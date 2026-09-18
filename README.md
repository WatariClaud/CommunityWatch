This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PROJECT SPECS

---

# Community Watch

Community Watch is a civic reporting platform that allows users to submit community reports, track their status, communicate through comments, and stay informed through notifications and recent activity.

The project was developed as a functional prototype to demonstrate the viability of a centralized community reporting and response platform.

## Features

- User registration and authentication
- Password reset
- Community report submission
- Report categories
- Report status management
- Report comments
- Search
- Report filtering
- Notifications
- Recent activity
- Dashboard for viewing and managing reports

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Node.js
- Express
- Drizzle ORM
- PostgreSQL

## Project Structure

```
community-watch/
├── backend/
├── server.js
├── package.json
└── app
```

The frontend and backend are started together through the root `server.js` entry point.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm

### Installation

Clone the repository and install the dependencies:

```bash
git clone
cd community-watch
npm install
```

### Environment Variables

Create the required environment configuration for the application.

The backend requires database and authentication configuration.

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Database

Create a PostgreSQL database "community_watch" and configure `DATABASE_URL`.

Run the project's Drizzle migrations against the configured database.

### Running the Application

Start the application using the root package script:

```bash
npm run dev
```

The development script uses `tsx watch server.js` to start the application, with the Node.js backend and Next.js frontend running together.

Open the local frontend URL provided by Next.js.

## Prototype Scope

This project is intended as a functional prototype rather than a production-ready deployment.

The current implementation focuses on demonstrating the core reporting workflow and the viability of the platform.

### Features

- **Issue Management:** Submit, filter, search, and view community reports with ease.
- **Filter & Search:** Filter by status, category, or personal reports (`mine`), with debounced keyword search.
- **Dynamic Timeline & Activity Feed:** Real-time updates for status transitions and activity logging.
- **Role-Based Updates:** Admin and officer updates with automated activity logging and user notifications.
- **Interactive Discussions:** Post comments directly on specific issue threads.
- **Language Switcher:** PCurrently only supports English and French for demo purposes

Potential future development includes:

- Interactive maps and geospatial reporting
- Image and file attachments
- Advanced geospatial visualization
- More advanced search and analytics
- Production-scale pagination and query optimization
- Additional moderation and administrative capabilities
- Production-grade password recovery and account security
- Deployment and infrastructure hardening
- More languages in "translations/index.ts" where needed

## Future Development

The platform could be expanded into a more comprehensive civic reporting system by integrating geospatial services, richer evidence collection, analytics, moderation workflows, and integrations with organizations responsible for responding to community reports.

## License

This project was developed as part of _Andela Community_ development challenge.
