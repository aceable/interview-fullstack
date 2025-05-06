# Interview Fullstack Application

## 🎗️ Read This First

* You should have received this 24 hours before your technical call.
* It is not required, but we recommend downloading and opening this codebase in your favorite IDE ahead of time.
* Prepare any tools you may want to use during the interview to discuss the code, make changes, run it locally, etc. AI tools are allowed.
* The technical interview will be a mock peer review with a "junior developer."
* You will be reviewing new code the Junior Developer added to this app:
    * All new code should be in files with "Note" in the name
    * Or in files where `<UserNotes>` is called
* By following the README below, this fullstack repo should run on any standard Mac, Linux, or Windows WSL with Node 22 installed. Running the app is not part of the test.
* If you start to analyze the code or make any changes (not required), please document your process. It is more important for us to understand how you think than what you change.

## 🆕 Overview

This is a modern fullstack application built with Node.js, Express, MongoDB, React, and TypeScript. This project is designed to be used as a shell for interviewing candidates by introducing intentionally broken code for debugging exercises, while simulating several of the concepts used at Aceable today.

## Project Structure

This is a monorepo using npm workspaces with the following structure:

```
interview-fullstack/
├── backend/         # Express API with TypeScript
├── frontend/        # React application with TypeScript and Tailwind CSS
└── shared/          # Shared types and utilities
```

## Prerequisites

- Node.js 22+ and npm
- Faked MongoDB running in file storage with NeDB

## Setup Instructions

### 1. Install dependencies

If you haven't, install either Node 22 or [NVM](https://github.com/nvm-sh/nvm) to switch to Node 22 for this repo

```bash
npm ci
```

### 2. Create environment files

Create a `.env` file in the `/backend` directory:

```
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/interview-app
DB_NAME=interview-app
JWT_SECRET=interview-app-secret-change-this-in-production
```

### 4. Build and start the application

Development mode with hot reloading:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5001`, and the frontend will be at `http://localhost:3000`.

## Features

- TypeScript for both frontend and backend
- File NoSQL database mimicing MongoDB
- Authentication system with JWT
- Role-based authorization (user/admin)
- Protected API routes
- React SPA frontend with React Router
- Responsive UI with Tailwind CSS

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm start` - Start both frontend and backend in production mode
- `npm run build` - Build both frontend and backend
- `npm run start:frontend` - Start only the frontend
- `npm run start:backend` - Start only the backend