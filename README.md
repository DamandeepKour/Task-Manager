# Task Manager API

A production-ready RESTful API for managing tasks with JWT authentication. Built with Node.js and Express.js using a layered architecture.

## Project Overview

The Task Manager API provides user authentication and full CRUD operations for personal tasks. Each user can only access their own tasks. The project follows clean code principles with separation of concerns across routes, controllers, services, and repositories.

**Key features:**

- JWT-based authentication (register, login, profile)
- Task CRUD with status and priority management
- Centralized validation using `express-validator`
- Production security (Helmet, rate limiting, CORS, password strength)
- Winston structured logging with file rotation
- Task soft delete with audit fields
- Consistent API response format
- Swagger API documentation
- Unit and integration tests with Jest and Supertest

## Folder Structure

```
api-aggregation/
├── src/
│   ├── config/           # Environment, security, Swagger configuration
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
| GET | `/api/tasks` | Yes | Get user tasks (paginated, filterable, searchable) |
| GET | `/api/tasks/:id` | Yes | Get task by ID |
| PUT | `/api/tasks/:id` | Yes | Update task by ID |
| PATCH | `/api/tasks/:id/delete` | Yes | Soft delete task by ID |

### APIs Not Yet Implemented

The following are planned for future releases and are **not** available:

| Feature | Status |
|---------|--------|
| MySQL / database persistence | Not implemented (in-memory storage only) |
| `DELETE /api/tasks/:id` (hard delete) | Replaced by soft delete (`PATCH /api/tasks/:id/delete`) |
| Refresh token | Not implemented |
| Forgot / reset password | Not implemented |
| Docker / containerization | Not implemented |
| Redis caching | Not implemented |
| CI/CD pipeline | Not implemented |

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

### Task Listing (GET /api/tasks)

Supports pagination, filtering, search, and sorting via query parameters.

**Query parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Items per page |
| `status` | string | — | Filter by status (`Todo`, `In Progress`, `Completed`) |
| `priority` | string | — | Filter by priority (`Low`, `Medium`, `High`) |
| `search` | string | — | Search in title and description |
| `sortBy` | string | `createdAt` | Sort field (`createdAt`, `updatedAt`, `title`, `status`, `priority`, `dueDate`) |
| `order` | string | `desc` | Sort order (`asc`, `desc`) |

Invalid filter values are ignored safely.

**Examples:**

```bash
# Default pagination (page 1, limit 10, sorted by createdAt desc)
GET /api/tasks

# Pagination
GET /api/tasks?page=2&limit=5

# Filter by status and priority
GET /api/tasks?status=Todo&priority=High

# Search by title or description
GET /api/tasks?search=project

# Sort by title ascending
GET /api/tasks?sortBy=title&order=asc

# Combined
GET /api/tasks?status=In Progress&search=report&sortBy=dueDate&order=asc&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish API documentation",
      "status": "Todo",
      "priority": "High",
      "dueDate": "2026-12-31T00:00:00.000Z",
      "createdBy": 1,
      "createdAt": "2026-07-01T10:00:00.000Z",
      "updatedAt": "2026-07-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NODE_ENV` | No | Application environment | `development` |
| `PORT` | No | Server port | `3000` |
| `JWT_SECRET` | **Yes** | Secret key for signing JWT tokens | — |
| `JWT_EXPIRES_IN` | No | JWT token expiration | `1d` |
| `CORS_ORIGIN` | No | Allowed origins (comma-separated or `*`) | `*` |
| `CORS_CREDENTIALS` | No | Allow credentials in CORS requests | `false` |

The server **will not start** if required environment variables are missing.

Example `.env`:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=false
```

## Security

The API applies production-oriented security controls:

| Control | Description |
|---------|-------------|
| **Helmet** | Secure HTTP headers (CSP, HSTS, X-Frame-Options, nosniff, etc.) |
| **Rate Limiting** | 100 requests per 15 minutes per IP (global) |
| **CORS** | Configurable allowed origins via `CORS_ORIGIN` |
| **Env Validation** | Startup fails if `JWT_SECRET` is missing |
| **Password Strength** | Registration requires min 8 chars with uppercase, lowercase, number, and special character |
| **JSON Body Limit** | Request body capped at 10kb |

### Password Requirements (Registration)

- Minimum 8 characters
- At least one uppercase letter (`A-Z`)
- At least one lowercase letter (`a-z`)
- At least one number (`0-9`)
- At least one special character (e.g. `!@#$%^&*`)

Example valid password: `Password1!`

## Logging

The application uses **Winston** for structured logging. Log files are written to the `logs/` directory:

| File | Contents |
|------|----------|
| `access.log` | Incoming HTTP requests (method, URL, status, duration) |
| `error.log` | Error-level events |
| `combined.log` | All log levels combined |

**Logged events:**

- Application startup
- Incoming HTTP requests
- Client errors (4xx) as warnings
- Server errors (5xx) and unhandled exceptions
- Unhandled promise rejections

Logs are disabled during test runs (`NODE_ENV=test`).

## Soft Delete (Tasks)

Tasks are never permanently removed. Instead, `PATCH /api/tasks/:id/delete` performs a soft delete:

- Sets `deletedAt` and `deletedBy` timestamps
- Updates `updatedAt` and `updatedBy` audit fields
- Soft-deleted tasks are **excluded** from `GET /api/tasks`
- `GET /api/tasks/:id` returns **404** for soft-deleted tasks

**Task audit fields:**

| Field | Description |
|-------|-------------|
| `createdBy` | User who created the task |
| `updatedBy` | User who last modified the task |
| `deletedAt` | Timestamp when task was soft deleted (`null` if active) |
| `deletedBy` | User who soft deleted the task (`null` if active) |

**Example:**

```bash
PATCH /api/tasks/1/delete
Authorization: Bearer <token>
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
- Refresh token support
- Password reset / forgot password flow
- CI/CD pipeline with GitHub Actions
- Docker containerization
- Redis caching for sessions

## License

ISC
