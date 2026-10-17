import {
  LOCAL_TEST_DATABASE_NAME,
  loadLocalTestEnvironment,
} from "./config/localTestEnvironment";

const start = (): void => {
  loadLocalTestEnvironment();
  console.log(
    `Local test safeguards passed for ${LOCAL_TEST_DATABASE_NAME}; outbound email is disabled.`
  );
  require("./index");
};

try {
  start();
} catch (error: unknown) {
  const message =
    error instanceof Error ? error.message : "Local test startup was refused.";
  console.error(message);
  process.exit(1);
}
