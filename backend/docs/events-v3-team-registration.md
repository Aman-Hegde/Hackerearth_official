# Events V3 Team Registration

## Compatibility defaults

Events created before Events V3 are interpreted as:

- `participationType: "individual"`
- `eligibility: "public"`

This matches the Events V2 API, which allowed authenticated members and guest
registration. No migration is required and existing records are not rewritten.

## Public team registration

Unauthenticated participants first submit their name, email, Indian mobile
number, and college name. Phone numbers accept a local 10-digit number or an
optional `+91`/`91` prefix and are stored in normalized 10-digit form. The
server creates the guest registration and team membership directly inside the
same MongoDB transaction used for event capacity and team membership.

Guest email addresses are unverified contact information. They are never used
as proof of identity and do not grant account privileges. Public team creation,
joining, and invitation previews have lightweight per-IP in-memory rate limits.

Guest team-view access uses a separate random token. Only its SHA-256 hash is
stored. Authenticated members are identified from the existing JWT cookie or
bearer token.

Authenticated members may use the contact number from their account or supply
an event-specific number. The event-specific value is stored on the event
registration and does not update the member's profile. Contact numbers are
available only through admin registration/team views and exports; normal team
rosters do not expose participant contact details. Existing registrations
without an event-specific contact number continue to use profile data where it
is available.

## Invitation codes

Invitation codes are generated on the server from 24 cryptographically random
bytes and encoded with base64url. The database enforces uniqueness. The API
also returns an origin-independent `invitationPath`; the frontend may combine
it with its configured origin to build a shareable URL.

The invitation preview endpoint returns only the event name, team name,
available slots, team status, and registration availability. It never returns
participant names, email addresses, contact numbers, college names, access
tokens, or the stored invitation secret. Member-only event previews require an
active authenticated club account.

## Capacity and transaction requirement

Creating or joining a team runs inside a MongoDB transaction. Within that
transaction the backend:

1. atomically reserves one event-capacity slot;
2. creates or atomically increments the team;
3. creates the existing member or guest event registration; and
4. creates the team-member record.

Unique indexes enforce one registration per event and participant, unique team
names within an event, and unique invitation codes. The deployment must use a
MongoDB replica set or sharded cluster that supports transactions. This is the
same deployment requirement already imposed by Events V2 registration.

## Endpoints

Public or optionally authenticated:

- `POST /api/events/:eventId/teams`
- `POST /api/events/:eventId/teams/join`
- `GET /api/events/:eventId/teams/invitations/:invitationCode`
- `GET /api/events/:eventId/team`

Admin only:

- `GET /api/admin/events/:eventId/teams`
- `GET /api/admin/events/:eventId/teams/export`

The existing individual registration and export endpoints remain unchanged.
