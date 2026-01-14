const API_URL = 'http://localhost:3000/api/books'; 

document.addEventListener('DOMContentLoaded', fetchBooks);

async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // 🔥 จุดที่แก้ 1: เช็คว่าเป็น Array หรือไม่? ถ้าไม่ใช่ให้ไปดึง key ชื่อ books ออกมาแทน
        // (รองรับทั้ง Backend ที่ส่งมาแบบ [..] และ { books: [..] })
        const books = Array.isArray(data) ? data : (data.books || []);

        console.log('Fetched data:', books); // ไว้ดูใน Console ว่าข้อมูลมาจริงไหม
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function displayBooks(books) {
    const list = document.getElementById('bookList');
    list.innerHTML = ''; 
    
    // 🔥 จุดที่แก้ 2: กันเหนียว ถ้า books ยังไม่ใช่ Array อีก ให้หยุดทำงาน (จะไม่ขึ้น Error แดงให้กวนใจ)
    if (!Array.isArray(books)) {
        console.error('Data received is not an array:', books);
        return;
    }

    books.forEach(book => {
        const li = document.createElement('li');
        // เพิ่ม style ปุ่ม delete ให้ด้วยเผื่อ css หลุด
        li.innerHTML = `
            <span><strong>${book.title}</strong> by ${book.author} (ISBN: ${book.isbn})</span>
            <button class="delete-btn" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; margin-left: 10px;" onclick="deleteBook(${book.id})">Delete</button>
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
