const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  InvalidLocalPosterError,
  storeLocalTestEventPoster,
} = require("../dist/services/localEventPosterStorage");

const validPng = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
]);

test("local poster storage is isolated, signature-checked, and local-mode only", async (t) => {
  const storageDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "hackerearth-local-poster-")
  );
  const previousLocalTestMode = process.env.LOCAL_TEST_MODE;

  t.after(async () => {
    if (previousLocalTestMode === undefined) {
      delete process.env.LOCAL_TEST_MODE;
    } else {
      process.env.LOCAL_TEST_MODE = previousLocalTestMode;
    }
    await fs.rm(storageDirectory, { recursive: true, force: true });
  });

  process.env.LOCAL_TEST_MODE = "true";
  const stored = await storeLocalTestEventPoster(
    validPng,
    "image/png",
    storageDirectory
  );

  assert.match(
    stored.url,
    /^http:\/\/localhost:5000\/local-test-uploads\/event-posters\/[0-9a-f-]+\.png$/
  );
  assert.match(stored.publicId, /^local-test\/event-posters\/[0-9a-f-]+\.png$/);
  assert.equal(path.dirname(stored.filePath), storageDirectory);
  assert.deepEqual(await fs.readFile(stored.filePath), validPng);

  await assert.rejects(
    () =>
      storeLocalTestEventPoster(
        Buffer.from("not an image"),
        "image/png",
        storageDirectory
      ),
    InvalidLocalPosterError
  );

  process.env.LOCAL_TEST_MODE = "false";
  await assert.rejects(
    () => storeLocalTestEventPoster(validPng, "image/png", storageDirectory),
    /only in local test mode/
  );

  assert.equal((await fs.readdir(storageDirectory)).length, 1);
});
