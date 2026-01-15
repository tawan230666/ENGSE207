const bookService = require('../../business/services/bookService');

class BookController {
    async getAllBooks(req, res, next) {
        try {
            const result = await bookService.getAllBooks(req.query.status);
            res.json({ success: true, data: result.books, statistics: result.statistics });
        } catch (e) { next(e); }
    }
    
    async getBookById(req, res, next) {
        try {
            const result = await bookService.getBookById(req.params.id);
            if (!result) return res.status(404).json({ error: 'Book not found' });
            res.json({ success: true, data: result });
        } catch (e) { next(e); }
    }

    async createBook(req, res, next) {
        try {
            const result = await bookService.createBook(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (e) { next(e); }
    }

    async updateBook(req, res, next) {
        try {
            const result = await bookService.updateBook(req.params.id, req.body);
            res.json({ success: true, data: result });
        } catch (e) { next(e); }
    }

    async borrowBook(req, res, next) {
        try {
            const result = await bookService.borrowBook(req.params.id);
            res.json({ success: true, data: result });
        } catch (e) { next(e); }
    }

    async returnBook(req, res, next) {
        try {
            const result = await bookService.returnBook(req.params.id);
            res.json({ success: true, data: result });
        } catch (e) { next(e); }
    }

    async deleteBook(req, res, next) {
        try {
            await bookService.deleteBook(req.params.id);
            res.json({ success: true, message: 'Book deleted successfully' });
        } catch (e) { next(e); }
    }
}
module.exports = new BookController();
