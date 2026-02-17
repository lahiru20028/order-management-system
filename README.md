# Order Management System

A simple full-stack application for managing orders.

## Tech Stack
- **Backend:** Spring Boot (Java 17+), Spring Data JPA
- **Frontend:** React (Vite), Tailwind CSS
- **Database:** PostgreSQL

## Prerequisites
- Java 17 or higher
- Node.js and npm
- PostgreSQL database
- Maven (for backend)

## Setup Instructions

### 1. Database Setup
Create a PostgreSQL database named `order_db`.
You can do this via `psql` or pgAdmin:
```sql
CREATE DATABASE order_db;
```
Ensure your PostgreSQL user is `postgres` and password is `password`. If different, update `backend/src/main/resources/application.yml`.

### 2. Backend Setup
Navigate to the `backend` directory and run the application:
```bash
cd backend
mvn spring-boot:run
```
The server will start on `http://localhost:8080`.

### 3. Frontend Setup
Navigate to the `frontend` directory, install dependencies (if not already done), and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## Features
- **Add Order:** Fill out the form to create a new order.
- **View Orders:** See all existing orders in a table.
- **Delete Order:** Remove an order by clicking the "Delete" button.
