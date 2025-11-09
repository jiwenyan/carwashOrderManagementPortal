# Car Wash Order Management API Documentation

## Overview
This is a Spring Boot REST API for managing car wash orders with full CRUD operations.

## API Endpoints

### Get All Orders
- **GET** `/api/orders`
- Returns all car wash orders
- Response: `200 OK` with list of orders

### Get Order by ID
- **GET** `/api/orders/{orderId}`
- Returns a specific order by UUID
- Response: `200 OK` with order or `404 Not Found`

### Create Order
- **POST** `/api/orders`
- Creates a new car wash order
- Request Body:
```json
{
  "userName": "John Doe",
  "phoneNumber": "123-456-7890",
  "carLicenseNumber": "ABC123",
  "orderStatus": "PENDING"
}
```
- Response: `201 Created` with created order

### Update Order
- **PUT** `/api/orders/{orderId}`
- Updates an existing order
- Request Body: Complete order object
- Response: `200 OK` with updated order or `404 Not Found`

### Update Order Status
- **PATCH** `/api/orders/{orderId}/status`
- Updates only the order status
- Request Body:
```json
{
  "status": "IN_PROGRESS"
}
```
- Response: `200 OK` with updated order or `404 Not Found`

### Delete Order
- **DELETE** `/api/orders/{orderId}`
- Deletes an order by ID
- Response: `204 No Content` or `404 Not Found`

### Get Orders by Status
- **GET** `/api/orders/status/{status}`
- Returns orders filtered by status
- Status values: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- Response: `200 OK` with filtered list of orders

## Order Model
```json
{
  "orderId": "uuid-string",
  "userName": "string",
  "phoneNumber": "string",
  "carLicenseNumber": "string",
  "orderStatus": "PENDING|IN_PROGRESS|COMPLETED|CANCELLED"
}
```

## Order Status Values
- `PENDING`: Order created but not started
- `IN_PROGRESS`: Car wash in progress
- `COMPLETED`: Car wash completed
- `CANCELLED`: Order cancelled

## Running the Application
```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`