
# Learning Management System (LMS) Backend

A backend application for managing an online learning platform. It supports administrators, instructors, and students with role-based access control.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- AJV Validation
- Redis
- Docker & Docker Compose

## Main Features

- User registration and login
- JWT-based authentication
- Role-based access control (Admin, Instructor, Student)
- Category management
- Course management
- Instructor assignment to courses
- Lesson management
- Student course enrollment
- Lesson progress tracking
- Course reviews and ratings
- Role-based dashboards
- Pagination and filtering
- Centralized error handling

## Project Structure

```text
lms-backend/
├── config/
├── errors/
├── middleware/
├── models/
├── modules/
│   ├── auth/
│   ├── categories/
│   ├── courses/
│   ├── dashboard/
│   ├── enrollments/
│   ├── lessons/
│   ├── progress/
│   ├── reviews/
│   └── users/
├── utils/
├── app.js
├── server.js
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Local Setup

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd lms-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file using `.env.example` as a reference.

Set your PostgreSQL database credentials and JWT secret.

### 4. Start the application

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

## Docker Setup

Build and start the containers:

```bash
sudo docker compose up --build -d
```

Check container status:

```bash
sudo docker compose ps
```

View backend logs:

```bash
sudo docker compose logs app
```

Stop containers:

```bash
sudo docker compose down
```

## Docker Services

| Service | Port |
|---|---:|
| LMS Backend | 5000 |
| PostgreSQL | 5434 |
| Redis | 6380 |

## API Base URL

`http://localhost:5000/api`

API modules include:

- `/auth`
- `/categories`
- `/users`
- `/courses`
- `/lessons`
- `/enrollments`
- `/progress`
- `/reviews`
- `/dashboard`

## User Roles

- **Admin:** Manages users, categories, courses, and platform operations.
- **Instructor:** Manages assigned courses and lessons.
- **Student:** Enrolls in courses, accesses lessons, tracks progress, and submits reviews.

## Security

- Password hashing
- JWT authentication
- Role-based authorization
- Request validation using AJV
- Environment-based configuration
- Centralized error handling

## Database

The application uses PostgreSQL with Sequelize models and associations. Database tables are synchronized during application startup.

## Development

```bash
npm run dev
```

## Important

- Never commit `.env` or expose database credentials.
- Configure a strong JWT secret before deployment.
- API requests can be tested using Postman.
