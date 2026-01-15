const bookRepository = require('../../data/repositories/bookRepository');

class BookService {
    async getAllBooks(status) {
        // 1. ดึงหนังสือ "ทั้งหมด" มาก่อน เพื่อคำนวณสถิติรวมที่ถูกต้อง
        const allBooks = await bookRepository.findAll(); 
        
        // 2. คำนวณสถิติจากหนังสือทั้งหมด (ไม่สน Filter)
        const statistics = {
            total: allBooks.length,
            available: allBooks.filter(b => b.status === 'available').length,
            borrowed: allBooks.filter(b => b.status === 'borrowed').length
        };

        // 3. ถ้ามีการเลือกสถานะ ค่อยกรองรายการหนังสือที่จะส่งไปแสดงผล
        let displayBooks = allBooks;
        if (status && status !== 'all') {
            displayBooks = allBooks.filter(b => b.status === status);
        }

        return { books: displayBooks, statistics };
    }

    async getBookById(id) { return await bookRepository.findById(id); }

    async createBook(data) {
        const isbnPattern = /^(97[89])\d{10}$/;
        if (!isbnPattern.test(data.isbn)) throw new Error('ISBN ต้องเป็นตัวเลข 13 หลัก และขึ้นต้นด้วย 978 หรือ 979');
        
        const existing = await bookRepository.findByIsbn(data.isbn);
        if (existing) throw new Error('ISBN นี้มีอยู่ในระบบแล้ว');

        return await bookRepository.create(data);
    }

    async updateBook(id, data) {
        const isbnPattern = /^(97[89])\d{10}$/;
        if (!isbnPattern.test(data.isbn)) throw new Error('ISBN ต้องเป็นตัวเลข 13 หลัก และขึ้นต้นด้วย 978 หรือ 979');

        const existing = await bookRepository.findByIsbn(data.isbn);
        if (existing && existing.id != id) throw new Error('ISBN นี้มีอยู่ในระบบแล้ว');

        return await bookRepository.update(id, data);
    }

    async borrowBook(id) {
        const book = await bookRepository.findById(id);
        if (!book) throw new Error('ไม่พบหนังสือ');
        if (book.status === 'borrowed') throw new Error('หนังสือถูกยืมไปแล้ว');
        
        await bookRepository.updateStatus(id, 'borrowed');
        return { ...book, status: 'borrowed' };
    }

    async returnBook(id) {
        const book = await bookRepository.findById(id);
        if (!book) throw new Error('ไม่พบหนังสือ');
        if (book.status !== 'borrowed') throw new Error('หนังสือไม่ได้ถูกยืม');
        
        await bookRepository.updateStatus(id, 'available');
        return { ...book, status: 'available' };
    }

    async deleteBook(id) {
        const book = await bookRepository.findById(id);
        if (!book) throw new Error('ไม่พบหนังสือ');
        if (book.status === 'borrowed') throw new Error('ห้ามลบหนังสือที่ถูกยืมอยู่ [ตามเงื่อนไขสอบ]');
        return await bookRepository.delete(id);
    }
}
module.exports = new BookService();
