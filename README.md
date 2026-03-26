# Kambaz (Next.js)

Kambaz is a learning management system (LMS) web application inspired by Canvas. It includes course navigation, modules, assignments, quizzes, grades, user/account flows, and enrollment views. This repository also contains a set of guided labs used to practice React, TypeScript, Bootstrap, Tailwind, and modern web development patterns.

## Purpose Of The Application

This project is designed for web development learning and demonstration:

- Build an LMS-style frontend experience with modern React and Next.js.
- Practice full UI workflows such as authentication, dashboard navigation, and course management.
- Explore incremental labs that teach core web concepts from styling/layout to state management.

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Redux Toolkit + React Redux
- Bootstrap + React Bootstrap
- Tailwind CSS
- Axios
- MongoDB

## Prerequisites

- Node.js 18+ (Node.js 20 LTS recommended)
- npm (comes with Node.js)

## Setup Instructions

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root.
4. Add the backend API base URL:

```env
NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
```

This environment variable is required by multiple client modules for API requests.

## Running The Application

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm start`: Starts the production server after build.
- `npm run lint`: Runs ESLint checks.

## Project Structure

- `app/(kambaz)`: Main LMS application routes and shared layout.
- `app/(kambaz)/account`: Sign in, sign up, profile, and account state.
- `app/(kambaz)/courses`: Course list and per-course experiences.
- `app/(kambaz)/courses/[cid]`: Course sections (home, modules, assignments, grades, quizzes, people, zoom, and more).
- `app/(kambaz)/dashboard`: Dashboard landing page.
- `app/(kambaz)/database`: Local JSON seed data for courses, modules, assignments, enrollments, and users.
- `app/labs`: Educational lab exercises (Lab 1-5) for course progression.

## Key Features

- Account workflows: sign in, sign up, and profile updates.
- Course-focused navigation with nested route structure.
- Module and assignment views with Redux-managed state.
- Enrollment and user-related data operations via API clients.
- Labs section for focused exercises in CSS, Bootstrap, JavaScript, and React.

## Troubleshooting

- If API calls fail, verify `.env.local` exists and `NEXT_PUBLIC_HTTP_SERVER` points to a running backend.
- If dependencies fail to install, confirm your Node.js version is compatible (18+).
- If lint errors appear, run:

```bash
npm run lint
```

## Learn More

- Next.js docs: https://nextjs.org/docs
- React docs: https://react.dev
- Redux Toolkit docs: https://redux-toolkit.js.org
