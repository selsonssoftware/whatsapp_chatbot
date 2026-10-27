# WhatsApp CRM Project

## Overview
This project is a WhatsApp CRM application designed to manage customer interactions through the WhatsApp platform. It consists of a frontend built with React and a backend powered by Laravel.

## Project Structure
The project is organized into two main directories: `frontend` and `backend`.

### Frontend
- **src/components**: Contains React components used throughout the application.
- **src/pages**: Contains the pages of the application, including user interfaces for various functionalities.
- **src/services**: Contains services for API calls and business logic.
- **src/App.tsx**: The main application file that sets up routing and renders components.
- **package.json**: Contains the project's dependencies and scripts.
- **README.md**: Documentation for the frontend part of the project.

### Backend
- **app/Http**: Contains controllers and middleware for handling requests and responses.
- **app/Models**: Contains Eloquent models representing the database structure.
- **routes/api.php**: Contains the API routes for the application.
- **tests**: Contains tests for the backend functionality.
- **README.md**: Documentation for the backend part of the project.

## Features
- User registration and authentication.
- Integration with WhatsApp Cloud API for messaging and automation.
- Role-based access control for different user types (Admin, Manager, Supporter).
- Webhooks for real-time updates and notifications.

## Getting Started
To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   composer install
   ```

4. Set up your environment variables for both frontend and backend.

5. Run the development server for the frontend:
   ```
   npm run dev
   ```

6. Start the backend server:
   ```
   php artisan serve
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.