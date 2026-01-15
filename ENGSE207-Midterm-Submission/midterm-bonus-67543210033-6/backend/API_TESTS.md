# API Tests
## 1. Get All Books
curl http://localhost:3000/api/books
## 2. Create Book
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d '{"title":"Test","author":"Me","isbn":"123"}'
