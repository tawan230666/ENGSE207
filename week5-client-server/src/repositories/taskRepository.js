const db = require('../../database/connection');

class TaskRepository {
    async findAll() {
        return await db.all('SELECT * FROM tasks ORDER BY created_at DESC');
    }

    async findById(id) {
        return await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
    }

    async create(task) {
        const sql = `INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, 'TODO', ?)`;
        const result = await db.run(sql, [task.title, task.description, task.priority]);
        return await this.findById(result.lastID);
    }

    async update(id, updates) {
        const fields = [];
        const values = [];

        // Dynamic Query Construction
        if (updates.title) { fields.push('title = ?'); values.push(updates.title); }
        if (updates.description) { fields.push('description = ?'); values.push(updates.description); }
        if (updates.status) { fields.push('status = ?'); values.push(updates.status); }
        if (updates.priority) { fields.push('priority = ?'); values.push(updates.priority); }
        
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id); // ID สำหรับ WHERE clause

        const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
        const result = await db.run(sql, values);
        
        return result.changes > 0 ? await this.findById(id) : null;
    }

    async delete(id) {
        const result = await db.run('DELETE FROM tasks WHERE id = ?', [id]);
        return result.changes > 0;
    }

    async count() {
        return await db.get('SELECT COUNT(*) AS count FROM tasks');
    }
}

module.exports = new TaskRepository();