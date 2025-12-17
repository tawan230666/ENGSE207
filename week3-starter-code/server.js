// server.js
// Task Board - Monolithic Application
// ENGSE207 Software Architecture - Week 3 Lab

// ========================================
// PART 1: IMPORT DEPENDENCIES
// ========================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ========================================
// PART 2: APP CONFIGURATION
// ========================================

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// PART 3: DATABASE SETUP
// ========================================

const dbPath = path.join(__dirname, 'database', 'tasks.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database:', dbPath);
    }
});

// ตรวจสอบให้แน่ใจว่าตารางมีอยู่ (กันพลาดกรณีลืมรัน schema.sql)
db.run(
    `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'TODO',
        priority TEXT DEFAULT 'MEDIUM',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
        if (err) {
            console.error('❌ Error ensuring tasks table exists:', err.message);
        } else {
            console.log('🧱 Tasks table is ready');
        }
    }
);

// ========================================
// PART 4: HEALTH CHECK ENDPOINT
// ========================================

// GET /api/health
app.get('/api/health', (req, res) => {
    db.get('SELECT COUNT(*) AS count FROM tasks', [], (err, row) => {
        if (err) {
            console.error('Error in /api/health:', err.message);
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.json({
            status: 'ok',
            message: 'Task Board API is healthy',
            tasksCount: row.count
        });
    });
});

// ========================================
// PART 5: API ROUTES - GET ALL TASKS
// ========================================

// GET /api/tasks
// คืนค่า task ทั้งหมดในรูป { tasks: [...] }
app.get('/api/tasks', (req, res) => {
    const sql = `SELECT * FROM tasks ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            return res.status(500).json({ error: 'Failed to fetch tasks' });
        }
        res.json({ tasks: rows });
    });
});

// ========================================
// PART 6: API ROUTES - GET SINGLE TASK
// ========================================

// GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM tasks WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching task:', err.message);
            return res.status(500).json({ error: 'Failed to fetch task' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ task: row });
    });
});

// ========================================
// PART 7: API ROUTES - CREATE TASK
// ========================================

// POST /api/tasks
// body: { title, description?, priority? }
app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    const sql = `
        INSERT INTO tasks (title, description, status, priority) 
        VALUES (?, ?, 'TODO', ?)
    `;
    const values = [
        title.trim(),
        description ? description.trim() : '',
        priority || 'MEDIUM'
    ];

    db.run(sql, values, function (err) {
        if (err) {
            console.error('Error creating task:', err.message);
            return res.status(500).json({ error: 'Failed to create task' });
        }

        const newId = this.lastID;
        db.get(`SELECT * FROM tasks WHERE id = ?`, [newId], (err2, row) => {
            if (err2) {
                console.error('Error fetching created task:', err2.message);
                return res.status(500).json({ error: 'Task created but failed to fetch' });
            }
            res.status(201).json({ task: row });
        });
    });
});

// ========================================
// PART 8: API ROUTES - UPDATE TASK (PUT)
// ========================================

// PUT /api/tasks/:id
// อัปเดต title / description / status / priority
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    // ตรวจสอบว่ามี field ให้แก้ไหม
    const updates = [];
    const values = [];

    if (title !== undefined) {
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title cannot be empty' });
        }
        updates.push('title = ?');
        values.push(title.trim());
    }

    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description.trim());
    }

    if (status !== undefined) {
        const allowed = ['TODO', 'IN_PROGRESS', 'DONE'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        updates.push('status = ?');
        values.push(status);
    }

    if (priority !== undefined) {
        const allowedPrio = ['LOW', 'MEDIUM', 'HIGH'];
        if (!allowedPrio.includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority value' });
        }
        updates.push('priority = ?');
        values.push(priority);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const sql = `
        UPDATE tasks 
        SET ${updates.join(', ')}
        WHERE id = ?
    `;
    values.push(id);

    db.run(sql, values, function (err) {
        if (err) {
            console.error('Error updating task:', err.message);
            return res.status(500).json({ error: 'Failed to update task' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err2, row) => {
            if (err2) {
                console.error('Error fetching updated task:', err2.message);
                return res.status(500).json({ error: 'Task updated but failed to fetch' });
            }
            res.json({ task: row });
        });
    });
});

// ========================================
// PART 9: API ROUTES - DELETE TASK
// ========================================

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM tasks WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Error deleting task:', err.message);
            return res.status(500).json({ error: 'Failed to delete task' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ success: true });
    });
});

// ========================================
// PART 10: API ROUTES - PATCH STATUS ONLY
// ========================================

// PATCH /api/tasks/:id/status
// body: { status }
app.patch('/api/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const sql = `
        UPDATE tasks 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(sql, [status, id], function (err) {
        if (err) {
            console.error('Error updating task status:', err.message);
            return res.status(500).json({ error: 'Failed to update task status' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err2, row) => {
            if (err2) {
                console.error('Error fetching updated task:', err2.message);
                return res.status(500).json({ error: 'Status updated but failed to fetch' });
            }
            res.json({ task: row });
        });
    });
});

// ========================================
// PART 11: ROOT ROUTE - SERVE INDEX.HTML
// ========================================

// GET /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========================================
// PART 12: START SERVER
// ========================================

app.listen(PORT, () => {
    console.log('=======================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📊 Architecture: Monolithic (All-in-one)');
    console.log('📁 Public folder:', path.join(__dirname, 'public'));
    console.log('=======================================');
});

// ========================================
// END OF FILE
// ========================================
