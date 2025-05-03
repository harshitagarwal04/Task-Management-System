# Task Management System Backend

This is the backend for the Task Management System, built using Node.js and Express. The application provides a RESTful API for managing tasks and user authentication.

## Features

- **User Authentication**: Secure registration and login functionalities.
- **Task Management**: Create, read, update, and delete tasks with attributes such as title, description, due date, priority, and status.
- **Team Collaboration**: Assign tasks to other users and receive notifications when tasks are assigned.
- **Dashboard**: View tasks assigned to the user, tasks created by the user, and overdue tasks.
- **Search and Filter**: Search tasks by title or description and filter based on status, priority, and due date.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for building the API.
- **MongoDB/PostgreSQL**: Database for storing user and task data.
- **TypeScript**: Superset of JavaScript for type safety.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd task-management-system/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root of the backend directory and add the necessary configuration (e.g., database connection string).

4. Start the server:
   ```
   npm run start
   ```

## API Endpoints

- **Authentication**
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in an existing user.

- **Tasks**
  - `POST /api/tasks`: Create a new task.
  - `GET /api/tasks`: Retrieve all tasks.
  - `GET /api/tasks/:id`: Retrieve a specific task by ID.
  - `PUT /api/tasks/:id`: Update a task by ID.
  - `DELETE /api/tasks/:id`: Delete a task by ID.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.