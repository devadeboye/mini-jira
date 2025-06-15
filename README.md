# Mini Jira - Modern Project Management Made Simple

Welcome to Mini Jira! We've built a streamlined project management solution that brings the power of Jira to your team, without the complexity. Our stack combines Next.js 15 for a smooth frontend experience with a robust NestJS backend, delivering enterprise-grade features in a developer-friendly package.

## ✨ What's Inside

- **Smart Authentication** - Secure, hassle-free login with JWT tokens
- **Project Command Center** - Your central hub for managing multiple projects
- **Agile Sprint Management** - Run your sprints with confidence, from planning to completion
- **Intuitive Work Tracking** - Handle stories, tasks, and bugs with natural workflow states
- **Dynamic Backlog** - Keep your project organized with flexible backlog management
- **Modern Interface** - Beautiful, responsive design that works everywhere
- **Real-time Updates** - Stay in sync with instant updates using React Query

## 🏗 Architecture

### Frontend Experience
- Built on **Next.js 15** with the latest App Router
- Styled with **Tailwind CSS** for a modern look and feel
- State handled by **Zustand + React Query** for seamless updates
- Secure auth with **HTTP-only JWT cookies**
- Fully accessible (WCAG 2.1 AA compliant)

### Backend Power
- **NestJS** with TypeScript for type-safe development
- **PostgreSQL + TypeORM** for reliable data management
- Role-based access control with JWT
- Request validation using Joi
- Clean, modular architecture for maintainability

## 🚀 Getting Started

### Before You Begin
Make sure you have:
- Node.js 18 or newer
- PostgreSQL 14+
- pnpm (recommended) or npm

### 1. Set Up Your Project
```bash
# Clone the repository
git clone https://github.com/devadeboye/mini-jira.git
cd mini-jira
```

### 2. Launch the Backend
```bash
cd mini-jira-backend

# Install your dependencies
pnpm install

# Set up your environment
cp .env.example .env     # Then edit .env with your database details

# Fire up the development server
pnpm run start:dev
```

### Database Management
```bash
# Create a new migration
pnpm run migration:create src/migrations/DescriptiveName

# Generate migration from your changes
pnpm run migration:generate src/migrations/DescriptiveName

# Apply migrations
pnpm run migration:run

# Need to roll back? No problem
pnpm run migration:revert
```

> 💡 **Production Migration Tips**:
> - Always backup your data first
> - Test migrations in staging
> - Review migration SQL for safety

### 3. Launch the Frontend
```bash
cd mini-jira-frontend

# Install dependencies
pnpm install

# Configure your environment
cp .env.example .env.local    # Then set your API URL

# Start development
pnpm run dev
```

### 4. You're All Set!
Visit your running application:
- Frontend: http://localhost:3000
- API: http://localhost:4000

## ⚙️ Configuration

### Backend (.env)
```env
# Database Settings
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=mini_jira

# Security
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=1h

# Server
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🔌 API Reference

### Authentication
- `POST /auth/login` - Sign in
- `POST /auth/register` - Create account
- `POST /auth/refresh` - Refresh session

### Projects
- `GET /projects/all` - Get all projects
- `GET /projects/get/:id` - Get project by ID
- `POST /projects/create` - Create new project
- `PATCH /projects/update/:id` - Update project
- `DELETE /projects/delete/:id` - Delete project

### Sprints
- `GET /sprints/all?projectId=:id` - Get project sprints
- `GET /sprints/find-by-id/:id` - Get sprint by ID
- `POST /sprints/create?projectId=:id` - Create new sprint
- `PUT /sprints/update/:id` - Update sprint
- `DELETE /sprints/delete/:id` - Delete sprint
- `POST /sprints/start/:id` - Start sprint
- `POST /sprints/complete/:id` - Complete sprint
- `GET /sprints/work-items/:id` - Get sprint work items
- `POST /sprints/work-items/:id` - Add work item to sprint
- `DELETE /sprints/:id/work-items/:workItemId` - Remove work item from sprint

### Work Items
- `GET /work-items/find-by-project/:projectId` - Get project work items
- `GET /work-items/backlogs/:projectId` - Get backlog items
- `GET /work-items/find-by-sprint/:sprintId` - Get sprint work items
- `GET /work-items/find-by-id/:id` - Get work item by ID
- `POST /work-items/create` - Create new work item
- `PATCH /work-items/update/:id` - Update work item
- `DELETE /work-items/delete/:id` - Delete work item

## 🛡️ Security First

We take security seriously:
- Robust JWT authentication
- Role-based access control
- Input validation & sanitization
- Secure CORS configuration
- Protected environment variables

## 🔧 Development Tools

### Backend Commands
```bash
pnpm run start:dev    # Launch development
pnpm run build        # Build for production
pnpm run start:prod   # Run production server
pnpm run test         # Run test suite
```

### Frontend Commands
```bash
pnpm run dev          # Start development
pnpm run build        # Build for production
pnpm run start        # Launch production
pnpm run lint         # Check code quality
```

## 🚀 Deployment Guide

### Deploying the Backend
1. Configure production environment variables
2. Build: `pnpm run build`
3. Launch: `pnpm run start:prod`

### Deploying the Frontend
1. Set production environment variables
2. Build: `pnpm run build`
3. Deploy the built assets

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Developer

**Devadeboye**
- GitHub: [@devadeboye](https://github.com/devadeboye)
- Email: emmanueladeboye2017@gmail.com

---

*Built with ❤️ using Next.js and NestJS*
