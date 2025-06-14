# Mini Jira - Project Management Application

A modern, full-stack project management application inspired by Jira, built with Next.js and NestJS. Features sprint management, work item tracking, and team collaboration tools.
****
## Features

- **User Authentication** - Secure login/registration with JWT tokens
- **Project Management** - Create and manage multiple projects
- **Sprint Planning** - Agile sprint management with start/complete lifecycle
- **Work Item Tracking** - Stories, tasks, and bugs with priority levels
- **Backlog Management** - Organize work items in project backlogs
- **Responsive Design** - Modern UI with accessibility features
- **Real-time Updates** - Optimistic updates with React Query

## Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Authentication**: JWT with HTTP-only cookies
- **Accessibility**: WCAG 2.1 AA compliant

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with role-based access control
- **Validation**: Joi schema validation
- **Architecture**: Modular with services, controllers, and entities

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or pnpm

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/devadeboye/mini-jira.git
cd mini-jira
```

### 2. Backend Setup
```bash
cd mini-jira-backend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the development server
pnpm run start:dev
```

### 3. Frontend Setup
```bash
cd mini-jira-frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start the development server
pnpm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 🔧 Environment Variables

### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=mini_jira

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=1h

# Application
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token

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



## Key Features Implemented

### Sprint Management
- Create, update, and delete sprints
- Start and complete sprint lifecycle
- Move work items between sprints and backlog
- Sprint statistics and progress tracking

### Work Item Management
- Create stories, tasks, and bugs
- Priority levels (Low, Medium, High, Urgent)
- Status tracking (To Do, In Progress, In Review, Done)
- Story point estimation
- Assignee management

### User Experience
- Responsive design for all screen sizes
- Keyboard navigation support
- Screen reader compatibility
- Loading states and error handling
- Optimistic UI updates

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Development Scripts

### Backend
```bash
pnpm run start:dev    # Development server
pnpm run build        # Production build
pnpm run start:prod   # Production server
pnpm run test         # Run tests
```

### Frontend
```bash
pnpm run dev          # Development server
pnpm run build        # Production build
pnpm run start        # Production server
pnpm run lint         # ESLint check
pnpm run check-env    # Validate environment variables
```

## Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `pnpm run build`
3. Start production server: `pnpm run start:prod`

### Frontend Deployment
1. Set production environment variables
2. Build the application: `pnpm run build`
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Developer

**Devadeboye**
- GitHub: [@devadeboye](https://github.com/devadeboye)
- Email: emmanueladeboye2017@gmail.com

---

*Built with ❤️ using Next.js and NestJS*
