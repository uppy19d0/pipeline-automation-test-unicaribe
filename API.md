# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
This API does not require authentication.

## Response Format
All responses are in JSON format with the following structure:

### Success Response
```json
{
  "result": "value",
  "operation": "operation_name",
  "...": "additional_fields"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Endpoints

### Health Check

#### GET /health
Returns the health status of the API.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

### API Information

#### GET /
Returns general information about the API.

**Response:**
```json
{
  "message": "Welcome to the CI Simple Node Project API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "calculator": "/api/calculator/*",
    "utils": "/api/utils/*",
    "legacy": "/api/sum"
  }
}
```

## Calculator Operations

### Addition

#### POST /api/calculator/add
Adds two numbers.

**Request Body:**
```json
{
  "a": 5,
  "b": 3
}
```

**Response:**
```json
{
  "result": 8,
  "operation": "addition",
  "operands": [5, 3]
}
```

### Subtraction

#### POST /api/calculator/subtract
Subtracts two numbers.

**Request Body:**
```json
{
  "a": 10,
  "b": 4
}
```

**Response:**
```json
{
  "result": 6,
  "operation": "subtraction",
  "operands": [10, 4]
}
```

### Multiplication

#### POST /api/calculator/multiply
Multiplies two numbers.

**Request Body:**
```json
{
  "a": 6,
  "b": 7
}
```

**Response:**
```json
{
  "result": 42,
  "operation": "multiplication",
  "operands": [6, 7]
}
```

### Division

#### POST /api/calculator/divide
Divides two numbers.

**Request Body:**
```json
{
  "a": 15,
  "b": 3
}
```

**Response:**
```json
{
  "result": 5,
  "operation": "division",
  "operands": [15, 3]
}
```

**Error Cases:**
- Division by zero returns 400 error

### Power

#### POST /api/calculator/power
Calculates base raised to the power of exponent.

**Request Body:**
```json
{
  "base": 2,
  "exponent": 8
}
```

**Response:**
```json
{
  "result": 256,
  "operation": "power",
  "base": 2,
  "exponent": 8
}
```

### Square Root

#### POST /api/calculator/sqrt
Calculates the square root of a number.

**Request Body:**
```json
{
  "number": 16
}
```

**Response:**
```json
{
  "result": 4,
  "operation": "square_root",
  "number": 16
}
```

**Error Cases:**
- Negative numbers return 400 error

### Factorial

#### POST /api/calculator/factorial
Calculates the factorial of a number.

**Request Body:**
```json
{
  "n": 5
}
```

**Response:**
```json
{
  "result": 120,
  "operation": "factorial",
  "number": 5
}
```

**Error Cases:**
- Negative numbers return 400 error
- Non-integers return 400 error

## Utility Functions

### Array Sum

#### POST /api/utils/array-sum
Calculates the sum of all elements in an array.

**Request Body:**
```json
{
  "array": [1, 2, 3, 4, 5]
}
```

**Response:**
```json
{
  "result": 15,
  "operation": "array_sum",
  "array": [1, 2, 3, 4, 5]
}
```

### Array Average

#### POST /api/utils/array-average
Calculates the average of all elements in an array.

**Request Body:**
```json
{
  "array": [2, 4, 6, 8]
}
```

**Response:**
```json
{
  "result": 5,
  "operation": "array_average",
  "array": [2, 4, 6, 8]
}
```

### Capitalize String

#### POST /api/utils/capitalize
Capitalizes the first letter of a string.

**Request Body:**
```json
{
  "text": "hello world"
}
```

**Response:**
```json
{
  "result": "Hello world",
  "operation": "capitalize",
  "original": "hello world"
}
```

### Reverse String

#### POST /api/utils/reverse-string
Reverses a string.

**Request Body:**
```json
{
  "text": "hello"
}
```

**Response:**
```json
{
  "result": "olleh",
  "operation": "reverse_string",
  "original": "hello"
}
```

### Check Palindrome

#### POST /api/utils/is-palindrome
Checks if a string is a palindrome.

**Request Body:**
```json
{
  "text": "racecar"
}
```

**Response:**
```json
{
  "result": true,
  "operation": "is_palindrome",
  "text": "racecar"
}
```

### Check Prime Number

#### POST /api/utils/is-prime
Checks if a number is prime.

**Request Body:**
```json
{
  "number": 17
}
```

**Response:**
```json
{
  "result": true,
  "operation": "is_prime",
  "number": 17
}
```

### Fibonacci Number

#### POST /api/utils/fibonacci
Calculates the nth Fibonacci number.

**Request Body:**
```json
{
  "n": 10
}
```

**Response:**
```json
{
  "result": 55,
  "operation": "fibonacci",
  "position": 10
}
```

## Legacy Endpoints

### Sum (Legacy)

#### POST /api/sum
Legacy endpoint for adding two numbers (maintained for backward compatibility).

**Request Body:**
```json
{
  "a": 5,
  "b": 3
}
```

**Response:**
```json
{
  "result": 8,
  "operation": "legacy_sum",
  "operands": [5, 3]
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found (invalid endpoint)
- `500` - Internal Server Error

All error responses include an `error` field with a descriptive message.

## Rate Limiting

Currently, there are no rate limits implemented.

## CORS

CORS is enabled for all origins in development mode.
