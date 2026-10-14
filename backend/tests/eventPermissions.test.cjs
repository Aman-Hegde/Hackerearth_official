// Run after npm --prefix backend run build: node --test backend/tests/eventPermissions.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../dist/models/user').default;
const Event = require('../dist/models/Event').default;
const Registration = require('../dist/models/EventRegistration').default;
const GuestRegistration = require('../dist/models/GuestEventRegistration').default;
const cloudinary = require('../dist/config/cloudinary');
const { generateAuthToken } = require('../dist/utils/jwt');
const { AUTH_COOKIE_NAME } = require('../dist/utils/authCookie');
process.env.JWT_SECRET = 'isolated-event-permission-test-secret';
const id = '507f1f77bcf86cd799439011';
const participant = { name: 'Guest Participant', email: 'guest@example.com', contactNumber: '9876543210' };
const chain = (value) => ({ sort() { return this; }, select() { return this; }, populate() { return this; }, exec: async () => value });

test('event API permission and participant registration regression suite', async (t) => {
  let account, event, writes, registrations, guests, duplicate, unavailable, imported;
  const reset = () => {
    account = { _id: new mongoose.Types.ObjectId(id), role: 'admin', isActive: true, emailVerified: true };
    event = { _id: new mongoose.Types.ObjectId(id), title: 'Workshop', description: 'Workshop description',
      venue: 'Campus', posterUrl: 'https://example.com/poster.png', active: true,
      eventDateTime: new Date(Date.now() + 86400000), eventEndDateTime: new Date(Date.now() + 90000000),
      registrationDeadline: new Date(Date.now() + 3600000), registrationCount: 0, maxRegistrations: 5,
      save: async () => { writes++; } };
    imported = null; writes = 0; registrations = []; guests = []; duplicate = false; unavailable = false;
  };
  reset();
  t.mock.method(User, 'findById', () => chain(account));
  t.mock.method(User, 'findOne', (filter) => chain(account && account.isActive && account.emailVerified && filter.role.$in.includes(account.role) ? account : null));
  t.mock.method(Event, 'find', (filter) => {
    if (filter) assert.deepEqual(filter, { published: { $ne: false } });
    return chain(filter && event.published === false ? [] : [event]);
  });
  t.mock.method(Event, 'findOne', () => chain(imported));
  t.mock.method(Event, 'findById', () => chain(event));
  t.mock.method(Event, 'create', async (data) => { writes++; const created = { ...event, ...data }; if (data._id) imported = created; return created; });
  t.mock.method(Event, 'findOneAndUpdate', (filter, update, options) => {
    assert.equal(filter.active, true);
    assert.ok(filter.eventDateTime.$gt instanceof Date);
    assert.ok(filter.registrationDeadline.$gt instanceof Date);
    assert.deepEqual(filter.$expr, { $lt: ['$registrationCount', '$maxRegistrations'] });
    assert.deepEqual(update, { $inc: { registrationCount: 1 } });
    assert.ok(options.session);
    return { exec: async () => { if (unavailable) return null; writes++; event.registrationCount++; return event; } };
  });
  t.mock.method(Registration, 'find', () => chain(registrations));
  t.mock.method(GuestRegistration, 'find', () => chain(guests));
  t.mock.method(Registration, 'create', async (docs) => { if (duplicate) throw { code: 11000 }; registrations.push(...docs); return docs; });
  t.mock.method(GuestRegistration, 'create', async (docs) => { if (duplicate) throw { code: 11000 }; guests.push(...docs); return docs; });
  t.mock.method(mongoose, 'startSession', async () => {
    const session = { endSession: async () => {}, withTransaction: async (fn) => {
      const count = event.registrationCount;
      try { await fn(session); } catch (error) { event.registrationCount = count; throw error; }
    } };
    return session;
  });
  t.mock.method(cloudinary, 'uploadEventPosterToCloudinary', async () => {
    writes++; return { secure_url: 'https://example.com/poster.png', public_id: 'poster' };
  });
  const app = express(); app.use(express.json(), cookieParser());
  app.use('/api/admin', require('../dist/routes/admin').default);
  app.use('/api/events', require('../dist/routes/events').default);
  app.use('/api/student', require('../dist/routes/student').default);
  const server = await new Promise((resolve) => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const tokens = { student: generateAuthToken({ userId: id, role: 'student' }), admin: generateAuthToken({ userId: id, role: 'admin' }) };
  const request = (method, path, role, body, cookie = false) => fetch(base + path, {
    method, headers: { ...(role ? cookie ? { cookie: `${AUTH_COOKIE_NAME}=${tokens[role]}` } : { authorization: `Bearer ${tokens[role]}` } : {}),
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  const management = [['POST', '/events/import/project-doomsday'], ['GET', '/events'], ['POST', '/events'], ['POST', '/events/poster'],
    ['GET', `/events/${id}`], ['PATCH', `/events/${id}`], ['PUT', `/events/${id}`], ['DELETE', `/events/${id}`],
    ['PATCH', `/events/${id}/archive`], ['POST', `/events/${id}/publish`],
    ['DELETE', `/events/${id}/poster`], ['GET', `/events/${id}/registrations`],
    ['GET', `/events/${id}/registrations/export`], ['DELETE', `/events/${id}/registrations/${id}`]];
  for (const role of [undefined, 'student']) {
    await t.test(`${role || 'guest'} cannot call any management API`, async () => {
      reset();
      for (const [method, path] of management) {
        for (const cookie of [false, true]) {
          const response = await request(method, '/api/admin' + path, role, method === 'GET' ? undefined : { role: 'admin', active: true }, cookie);
          assert.equal(response.status, role ? 403 : 401, `${method} ${path}`);
        }
      }
      assert.equal(writes, 0);
    });
  }
  await t.test('invalid and forged credentials receive 401', async () => {
    for (const token of ['invalid', jwt.sign({ userId: id, role: 'admin' }, 'wrong-secret'),
      jwt.sign({ userId: id, role: 'admin' }, process.env.JWT_SECRET, { issuer: 'hackerearth-hub-nmamit', expiresIn: -1 })]) {
      const response = await fetch(base + '/api/admin/events', { headers: { authorization: `Bearer ${token}` } });
      assert.equal(response.status, 401);
    }
  });
  await t.test('demoted, disabled, unverified and deleted administrators receive 403', async () => {
    for (const changes of [{ role: 'student' }, { isActive: false }, { emailVerified: false }, null]) {
      reset(); account = changes ? { ...account, ...changes } : null;
      for (const [method, path] of management) assert.equal((await request(method, '/api/admin' + path, 'admin')).status, 403);
      assert.equal(writes, 0);
    }
  });
  await t.test('admin can create, edit, list, inspect attendees, export and upload posters', async () => {
    reset();
    const input = { title: event.title, description: event.description, venue: event.venue, posterUrl: event.posterUrl,
      eventDateTime: event.eventDateTime.toISOString(), eventEndDateTime: event.eventEndDateTime.toISOString(),
      registrationDeadline: event.registrationDeadline.toISOString(), maxRegistrations: 5 };
    assert.equal((await request('POST', '/api/admin/events', 'admin', input)).status, 201);
    assert.equal((await request('PATCH', `/api/admin/events/${id}`, 'admin', { active: false, maxRegistrations: 10 })).status, 200);
    for (const path of ['/events', `/events/${id}`, `/events/${id}/registrations`, `/events/${id}/registrations/export`]) {
      assert.equal((await request('GET', '/api/admin' + path, 'admin')).status, 200);
    }
    const form = new FormData(); form.append('poster', new Blob(['image'], { type: 'image/png' }), 'poster.png');
    assert.equal((await fetch(base + '/api/admin/events/poster', { method: 'POST', headers: { authorization: `Bearer ${tokens.admin}` }, body: form })).status, 200);
  });
  for (const role of [undefined, 'student', 'admin']) {
    await t.test(`${role || 'guest'} can view and register for eligible events`, async () => {
      reset(); account.role = role || 'student';
      assert.equal((await request('GET', '/api/events', role)).status, 200);
      assert.equal((await request('POST', `/api/events/${id}/register`, role, role ? {} : participant)).status, 201);
      assert.equal(event.registrationCount, 1);
      assert.equal(role ? registrations.length : guests.length, 1);
      if (role) assert.equal(String(registrations[0].studentId), id);
      else assert.equal(guests[0].email, participant.email);
    });
    await t.test(`${role || 'guest'} cannot inject privileged registration fields`, async () => {
      reset();
      for (const field of ['role', 'studentId', 'eventId', 'createdBy', 'title', 'description', 'venue', 'posterUrl', 'posterPublicId',
        'eventDateTime', 'eventEndDateTime', 'registrationDeadline', 'maxRegistrations', 'registrationCount', 'active', 'published', 'imageUrls', 'tagline', 'rounds', '$set']) {
        assert.equal((await request('POST', `/api/events/${id}/register`, role, { ...(role ? {} : participant), [field]: 'malicious' })).status, 400, field);
      }
      assert.equal(writes, 0);
    });
  }
  await t.test('admin import is repeatable without overwriting records and carries all seven photographs', async () => {
    reset();
    const response = await request('POST', '/api/admin/events/import/project-doomsday', 'admin');
    assert.equal(response.status, 201);
    const result = (await response.json()).event;
    assert.equal(result.imageUrls.length, 7);
    assert.equal(result.imageUrls[0], '/events/project-doomsday/doomsday-02.webp');
    assert.equal(result.imageUrls[6], '/events/project-doomsday/doomsday-08.webp');
    assert.equal(result.eventDateTime, '2026-10-10T03:30:00.000Z');
    assert.equal(result.active, false);
    assert.equal(result.registrationOpen, false);
    assert.equal(result.published, true);
    imported.title = 'Edited Project Doomsday';
    const repeat = await request('POST', '/api/admin/events/import/project-doomsday', 'admin');
    assert.equal(repeat.status, 200);
    assert.equal((await repeat.json()).event.title, 'Edited Project Doomsday');
    assert.equal(writes, 1);
  });
  await t.test('past events are public and admin can edit galleries and archive them', async () => {
    reset(); event.eventDateTime = new Date(0); event.eventEndDateTime = new Date(1); event.registrationDeadline = new Date(0);
    const publicResult = await (await request('GET', '/api/events')).json();
    assert.equal(publicResult.past.length, 1);
    assert.equal(publicResult.past[0].registrationOpen, false);
    assert.equal((await request('PATCH', `/api/admin/events/${id}`, 'admin', {
      imageUrls: ['/events/project-doomsday/doomsday-02.webp'], tagline: 'Three rounds. One mission.', rounds: ['MCQ Challenge'], published: false
    })).status, 200);
    assert.equal(event.imageUrls.length, 1);
    assert.equal((await (await request('GET', '/api/events')).json()).past.length, 0);
    assert.equal((await request('PATCH', `/api/admin/events/${id}`, 'admin', { published: true })).status, 200);
    assert.equal((await (await request('GET', '/api/events')).json()).past.length, 1);
    for (const input of [{ imageUrls: ['javascript:alert(1)'] }, { imageUrls: ['/events/../secret.webp'] }, { rounds: [7] }, { published: 'true' }, { imageUrls: Array(21).fill('https://example.com/a.webp') }])
      assert.equal((await request('PATCH', `/api/admin/events/${id}`, 'admin', input)).status, 400);
  });
  await t.test('malformed guest data and invalid optional credentials are rejected', async () => {
    reset();
    for (const body of [{}, [], { ...participant, email: 'invalid' }, { ...participant, contactNumber: '1' }]) {
      assert.equal((await request('POST', `/api/events/${id}/register`, undefined, body)).status, 400);
    }
    assert.equal((await fetch(base + '/api/events', { headers: { authorization: 'Bearer invalid' } })).status, 401);
    assert.equal(writes, 0);
  });
  await t.test('closed, full, past and duplicate registration remain rejected', async () => {
    for (const changes of [{ active: false }, { registrationCount: 5 }, { eventDateTime: new Date(0), eventEndDateTime: new Date(1) }, { registrationDeadline: new Date(0) }]) {
      reset(); Object.assign(event, changes); unavailable = true;
      assert.equal((await request('POST', `/api/events/${id}/register`, undefined, participant)).status, 409);
      assert.equal(guests.length, 0);
    }
    reset(); duplicate = true;
    assert.equal((await request('POST', `/api/events/${id}/register`, undefined, participant)).status, 409);
    assert.equal(event.registrationCount, 0);
  });
  await t.test('guest attendee details are available only in admin lists and exports', async () => {
    reset();
    guests = [{ ...participant, _id: new mongoose.Types.ObjectId(), createdAt: new Date() }];
    const response = await request('GET', `/api/admin/events/${id}/registrations`, 'admin');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).registrations[0].email, participant.email);
    const exported = await request('GET', `/api/admin/events/${id}/registrations/export`, 'admin');
    const workbook = new (require('exceljs').Workbook)();
    await workbook.xlsx.load(Buffer.from(await exported.arrayBuffer()));
    assert.equal(workbook.worksheets[0].getRow(2).getCell(3).value, participant.email);
    const publicEvents = await request('GET', '/api/events');
    assert.ok(!(await publicEvents.text()).includes(participant.email));
  });
  await t.test('public API has no management or attendee routes', async () => {
    reset();
    for (const [method, path] of [['POST', ''], ['PATCH', `/${id}`], ['DELETE', `/${id}`],
      ['POST', '/poster'], ['GET', `/${id}/registrations`], ['GET', `/${id}/registrations/export`]]) {
      assert.equal((await request(method, '/api/events' + path, undefined, method === 'GET' ? undefined : {})).status, 404);
    }
    assert.equal(writes, 0);
  });
  await t.test('inactive and unverified accounts cannot register', async () => {
    for (const changes of [{ isActive: false }, { emailVerified: false }]) {
      reset(); Object.assign(account, changes);
      assert.equal((await request('POST', `/api/events/${id}/register`, 'student', {})).status, 403);
      assert.equal(writes, 0);
    }
  });
  await t.test('legacy student registration rejects event updates', async () => {
    reset();
    assert.equal((await request('POST', `/api/student/events/${id}/register`, 'student', { active: false })).status, 400);
    assert.equal(writes, 0);
  });
});
