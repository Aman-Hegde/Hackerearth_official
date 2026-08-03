# HackerEarth Hub NMAMIT Backend

Backend API for the **HackerEarth Hub NMAMIT** website.

This backend provides secure authentication, role-based authorization, OTP verification, student management, admin management, registration controls, and REST APIs consumed by the frontend.

---

# Features

## Authentication

- Student Registration
- NMAMIT Email Validation
- Email OTP Verification
- Secure Password Hashing
- Email & Password Login
- Logout
- HTTP-only JWT Sessions
- Forgot Password with OTP
- Password Reset

---

## Authorization

- Student Protected Routes
- Admin Protected Routes
- Role-Based Access Control
- HTTP-only Cookie Authentication

---

## Student Features

- Student Registration
- Student Profile
- Domain Enrollment
- Secure Login
- Personalized Dashboard

---

## Admin Features

- Dashboard Overview
- Student Statistics
- Student Directory
- Search Students
- Filter Students
- Pagination
- Activate / Deactivate Students
- Open / Close Student Registration
- Registration Settings
- Export Filtered Students to Excel (.xlsx)
- Admin Account Creation Utility

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT Authentication
- HTTP-only Cookies
- bcryptjs
- Nodemailer
- ExcelJS

---

# Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── index.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

# Requirements

- Node.js
- npm
- MongoDB Atlas
- SMTP Email Account

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Navigate to backend

```bash
cd Hackerearth_official/backend
```

Install dependencies

```bash
npm install
```

or

```bash
npm ci
```

---

# Environment Setup

Create

```text
backend/.env
```

using

```text
backend/.env.example
```

Required environment variables

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

NODE_ENV=development

FRONTEND_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM_NAME=HackerEarth Hub NMAMIT
EMAIL_FROM_ADDRESS=

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_USN=
ADMIN_CONTACT_NUMBER=
ADMIN_BRANCH=
ADMIN_YEAR=
ADMIN_PASSWORD=
```

> **Never commit the actual `.env` file or real credentials.**

---

# Running the Backend

Development

```bash
npm run dev
```

Expected output

```text
MongoDB connected successfully.
Server running on port 5000
```

Backend URL

```text
http://localhost:5000
```

Health Check

```http
GET /api/health
```

---

# Build

```bash
npm run build
```

Run production build

```bash
npm start
```

Type checking

```bash
npx tsc --noEmit
```

---

# Utility Commands

Test MongoDB

```bash
npm run test:db
```

Test SMTP

```bash
npm run test:email
```

Create or Promote Admin

```bash
npm run create:admin
```

The script reads the **ADMIN_\*** values from `.env`.

---

# Authentication Flow

## Student Registration

```text
Register
      ↓
OTP sent to NMAMIT Email
      ↓
Verify OTP
      ↓
Student Account Created
      ↓
Login
```

---

## Login

```text
Email + Password
        ↓
Credential Verification
        ↓
JWT Created
        ↓
HTTP-only Cookie
        ↓
Student/Admin Dashboard
```

---

## Forgot Password

```text
Enter Email
      ↓
Receive OTP
      ↓
Verify OTP
      ↓
Set New Password
      ↓
Login
```

---

# API Modules

## Authentication

Base Route

```text
/api/auth
```

Endpoints

```text
POST /register/request-otp
POST /register/resend-otp
POST /register/verify-otp

POST /login
POST /logout
GET  /me

POST /forgot-password/request-otp
POST /forgot-password/resend-otp
POST /forgot-password/verify-otp
POST /forgot-password/change-password
```

---

## Admin

Base Route

```text
/api/admin
```

Endpoints

```text
GET   /overview

GET   /students

GET   /students/export

PATCH /students/:studentId/status

GET   /settings/registration

PATCH /settings/registration
```

---

# Student Filters

Supported filters

- Search
- Branch
- Year
- Domain
- Status
- Pagination
- Sorting

Example

```http
GET /api/admin/students?year=3&branch=ISE&status=active
```

Excel Export

```http
GET /api/admin/students/export?year=3
```

---

# Excel Export

The backend exports filtered student records into an **Excel (.xlsx)** file.

Exported information includes

- Name
- Email
- USN
- Contact Number
- Branch
- Year
- Domains
- Account Status
- Email Verification Status
- Registration Date

Sensitive information such as passwords, OTPs, password hashes, reset tokens, and internal database fields are never exported.

---

# Registration Control

Administrators can

- Open Student Registration
- Close Student Registration
- Configure Registration Messages

API

```http
PATCH /api/admin/settings/registration
```

When registration is closed, new OTP requests are blocked while students who have already received an OTP can still complete verification.

---

# Security

- JWT Authentication
- HTTP-only Cookies
- bcrypt Password Hashing
- Role-Based Authorization
- NMAMIT Email Validation
- OTP Expiry
- OTP Resend Cooldown
- Protected Admin APIs
- Secure API Responses

---

# CORS

Local Frontend

```text
http://localhost:5173
```

Frontend requests requiring authentication must send

```ts
credentials: "include"
```

---

# Current Features

- Student Registration
- OTP Verification
- Login
- Logout
- Forgot Password
- Password Reset
- Student Dashboard APIs
- Admin Dashboard APIs
- Student Directory
- Search & Filtering
- Pagination
- Registration Controls
- Excel Export
- Role-Based Authentication

---

# Planned Features

- Event Management
- Event Registration
- Weekly Learning Resources
- PDF Distribution
- Domain Management
- Announcements
- Leaderboard APIs
- Attendance
- Analytics Dashboard

---

# Notes

- Use `.env.example` as the template for local development.
- Never commit `.env` files or sensitive credentials.
- Store large files (PDFs, posters, images) in external object storage and save only metadata/URLs in MongoDB.
