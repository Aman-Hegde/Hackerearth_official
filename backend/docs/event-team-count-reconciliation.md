# Team Event Count Reconciliation

Team events use `Event.registrationCount` as the number of created teams. This utility compares that stored value with the number of `EventTeam` documents without changing registrations, teams, members, or users.

## Dry Run

From `backend`, inspect every team event:

```powershell
npm run reconcile:event-team-counts
```

To inspect only an approved event:

```powershell
npm run reconcile:event-team-counts -- --event-id=<EVENT_OBJECT_ID>
```

Dry run is the default and performs no writes.

## Apply

Apply mode requires each approved event ID explicitly. Review the dry-run output first, take a database backup, and run this only during an approved maintenance window:

```powershell
npm run reconcile:event-team-counts -- --apply --event-id=<EVENT_OBJECT_ID>
```

Repeat `--event-id=<EVENT_OBJECT_ID>` to approve more than one event. Apply mode refuses to update all events implicitly and ignores individual events.

All approved event IDs are reconciled in one transaction. If any ID does not exist, is not a team event, or cannot be updated safely, the entire batch is aborted; an earlier event in that command is not left committed while a later event fails.

The transaction uses snapshot reads and majority writes. The script counts teams and conditionally updates only `Event.registrationCount` when its stored value still matches the value read in that transaction. Team creation updates the same event document in its own transaction, so concurrent creation produces a MongoDB write conflict or a guarded-update failure. The MongoDB driver retries labeled transient transaction errors through `withTransaction()`, and the script retries a guarded no-match up to three times. Reporting occurs only after the transaction commits, using the result of the successful callback attempt, so discarded retry attempts are never reported as applied.

Dry-run mode performs no writes and does not start a transaction. Counts can naturally change after a dry run if students create teams, so run a fresh targeted dry run immediately before requesting apply approval.

The reconciliation service imports only `Event` and `EventTeam`. It filters events by `participationType: "team"`, reads `EventTeam` only to count documents, and updates only `Event.registrationCount`. It never updates individual events, team documents, team membership records, student registrations, guest registrations, or user records.

The script never prints database credentials or connection strings. Do not run the apply command against production without explicit approval.
