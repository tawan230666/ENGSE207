const db = require('../database/connection');

class BookRepository {
    // ไม่ต้อง init() ในนี้แล้ว เพราะทำใน connection.js แล้ว เพื่อกันความสับสน

    async findAll(status = null) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM books ORDER BY id DESC';
            let params = [];
            if (status && status !== 'all') {
                sql += ' WHERE status = ?';
                params.push(status);
            }
            db.all(sql, params, (err, rows) => {
                if (err) reject(err); else resolve(rows);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });
    }

    async findByIsbn(isbn) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE isbn = ?', [isbn], (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });
    }

    async create(bookData) {
        const { title, author, isbn } = bookData;
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)', 
                [title, author, isbn], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) reject(new Error('ISBN already exists'));
                    else reject(err);
                } else {
                    db.get('SELECT * FROM books WHERE id = ?', [this.lastID], (e, r) => {
                        if(e) reject(e); else resolve(r);
                    });
                }
            });
        });
    }

    async update(id, bookData) {
        const { title, author, isbn } = bookData;
        return new Promise((resolve, reject) => {
            db.run('UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?', 
                [title, author, isbn, id], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) reject(new Error('ISBN already exists'));
                    else reject(err);
                } else resolve({ id, ...bookData });
            });
        });
    }

    async updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE books SET status = ? WHERE id = ?', [status, id], function(err) {
                if (err) reject(err); else resolve({ id, status });
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM books WHERE id = ?', [id], (err) => {
                if (err) reject(err); else resolve({ message: 'Deleted' });
            });
        });
    }
}
module.exports = new BookRepository();
