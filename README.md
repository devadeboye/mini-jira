# Mini Jira - A Slimmed-Down Jira Clone for My Portfolio

Ever tried using Jira and felt like you needed a PhD just to create a simple task? Yeah, I've been there too. That's why I built Mini Jira - a project management tool that gives you the core power of Jira without the overwhelming complexity.

## What This Project Is

This is a portfolio project - a full-stack Jira clone I built from scratch to demonstrate my skills in modern web development. It's a slimmed-down version that focuses on the essential features you actually need for project management: user authentication, project creation, sprint planning, backlog management, and work item tracking. But here's the thing: it's actually intuitive to use.

## Project Structure

The project is split into two main parts:

```
mini-jira/
├── mini-jira-frontend/    # The React/Next.js frontend application
├── mini-jira-backend/     # The NestJS backend API
└── README.md              # This file you're reading right now
```

**mini-jira-frontend/** - This is where the magic happens for users. I built it with Next.js 15, creating a beautiful interface that makes project management feel effortless. Think clean dashboards, drag-and-drop functionality, and responsive design that works on any device.

**mini-jira-backend/** - The engine room. This NestJS-powered API handles all the heavy lifting - authentication, data management, business logic, and everything else that keeps the frontend running smoothly.

## What You Can Do With It

### Project Management
- Create and manage multiple projects (Scrum or Kanban style)
- Add team members and manage permissions
- Get a bird's eye view of all your projects from one dashboard

### Sprint Planning
- Plan your work in manageable sprints
- Set sprint goals and timelines
- Track progress with real-time updates
- Start and complete sprints with proper workflows

### Work Item Tracking
- Create stories, tasks, and bugs with detailed descriptions
- Set priorities and story points
- Assign work to team members
- Track status from "To Do" to "Done"
- Move items between backlog and active sprints

### User Experience
- Clean, modern interface that doesn't get in your way
- Responsive design that works on desktop, tablet, and mobile
- Keyboard shortcuts for power users
- Accessibility features for everyone

## The Tech Stack

I chose technologies that are both powerful and developer-friendly:

### Frontend (mini-jira-frontend)
- **Next.js 15** - React framework with App Router for modern web development
- **Tailwind CSS** - Utility-first CSS for rapid UI development
- **TypeScript** - Type safety that catches bugs before they happen
- **Zustand + React Query** - State management that just works
- **NextAuth.js** - Authentication that's secure by default

### Backend (mini-jira-backend)
- **NestJS** - Scalable Node.js framework with TypeScript
- **PostgreSQL** - Robust relational database
- **TypeORM** - Database ORM that makes queries readable
- **JWT Authentication** - Secure token-based authentication
- **Joi Validation** - Input validation that prevents bad data

## Getting Started

### Prerequisites
Before you dive in, make sure you have:
- Node.js 18 or higher
- PostgreSQL 14 or higher
- pnpm (recommended) or npm

### Quick Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/devadeboye/mini-jira.git
   cd mini-jira
   ```

2. **Set up the backend**
   ```bash
   cd mini-jira-backend
   pnpm install
   cp .env.example .env
   # Edit .env with your database credentials
   pnpm run start:dev
   ```

3. **Set up the frontend**
   ```bash
   cd mini-jira-frontend
   pnpm install
   cp .env.example .env.local
   # Edit .env.local with your API URL
   pnpm run dev
   ```

4. **Visit your app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## Key Features

### Authentication & Security
- User registration and login
- JWT-based session management
- Protected routes and API endpoints
- Role-based access control

### Project Dashboard
- Overview of all your projects
- Quick access to recent work
- Project creation wizard
- Team member management

### Sprint Management
- Create and configure sprints
- Sprint planning with story points
- Sprint burndown tracking
- Start/complete sprint workflows

### Backlog Management
- Drag-and-drop work items
- Priority management
- Story point estimation
- Bulk operations

### Work Item Details
- Rich text descriptions
- Comment system
- File attachments
- Activity history

## What Makes This Different

Unlike other project management tools that try to do everything, I focused Mini Jira on doing the core things really well:

- **Simplicity** - No overwhelming menus or confusing workflows
- **Speed** - Fast loading times and responsive interactions
- **Flexibility** - Works for both Scrum and Kanban methodologies
- **Accessibility** - Built with screen readers and keyboard navigation in mind
- **Modern** - Uses the latest web technologies for a smooth experience

## Environment Setup

Each application has its own environment configuration:

### Backend Environment
```env
# Database
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

### Frontend Environment
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

## Deployment

Ready to go live? Here's the general process:

1. **Database Setup** - Set up PostgreSQL in your production environment
2. **Backend Deployment** - Deploy the NestJS API to your server of choice
3. **Frontend Deployment** - Deploy the Next.js app to Vercel, Netlify, or similar
4. **Configuration** - Update environment variables for production
5. **Database Migration** - Run migrations to set up your production database

## Contributing

Found a bug? Have an idea for a new feature? I'd love your help!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write tests if needed
5. Submit a pull request

## What's Next

I'm constantly improving Mini Jira. Here's what's on my roadmap:

- **Real-time Collaboration** - See changes as they happen
- **Advanced Reporting** - Charts and analytics for project insights
- **Dark Mode** - For those late-night coding sessions

## Need Help?

- Check out the detailed README files in each folder (`mini-jira-frontend/` and `mini-jira-backend/`)
- Look at the API documentation in the backend folder
- Open an issue if you run into problems

## License

This project is licensed under the MIT License - use it, modify it, make it your own!

---

Built with care by a developer who actually uses project management tools and got tired of the complexity. I hope you find Mini Jira as useful as I do, and that it demonstrates my ability to build full-stack applications with modern technologies.
