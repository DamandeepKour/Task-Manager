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
- Redis caching for task read endpoints (optional, graceful fallback)
- Consistent API response format
- Swagger API documentation
- Unit and integration tests with Jest and Supertest
- Docker containerization with MySQL
- GitHub Actions CI/CD pipeline

## Folder Structure

```
api-aggregation/
├── src/
│   ├── config/           # Environment, security, Swagger configuration
│   ├── constants/        # Centralized constants (tasks, cache, auth, messages)
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
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .github/workflows/node.yml
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
| MySQL / database persistence | Not implemented (in-memory storage only; MySQL available in Docker for future use) |
| `DELETE /api/tasks/:id` (hard delete) | Replaced by soft delete (`PATCH /api/tasks/:id/delete`) |
| Refresh token | Not implemented |
| Forgot / reset password | Not implemented |
| Redis caching | Not implemented (read-cache implemented; sessions not cached) |

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
| `REDIS_ENABLED` | No | Enable Redis caching | `false` |
| `REDIS_URL` | No | Redis connection URL | `redis://localhost:6379` |
| `REDIS_TTL` | No | Cache TTL in seconds | `300` |
| `REDIS_PORT` | Docker only | Redis host port mapping | `6379` |
| `MYSQL_ROOT_PASSWORD` | Docker only | MySQL root password | `rootpassword` |
| `MYSQL_DATABASE` | Docker only | MySQL database name | `task_manager` |
| `MYSQL_USER` | Docker only | MySQL application user | `taskuser` |
| `MYSQL_PASSWORD` | Docker only | MySQL application password | `taskpassword` |
| `MYSQL_PORT` | Docker only | MySQL host port mapping | `3306` |

The server **will not start** if required environment variables are missing.

Example `.env`:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=false

# Redis (optional — app continues normally if unavailable)
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379
REDIS_TTL=300

# Docker / MySQL (infrastructure — persistence not wired yet)
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=task_manager
MYSQL_USER=taskuser
MYSQL_PASSWORD=taskpassword
MYSQL_PORT=3306
```

## Docker Setup

The project includes a multi-stage **Dockerfile** and **docker-compose.yml** with the Node.js API and MySQL 8.

**Prerequisites:** Docker and Docker Compose

1. Copy environment file and set `JWT_SECRET`:

   ```bash
   cp .env.example .env
   ```

2. Start all containers:

   ```bash
   npm run docker:up
   # or
   docker compose up -d --build
   ```

3. Verify the API:

   ```bash
   curl http://localhost:3000/health
   ```

4. View logs:

   ```bash
   npm run docker:logs
   ```

5. Stop containers:

   ```bash
   npm run docker:down
   ```

### Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| `app` | `task-manager-api` | `3000` | Node.js Express API |
| `mysql` | `task-manager-mysql` | `3306` | MySQL 8 database |
| `redis` | `task-manager-redis` | `6379` | Redis 7 cache |

### Volumes

| Volume | Purpose |
|--------|---------|
| `mysql-data` | Persistent MySQL data |
| `redis-data` | Persistent Redis data |
| `app-logs` | Application log files |

### Health Checks

- **App** — polls `GET /health` every 30s
- **MySQL** — `mysqladmin ping` every 10s

Both services use `restart: unless-stopped`.

> **Note:** MySQL is provisioned for future database integration. The application still uses in-memory storage and does not connect to MySQL yet.

## Running Containers

```bash
# Build and start in detached mode
docker compose up -d --build

# Check container status
docker compose ps

# Follow application logs
docker compose logs -f app

# Restart a service
docker compose restart app

# Stop and remove containers (volumes preserved)
docker compose down

# Stop and remove containers + volumes
docker compose down -v
```

## GitHub Actions

CI runs automatically on **push** and **pull_request** to `main` via `.github/workflows/node.yml`.

**Pipeline steps:**

1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run ESLint (`npm run lint`)
5. Run Jest tests (`npm test`)
6. Build application (`npm run build`)
7. Build Docker image

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

## Redis Caching

Optional Redis caching improves performance for task read endpoints. If Redis is unavailable, the application **continues working normally** without cache.

| Endpoint | Cached | TTL |
|----------|--------|-----|
| `GET /api/tasks` | Yes | 300s |
| `GET /api/tasks/:id` | Yes | 300s |

**Cache invalidation** occurs on:

- Create task
- Update task
- Soft delete task

Enable locally:

```env
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379
REDIS_TTL=300
```

With Docker Compose, Redis is enabled by default (`REDIS_ENABLED=true`).

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
| `npm run lint` | Run ESLint |
| `npm run build` | Validate application entry files |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run docker:up` | Build and start Docker containers |
| `npm run docker:down` | Stop Docker containers |
| `npm run docker:logs` | Follow application container logs |

## Architecture

```
Request → Route → Middleware → Controller → Service → Repository
```

- **Routes** — Define endpoints and apply middleware
- **Controllers** — Handle HTTP requests and format responses
- **Services** — Business logic, caching, and authorization rules
- **Repositories** — Data access only (in-memory store)
- **Middlewares** — Authentication, validation, error handling

## Future Improvements

- MySQL database integration (wire repositories to Docker MySQL)
- Refresh token support
- Password reset / forgot password flow

## License

ISC
