import { loadLocalTestEnvironment } from "../config/localTestEnvironment";

const run = (): void => {
  loadLocalTestEnvironment();
  require("./createAdmin");
};

try {
  run();
} catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Local test admin creation was refused.";
  console.error(message);
  process.exit(1);
}
