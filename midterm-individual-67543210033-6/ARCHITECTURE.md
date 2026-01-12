# Library Management System - Architecture

## C1: System Context
User (Librarian) --> [Library System] --> [SQLite Database]

## C2: Container Diagram (Layered)
Requests flow:
Client -> Presentation Layer -> Business Layer -> Data Layer -> Database

## Layer Responsibilities

### 1. Presentation Layer
- **Files:** `bookController.js`, `bookRoutes.js`
- **Role:** Handle HTTP requests (req/res), Parse body/params.
- **Rule:** No business logic, No SQL here.

### 2. Business Logic Layer
- **Files:** `bookService.js`, `bookValidator.js`
- **Role:** Validate inputs (Required fields, ISBN format), Check business rules (e.g., cannot delete borrowed books).
- **Rule:** Orchestrate flow between Controller and Repository.

### 3. Data Access Layer
- **Files:** `bookRepository.js`, `connection.js`
- **Role:** Execute SQL queries (INSERT, SELECT, DELETE).
- **Rule:** Only talk to Database.