# ultimate-todo-app

**Ultimate Todo Application - Backend**

A production-grade todo application backend built with Node.js, Express, and TypeScript. The application demonstrates modern software architecture patterns including the repository pattern, dependency injection, and clean separation of concerns.

## Technologies

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=flat&logo=zod&logoColor=white)

**Key Technologies:**

- **Database**: Prisma ORM + PostgreSQL
- **Validation**: Zod Schema Validation
- **Testing**: Jest with TypeScript
- **Containerization**: Docker & Docker Compose
- **Planned**: BullMQ, Redis, Kubernetes, React Frontend

## Overview

This is a comprehensive backend service for a todo management platform. It provides features for user authentication, todo creation and management, email notifications, and more. The codebase is designed with maintainability, testability, and scalability in mind.

## Key Architecture Patterns

### Repository Pattern Implementation

The application uses the repository pattern to abstract database operations. This creates a clear separation between the data access layer and business logic:

- **Repositories**: Handle all database interactions via Prisma ORM (`UserRepository`, `TodoRepository`, `TokenRepository`)
- **Services**: Implement business logic and orchestrate repositories (e.g., `TodoService`, `UserService`)
- **Controllers**: Handle HTTP requests and delegate to services

This loosely coupled design makes the code:

- Testable (repositories can be easily mocked)
- Maintainable (database changes only affect the repository layer)
- Scalable (services are reusable across different endpoints)

### Dependency Injection

All dependencies are injected at the composition root in `server.ts`. This eliminates tight coupling and makes the application highly testable. Each module exports a factory function that creates instances with their required dependencies.

```
Controllers -> Services -> Repositories -> Prisma Client
```

## Current Features

### Authentication & Security

- JWT-based authentication with access and refresh token rotation
- Token family tracking for refresh token rotation and security
- Password hashing with bcrypt
- Role-based access control (ADMIN, USER)
- Rate limiting on API endpoints
- CORS configuration
- Security headers with Helmet
- Request logging with Winston

### Todo Management

- Create, read, update, and delete todos
- Priority levels (LOW, MEDIUM, HIGH, URGENT)
- Due date tracking
- Completion status and timestamp tracking
- User-specific todo isolation
- Batch operations support

### Data Validation

- Schema validation using Zod for all request payloads
- Type-safe validation with automatic error handling
- Detailed validation error messages
- Environmental variable validation at startup

### Logging & Monitoring

- Structured logging with Winston
- Request logging for all API calls
- Error tracking with full context (method, URL, user, IP)
- Health check endpoint for monitoring

### Database - PostgreSQL & Prisma ORM

- **PostgreSQL**: Reliable, open-source relational database with ACID compliance
- **Prisma ORM**: Type-safe database client with auto-generated types from schema
- Automated migrations with version control control and reversal capabilities
- Database indexes for performance optimization on frequently queried fields
- Foreign key constraints with cascade delete for data integrity
- Connection pooling for efficient resource management
- Timezone support for users
- Shadow database for safe migration testing

## Technology Stack

### Core

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 14+ with Prisma ORM 6.x
- **Validation**: Zod (schema validation with type inference)
- **Containerization**: Docker & Docker Compose

### Development & Quality

- **Testing**: Jest with TypeScript support
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

### Security & Performance

- **Security**: Helmet, bcrypt, jsonwebtoken, CORS
- **Rate Limiting**: express-rate-limit
- **Compression**: gzip compression for responses
- **Database**: Connection pooling, query optimization

### Utilities

- **Logging**: Winston
- **Email**: Nodemailer (with multiple provider support)
- **Environment**: dotenv, Zod

## Planned Features

### React Frontend

A React-based single-page application is planned to provide a modern user interface for the todo application.

### OpenAPI / Swagger Documentation

Complete API documentation with OpenAPI specification to provide interactive API exploration and client generation capabilities.

### BullMQ for Email Queue

Integration of BullMQ (Redis-based task queue) for:

- Asynchronous email delivery
- Due date notifications
- Retry logic for failed emails
- Job scheduling and monitoring

### Redis Caching

Redis integration for:

- Session caching
- API response caching
- Rate limit state management
- Job queue backing store for BullMQ

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup

1. Clone the repository

```bash
git clone https://github.com/copyniinja/ultimate-todo-app
cd exp
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
ALLOWED_ORIGINS=http://localhost:5173
# Email provider credentials (choose one or multiple)
MAILER_EMAIL_PROVIDER=gmail
MAILER_GMAIL_USER=your-email@gmail.com
MAILER_APP_PASSWORD=your-app-password
```

4. Setup database

```bash
npm run db:generate
npm run db:migrate
```

## Development

### Running the Development Server

```bash
npm run dev
```

The server will start on the configured PORT (default: 8080) with hot reload enabled.

### Database Management

Generate Prisma client (after schema changes):

