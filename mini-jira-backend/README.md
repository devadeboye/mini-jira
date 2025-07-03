# Mini Jira Backend - The Engine Room

This is the backend service for my Mini Jira portfolio project, built with NestJS and TypeScript. It handles all the heavy lifting - authentication, project management, sprint tracking, and work item operations. Think of it as the brain behind the beautiful frontend you see.

## What I'm Working With

- **NestJS** - My main framework for building scalable Node.js applications
- **TypeScript** - Because I like my code type-safe and predictable
- **PostgreSQL** - Reliable database that won't let you down
- **TypeORM** - Makes database operations feel like a breeze
- **JWT Authentication** - Secure token-based auth that just works
- **Joi Validation** - Input validation that catches errors before they become problems

## Getting Your Environment Ready

Before you jump in, make sure you have:
- Node.js 18 or higher
- PostgreSQL 14 or newer
- pnpm (I recommend this) or npm

## Setting Up Shop

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Your Database
Copy the example environment file and fill in your details:
```bash
cp .env.example .env
```

Your `.env` file should look something like this:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=mini_jira

# Security Settings
JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRES_IN=1h

# Server Configuration
PORT=4000
NODE_ENV=development
```

### 3. Fire Up the Server
```bash
# Development mode with hot reload
pnpm run start:dev

# Production mode
pnpm run start:prod
```

Your API will be running at `http://localhost:4000`

## Database Management

I use TypeORM migrations to keep your database schema in sync. Here's how to work with them:

### Creating Migrations
```bash
# Create a new empty migration
pnpm run migration:create src/migrations/YourMigrationName

# Generate migration from entity changes
pnpm run migration:generate src/migrations/YourMigrationName
```

### Running Migrations
```bash
# Apply pending migrations
pnpm run migration:run

# Rollback last migration (if something goes wrong)
pnpm run migration:revert
```

Pro tip: Always test your migrations in a development environment first. Nobody likes surprises in production.

## API Endpoints

### Authentication
- `POST /auth/register` - Create a new user account
- `POST /auth/login` - Sign in with credentials
- `POST /auth/refresh` - Refresh your access token
- `POST /auth/logout` - Sign out securely

### Projects
- `GET /projects/all` - Get all your projects
- `GET /projects/get/:id` - Get specific project details
- `POST /projects/create` - Create a new project
- `PATCH /projects/update/:id` - Update project information
- `DELETE /projects/delete/:id` - Delete a project

### Sprints
- `GET /sprints/all?projectId=:id` - Get all sprints for a project
- `GET /sprints/find-by-id/:id` - Get sprint details
- `POST /sprints/create?projectId=:id` - Create a new sprint
- `PUT /sprints/update/:id` - Update sprint information
- `DELETE /sprints/delete/:id` - Delete a sprint
- `POST /sprints/start/:id` - Start a sprint
- `POST /sprints/complete/:id` - Complete a sprint

### Work Items
- `GET /work-items/find-by-project/:projectId` - Get all work items for a project
- `GET /work-items/backlogs/:projectId` - Get backlog items
- `GET /work-items/find-by-sprint/:sprintId` - Get work items in a sprint
- `POST /work-items/create` - Create a new work item
- `PATCH /work-items/update/:id` - Update work item
- `DELETE /work-items/delete/:id` - Delete work item

## Security Features

I take security seriously around here:
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation on all endpoints
- Secure password hashing
- CORS protection
- Environment variable protection

## Development Commands

```bash
# Start development server
pnpm run start:dev

# Build for production
pnpm run build

# Run production server
pnpm run start:prod

# Run tests
pnpm run test

# Run end-to-end tests
pnpm run test:e2e

# Check test coverage
pnpm run test:cov
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── project/        # Project management
├── sprint/         # Sprint functionality
├── work-item/      # Work item operations
├── user/           # User management
├── common/         # Shared utilities
├── config/         # Configuration files
└── migrations/     # Database migrations
```

## Deployment

When you're ready to go live:

1. Set up your production environment variables
2. Run database migrations: `pnpm run migration:run`
3. Build the application: `pnpm run build`
4. Start the production server: `pnpm run start:prod`

## Troubleshooting

Having issues? Here are some common fixes:

- **Database connection errors**: Check your database credentials in `.env`
- **Port already in use**: Change the PORT in your `.env` file
- **Migration errors**: Make sure your database exists and is accessible

## Contributing

Found a bug or want to add a feature? I'd love your help! Just make sure to:
- Write tests for new features
- Follow the existing code style
- Update documentation as needed

## License

This project is licensed under the MIT License.
