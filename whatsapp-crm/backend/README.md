# WhatsApp CRM Backend

This is the backend part of the WhatsApp CRM project, built using Laravel. The backend handles API requests, user authentication, and business logic for the application.

## Directory Structure

- **app/**: Contains the core application logic.
  - **Http/**: Controllers and middleware for handling requests.
  - **Models/**: Eloquent models representing the database entities.
  
- **routes/**: Contains the API route definitions.
  - **api.php**: Defines the API endpoints for the application.

- **tests/**: Contains unit and feature tests for the backend functionality.

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd whatsapp-crm/backend
   ```

3. Install dependencies:
   ```
   composer install
   ```

4. Set up your `.env` file by copying the example:
   ```
   cp .env.example .env
   ```

5. Generate the application key:
   ```
   php artisan key:generate
   ```

6. Run migrations:
   ```
   php artisan migrate
   ```

7. Start the server:
   ```
   php artisan serve
   ```

## API Documentation

Refer to the `api.php` file for a list of available API endpoints and their usage.

## Testing

To run the tests, use the following command:
```
php artisan test
```

## Contribution

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.