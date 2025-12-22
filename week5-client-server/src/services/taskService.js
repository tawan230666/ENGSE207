const taskRepository = require('../repositories/taskRepository');

class TaskService {
    async getAllTasks() {
        return await taskRepository.findAll();
    }

    async getTaskById(id) {
        const task = await taskRepository.findById(id);
        if (!task) throw new Error('Task not found');
        return task;
    }

    async createTask(data) {
        // แก้ไขท่อนตรวจสอบ Title
        if (!data.title || data.title.trim().length < 3) {
            throw new Error('Title must be at least 3 characters');
        }
        
        const cleanData = {
            title: data.title.trim(),
            description: data.description ? data.description.trim() : '',
            priority: data.priority || 'MEDIUM'
        };

        return await taskRepository.create(cleanData);
    }

    async updateTask(id, data) {
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) throw new Error('Task not found');

        // แก้ไขท่อนตรวจสอบ Title ตอนอัพเดทด้วย
        if (data.title !== undefined) {
             if (data.title.trim().length < 3) {
                 throw new Error('Title must be at least 3 characters');
             }
        }
        
        if (data.status) {
            const allowed = ['TODO', 'IN_PROGRESS', 'DONE'];
            if (!allowed.includes(data.status)) throw new Error('Invalid status value');
        }

        if (data.priority) {
            const allowedPrio = ['LOW', 'MEDIUM', 'HIGH'];
            if (!allowedPrio.includes(data.priority)) throw new Error('Invalid priority value');
        }

        return await taskRepository.update(id, data);
    }

    async deleteTask(id) {
        const success = await taskRepository.delete(id);
        if (!success) throw new Error('Task not found');
        return true;
    }

    async getHealth() {
        const result = await taskRepository.count();
        return {
            status: 'ok',
            message: 'Task Board API is healthy',
            tasksCount: result.count
        };
    }

    // ✅ เพิ่มฟังก์ชัน: ดึงสถิติ
    async getStatistics() {
        const tasks = await taskRepository.findAll();
        return {
            total: tasks.length,
            byStatus: {
                TODO: tasks.filter(t => t.status === 'TODO').length,
                IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
                DONE: tasks.filter(t => t.status === 'DONE').length
            },
            byPriority: {
                LOW: tasks.filter(t => t.priority === 'LOW').length,
                MEDIUM: tasks.filter(t => t.priority === 'MEDIUM').length,
                HIGH: tasks.filter(t => t.priority === 'HIGH').length
            }
        };
    }

    // ✅ เพิ่มฟังก์ชัน: เลื่อนสถานะถัดไป
    async moveToNextStatus(id) {
        const task = await this.getTaskById(id);
        
        const statusFlow = {
            'TODO': 'IN_PROGRESS',
            'IN_PROGRESS': 'DONE',
            'DONE': 'DONE'
        };

        const nextStatus = statusFlow[task.status];

        if (task.status === 'DONE') {
            throw new Error('งานนี้เสร็จสมบูรณ์แล้ว');
        }

        return await taskRepository.update(id, { status: nextStatus });
    }
}

module.exports = new TaskService();