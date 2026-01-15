const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ใช้ path.resolve เพื่อระบุตำแหน่งไฟล์ library.db ให้แน่นอน (อยู่ที่ root ของ backend)
const dbPath = path.resolve(__dirname, '../../../library.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database Error:', err.message);
    } else {
        // Log บอกชัดๆ ว่าต่อไฟล์ไหน
        console.log('✅ Database connected at:', dbPath);
        
        // สร้างตารางทันทีที่ต่อติด (ถ้ายังไม่มี)
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'available',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

module.exports = db;
