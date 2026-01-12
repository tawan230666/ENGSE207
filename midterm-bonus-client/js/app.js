// 🔥 จุดสำคัญ: ชี้ไปที่ Backend ของเรา
const API_URL = 'http://localhost:3000/api/books';

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    document.getElementById('book-form').addEventListener('submit', addBook);
});

async function loadBooks() {
    const list = document.getElementById('book-list');
    const loading = document.getElementById('loading');

    try {
        loading.style.display = 'block';
        const res = await fetch(API_URL);
        const data = await res.json();
        const books = data.books || data;

        loading.style.display = 'none';
        list.innerHTML = '';

        books.forEach(book => {
            const isBorrowed = book.status === 'borrowed';
            const statusClass = isBorrowed ? 'status-borrowed' : 'status-available';

            // ปุ่มเปลี่ยนตามสถานะ
            const actionBtn = isBorrowed 
                ? `<button class="btn btn-return" onclick="returnBook(${book.id})">Return</button>`
                : `<button class="btn btn-borrow" onclick="borrowBook(${book.id})">Borrow</button>`;

            const div = document.createElement('div');
            div.className = 'book-item';
            div.innerHTML = `
                <div class="book-info">
                    <h3>${book.title} <span class="status-badge ${statusClass}">${book.status}</span></h3>
                    <p>👤 ${book.author} | 🔖 ${book.isbn}</p>
                </div>
                <div class="actions">
                    ${actionBtn}
                    <button class="btn btn-delete" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        loading.style.display = 'none';
        Swal.fire('Connection Error', 'Cannot connect to Backend (Port 3000)', 'error');
    }
}

async function addBook(e) {
    e.preventDefault();
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error);
        }

        await Swal.fire('Saved!', 'Book added successfully', 'success');
        e.target.reset();
        loadBooks();
    } catch (err) {
        Swal.fire('Error', err.message, 'error');
    }
}

async function borrowBook(id) {
    try {
        await fetch(`${API_URL}/${id}/borrow`, { method: 'PATCH' });
        Swal.fire({ icon: 'success', title: 'Borrowed', timer: 1000, showConfirmButton: false });
        loadBooks();
    } catch (err) { Swal.fire('Error', 'Failed to borrow', 'error'); }
}

async function returnBook(id) {
    try {
        await fetch(`${API_URL}/${id}/return`, { method: 'PATCH' });
        Swal.fire({ icon: 'success', title: 'Returned', timer: 1000, showConfirmButton: false });
        loadBooks();
    } catch (err) { Swal.fire('Error', 'Failed to return', 'error'); }
}

async function deleteBook(id) {
    const result = await Swal.fire({
        title: 'Delete?',
        text: "You cannot undo this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error);
            }
            Swal.fire('Deleted!', 'Book removed.', 'success');
            loadBooks();
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    }
}
