// Run after build: node --test tests/eventTeamCountReconciliation.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const Event = require('../dist/models/Event').default;
const EventTeam = require('../dist/models/EventTeam').default;
const {
  applyEventTeamCountReconciliation,
  inspectEventTeamCounts,
  parseReconciliationArguments,
  ReconciliationInputError,
  TeamEventNotFoundError,
} = require('../dist/services/eventTeamCountReconciliation');

const teamEventId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439101');
const secondTeamEventId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439102');
const individualEventId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439103');

const query = (getValue) => ({
  select() { return this; },
  sort() { return this; },
  session(value) { this.activeSession = value; return this; },
  exec: async function () { return getValue(this.activeSession); },
  then(resolve, reject) { return this.exec().then(resolve, reject); },
});

test('team count reconciliation is dry-run-first, guarded, and transactional', async (t) => {
  let events;
  let teams;
  let updateCalls;
  let transactionCalls;
  let transactionOptions;
  let forceGuardConflict;
  let retryCallbackOnce;
  let onCallbackRetry;

  const reset = () => {
    events = [
      { _id: teamEventId, title: 'Team Event', participationType: 'team', registrationCount: 4 },
      { _id: secondTeamEventId, title: 'Second Team Event', participationType: 'team', registrationCount: 1 },
      { _id: individualEventId, title: 'Individual Event', participationType: 'individual', registrationCount: 9 },
    ];
    teams = [
      { _id: new mongoose.Types.ObjectId(), eventId: teamEventId },
      { _id: new mongoose.Types.ObjectId(), eventId: teamEventId },
      { _id: new mongoose.Types.ObjectId(), eventId: secondTeamEventId },
    ];
    updateCalls = [];
    transactionCalls = 0;
    transactionOptions = [];
    forceGuardConflict = false;
    retryCallbackOnce = false;
    onCallbackRetry = null;
  };

  reset();

  t.mock.method(Event, 'find', (filter) => query(() => events.filter((event) => {
    if (event.participationType !== filter.participationType) return false;
    if (!filter._id) return true;
    return filter._id.$in.some((id) => String(id) === String(event._id));
  })));
  t.mock.method(Event, 'findOne', (filter) => query(() => events.find((event) =>
    String(event._id) === String(filter._id) &&
    event.participationType === filter.participationType
  ) ?? null));
  t.mock.method(EventTeam, 'countDocuments', (filter) => query(() =>
    teams.filter((team) => String(team.eventId) === String(filter.eventId)).length
  ));
  t.mock.method(Event, 'updateOne', (filter, update, options) => query(() => {
    updateCalls.push({ filter, update, options });
    const event = events.find((item) => String(item._id) === String(filter._id));
    if (!event || event.participationType !== 'team') return { modifiedCount: 0 };

    if (forceGuardConflict) {
      forceGuardConflict = false;
      event.registrationCount += 1;
      teams.push({ _id: new mongoose.Types.ObjectId(), eventId: event._id });
      return { modifiedCount: 0 };
    }
    if (event.registrationCount !== filter.registrationCount) {
      return { modifiedCount: 0 };
    }

    options.session.pendingUpdates.set(String(event._id), update.$set.registrationCount);
    return { modifiedCount: 1 };
  }));
  t.mock.method(mongoose, 'startSession', async () => {
    const session = {
      pendingUpdates: new Map(),
      endSession: async () => {},
      withTransaction: async (callback, options) => {
        transactionCalls += 1;
        transactionOptions.push(options);
        const runCallback = async () => {
          session.pendingUpdates.clear();
          return callback();
        };

        try {
          if (retryCallbackOnce) {
            await runCallback();
            session.pendingUpdates.clear();
            retryCallbackOnce = false;
            onCallbackRetry?.();
          }
          const result = await runCallback();
          for (const [eventId, count] of session.pendingUpdates) {
            const event = events.find((item) => String(item._id) === eventId);
            if (event) event.registrationCount = count;
          }
          return result;
        } catch (error) {
          session.pendingUpdates.clear();
          throw error;
        }
      },
    };
    return session;
  });

  await t.test('argument parsing defaults to dry run and apply requires approved event ids', () => {
    assert.deepEqual(parseReconciliationArguments([]), { applyChanges: false, eventIds: [] });
    assert.deepEqual(
      parseReconciliationArguments([`--event-id=${teamEventId}`, `--event-id=${teamEventId}`]),
      { applyChanges: false, eventIds: [teamEventId.toString()] }
    );
    assert.throws(
      () => parseReconciliationArguments(['--apply']),
      (error) => error instanceof ReconciliationInputError && error.code === 'APPLY_REQUIRES_EVENT_IDS'
    );
    assert.throws(
      () => parseReconciliationArguments(['--apply', '--event-id=invalid']),
      (error) => error instanceof ReconciliationInputError && error.code === 'INVALID_EVENT_ID_ARGUMENT'
    );
  });

  await t.test('dry run reports mismatches without creating a session or writing data', async () => {
    reset();
    const before = events.map((event) => event.registrationCount);
    const results = await inspectEventTeamCounts([]);
    assert.equal(results.length, 2);
    assert.deepEqual(results.map((result) => [result.storedCount, result.actualTeamCount]), [[4, 2], [1, 1]]);
    assert.deepEqual(events.map((event) => event.registrationCount), before);
    assert.equal(updateCalls.length, 0);
    assert.equal(transactionCalls, 0);
  });

  await t.test('apply corrects only approved team event counters', async () => {
    reset();
    const results = await applyEventTeamCountReconciliation([teamEventId.toString()]);
    assert.equal(events[0].registrationCount, 2);
    assert.equal(events[1].registrationCount, 1);
    assert.equal(events[2].registrationCount, 9);
    assert.equal(results[0].storedCount, 4);
    assert.equal(results[0].actualTeamCount, 2);
    assert.deepEqual(updateCalls[0].update, { $set: { registrationCount: 2 } });
    assert.equal(updateCalls[0].filter.participationType, 'team');
    assert.deepEqual(transactionOptions[0].readConcern, { level: 'snapshot' });
    assert.deepEqual(transactionOptions[0].writeConcern, { w: 'majority' });
  });

  await t.test('a later invalid event aborts every update in the approved batch', async () => {
    reset();
    const missingId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439199');
    await assert.rejects(
      () => applyEventTeamCountReconciliation([teamEventId.toString(), missingId.toString()]),
      (error) => error instanceof TeamEventNotFoundError
    );
    assert.equal(events[0].registrationCount, 4);
    assert.equal(updateCalls.length, 1);
  });

  await t.test('apply refuses individual events without changing their counters', async () => {
    reset();
    await assert.rejects(
      () => applyEventTeamCountReconciliation([individualEventId.toString()]),
      (error) => error instanceof TeamEventNotFoundError
    );
    assert.equal(events[2].registrationCount, 9);
    assert.equal(updateCalls.length, 0);
  });

  await t.test('a concurrent team creation causes a guarded retry instead of a stale overwrite', async () => {
    reset();
    forceGuardConflict = true;
    const results = await applyEventTeamCountReconciliation([teamEventId.toString()]);
    assert.equal(transactionCalls, 2);
    assert.equal(teams.filter((team) => String(team.eventId) === String(teamEventId)).length, 3);
    assert.equal(events[0].registrationCount, 3);
    assert.equal(results[0].storedCount, 5);
    assert.equal(results[0].actualTeamCount, 3);
    assert.equal(updateCalls.length, 2);
  });

  await t.test('withTransaction callback retries return only the committed attempt report', async () => {
    reset();
    retryCallbackOnce = true;
    onCallbackRetry = () => {
      events[0].registrationCount += 1;
      teams.push({ _id: new mongoose.Types.ObjectId(), eventId: teamEventId });
    };
    const results = await applyEventTeamCountReconciliation([teamEventId.toString()]);
    assert.equal(transactionCalls, 1);
    assert.equal(results.length, 1);
    assert.equal(results[0].storedCount, 5);
    assert.equal(results[0].actualTeamCount, 3);
    assert.equal(events[0].registrationCount, 3);
  });

  await t.test('service source cannot mutate registrations, memberships, teams, or individual events', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, '../src/services/eventTeamCountReconciliation.ts'),
      'utf8'
    );
    assert.equal(source.includes('EventRegistration'), false);
    assert.equal(source.includes('GuestEventRegistration'), false);
    assert.equal(source.includes('EventTeamMember'), false);
    assert.equal(source.includes('EventTeam.update'), false);
    assert.match(source, /participationType:\s*"team"/);
    assert.match(source, /\$set:\s*\{\s*registrationCount:/);
  });
});
