const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const mongoose = require("mongoose");
const {
  assertLocalTestEnvironment,
  initializeRuntimeEnvironment,
} = require("../dist/config/localTestEnvironment");
const { connectDatabase } = require("../dist/config/db");

const validEnvironment = () => ({
  LOCAL_TEST_MODE: "true",
  NODE_ENV: "development",
  PORT: "5000",
  FRONTEND_URL: "http://localhost:5173",
  EMAIL_DELIVERY_MODE: "disabled",
  MONGODB_URI:
    "mongodb+srv://events-v3-test-user:not-a-real-password@example.invalid/hackerearth_hub_v3_test?retryWrites=true&w=majority",
  TEST_MONGODB_USERNAME: "events-v3-test-user",
  JWT_SECRET: "offline-test-secret-with-at-least-32-characters",
});

test("local test safety accepts the isolated configuration without connecting", () => {
  assert.doesNotThrow(() => assertLocalTestEnvironment(validEnvironment(), true));
});

test("local test safety requires explicit loading of .env.test.local", () => {
  assert.throws(
    () => assertLocalTestEnvironment(validEnvironment(), false),
    /was not explicitly loaded/
  );
});

test("local test safety rejects the production database name", () => {
  const environment = validEnvironment();
  environment.MONGODB_URI = environment.MONGODB_URI.replace(
    "hackerearth_hub_v3_test",
    "hackerearth_hub"
  );
  assert.throws(
    () => assertLocalTestEnvironment(environment, true),
    /database must be hackerearth_hub_v3_test/
  );
});

test("local test safety rejects a database username mismatch", () => {
  const environment = validEnvironment();
  environment.TEST_MONGODB_USERNAME = "different-test-user";
  assert.throws(
    () => assertLocalTestEnvironment(environment, true),
    /must use TEST_MONGODB_USERNAME/
  );
});

test("local test safety rejects enabled email delivery", () => {
  const environment = validEnvironment();
  environment.EMAIL_DELIVERY_MODE = "brevo";
  assert.throws(
    () => assertLocalTestEnvironment(environment, true),
    /email delivery must be disabled/
  );
});

test("local test safety rejects production and unexpected frontend origins", () => {
  const environment = validEnvironment();
  environment.FRONTEND_URL = "https://example.invalid";
  assert.throws(
    () => assertLocalTestEnvironment(environment, true),
    /FRONTEND_URL must be the local frontend/
  );
});

test("local test safety rejects local mode being disabled", () => {
  const environment = validEnvironment();
  environment.LOCAL_TEST_MODE = "false";
  assert.throws(
    () => assertLocalTestEnvironment(environment, true),
    /LOCAL_TEST_MODE must be true/
  );
});

test("runtime initialization rejects local mode introduced by dotenv", () => {
  const environment = {};

  assert.throws(
    () =>
      initializeRuntimeEnvironment(
        environment,
        () => Object.assign(environment, validEnvironment()),
        false
      ),
    /was not explicitly loaded/
  );
});

test("direct database initialization rejects unverified local mode before connecting", async (t) => {
  const originalEnvironment = { ...process.env };
  let connectionAttempts = 0;
  t.mock.method(mongoose, "connect", async () => {
    connectionAttempts += 1;
  });

  Object.assign(process.env, validEnvironment());

  try {
    await assert.rejects(
      () => connectDatabase(),
      /was not explicitly loaded/
    );
    assert.equal(connectionAttempts, 0);
  } finally {
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnvironment)) delete process.env[key];
    }
    Object.assign(process.env, originalEnvironment);
  }
});

test("normal production-mode initialization is not rejected", () => {
  const environment = {};
  let dotenvLoaded = false;

  assert.doesNotThrow(() =>
    initializeRuntimeEnvironment(
      environment,
      () => {
        dotenvLoaded = true;
        environment.NODE_ENV = "production";
      },
      false
    )
  );
  assert.equal(dotenvLoaded, true);
});

test("git ignores real environment files recursively but keeps templates", () => {
  const repositoryRoot = path.resolve(__dirname, "../..");
  const ignoredPaths = [
    "backend/.env",
    "backend/.env.local",
    "backend/.env.production",
    "backend/.env.test.local",
    "frontend/.env",
    "frontend/.env.local",
    "frontend/.env.production",
    "frontend/local-test-env/.env.test-local",
  ];
  const templatePaths = [
    "backend/.env.example",
    "backend/.env.test.local.example",
    "frontend/.env.example",
  ];
  const checkIgnore = (relativePath) =>
    spawnSync(
      "git",
      ["check-ignore", "--no-index", "--quiet", "--", relativePath],
      { cwd: repositoryRoot }
    ).status;

  for (const relativePath of ignoredPaths) {
    assert.equal(checkIgnore(relativePath), 0, `${relativePath} must be ignored`);
  }
  for (const relativePath of templatePaths) {
    assert.equal(checkIgnore(relativePath), 1, `${relativePath} must remain committable`);
  }
});
