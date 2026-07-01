# Task Manager API

A production-ready RESTful API for managing tasks with JWT authentication. Built with Node.js and Express.js using a layered architecture.

## Project Overview

The Task Manager API provides user authentication and full CRUD operations for personal tasks. Each user can only access their own tasks. The project follows clean code principles with separation of concerns across routes, controllers, services, and repositories.

**Key features:**

- JWT-based authentication (register, login, profile)
- Task CRUD with status and priority management
- Centralized validation using `express-validator`
- Consistent API response format
- Swagger API documentation
- Unit and integration tests with Jest and Supertest

## Folder Structure

```
api-aggregation/
├── src/
│   ├── config/           # Environment and Swagger configuration
│   ├── constants/        # Application constants (task status, priority)
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Auth, validation, and error middleware
│   ├── repositories/     # In-memory data access layer
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic layer
│   ├── utils/            # Shared utilities (ApiError, asyncHandler)
│   ├── validations/      # express-validator rule definitions
│   ├── app.js            # Express application setup
│   └── server.js         # Server entry point
├── tests/
│   ├── integration/      # API integration tests (Supertest)
│   ├── unit/             # Unit tests
│   ├── helpers/          # Test utilities
│   └── setup.js          # Jest test environment setup
├── jest.config.js
├── package.json
└── README.md
```

## Installation

**Prerequisites:** Node.js >= 18, npm

```bash
git clone <repository-url>
cd api-aggregation
npm install
cp .env.example .env
```

Update `.env` with your configuration (see [Environment Variables](#environment-variables)).

## Running Locally

Start the development server with hot reload:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

## API Documentation

Interactive Swagger documentation is available at:

**http://localhost:3000/api-docs**

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/users/profile` | Yes | Get logged-in user profile |
| POST | `/api/tasks` | Yes | Create a new task |
| GET | `/api/tasks` | Yes | Get all user tasks |
| GET | `/api/tasks/:id` | Yes | Get task by ID |
| PUT | `/api/tasks/:id` | Yes | Update task by ID |
| DELETE | `/api/tasks/:id` | Yes | Delete task by ID |

### Response Format

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `JWT_EXPIRES_IN` | JWT token expiration | `1d` |

Example `.env`:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Architecture

```
Request → Route → Middleware → Controller → Service → Repository
```

- **Routes** — Define endpoints and apply middleware
- **Controllers** — Handle HTTP requests and format responses
- **Services** — Business logic and authorization rules
- **Repositories** — Data persistence (in-memory for now)
- **Middlewares** — Authentication, validation, error handling

## Future Improvements

- MySQL (or PostgreSQL) database integration
- Pagination and filtering for task lists
- Refresh token support
- Password reset / forgot password flow
- Rate limiting and request throttling
- Structured logging (Winston / Pino)
- CI/CD pipeline with GitHub Actions
- Docker containerization
- Redis caching for sessions

## License

ISC
