# Zypto Backend API

Express.js backend API for the Zypto payment processing dashboard.

## Features

- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Security** - Helmet, CORS, rate limiting
- **Validation** - Request validation and error handling
- **Logging** - Morgan HTTP request logger

## API Endpoints

### Payments
- `GET /api/payments` - Get all payments (with optional filtering)
- `GET /api/payments/:id` - Get specific payment
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/chart-data` - Get chart data
- `GET /api/dashboard/section-cards` - Get section cards data

### Health
- `GET /health` - Health check endpoint

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Seed database (optional):**
   ```bash
   npm run seed
   ```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `DB_NAME` - Database name
- `FRONTEND_URL` - Frontend URL for CORS
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

## Development

- **Start server:** `npm run dev`
- **Seed database:** `npm run seed`
- **Run tests:** `npm test`

## Production

- **Start server:** `npm start`
- **Health check:** `GET /health`

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```
