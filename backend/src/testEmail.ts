import dotenv from "dotenv";
import { verifyEmailTransport } from "./services/emailService";

dotenv.config();

verifyEmailTransport()
  .then(() => {
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(
      "SMTP configuration verification failed:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  });
