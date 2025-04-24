# Interview Fullstack Application

A modern fullstack application built with Node.js, Express, MongoDB, React, and TypeScript. This project is designed to be used as a shell for interviewing candidates by introducing intentionally broken code for debugging exercises.

## Project Structure

This is a monorepo using npm workspaces with the following structure:

```
interview-fullstack/
├── backend/         # Express API with TypeScript
├── frontend/        # React application with TypeScript and Tailwind CSS
└── shared/          # Shared types and utilities
```

## Prerequisites

- Node.js 16+ and npm
- MongoDB running locally or a remote MongoDB instance

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment files

Create a `.env` file in the backend directory:

```
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/interview-app
DB_NAME=interview-app
JWT_SECRET=interview-app-secret-change-this-in-production
```

### 3. Start MongoDB

Make sure MongoDB is running on your system or use a cloud MongoDB instance and update the `.env` file accordingly.

### 4. Build and start the application

Development mode with hot reloading:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The backend API will be available at `http://localhost:5001`, and the frontend will be at `http://localhost:3000`.

## Features

- TypeScript for both frontend and backend
- MongoDB database integration
- Authentication system with JWT
- Role-based authorization (user/admin)
- Protected API routes
- React SPA frontend with React Router
- Responsive UI with Tailwind CSS

## Adding Intentionally Broken Code

To create interview scenarios, you can introduce intentional bugs in:

1. Authentication flow
2. API routes and controllers
3. React component rendering
4. State management
5. Database interactions

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm start` - Start both frontend and backend in production mode
- `npm run build` - Build both frontend and backend
- `npm run start:frontend` - Start only the frontend
- `npm run start:backend` - Start only the backend