```bash
npm run db:generate
```

Create and apply migrations:

```bash
npm run db:migrate
```

Check migration status:

```bash
npm run db:status
```

Reset database (development only):

```bash
npm run db:reset
```

### Code Quality

Run all checks (lint, format, typecheck, and tests):

```bash
npm run check
```

Run specific checks:

```bash
npm run lint              # ESLint
npm run lint:fix          # Auto-fix linting issues
npm run format            # Prettier formatting
npm run typecheck         # TypeScript type checking
npm run test              # Jest tests with coverage
npm run test:watch        # Jest in watch mode
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token

### Todos

- `GET /api/v1/todos` - Get all todos for authenticated user
- `POST /api/v1/todos` - Create a new todo
- `GET /api/v1/todos/:id` - Get a specific todo
- `PUT /api/v1/todos/:id` - Update a todo
- `DELETE /api/v1/todos/:id` - Delete a todo
- `PATCH /api/v1/todos/:id/complete` - Mark todo as complete

### Health

- `GET /health` - Health check endpoint

## Project Structure

```
src/
├── controllers/        # HTTP request handlers
├── services/          # Business logic
├── repositories/      # Data access layer
├── middlewares/       # Express middlewares
├── routes/            # API route definitions
├── validators/        # Zod validation schemas
├── configs/           # Configuration management
├── logger/            # Logging setup
├── utils/             # Utility functions
├── prisma/            # Prisma client initialization
├── @types/            # TypeScript type augmentations
├── app.ts             # Express app setup
├── server.ts          # Dependency injection & bootstrap
└── index.ts           # Entry point

prisma/
├── schema.prisma      # Database schema
└── migrations/        # Migration history
```

## Docker Support

The application includes complete Docker support for development and production environments.

### Docker Compose Setup

Build and run the entire stack locally with Docker Compose:

```bash
docker-compose up -d
```

The Docker Compose setup includes:

- **Node.js Application Container**: Runs the Express server with hot reload in development
- **PostgreSQL Database Container**: PostgreSQL 14 with persistent volume storage
- **Automatic Migrations**: Migrations run automatically on application startup
- **Environment Configuration**: Services configured via environment variables
- **Volume Mounts**: Database data persists between container restarts
- **Network**: Internal Docker network for service communication

### Building Docker Image

Build the application Docker image:

```bash
docker build -t todo-app:latest .
```

Run the container in production mode:

```bash
docker run -d \
  -p 8080:8080 \
  -e DATABASE_URL="postgresql://..." \
  -e NODE_ENV=production \
  --name todo-app \
  todo-app:latest
```

### Docker Features

- Multi-stage builds for optimized image size
- Non-root user execution for security
- Health check endpoint integration
- Graceful shutdown signal handling
- Environment variable substitution
- Volume support for database persistence

## Testing

Jest is configured for unit and integration testing:

```bash
npm test              # Run all tests with coverage
npm run test:watch    # Run tests in watch mode
```

Test coverage is generated in the `coverage/` directory.

## Error Handling

The application includes comprehensive error handling:

- Zod validation errors with detailed field-level feedback
- Database operation errors with appropriate HTTP status codes
- Unhandled promise rejections and exceptions are logged
- Graceful shutdown with database connection cleanup

## Database Schema

The application manages three main entities:

### User

- `id`: Unique identifier
- `email`: Unique email address
- `name`: User's name
- `password`: Hashed password
- `role`: USER or ADMIN
- `timezone`: User's timezone for notifications

### Todo

- `id`: Unique identifier
- `title`: Todo title
- `description`: Detailed description
- `completed`: Completion status
- `priority`: LOW, MEDIUM, HIGH, or URGENT
- `dueDate`: Optional due date
- `userId`: Reference to owner
- Timestamps: created, updated, completed, lastNotified

### Token

- `id`: Unique identifier
- `hashedToken`: Hashed JWT token
- `family`: Token family for rotation tracking
- `userId`: Reference to user
- `role`: User role at token creation
- `expiresAt`: Token expiration time

## Performance Considerations

- Database indexes on frequently queried fields (userId, email, dueDate)
- Gzip compression for HTTP responses (1KB threshold)
- Connection pooling via Prisma
- Rate limiting to prevent abuse
- Request logging for monitoring

## Security

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with configurable TTL
- CORS configuration for allowed origins
- Helmet for HTTP security headers
- SQL injection protection via Prisma's parameterized queries
- Rate limiting per IP address

## Production Deployment

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run start:prod
```

Environment considerations:

- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure ALLOWED_ORIGINS appropriately
- Set up database backups
- Enable monitoring and alerting

## Contributing

When adding new features:

1. Follow the repository pattern for data access
2. Implement services for business logic
3. Create controllers for HTTP handling
4. Add Zod schemas for validation
5. Write tests for new functionality
6. Run `npm run check` before committing
