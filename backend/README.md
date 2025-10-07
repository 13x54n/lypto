# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Dev mode with nodemon

```bash
bun run dev
```

This reloads the backend when files change.

## Environment variables

Create a `.env` file in `backend/` with:

```
MONGODB_URI=mongodb://localhost:27017/zypto
JWT_SECRET=replace-with-a-long-random-secret
PORT=4000
```

## API

- POST `/api/auth/register` { email, password }
- POST `/api/auth/login` { email, password }
- GET `/api/auth/me` with `Authorization: Bearer <token>`
- POST `/api/auth/request-otp` { email }
- POST `/api/auth/verify-otp` { email, code }
- POST `/api/auth/firebase-login` { email, uid }

