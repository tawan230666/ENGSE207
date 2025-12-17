const taskService = require('../services/taskService');

class TaskController {
    // Health Check
    async healthCheck(req, res) {
        try {
            const health = await taskService.getHealth();
            res.json(health);
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    }

    async getAllTasks(req, res) {
        try {
            const tasks = await taskService.getAllTasks();
            res.json({ tasks });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getTaskById(req, res) {
        try {
            const task = await taskService.getTaskById(req.params.id);
            res.json({ task });
        } catch (err) {
            const status = err.message === 'Task not found' ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    }

    async createTask(req, res) {
        try {
            const task = await taskService.createTask(req.body);
            res.status(201).json({ task });
        } catch (err) {
            const status = err.message === 'Title is required' ? 400 : 500;
            res.status(status).json({ error: err.message });
        }
    }

    async updateTask(req, res) {
        try {
            const task = await taskService.updateTask(req.params.id, req.body);
            res.json({ task });
        } catch (err) {
            let status = 500;
            if (err.message === 'Task not found') status = 404;
            if (err.message.includes('Invalid') || err.message.includes('Title')) status = 400;
            res.status(status).json({ error: err.message });
        }
    }

    async deleteTask(req, res) {
        try {
            await taskService.deleteTask(req.params.id);
            res.json({ success: true });
        } catch (err) {
            const status = err.message === 'Task not found' ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    }
    
    // สำหรับ PATCH status อย่างเดียว
    async updateStatus(req, res) {
        if (!req.body.status) return res.status(400).json({ error: 'Status is required' });
        return this.updateTask(req, res);
    }

    // ✅ เพิ่ม Controller: Stats (ที่ Error อยู่เพราะขาดตัวนี้)
    async getStatistics(req, res) {
        try {
            const stats = await taskService.getStatistics();
            res.json({ success: true, data: stats });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // ✅ เพิ่ม Controller: Next Status
    async moveToNextStatus(req, res) {
        try {
            const task = await taskService.moveToNextStatus(req.params.id);
            res.json({ success: true, data: task, message: 'เปลี่ยนสถานะงานสำเร็จ' });
        } catch (err) {
            let status = 500;
            if (err.message === 'Task not found') status = 404;
            if (err.message === 'งานนี้เสร็จสมบูรณ์แล้ว') status = 400;
            
            res.status(status).json({ error: err.message });
        }
    }
}

module.exports = new TaskController();