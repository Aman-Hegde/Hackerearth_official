# Safe local Events V3 testing

This setup runs the website locally while using only the Atlas database
`hackerearth_hub_v3_test`. The guarded command refuses to start if the
database, database username, local mode, email mode, frontend origin, or port
is not the expected test value.

Never use the normal `npm run dev` command for this test session.

## 1. Create a restricted Atlas database user

Atlas creates the physical database when the first document is written, so it
is normal if `hackerearth_hub_v3_test` is not initially listed under Browse
Collections.

1. Sign in to MongoDB Atlas and open the project containing the development
   cluster.
2. Open **Security > Database Access**.
3. Select **Add New Database User**.
4. Choose **Password** authentication.
5. Enter a new username used only for local Events V3 testing. Do not reuse the
   production application's database username.
6. Generate a strong password and store it in a password manager.
7. Under database user privileges, choose **Specific Privileges** rather than
   an "any database" role.
8. Add the `readWrite` privilege with database
   `hackerearth_hub_v3_test`. Leave the collection blank so it applies to that
   test database only.
9. Confirm that no `readWriteAnyDatabase`, Atlas admin, cluster admin, or
   production-database privilege is assigned.
10. Save the user.
11. Open **Security > Network Access** and allow only your current IP address.
    Avoid `0.0.0.0/0` for this test.

Atlas wording can vary slightly by UI version. The final user must have
`readWrite` on `hackerearth_hub_v3_test` and no access to `hackerearth_hub`.

## 2. Configure the guarded backend environment

The real file is git-ignored. From the repository root, create it from the
example only if it does not already exist:

```powershell
Copy-Item backend/.env.test.local.example backend/.env.test.local
```

Open `backend/.env.test.local` and replace the placeholders. Do not paste its
contents into chat, terminal output, screenshots, or Git.

Required safety values:

```dotenv
LOCAL_TEST_MODE=true
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
EMAIL_DELIVERY_MODE=disabled
```

Also configure:

- `MONGODB_URI`: the Atlas URI for the restricted test user, with
  `/hackerearth_hub_v3_test` before the query string. URL-encode special
  characters in the password.
- `TEST_MONGODB_USERNAME`: exactly the username embedded in `MONGODB_URI`.
- `JWT_SECRET`: a new local-only random value containing at least 32
  characters. Do not reuse the production JWT secret.

The loader requires these values to exist in `.env.test.local`; it does not
accept missing values from `backend/.env` or the parent shell. It also removes
SMTP, Brevo, and Cloudinary credentials from the local test process. Event
posters uploaded in this mode are stored only under the git-ignored
`backend/.local-test-uploads` directory and are served by the local backend.
They are not sent to Cloudinary and are not intended for deployment.

Email delivery is disabled. Forgot-password requests cannot deliver a usable
OTP during this local session. No OTP, password, token, or environment secret
is printed by the safe startup command.

## 3. Optional: create an isolated test admin

To test the Admin Dashboard on a fresh database, add these test-only values to
`backend/.env.test.local`:

```dotenv
ADMIN_NAME=Local Test Admin
ADMIN_EMAIL=YOUR_TEST_NMAMIT_EMAIL
ADMIN_USN=YOUR_TEST_ADMIN_USN
ADMIN_CONTACT_NUMBER=YOUR_TEST_10_DIGIT_NUMBER
ADMIN_BRANCH=YOUR_TEST_BRANCH
ADMIN_YEAR=1
ADMIN_PASSWORD=YOUR_UNIQUE_TEST_PASSWORD
```

Then run this guarded command from `backend`:

```powershell
npm run create:admin:test-local
```

Do not use `npm run create:admin` for the isolated test setup.

Student accounts can be created through the normal local registration page.
Registration currently creates the student directly; outbound email is not
needed for that flow.

## 4. Start the backend safely

In terminal 1:

```powershell
cd backend
npm run dev:test-local
```

The process validates all safeguards before attempting a MongoDB connection.
If any check fails, it exits without starting Express.

## 5. Start the isolated frontend

In terminal 2:

```powershell
cd frontend
npm run dev:test-local
```

Open `http://localhost:5173`. This Vite command:

- fixes the API target to `http://localhost:5000`;
- uses `frontend/local-test-env` instead of normal frontend environment files;
- does not load production EmailJS variables; and
- requires port 5173 instead of silently switching ports.

The backend allows `http://localhost:5173` through CORS with credentials, so
the existing HTTP-only authentication cookie works during local testing.

## 6. Offline safety checks

These checks do not connect to MongoDB:

```powershell
cd backend
npm run test:local-safety
```

Stop both development servers with `Ctrl+C` when finished.
