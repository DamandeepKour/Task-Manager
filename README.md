# Task Manager API

Production-ready backend starter for a Task Manager API built with Node.js and Express.js.

## Tech Stack

- **Node.js** (>= 18)
- **Express.js**
- **ES Modules**

## Project Structure

```
src/
├── config/          # Environment and app configuration
├── controllers/     # Request handlers
├── routes/          # Route definitions
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── middlewares/     # Express middleware
├── validations/     # Request validation schemas
├── utils/           # Shared utilities
├── app.js           # Express application setup
└── server.js        # Server entry point
```

## Prerequisites

- Node.js >= 18
- npm

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd task-manager-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:

   ```env
   NODE_ENV=development
   PORT=3000
   ```

## Scripts

| Command       | Description                          |
|---------------|--------------------------------------|
| `npm run dev` | Start development server with nodemon |
| `npm start`   | Start production server              |

## API Endpoints

### Health Check

```
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running"
}
```

## Architecture

This starter follows a layered architecture:

- **Routes** — Define API endpoints and map them to controllers
- **Controllers** — Handle HTTP requests and responses
- **Services** — Contain business logic (to be implemented)
- **Repositories** — Handle data persistence (to be implemented)
- **Middlewares** — Cross-cutting concerns (error handling, etc.)
- **Validations** — Request input validation (to be implemented)

## License

ISC
