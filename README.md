# Church Management System

A simple and effective church management system built with Next.js, Shadcn UI, and Prisma.

## Features

- **Member Management**: Track church members, their contact information, and roles
- **Event Scheduling**: Create and manage church services, meetings, and special events
- **Group Organization**: Organize ministries, departments, and committees
- **Donation Tracking**: Record and manage tithes and offerings
- **Announcements**: Create and publish church announcements

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI**: Tailwind CSS, Shadcn UI components
- **Database**: SQLite with Prisma ORM
- **Deployment**: Can be deployed on Vercel, Netlify, or any Node.js hosting

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/church-management-system.git
   cd church-management-system
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
church-management-system/
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── members/       # Member management
│   │   ├── events/        # Event management
│   │   ├── groups/        # Group management
│   │   ├── donations/     # Donation tracking
│   │   └── announcements/ # Announcements
│   ├── components/        # React components
│   │   ├── ui/            # Shadcn UI components
│   │   └── ...            # Custom components
│   └── lib/               # Utility functions and shared code
└── ...
```

## Customization

### Styling

The project uses Tailwind CSS for styling. You can customize the theme in the `tailwind.config.js` file.

### Database

The default database is SQLite for simplicity. You can change to another database like PostgreSQL or MySQL by updating the `prisma/schema.prisma` file and the `DATABASE_URL` in the `.env` file.

## Deployment

### Vercel

The easiest way to deploy the application is using Vercel:

```bash
vercel
```

### Other Platforms

You can also deploy to any platform that supports Node.js applications:

1. Build the application:
   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
