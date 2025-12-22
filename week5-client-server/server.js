require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/connection');
const taskController = require('./src/controllers/taskController');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// ==========================================
// MIDDLEWARE
// ==========================================
// ตั้งค่า CORS ให้ยอมรับทุก Origin (เพื่อความง่ายใน Lab)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================
// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Stats (ต้องมาก่อน :id)
app.get('/api/tasks/stats', taskController.getStatistics.bind(taskController));

// CRUD Operations
app.get('/api/tasks', taskController.getAllTasks.bind(taskController));
app.get('/api/tasks/:id', taskController.getTaskById.bind(taskController));
app.post('/api/tasks', taskController.createTask.bind(taskController));
app.put('/api/tasks/:id', taskController.updateTask.bind(taskController));
app.patch('/api/tasks/:id/status', taskController.updateStatus.bind(taskController));
app.patch('/api/tasks/:id/next-status', taskController.moveToNextStatus.bind(taskController));
app.delete('/api/tasks/:id', taskController.deleteTask.bind(taskController));

// ==========================================
// START SERVER
// ==========================================
async function start() {
    try {
        await db.connect();
        app.listen(PORT, HOST, () => {
            console.log('=======================================');
            console.log(`🚀 Server running on http://${HOST}:${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
            console.log('🍰 Architecture: Client-Server (Week 5)');
            console.log('=======================================');
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

start();
