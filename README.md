# RUNIT - Hotel Housekeeping Management System

A modern request management platform designed for hotel housekeeping departments, featuring supervisor management and mobile interfaces for housekeeping staff.

## Features

### Supervisor Management Interface
- 📊 Real-time request statistics and status tracking
- 👥 Task assignment and personnel management
- 🔍 Advanced filtering and search functionality
- 📈 Data analysis and reporting

### Mobile Interface for Housekeeping Staff
- 📱 Mobile-optimized responsive design
- ⚡ Quick request recording and status updates
- 🎯 Personal task management and tracking
- 📍 Location information recording

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Prisma ORM)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Quick Start

### Requirements
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Method 1: Using Startup Script (Recommended)
```bash
# Run directly after cloning the project
./start.sh
```

### Method 2: Manual Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Database Setup
1. Create PostgreSQL database
2. Copy `env.example` to `.env.local`
3. Update database connection string
4. Run database migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

#### 3. Development Mode
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Access URLs
- **Homepage**: http://localhost:3000
- **Supervisor Interface**: http://localhost:3000/supervisor
- **Mobile Interface**: http://localhost:3000/runner
- **Demo Page**: http://localhost:3000/demo

### Build for Production
```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables (database connection, etc.)
4. Deploy

## Project Structure

```
runit/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── supervisor/        # Supervisor Management Interface
│   ├── mobile/           # Mobile Interface
│   ├── globals.css       # Global Styles
│   ├── layout.tsx        # Root Layout
│   └── page.tsx          # Homepage
├── lib/                   # Utilities
│   └── prisma.ts         # Prisma Client
├── prisma/               # Database Configuration
│   └── schema.prisma     # Database Schema
├── public/               # Static Assets
└── package.json          # Project Configuration
```

## Database Models

### User
- Supports multiple roles: SUPERVISOR, HOUSE_PERSON, RUNNER
- Includes name, email, phone and other basic information

### Request
- Room number, guest name
- Request type, priority, status
- Description, notes, location information
- Creator and assignee relationships
- Timestamp records

## Environment Variables

Create `.env.local` file:

```env
POSTGRES_URL="postgresql://username:password@localhost:5432/runit"
```

## Contributing

Issues and Pull Requests are welcome!

## License

MIT License 