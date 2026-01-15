class LibraryAPI {
    constructor(baseURL) {
        // แก้ไข IP ให้ตรงกับ VM ของคุณ
        this.baseURL = baseURL || 'http://172.31.117.173:3000/api';
    }

    async _fetch(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Request failed');
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getAllBooks(status = 'all') { return this._fetch(`/books?status=${status}`); }
    async getBookById(id) { return this._fetch(`/books/${id}`); }
    
    async createBook(data) {
        return this._fetch('/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
    
    async updateBook(id, data) {
        return this._fetch(`/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
    
    async borrowBook(id) { return this._fetch(`/books/${id}/borrow`, { method: 'PATCH' }); }
    async returnBook(id) { return this._fetch(`/books/${id}/return`, { method: 'PATCH' }); }
    async deleteBook(id) { return this._fetch(`/books/${id}`, { method: 'DELETE' }); }
}
const api = new LibraryAPI();