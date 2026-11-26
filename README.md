# Learning Management System (LMS) Backend

Backend application for an online learning platform with Admin, Instructor, and Student roles.

## Tech Stack
- Node.js and Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- AJV Validation
- Redis Caching
- Docker and Docker Compose

## Features
- User registration, login, logout, and token management
- Role-based access control
- Category and course management
- Instructor assignment
- Lesson management and preview access
- Student enrollment
- Lesson progress tracking and course completion
- Course reviews and ratings
- Admin, Instructor, and Student dashboards
- Pagination, filtering, and sorting
- Centralized error handling
- Redis course-list caching

## Local Setup

1. Install dependencies:

   npm install

2. Create `.env` using `.env.example` as reference.

3. Configure PostgreSQL, JWT_SECRET, and REDIS_URL.

4. Run migrations:

   npm run db:migrate

5. Insert initial categories:

   npm run db:seed

6. Start the server:

   npm run dev

Backend URL: http://localhost:5000

## Docker Setup

Start services:

   sudo docker compose up --build -d

Check containers:

   sudo docker compose ps

Run category seeder:

   sudo docker compose exec app npm run db:seed

View logs:

   sudo docker compose logs app

Stop containers:

   sudo docker compose down

## Docker Ports

- Backend: 5000
- PostgreSQL: 5434
- Redis: 6380

## API Base URL

http://localhost:5000/api

## API Modules

- /auth
- /categories
- /users
- /courses
- /lessons
- /enrollments
- /progress
- /reviews
- /dashboard

Use Postman for API testing.

## User Roles

- Admin: Manages users, categories, courses, and platform operations.
- Instructor: Manages assigned courses and lessons.
- Student: Enrolls in courses, accesses lessons, tracks progress, and submits reviews.

## Database

PostgreSQL is managed through Sequelize models, associations, and migrations.

- npm run db:migrate
- npm run db:seed

The application currently synchronizes Sequelize models during startup.

## Security

- Password hashing
- JWT authentication
- Role-based authorization
- AJV request validation
- Environment-based configuration
- Centralized error handling

## Important

- Never commit `.env` or expose database credentials.
- Use a strong, unique JWT secret before deployment.
- Never commit node_modules.

## Environment Configuration

Before starting the application, configure the required variables in `.env`.
Use `.env.example` as a reference. Never commit `.env` to Git.

For Docker Compose, the application connects to PostgreSQL and Redis using
their service names (`db` and `redis`) inside the Docker network.

## Database Setup Notes

For a fresh database, run migrations and seeders before using the APIs.

Local environment:

    npm run db:migrate
    npm run db:seed

Docker environment:

    sudo docker compose exec app npm run db:migrate
    sudo docker compose exec app npm run db:seed

The application also synchronizes Sequelize models during startup.
Migrations should still be maintained as the schema versioning mechanism.

## Production Deployment Notes

- Replace development credentials with strong, unique secrets.
- Use a strong JWT secret.
- Do not expose PostgreSQL or Redis ports publicly unless required.
- Configure HTTPS and production CORS restrictions.
- Review database backups and recovery procedures.
