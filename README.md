Live URL = mindstack-lms.vercel.app/

# LMS Becodemy — Learning Management System

A full-stack **Learning Management System (LMS)** where admins can create and manage courses, and users can browse, purchase, and consume course content — complete with video lessons, Q&A, reviews, notifications, and an analytics dashboard.

Built as a monorepo with a **Next.js** client and a **Node.js/Express** REST API server.

---

## ✨ Features

- **Authentication & Authorization**
  - Email/password registration with OTP-based account activation
  - Social login support (NextAuth)
  - JWT-based access & refresh tokens with Redis session storage
  - Role-based access control (`user` / `admin`)
- **Course Management**
  - Create, edit, and delete courses (admin)
  - Multi-section video courses with links, prerequisites, and benefits
  - Secure video playback via VdoCipher
  - Course preview / demo video support
- **Learning Experience**
  - Ask questions & get replies on course lessons (Q&A threads)
  - Leave reviews and ratings, with admin replies
  - Track purchased courses per user
- **Payments**
  - Stripe integration for secure course checkout
  - Order creation and order history
- **Admin Dashboard**
  - User management (view, update roles, delete users)
  - Course, order, and user analytics (charts via Recharts)
  - Site layout management (banner, FAQ, categories)
  - Real-time notifications (Socket.IO)
- **Other**
  - Email notifications (activation, order confirmation, question replies) via Nodemailer + EJS templates
  - Rate limiting on the API
  - Cloudinary integration for image uploads (avatars, thumbnails)

---

## 🛠️ Tech Stack

**Client**
- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- Redux Toolkit & React-Redux for state management
- NextAuth for authentication
- Material UI (MUI) + Tailwind CSS for UI
- Formik + Yup for form handling/validation
- Stripe.js / React Stripe.js for payments
- Socket.IO client for real-time notifications
- Recharts for analytics charts

**Server**
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- Redis (ioredis) for session/token caching
- JWT for authentication
- Stripe for payment processing
- Cloudinary for media storage
- Nodemailer + EJS for transactional emails
- Socket.IO for real-time features
- express-rate-limit for API protection

---

## 📁 Project Structure

```
LMS_becodemy/
├── client/                  # Next.js frontend
│   ├── app/
│   │   ├── admin/           # Admin dashboard pages (courses, users, analytics, orders, etc.)
│   │   ├── components/      # Reusable UI components (Auth, Course, Payment, Review, FAQ, etc.)
│   │   ├── course/          # Course detail pages
│   │   ├── course-access/   # Enrolled course viewing/learning pages
│   │   ├── courses/         # Course catalog
│   │   ├── profile/         # User profile
│   │   ├── policy/, about/, faq/
│   │   ├── hooks/, utils/, styles/
│   ├── redux/                # Redux Toolkit store & API slices
│   └── public/
│
└── server/                  # Express backend (TypeScript)
    ├── controller/           # Route handlers (user, course, order, notification, analytics, layout)
    ├── routes/               # Express routers
    ├── models/               # Mongoose schemas (user, course, order, layout, notification)
    ├── services/             # Business logic layer
    ├── middleware/            # Auth guard, error handling, async wrapper
    ├── mails/                 # EJS email templates
    ├── utils/                 # DB connection, Redis, JWT, mailer, error handler
    ├── app.ts                 # Express app & route registration
    ├── server.ts               # Server entry point
    └── socketServer.ts         # Socket.IO setup
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x recommended)
- MongoDB database (local or Atlas)
- Redis instance (e.g., Upstash)
- Cloudinary account
- Stripe account (test keys for development)
- SMTP credentials (e.g., Gmail app password) for sending emails

### 1. Clone the repository
```bash
git clone https://github.com/Raza181261/LMS_becodemy.git
cd LMS_becodemy
```

### 2. Set up the server
```bash
cd server
npm install
```

Create a `.env` file inside `server/` with the following variables (replace with your own values — **never commit real secrets**):

```env
PORT=8000
DB_URI=<your-mongodb-connection-string>
NODE_ENV=development

ORIGIN=['http://localhost:3000']

CLOUD_NAME=<cloudinary-cloud-name>
CLOUD_API_KEY=<cloudinary-api-key>
CLOUD_SECRET_KEY=<cloudinary-api-secret>

REDIS_URL=<your-redis-connection-url>

ACTIVATION_SECRET=<random-secret-for-account-activation>

ACCESS_TOKEN=<random-access-token-secret>
ACCESS_TOKEN_EXPIRE=5
REFRESH_TOKEN=<random-refresh-token-secret>
REFRESH_TOKEN_EXPIRE=3

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=<your-email>
SMTP_PASSWORD=<your-email-app-password>

VDOCIPHER_API_SECRET=<vdocipher-api-secret>

STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
```

Run the server in development mode:
```bash
npm run dev
```
The API will be available at `http://localhost:8000/api/v1`.

### 3. Set up the client
```bash
cd ../client
npm install
```

Create a `.env.local` file inside `client/` with the required public variables (API base URL, NextAuth secret, Stripe publishable key, etc.), matching what the app's config expects.

Run the client:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 📡 API Overview

All routes are prefixed with `/api/v1`.

| Resource | Base Route | Examples |
|---|---|---|
| Users | `/api/v1` | `/registration`, `/login`, `/logout`, `/me`, `/update-user-info`, `/get-users` (admin) |
| Courses | `/api/v1` | `/create-course` (admin), `/get-courses`, `/get-course/:id`, `/add-questions`, `/add-review/:id` |
| Orders | `/api/v1` | `/create-order`, `/get-orders` (admin), `/payment` |
| Notifications | `/api/v1` | `/get-all-notifications` (admin), `/update-notification/:id` |
| Analytics | `/api/v1` | `/get-user-analytics`, `/get-course-analytics`, `/get-order-analytics` |
| Layout | `/api/v1` | `/create-layout` (admin), `/edit-layout` (admin), `/get-layout/:type` |

Most write operations and admin-only endpoints require authentication (JWT via cookies) and the `admin` role.

---

