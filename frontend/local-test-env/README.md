# Isolated local test environment

The local-test Vite configuration uses this directory as its environment
directory. Keep it free of production credentials and EmailJS settings.

The local backend URL is fixed by `vite.test-local.config.ts` so the browser
cannot silently use a production API URL.
