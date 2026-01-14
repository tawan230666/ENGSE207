const API_URL = 'http://localhost:3000/api/books'; 

document.addEventListener('DOMContentLoaded', fetchBooks);

async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // 🔥 แก้ตรงนี้: ถ้า data ไม่ใช่ Array ให้ลองหาข้างในว่ามี key ชื่อ books หรือเปล่า
        const books = Array.isArray(data) ? data : (data.books || []);

        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function displayBooks(books) {
    const list = document.getElementById('bookList');
    list.innerHTML = ''; 
    books.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${book.title}</strong> by ${book.author} (ISBN: ${book.isbn})</span>
            <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}

document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, isbn })
        });
        e.target.reset();
        fetchBooks(); 
    } catch (error) { console.error('Error adding book:', error); }
    });

async function deleteBook(id) {
    if(!confirm('Are you sure?')) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchBooks();
    } catch (error) { console.error('Error deleting book:', error); }
}
