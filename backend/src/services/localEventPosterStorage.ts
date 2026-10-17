import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const LOCAL_TEST_POSTER_ROUTE = "/local-test-uploads/event-posters";
const LOCAL_TEST_POSTER_ORIGIN = "http://localhost:5000";

export const LOCAL_TEST_POSTER_DIRECTORY = path.resolve(
  __dirname,
  "../../.local-test-uploads/event-posters"
);

const POSTER_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export class InvalidLocalPosterError extends Error {
  constructor() {
    super("Poster file contents do not match the selected image type.");
    this.name = "InvalidLocalPosterError";
  }
}

const hasExpectedSignature = (buffer: Buffer, mimeType: string): boolean => {
  if (mimeType === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (mimeType === "image/png") {
    const pngSignature = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    return buffer.length >= pngSignature.length && buffer.subarray(0, 8).equals(pngSignature);
  }

  if (mimeType === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
};

export const storeLocalTestEventPoster = async (
  buffer: Buffer,
  mimeType: string,
  storageDirectory = LOCAL_TEST_POSTER_DIRECTORY
): Promise<{ url: string; publicId: string; filePath: string }> => {
  if (process.env.LOCAL_TEST_MODE !== "true") {
    throw new Error("Local poster storage is available only in local test mode.");
  }

  const extension = POSTER_EXTENSIONS[mimeType];
  if (!extension || !hasExpectedSignature(buffer, mimeType)) {
    throw new InvalidLocalPosterError();
  }

  const filename = `${randomUUID()}${extension}`;
  const filePath = path.join(storageDirectory, filename);

  await fs.mkdir(storageDirectory, { recursive: true });
  await fs.writeFile(filePath, buffer, { flag: "wx" });

  return {
    url: `${LOCAL_TEST_POSTER_ORIGIN}${LOCAL_TEST_POSTER_ROUTE}/${filename}`,
    publicId: `local-test/event-posters/${filename}`,
    filePath,
  };
};

export { LOCAL_TEST_POSTER_ROUTE };
