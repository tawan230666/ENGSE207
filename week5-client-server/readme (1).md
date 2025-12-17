# Week 5: Task Board - Client-Server Architecture

## Overview
This project demonstrates **Client-Server Architecture** with:
- Client (Frontend) on Local Machine
- Server (Backend) on Ubuntu VM
- Communication via REST API over HTTP

## Architecture Comparison

### Week 4: Layered (Single Machine)
Browser → Node.js → Database (localhost)

### Week 5: Client-Server (Two Machines)
Local Browser → Network → VM (Node.js API) → Database

Frontend: localhost:8080  
Backend: 192.168.56.106:3000

## Project Structure

### Local Machine
```
public/
├── index.html
├── style.css
├── app.js
└── config.js
```

### Virtual Machine
```
task-board-api/
├── server.js
├── ecosystem.config.js
├── src/
│   ├── controllers/
│   ├── services/
│   └── repositories/
└── database/
```

## Setup Instructions

### VM Setup
See [DEPLOYMENT.md](DEPLOYMENT.md)

### Local Frontend
```bash
cd public
npx http-server -p 8080 -c-1
```

### Configure API URL
```javascript
const API_CONFIG = {
  BASE_URL: 'http://192.168.56.106:3000'
};
```

## Technologies

### Client
- HTML, CSS, JavaScript
- Fetch API

### Server
- Ubuntu Server 22.04 LTS
- Node.js 20+
- Express.js
- SQLite3
- PM2
- CORS

## API Endpoints
- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/status

