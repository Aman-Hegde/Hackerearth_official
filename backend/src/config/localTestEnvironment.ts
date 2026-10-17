import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export const LOCAL_TEST_DATABASE_NAME = "hackerearth_hub_v3_test";

const REQUIRED_LOCAL_TEST_KEYS = [
  "LOCAL_TEST_MODE",
  "MONGODB_URI",
  "TEST_MONGODB_USERNAME",
  "JWT_SECRET",
  "EMAIL_DELIVERY_MODE",
  "FRONTEND_URL",
  "NODE_ENV",
  "PORT",
] as const;

const DISALLOWED_INTEGRATION_KEYS = [
  "BREVO_API_KEY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

let localTestFileLoaded = false;

const getMongoTarget = (mongoUri: string) => {
  let parsed: URL;

  try {
    parsed = new URL(mongoUri);
  } catch {
    throw new Error("Local test safety check failed: MONGODB_URI is invalid.");
  }

  if (parsed.protocol !== "mongodb:" && parsed.protocol !== "mongodb+srv:") {
    throw new Error(
      "Local test safety check failed: MONGODB_URI must use MongoDB."
    );
  }

  const databaseName = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  const username = decodeURIComponent(parsed.username);

  return { databaseName, username };
};

export const assertLocalTestEnvironment = (
  environment: NodeJS.ProcessEnv,
  environmentFileLoaded = localTestFileLoaded
): void => {
  if (!environmentFileLoaded) {
    throw new Error(
      "Local test safety check failed: backend/.env.test.local was not explicitly loaded."
    );
  }

  if (environment.LOCAL_TEST_MODE !== "true") {
    throw new Error(
      "Local test safety check failed: LOCAL_TEST_MODE must be true."
    );
  }

  if (environment.NODE_ENV !== "development") {
    throw new Error(
      "Local test safety check failed: NODE_ENV must be development."
    );
  }

  if (environment.EMAIL_DELIVERY_MODE !== "disabled") {
    throw new Error(
      "Local test safety check failed: email delivery must be disabled."
    );
  }

  if (environment.FRONTEND_URL !== "http://localhost:5173") {
    throw new Error(
      "Local test safety check failed: FRONTEND_URL must be the local frontend."
    );
  }

  if (environment.PORT !== "5000") {
    throw new Error(
      "Local test safety check failed: PORT must be 5000."
    );
  }

  const expectedUsername = environment.TEST_MONGODB_USERNAME?.trim();
  const mongoUri = environment.MONGODB_URI?.trim();
  const jwtSecret = environment.JWT_SECRET?.trim();

  if (!expectedUsername || !mongoUri || !jwtSecret) {
    throw new Error(
      "Local test safety check failed: database credentials and JWT_SECRET must be explicitly configured."
    );
  }

  if (jwtSecret.length < 32) {
    throw new Error(
      "Local test safety check failed: JWT_SECRET must contain at least 32 characters."
    );
  }

  const { databaseName, username } = getMongoTarget(mongoUri);

  if (databaseName !== LOCAL_TEST_DATABASE_NAME) {
    throw new Error(
      `Local test safety check failed: database must be ${LOCAL_TEST_DATABASE_NAME}.`
    );
  }

  if (!username || username !== expectedUsername) {
    throw new Error(
      "Local test safety check failed: MONGODB_URI must use TEST_MONGODB_USERNAME."
    );
  }
};

export const assertVerifiedLocalTestMode = (
  environment: NodeJS.ProcessEnv,
  environmentFileLoaded = localTestFileLoaded
): void => {
  if (environment.LOCAL_TEST_MODE === "true") {
    assertLocalTestEnvironment(environment, environmentFileLoaded);
  }
};

export const initializeRuntimeEnvironment = (
  environment: NodeJS.ProcessEnv,
  loadDefaultEnvironment: () => void,
  environmentFileLoaded = localTestFileLoaded
): void => {
  if (environment.LOCAL_TEST_MODE !== "true") {
    loadDefaultEnvironment();
  }

  // Re-check after dotenv loading so a misplaced LOCAL_TEST_MODE cannot bypass
  // the dedicated loader and its database isolation checks.
  assertVerifiedLocalTestMode(environment, environmentFileLoaded);
};

export const loadLocalTestEnvironment = (): void => {
  const environmentPath = path.resolve(__dirname, "../../.env.test.local");

  if (!fs.existsSync(environmentPath)) {
    throw new Error(
      "Local test startup refused: backend/.env.test.local does not exist."
    );
  }

  const parsed = dotenv.parse(fs.readFileSync(environmentPath));
  const missingKeys = REQUIRED_LOCAL_TEST_KEYS.filter(
    (key) => !Object.prototype.hasOwnProperty.call(parsed, key) || !parsed[key]?.trim()
  );

  if (missingKeys.length > 0) {
    throw new Error(
      `Local test startup refused: backend/.env.test.local is missing ${missingKeys.join(
        ", "
      )}.`
    );
  }

  for (const [key, value] of Object.entries(parsed)) {
    process.env[key] = value;
  }

  for (const key of DISALLOWED_INTEGRATION_KEYS) {
    delete process.env[key];
  }

  localTestFileLoaded = true;
  assertLocalTestEnvironment(process.env);
};

export const isLocalTestEnvironmentLoaded = (): boolean => localTestFileLoaded;
