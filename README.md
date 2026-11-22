# Subscription Tracker API

A RESTful subscription tracking API built with Node.js, Express, and MongoDB. It supports user authentication, subscription management, rate limiting, and renewal reminder workflows powered by Upstash QStash.

## Features

- User sign-up and sign-in with bcrypt password hashing
- JWT-based route authorization
- Create, retrieve, and delete subscriptions
- MongoDB persistence with Mongoose
- Automatic renewal dates based on subscription frequency
- Renewal reminder emails at 7, 5, 2, and 1 day(s) before renewal
- Upstash Workflow/QStash integration
- 100-request-per-15-minute IP rate limit

## Tech Stack

- Node.js
- Express
- MongoDB and Mongoose
- Upstash Workflow/QStash


## Project Structure

```text
subscription-tracker/
├── app.js
├── config/
├── controllers/
├── database/
├── middlewares/
├── models/
├── routes/
└── utils/
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database
- An Upstash QStash account
- A Gmail account with an app password for reminder emails

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/amal-ns-dev/subscription-tracker.git
   cd subscription-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the environment file for your target environment:

   - Development: `.env.development.local`
   - Production: `.env.production.local`

   Add the variables described below.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Or run it with Node:

   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port on which the Express server listens |
| `NODE_ENV` | Runtime environment, such as `development` or `production` |
| `DB_URI` | MongoDB connection URI |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | JWT lifetime, for example `7d` |
| `QSTASH_TOKEN` | Upstash QStash authentication token |
| `QSTASH_URL` | Upstash QStash base URL |
| `SERVER_URL` | Public URL used by QStash to call this API |
| `EMAIL_PASSWORD` | Gmail app password used by Nodemailer |

Example `.env.development.local`:

```dotenv
PORT=5500
NODE_ENV=development
DB_URI=mongodb://127.0.0.1:27017/subscription-tracker
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
QSTASH_TOKEN=replace-with-your-qstash-token
QSTASH_URL=https://qstash.upstash.io
SERVER_URL=http://localhost:5500
EMAIL_PASSWORD=replace-with-your-gmail-app-password
```


## API Routes

Base path: `/api/v1`

### Authentication

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/sign-up` | No | Create a user |
| `POST` | `/auth/sign-in` | No | Sign in and receive a JWT |

Sign-up request:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "secure-password"
}
```

Send the returned JWT with protected routes:

```text
Authorization: Bearer <token>
```

### Users

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/users/:id` | Bearer token | Retrieve a user without the password |

### Subscriptions

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/subscriptions` | Bearer token | Create a subscription |
| `GET` | `/subscriptions/user/:id` | Bearer token | Retrieve subscriptions belonging to a user |
| `GET` | `/subscriptions/:userId/:subscriptionId` | Bearer token | Retrieve one subscription |
| `DELETE` | `/subscriptions/:userId/:subscriptionId` | Bearer token | Delete one subscription |

Create-subscription request:

```json
{
  "name": "Cloud Storage",
  "price": 999,
  "currency": "INR",
  "frequency": "monthly",
  "category": "technology",
  "paymentMethod": "Credit Card",
  "startDate": "2026-11-22T00:00:00.000Z"
}
```

Supported values:

- `currency`: `USD`, `EUR`, `GBP`, `INR`
- `frequency`: `daily`, `weekly`, `monthly`, `yearly`
- `category`: `sports`, `news`, `entertainment`, `lifestyle`, `technology`, `finance`, `politics`, `other`
- `status`: `active`, `cancelled`, `expired`

If `renewalDate` is omitted, it is calculated from `startDate` and `frequency`. A renewal reminder workflow is triggered whenever a subscription is created.

### Workflows

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/workflows/subscription/reminder` | QStash/Upstash callback | Process a subscription reminder workflow |

The workflow loads the subscription, stops for inactive or already-renewed subscriptions, and schedules email reminders for 7, 5, 2, and 1 day before renewal.

## Rate Limiting

All routes are limited to 100 requests per IP address within a 15-minute window. When the limit is exceeded, the API responds with:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```
