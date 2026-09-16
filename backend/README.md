# Kairali Match Makers — Backend API

Express + MongoDB backend for the [Kairali Match Makers](../frontend) frontend.

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000` by default (matches the frontend's `axiosInstance` baseURL).

## Requirements

- MongoDB running locally at `mongodb://127.0.0.1:27017` (see `.env`), or point `MONGODB_URI` at a MongoDB Atlas connection string instead.

## Note on payments

Contact-info requests are created via `POST /contact-requests` directly — Stripe/payment collection was intentionally left out of the frontend for now, so this simply records the request without charging anything.

## Note on auth

Routes are currently **not** protected by Firebase token verification (no admin/user role check server-side) — anyone who knows an endpoint can call it. This is fine for local development but should be locked down (e.g. with `firebase-admin`'s `verifyIdToken`) before deploying this publicly.
