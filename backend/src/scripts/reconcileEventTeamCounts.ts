import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { initializeRuntimeEnvironment } from "../config/localTestEnvironment";
import {
  applyEventTeamCountReconciliation,
  inspectEventTeamCounts,
  parseReconciliationArguments,
  ReconciliationInputError,
  TeamEventNotFoundError,
  type EventTeamCountReconciliationResult,
} from "../services/eventTeamCountReconciliation";

const reportResult = (
  result: EventTeamCountReconciliationResult,
  mode: "DRY RUN" | "APPLY"
) => {
  const title = result.title.replace(/[\r\n]+/g, " ");
  if (mode === "APPLY") {
    console.log(
      `[APPLY] ${result.eventId} | ${title} | before=${result.storedCount} | after=${result.actualTeamCount} | ${result.changed ? "updated" : "already correct"}`
    );
    return;
  }

  console.log(
    `[DRY RUN] ${result.eventId} | ${title} | stored=${result.storedCount} | teams=${result.actualTeamCount} | ${result.changed ? "mismatch" : "already correct"}`
  );
};

export const runEventTeamCountReconciliation = async (args: string[]) => {
  const { applyChanges, eventIds } = parseReconciliationArguments(args);

  initializeRuntimeEnvironment(process.env, () => {
    dotenv.config();
  });
  await connectDatabase();

  if (applyChanges) {
    console.log(
      `Apply mode enabled for ${eventIds.length} explicitly approved team event(s).`
    );
    const results = await applyEventTeamCountReconciliation(eventIds);
    results.forEach((result) => reportResult(result, "APPLY"));
    return;
  }

  const results = await inspectEventTeamCounts(eventIds);
  console.log(
    `Dry run: inspecting ${results.length} team event(s). No data will be changed.`
  );
  results.forEach((result) => reportResult(result, "DRY RUN"));
};

if (require.main === module) {
  void runEventTeamCountReconciliation(process.argv.slice(2))
    .catch((error: unknown) => {
      if (error instanceof ReconciliationInputError) {
        console.error(
          error.code === "INVALID_EVENT_ID_ARGUMENT"
            ? "Reconciliation stopped: every --event-id value must be a valid MongoDB ObjectId."
            : "Reconciliation stopped: apply mode requires at least one explicitly approved --event-id value."
        );
      } else if (error instanceof TeamEventNotFoundError) {
        console.error(
          "Reconciliation stopped: an approved event is not a team event or does not exist. No approved event was changed."
        );
      } else {
        console.error(
          "Reconciliation failed. The transaction was aborted and no approved event was partially reconciled."
        );
      }
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}
