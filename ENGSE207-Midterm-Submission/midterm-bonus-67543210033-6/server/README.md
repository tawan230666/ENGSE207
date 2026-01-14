# 📚 Library Management System  
**Bonus Assignment: Client-Server Architecture**

---

## 📋 Project Information
- **Student Name:** ธาวัน ทิพคุณ (Tawan Thipkhun)  
- **Student ID:** 67543210033-6  
- **Section:** 1  
- **Course:** ENGSE207 Software Architecture  

---

## 🏗️ Project Overview
This project is a **Bonus Assignment** for the Midterm Exam.  
The objective is to refactor the original **Layered Monolithic Architecture** into a fully decoupled **Client-Server Architecture** using RESTful APIs.

The system separates the **Frontend (Client)** and **Backend (Server)** to improve flexibility, scalability, and maintainability.

---

## 🔄 Architecture Comparison

| Feature | Original (Layered Monolithic) | New (Bonus: Client-Server) |
|-------|-------------------------------|----------------------------|
| **Architecture Style** | 3-Tier Layered (Monolithic) | Client-Server (Decoupled) |
| **Rendering** | Server-side Rendering (EJS / HTML) | Client-side Rendering (HTML + JS) |
| **Communication** | Internal Function Calls | HTTP REST API (JSON) |
| **Coupling** | High (Frontend & Backend tightly coupled) | Low (Separated concerns) |
| **Deployment** | Single Application | Client & Server can be deployed separately |
| **Data Flow** | Database → Service → View | Database → API → JSON → Fetch → DOM |

---

## 🚀 How to Run the Project

### 1️⃣ Start Backend (Server)
The backend is implemented as a REST API using **Node.js + Express**  
and runs on **Port 3000**.

```bash
cd server
npm install
npm start
```

**Expected Output**
```
Server is running on port 3000
```

---

### 2️⃣ Start Frontend (Client)
The frontend is a **static web application**.

You can run it by:
- Opening `client/index.html` directly in a browser (Chrome / Edge)
- **OR** using **VS Code Live Server Extension**

---

## ✅ Features Implemented

### 🔌 Backend (Server)
- [x] REST API (JSON response instead of HTML)
- [x] CORS enabled for cross-origin requests
- [x] SQLite database connection
- [x] Repository Pattern for data access
- [x] Layered Architecture (Route → Controller → Service → Repository)

---

### 💻 Frontend (Client)
- [x] Fetch API for HTTP communication
- [x] Dynamic UI rendering using DOM manipulation
- [x] Responsive and clean UI with CSS
- [x] Fully separated from Backend logic

---

## 🛠️ CRUD Operations
- [x] **Create:** Add new books using form submission
- [x] **Read:** Display book list fetched from API
- [x] **Delete:** Remove books via REST API calls

---

## 📂 Project Structure

```
midterm-bonus-67543210033-6/
├── client/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── repositories/
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 🎯 Key Learning Outcomes
- Understanding Client-Server Architecture
- Using RESTful APIs
- Decoupling Frontend and Backend
- Applying Software Architecture principles
- Improving scalability and maintainability

---

## 📌 Notes
This project demonstrates the transition from a monolithic system to a modern **Client-Server Architecture** aligned with real-world software engineering practices.

---

✅ **Ready for submission & GitHub upload**
