// server.js - Final Fixed Version
require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./database/connection');
const taskController = require('./src/controllers/taskController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ROUTES DEFINITION
// ==========================================

// Health Check
app.get('/api/health', taskController.healthCheck.bind(taskController));

// ⚠️ IMPORTANT: Stats ต้องมาก่อน :id เสมอ ไม่งั้นระบบจะนึกว่าคำว่า "stats" คือ ID
app.get('/api/tasks/stats', taskController.getStatistics.bind(taskController));

// Standard CRUD
app.get('/api/tasks', taskController.getAllTasks.bind(taskController));
app.get('/api/tasks/:id', taskController.getTaskById.bind(taskController));
app.post('/api/tasks', taskController.createTask.bind(taskController));
app.put('/api/tasks/:id', taskController.updateTask.bind(taskController));

// Special Actions
app.patch('/api/tasks/:id/status', taskController.updateStatus.bind(taskController)); // อันเดิมที่มี
app.patch('/api/tasks/:id/next-status', taskController.moveToNextStatus.bind(taskController)); // ✅ อันใหม่ตามโจทย์

app.delete('/api/tasks/:id', taskController.deleteTask.bind(taskController));

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// START SERVER
// ==========================================
async function start() {
    try {
        await db.connect(); // รอเชื่อมต่อ DB ให้เสร็จก่อน
        app.listen(PORT, () => {
            console.log('=======================================');
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log('🍰 Architecture: Layered (3-Tier)');
            console.log('=======================================');
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

start();