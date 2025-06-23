# API Documentation for Frontend Integration

This document outlines the key API endpoints used by the locations frontend application.

## Authentication Endpoints

### User Registration
- **URL**: `/api/user`
- **Method**: `POST`
- **Request Body**:
  - `username`: String (min 3 characters)
  - `email`: String (valid email format)
  - `password`: String
  - `password2`: String (must match password)
- **Response**: Authentication token
- **Example**:
  ```javascript
  // Request
  const formData = new FormData();
  formData.append('username', 'testuser');
  formData.append('email', 'test@example.com');
  formData.append('password', 'password123');
  formData.append('password2', 'password123');
  
  // Response
  {
    "token": "jwt-token-string"
  }
  ```

### User Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  - `email`: String
  - `password`: String
- **Response**: Authentication token
- **Example**:
  ```javascript
  // Request
  const formData = new FormData();
  formData.append('email', 'test@example.com');
  formData.append('password', 'password123');
  
  // Response
  {
    "token": "jwt-token-string"
  }
  ```

## Authentication Flow

1. User submits registration/login form
2. Frontend sends credentials to appropriate endpoint
3. Backend validates credentials and returns authentication token
4. Frontend stores token in:
   - `localStorage` for browser persistence
   - Axios default headers for API requests
5. Subsequent API requests include the token in the Authorization header

## Error Handling

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

Common error cases:
- Missing required fields
- Invalid email format
- Password mismatch
- Username already exists
- Invalid credentials