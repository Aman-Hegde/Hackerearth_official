// Run after build: node --test tests/eventTeamRegistration.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Event = require('../dist/models/Event').default;
const EventRegistration = require('../dist/models/EventRegistration').default;
const GuestRegistration = require('../dist/models/GuestEventRegistration').default;
const EventTeam = require('../dist/models/EventTeam').default;
const TeamMember = require('../dist/models/EventTeamMember').default;
const User = require('../dist/models/user').default;
const { generateAuthToken } = require('../dist/utils/jwt');

process.env.JWT_SECRET = 'isolated-events-v3-test-secret';

const eventId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439020');
const adminId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439021');
const studentIds = Array.from({ length: 6 }, (_, index) =>
  new mongoose.Types.ObjectId(`507f1f77bcf86cd7994390${30 + index}`)
);

const chain = (getValue) => ({
  select() { return this; },
  sort() { return this; },
  session() { return this; },
  populate() { return this; },
  lean() { return this; },
  exec: async () => typeof getValue === 'function' ? getValue() : getValue,
});

const duplicateError = (keyPattern) => ({ code: 11000, keyPattern });

test('Events V3 team registration, security, capacity and admin regression suite', async (t) => {
  let event;
  let accounts;
  let teams;
  let members;
  let registrations;
  let guests;

  const makeAccount = (id, role = 'student') => ({
    _id: id,
    role,
    isActive: true,
    emailVerified: true,
    name: role === 'admin' ? 'Admin User' : `Student ${id.toString().slice(-2)}`,
    email: `${id.toString().slice(-4)}@nmamit.in`,
    usn: `NNM24IS${id.toString().slice(-3)}`,
    contactNumber: '9876543210',
    branch: 'ISE',
    year: 2,
  });

  const reset = (overrides = {}) => {
    event = {
      _id: eventId,
      title: 'Team Challenge',
      description: 'Team event description',
      venue: 'Campus',
      posterUrl: 'https://example.com/poster.png',
      published: true,
      active: true,
      participationType: 'team',
      eligibility: 'public',
      minTeamSize: 2,
      maxTeamSize: 3,
      eventDateTime: new Date(Date.now() + 86_400_000),
      eventEndDateTime: new Date(Date.now() + 90_000_000),
      registrationDeadline: new Date(Date.now() + 3_600_000),
      registrationCount: 0,
      maxRegistrations: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async () => event,
      set: (values) => Object.assign(event, values),
      ...overrides,
    };
    accounts = new Map([
      [adminId.toString(), makeAccount(adminId, 'admin')],
      ...studentIds.map((id) => [id.toString(), makeAccount(id)]),
    ]);
    teams = [];
    members = [];
    registrations = [];
    guests = [];
  };

  reset();

  t.mock.method(User, 'findById', (id) => chain(() => accounts.get(String(id)) ?? null));
  t.mock.method(User, 'findOne', (filter) => chain(() => {
    const account = accounts.get(String(filter._id));
    return account && account.isActive && account.emailVerified ? account : null;
  }));
  t.mock.method(User, 'exists', async (filter) =>
    [...accounts.values()].some((account) => account.email === filter.email)
      ? { _id: adminId }
      : null
  );

  t.mock.method(Event, 'findById', (id) => chain(() => String(id) === eventId.toString() ? event : null));
  t.mock.method(Event, 'create', async (data) => {
    Object.assign(event, data, {
      participationType: data.participationType ?? 'individual',
      eligibility: data.eligibility ?? 'public',
    });
    return event;
  });
  t.mock.method(Event, 'findOneAndUpdate', (filter, update, options) => chain(() => {
    const now = new Date();
    const participationMatches = filter.participationType === 'team'
      ? event.participationType === 'team'
      : Array.isArray(filter.$or)
        ? event.participationType === 'individual' || event.participationType === undefined
        : true;
    const open = String(filter._id) === eventId.toString() &&
      participationMatches && event.active && event.published !== false &&
      event.eventDateTime > now && event.registrationDeadline > now &&
      event.registrationCount < event.maxRegistrations;
    if (!open) return null;
    event.registrationCount += update.$inc.registrationCount;
    if (options.session) options.session.eventIncrement += 1;
    return event;
  }));

  t.mock.method(EventRegistration, 'create', async (docs) => {
    const doc = docs[0];
    if (registrations.some((item) => String(item.eventId) === String(doc.eventId) && String(item.studentId) === String(doc.studentId))) {
      throw duplicateError({ eventId: 1, studentId: 1 });
    }
    const registration = { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), ...doc };
    registrations.push(registration);
    return [registration];
  });
  t.mock.method(GuestRegistration, 'create', async (docs) => {
    const doc = docs[0];
    if (guests.some((item) => String(item.eventId) === String(doc.eventId) && item.email === doc.email)) {
      throw duplicateError({ eventId: 1, email: 1 });
    }
    const registration = { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), ...doc };
    guests.push(registration);
    return [registration];
  });
  t.mock.method(GuestRegistration, 'exists', async (filter) =>
    guests.some((item) => String(item.eventId) === String(filter.eventId) && item.email === filter.email)
      ? { _id: guests[0]._id }
      : null
  );

  t.mock.method(EventTeam, 'create', async (docs) => {
    const doc = docs[0];
    if (teams.some((team) => String(team.eventId) === String(doc.eventId) && team.normalizedName === doc.normalizedName)) {
      throw duplicateError({ eventId: 1, normalizedName: 1 });
    }
    if (teams.some((team) => team.invitationCode === doc.invitationCode)) {
      throw duplicateError({ invitationCode: 1 });
    }
    const team = { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), ...doc };
    teams.push(team);
    return [team];
  });
  t.mock.method(EventTeam, 'findOne', (filter) => chain(() =>
    teams.find((team) =>
      String(team.eventId) === String(filter.eventId) &&
      (filter.invitationCode === undefined || team.invitationCode === filter.invitationCode)
    ) ?? null
  ));
  t.mock.method(EventTeam, 'findOneAndUpdate', (filter, update, options) => chain(() => {
    const team = teams.find((item) =>
      String(item.eventId) === String(filter.eventId) &&
      item.invitationCode === filter.invitationCode &&
      item.currentMemberCount < filter.currentMemberCount.$lt
    );
    if (!team) return null;
    team.currentMemberCount += update.$inc.currentMemberCount;
    if (options.session) options.session.teamIncrement = team;
    return team;
  }));
  t.mock.method(EventTeam, 'findById', (id) => chain(() => teams.find((team) => String(team._id) === String(id)) ?? null));
  t.mock.method(EventTeam, 'find', (filter) => chain(() => teams.filter((team) => String(team.eventId) === String(filter.eventId))));

  t.mock.method(TeamMember, 'create', async (docs) => {
    const doc = docs[0];
    if (doc.studentId && members.some((member) => String(member.eventId) === String(doc.eventId) && String(member.studentId) === String(doc.studentId))) {
      throw duplicateError({ eventId: 1, studentId: 1 });
    }
    const member = { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), ...doc };
    members.push(member);
    return [member];
  });
  t.mock.method(TeamMember, 'findOne', (filter) => chain(() => members.find((member) => {
    if (String(member.eventId) !== String(filter.eventId)) return false;
    if (filter.studentId !== undefined) return String(member.studentId) === String(filter.studentId);
    return member.accessTokenHash === filter.accessTokenHash;
  }) ?? null));
  t.mock.method(TeamMember, 'find', (filter) => {
    const query = chain(() => members
      .filter((member) => String(member.teamId) === String(filter.teamId))
      .map((member) => ({
        ...member,
        studentId: member.studentId ? accounts.get(String(member.studentId)) : undefined,
        eventRegistrationId: member.eventRegistrationId
          ? registrations.find((registration) => String(registration._id) === String(member.eventRegistrationId))
          : undefined,
        guestRegistrationId: member.guestRegistrationId
          ? guests.find((guest) => String(guest._id) === String(member.guestRegistrationId))
          : undefined,
      })));
    return query;
  });

  t.mock.method(mongoose, 'startSession', async () => ({
    endSession: async () => {},
    withTransaction: async function (operation) {
      const transactionState = { eventIncrement: 0, teamIncrement: null };
      const registrationLength = registrations.length;
      const guestLength = guests.length;
      const memberLength = members.length;
      const teamLength = teams.length;
      try {
        return await operation(transactionState);
      } catch (error) {
        event.registrationCount -= transactionState.eventIncrement;
        if (transactionState.teamIncrement) transactionState.teamIncrement.currentMemberCount -= 1;
        registrations.length = registrationLength;
        guests.length = guestLength;
        members.length = memberLength;
        teams.length = teamLength;
        throw error;
      }
    },
  }));

  const app = express();
  app.use(express.json(), cookieParser());
  app.use('/api/events', require('../dist/routes/events').default);
  app.use('/api/admin', require('../dist/routes/admin').default);
  const server = await new Promise((resolve) => {
    const activeServer = app.listen(0, '127.0.0.1', () => resolve(activeServer));
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const tokens = new Map([
    [adminId.toString(), generateAuthToken({ userId: adminId.toString(), role: 'admin' })],
    ...studentIds.map((id) => [id.toString(), generateAuthToken({ userId: id.toString(), role: 'student' })]),
  ]);
  const request = (method, path, userId, body, extraHeaders = {}) => fetch(base + path, {
    method,
    headers: {
      ...(userId ? { authorization: `Bearer ${tokens.get(String(userId))}` } : {}),
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...extraHeaders,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  await t.test('schema enforces team configuration and database uniqueness', async () => {
    const invalid = new Event({
      title: 'Invalid Team Event', description: 'Description', venue: 'Campus',
      posterUrl: 'https://example.com/poster.png', eventDateTime: new Date(Date.now() + 10000),
      eventEndDateTime: new Date(Date.now() + 20000), registrationDeadline: new Date(Date.now() + 5000),
      maxRegistrations: 10, createdBy: adminId, participationType: 'team', minTeamSize: 4, maxTeamSize: 3,
    });
    await assert.rejects(() => invalid.validate(), /Maximum team size/);
    const teamIndexes = EventTeam.schema.indexes();
    assert.ok(teamIndexes.some(([fields, options]) => fields.eventId === 1 && fields.normalizedName === 1 && options.unique));
    const memberIndexes = TeamMember.schema.indexes();
    assert.ok(memberIndexes.some(([fields, options]) => fields.eventId === 1 && fields.studentId === 1 && options.unique));
  });

  await t.test('members-only teams require an active authenticated member', async () => {
    reset({ eligibility: 'members_only' });
    const guest = await request('POST', `/api/events/${eventId}/teams`, undefined, {
      teamName: 'Guest Team', name: 'Guest', email: 'guest@example.com',
      contactNumber: '9876543210', collegeName: 'Guest College',
    });
    assert.equal(guest.status, 401);
    assert.equal((await guest.json()).code, 'MEMBERS_ONLY_EVENT');
    accounts.get(studentIds[0].toString()).isActive = false;
    assert.equal((await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Inactive Team' })).status, 403);
  });

  await t.test('individual public and members-only registration preserve V2 behavior', async () => {
    reset({ participationType: 'individual', eligibility: 'public' });
    const publicGuest = await request('POST', `/api/events/${eventId}/register`, undefined, {
      name: 'Public Guest', email: 'public@example.com', contactNumber: '9876543210',
    });
    assert.equal(publicGuest.status, 201);
    assert.equal(guests.length, 1);

    reset({ participationType: 'individual', eligibility: 'members_only' });
    const rejectedGuest = await request('POST', `/api/events/${eventId}/register`, undefined, {});
    assert.equal(rejectedGuest.status, 401);
    assert.equal((await rejectedGuest.json()).code, 'MEMBERS_ONLY_EVENT');
    assert.equal((await request('POST', `/api/events/${eventId}/register`, studentIds[0], {})).status, 201);
    assert.equal(registrations.length, 1);
  });

  await t.test('authenticated member creates a team with a unique server invitation code', async () => {
    reset({ eligibility: 'members_only' });
    const first = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Alpha Team' });
    assert.equal(first.status, 201);
    const firstCode = (await first.json()).team.invitationCode;
    const second = await request('POST', `/api/events/${eventId}/teams`, studentIds[1], { teamName: 'Beta Team' });
    assert.equal(second.status, 201);
    const secondCode = (await second.json()).team.invitationCode;
    assert.ok(firstCode.length >= 32);
    assert.notEqual(firstCode, secondCode);
    assert.equal(event.registrationCount, 2);
    const publicPreview = await request(
      'GET',
      `/api/events/${eventId}/teams/invitations/${firstCode}`
    );
    assert.equal(publicPreview.status, 401);
    const memberPreview = await request(
      'GET',
      `/api/events/${eventId}/teams/invitations/${firstCode}`,
      studentIds[2]
    );
    assert.equal(memberPreview.status, 200);
  });

  await t.test('member contact is required, normalized, and stored per event without changing profile', async () => {
    reset({ eligibility: 'members_only' });
    accounts.get(studentIds[0].toString()).contactNumber = '';
    const missing = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], {
      teamName: 'Missing Contact',
    });
    assert.equal(missing.status, 400);
    assert.equal((await missing.json()).code, 'CONTACT_NUMBER_REQUIRED');

    const invalid = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], {
      teamName: 'Invalid Contact', contactNumber: '+911234567890',
    });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).code, 'INVALID_CONTACT_NUMBER');

    const valid = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], {
      teamName: 'Normalized Contact', contactNumber: '+919123456789',
    });
    assert.equal(valid.status, 201);
    assert.equal(registrations[0].contactNumber, '9123456789');
    assert.equal(accounts.get(studentIds[0].toString()).contactNumber, '');
  });

  await t.test('member contact defaults to the authenticated profile number', async () => {
    reset({ eligibility: 'members_only' });
    const response = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], {
      teamName: 'Profile Contact',
    });
    assert.equal(response.status, 201);
    assert.equal(registrations[0].contactNumber, '9876543210');
  });

  await t.test('admin configures team events and invalid team sizes are rejected', async () => {
    reset();
    const input = {
      title: event.title, description: event.description, venue: event.venue,
      posterUrl: event.posterUrl, eventDateTime: event.eventDateTime.toISOString(),
      eventEndDateTime: event.eventEndDateTime.toISOString(),
      registrationDeadline: event.registrationDeadline.toISOString(), maxRegistrations: 50,
      participationType: 'team', eligibility: 'members_only', minTeamSize: 2, maxTeamSize: 4,
    };
    const created = await request('POST', '/api/admin/events', adminId, input);
    assert.equal(created.status, 201);
    const createdEvent = (await created.json()).event;
    assert.equal(createdEvent.participationType, 'team');
    assert.equal(createdEvent.eligibility, 'members_only');
    assert.equal(createdEvent.maxTeamSize, 4);
    const invalid = await request('POST', '/api/admin/events', adminId, { ...input, minTeamSize: 5, maxTeamSize: 4 });
    assert.equal(invalid.status, 400);
  });

  await t.test('duplicate team names are blocked within an event', async () => {
    reset();
    assert.equal((await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Alpha Squad' })).status, 201);
    const duplicate = await request('POST', `/api/events/${eventId}/teams`, studentIds[1], { teamName: '  ALPHA   SQUAD  ' });
    assert.equal(duplicate.status, 409);
    assert.equal((await duplicate.json()).code, 'TEAM_NAME_EXISTS');
  });

  await t.test('public guests create teams directly with unverified contact details', async () => {
    reset();
    const response = await request('POST', `/api/events/${eventId}/teams`, undefined, {
      teamName: 'Public Team', name: 'External Guest', email: 'external@example.com',
      contactNumber: '919876543210', collegeName: 'External College',
    });
    assert.equal(response.status, 201);
    const result = await response.json();
    assert.equal(result.team.currentMemberCount, 1);
    assert.ok(result.team.accessToken);
    assert.match(result.team.invitationPath, new RegExp(`^/events/${eventId}\\?invite=`));
    assert.equal(guests.length, 1);
    assert.equal(guests[0].contactNumber, '9876543210');
    assert.equal(guests[0].collegeName, 'External College');
    const duplicate = await request('POST', `/api/events/${eventId}/teams`, undefined, {
      teamName: 'Another Public Team', name: 'External Guest', email: 'external@example.com',
      contactNumber: '9876543210', collegeName: 'External College',
    });
    assert.equal(duplicate.status, 409);
    assert.equal((await duplicate.json()).code, 'ALREADY_REGISTERED');
    const removedVerificationRoute = await request(
      'POST',
      `/api/events/team-verifications/${new mongoose.Types.ObjectId()}/confirm`,
      undefined,
      { otp: '123456' }
    );
    assert.equal(removedVerificationRoute.status, 404);
  });

  await t.test('invitation preview is safe and public guests can join directly', async () => {
    reset();
    const created = await request('POST', `/api/events/${eventId}/teams`, undefined, {
      teamName: 'Link Team', name: 'Guest Leader', email: 'leader@example.com',
      contactNumber: '+919876543210', collegeName: 'Leader College',
    });
    assert.equal(created.status, 201);
    const createdBody = await created.json();
    const invitationCode = createdBody.team.invitationCode;

    const preview = await request(
      'GET',
      `/api/events/${eventId}/teams/invitations/${invitationCode}`
    );
    assert.equal(preview.status, 200);
    const previewBody = await preview.json();
    assert.equal(previewBody.invitation.event.name, event.title);
    assert.equal(previewBody.invitation.team.name, 'Link Team');
    assert.equal(previewBody.invitation.team.availableSlots, 2);
    assert.equal(JSON.stringify(previewBody).includes('9876543210'), false);
    assert.equal(JSON.stringify(previewBody).includes('leader@example.com'), false);

    const joined = await request('POST', `/api/events/${eventId}/teams/join`, undefined, {
      invitationCode, name: 'Guest Teammate', email: 'teammate@example.com',
      contactNumber: '919123456789', collegeName: 'Teammate College',
    });
    assert.equal(joined.status, 201);
    assert.equal((await joined.json()).team.currentMemberCount, 2);
    assert.equal(guests.length, 2);
    assert.equal(guests[1].contactNumber, '9123456789');
  });

  await t.test('public guest team registration requires valid contact and college details', async () => {
    reset();
    const missing = await request('POST', `/api/events/${eventId}/teams`, undefined, {
      teamName: 'Missing Details', name: 'External Guest', email: 'missing@example.com',
    });
    assert.equal(missing.status, 400);
    const invalid = await request('POST', `/api/events/${eventId}/teams`, undefined, {
      teamName: 'Invalid Details', name: 'External Guest', email: 'invalid@example.com',
      contactNumber: '98765abcde', collegeName: 'External College',
    });
    assert.equal(invalid.status, 400);
  });

  await t.test('invalid invitation codes and duplicate participation are rejected', async () => {
    reset();
    assert.equal((await request('POST', `/api/events/${eventId}/teams/join`, studentIds[0], { invitationCode: 'invalid-code' })).status, 409);
    const created = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Alpha Team' });
    const code = (await created.json()).team.invitationCode;
    const duplicate = await request('POST', `/api/events/${eventId}/teams/join`, studentIds[0], { invitationCode: code });
    assert.equal(duplicate.status, 409);
    assert.equal((await duplicate.json()).code, 'ALREADY_REGISTERED');
    assert.equal(event.registrationCount, 1);
  });

  await t.test('full teams and concurrent joins cannot exceed team capacity', async () => {
    reset({ maxTeamSize: 2 });
    const created = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Capacity Team' });
    const code = (await created.json()).team.invitationCode;
    const responses = await Promise.all([
      request('POST', `/api/events/${eventId}/teams/join`, studentIds[1], { invitationCode: code }),
      request('POST', `/api/events/${eventId}/teams/join`, studentIds[2], { invitationCode: code }),
    ]);
    assert.deepEqual(responses.map((response) => response.status).sort(), [201, 409]);
    assert.equal(teams[0].currentMemberCount, 2);
    assert.equal(members.filter((member) => String(member.teamId) === String(teams[0]._id)).length, 2);
    assert.equal((await request('POST', `/api/events/${eventId}/teams/join`, studentIds[3], { invitationCode: code })).status, 409);
  });

  await t.test('team members can view safe team state while only the leader sees the invitation code', async () => {
    reset();
    const created = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Visible Team' });
    const code = (await created.json()).team.invitationCode;
    await request('POST', `/api/events/${eventId}/teams/join`, studentIds[1], { invitationCode: code });
    const leaderView = await (await request('GET', `/api/events/${eventId}/team`, studentIds[0])).json();
    const memberView = await (await request('GET', `/api/events/${eventId}/team`, studentIds[1])).json();
    assert.equal(leaderView.team.status, 'complete');
    assert.equal(leaderView.team.members.length, 2);
    assert.equal(leaderView.team.invitationCode, code);
    assert.equal(memberView.team.invitationCode, undefined);
    assert.equal(leaderView.team.members[0].contactNumber, undefined);
    assert.match(leaderView.team.members[0].email, /@nmamit\.in$/);
  });

  await t.test('admin cannot change team limits in a way that invalidates existing teams', async () => {
    reset({ eligibility: 'members_only' });
    const created = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Complete Team' });
    const code = (await created.json()).team.invitationCode;
    assert.equal((await request('POST', `/api/events/${eventId}/teams/join`, studentIds[1], { invitationCode: code })).status, 201);
    const response = await request('PATCH', `/api/admin/events/${eventId}`, adminId, { minTeamSize: 3 });
    assert.equal(response.status, 409);
    assert.equal((await response.json()).code, 'TEAM_SIZE_LIMIT_LOCKED');
    const typeChange = await request('PATCH', `/api/admin/events/${eventId}`, adminId, { participationType: 'individual' });
    assert.equal(typeChange.status, 409);
    assert.equal((await typeChange.json()).code, 'EVENT_PARTICIPATION_TYPE_LOCKED');
  });

  await t.test('deadlines and past events reject create and join', async () => {
    for (const overrides of [
      { registrationDeadline: new Date(0) },
      { eventDateTime: new Date(0), eventEndDateTime: new Date(1), registrationDeadline: new Date(0) },
    ]) {
      reset(overrides);
      const response = await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Closed Team' });
      assert.equal(response.status, 409);
    }
  });

  await t.test('admin team list and XLSX export are protected and include team members', async () => {
    reset();
    await request('POST', `/api/events/${eventId}/teams`, studentIds[0], { teamName: 'Admin View Team' });
    assert.equal((await request('GET', `/api/admin/events/${eventId}/teams`)).status, 401);
    assert.equal((await request('GET', `/api/admin/events/${eventId}/teams`, studentIds[1])).status, 403);
    const list = await request('GET', `/api/admin/events/${eventId}/teams`, adminId);
    assert.equal(list.status, 200);
    const listBody = await list.json();
    assert.equal(listBody.teams[0].members[0].isLeader, true);
    assert.equal(listBody.teams[0].members[0].contactNumber, '9876543210');
    const exported = await request('GET', `/api/admin/events/${eventId}/teams/export`, adminId);
    assert.equal(exported.status, 200);
    const workbook = new (require('exceljs').Workbook)();
    await workbook.xlsx.load(Buffer.from(await exported.arrayBuffer()));
    assert.equal(workbook.worksheets[0].getRow(2).getCell(1).value, 'Admin View Team');
    assert.equal(workbook.worksheets[0].getRow(2).getCell(8).value, '9876543210');
  });

  await t.test('public team registration and invitation preview are rate limited', async () => {
    reset();
    let registrationRateLimited = false;
    for (let attempt = 0; attempt < 25; attempt += 1) {
      const response = await request('POST', `/api/events/${eventId}/teams`, undefined, {});
      if (response.status === 429) {
        registrationRateLimited = true;
        assert.equal((await response.json()).code, 'RATE_LIMITED');
        break;
      }
    }
    assert.equal(registrationRateLimited, true);

    let previewRateLimited = false;
    for (let attempt = 0; attempt < 65; attempt += 1) {
      const response = await request(
        'GET',
        `/api/events/${eventId}/teams/invitations/invalid-invitation-token`
      );
      if (response.status === 429) {
        previewRateLimited = true;
        assert.equal((await response.json()).code, 'RATE_LIMITED');
        break;
      }
    }
    assert.equal(previewRateLimited, true);
  });

  await t.test('past historical event documents remain valid and closed', async () => {
    const historical = new Event({
      title: 'Historical Event', description: 'Past showcase', venue: 'Campus',
      posterUrl: 'https://example.com/past.png', eventDateTime: new Date('2025-01-01T10:00:00Z'),
      eventEndDateTime: new Date('2025-01-01T12:00:00Z'), registrationDeadline: new Date('2025-01-01T09:00:00Z'),
      maxRegistrations: 100, createdBy: adminId, participationType: 'individual', eligibility: 'public', active: false,
    });
    await historical.validate();
  });
});
