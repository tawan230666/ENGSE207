// Main Application Logic for Library Management
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadBooks();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('add-btn').addEventListener('click', showAddModal);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            filterBooks(filter);
        });
    });
    
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('book-form').addEventListener('submit', handleSubmit);
}

// Load books
async function loadBooks(status = null) {
    try {
        showLoading();
        
        const data = await api.getAllBooks(status);
        
        displayBooks(data.books);
        updateStatistics(data.statistics);
        
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Connection Error',
            text: 'Failed to load books: ' + error.message
        });
        hideLoading();
    }
}

// Display books
function displayBooks(books) {
    const container = document.getElementById('book-list');
    
    if (books.length === 0) {
        container.innerHTML = '<div class="no-books">📚 No books found</div>';
        return;
    }
    
    container.innerHTML = books.map(book => createBookCard(book)).join('');
}

// Create book card HTML
function createBookCard(book) {
    return `
        <div class="book-card">
            <h3>${escapeHtml(book.title)}</h3>
            <p class="author">👤 ${escapeHtml(book.author)}</p>
            <p class="isbn">🔖 ISBN: ${escapeHtml(book.isbn)}</p>
            <span class="status-badge status-${book.status}">
                ${book.status === 'available' ? '✅' : '📖'} ${book.status.toUpperCase()}
            </span>
            <div class="actions">
                ${book.status === 'available' 
                    ? `<button class="btn btn-success" onclick="borrowBook(${book.id})">Borrow</button>`
                    : `<button class="btn btn-warning" onclick="returnBook(${book.id})">Return</button>`
                }
                <button class="btn btn-secondary" onclick="editBook(${book.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `;
}

// Update statistics
function updateStatistics(stats) {
    document.getElementById('stat-available').textContent = stats.available;
    document.getElementById('stat-borrowed').textContent = stats.borrowed;
    document.getElementById('stat-total').textContent = stats.total;
}

// Filter books
function filterBooks(status) {
    currentFilter = status;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === status) {
            btn.classList.add('active');
        }
    });
    
    loadBooks(status === 'all' ? null : status);
}

// Show/hide loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('book-list').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('book-list').style.display = 'grid';
}

// Modal functions
function showAddModal() {
    document.getElementById('modal-title').textContent = 'Add New Book';
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('book-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('book-modal').style.display = 'none';
}

// Form submit (Add & Update) - แก้ตรงนี้ให้เป็น SweetAlert
async function handleSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('book-id').value;
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value
    };
    
    try {
        if (id) {
            await api.updateBook(id, bookData);
            await Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Book updated successfully!',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            await api.createBook(bookData);
            await Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Book added successfully!',
                timer: 1500,
                showConfirmButton: false
            });
        }
        
        closeModal();
        loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) {
        // แจ้งเตือน Error สวยๆ (เช่น ISBN ซ้ำ หรือ Format ผิด)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message
        });
    }
}

// Edit book
async function editBook(id) {
    try {
        const book = await api.getBookById(id);
        
        document.getElementById('modal-title').textContent = 'Edit Book';
        document.getElementById('book-id').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn;
        
        document.getElementById('book-modal').style.display = 'flex';
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// Borrow book (SweetAlert Version)
async function borrowBook(id) {
    const result = await Swal.fire({
        title: 'Confirm Borrow?',
        text: "Do you want to borrow this book?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, borrow it!'
    });

    if (!result.isConfirmed) return;
    
    try {
        await api.borrowBook(id);
        await Swal.fire({
            icon: 'success',
            title: 'Borrowed!',
            text: 'Book borrowed successfully.',
            timer: 1500,
            showConfirmButton: false
        });
        loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// Return book (SweetAlert Version)
async function returnBook(id) {
    const result = await Swal.fire({
        title: 'Return Book?',
        text: "Are you returning this book?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffc107',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, return it!',
        color: '#000'
    });

    if (!result.isConfirmed) return;
    
    try {
        await api.returnBook(id);
        await Swal.fire({
            icon: 'success',
            title: 'Returned!',
            text: 'Book returned successfully.',
            timer: 1500,
            showConfirmButton: false
        });
        loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// Delete book (SweetAlert Version)
async function deleteBook(id) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;
    
    try {
        await api.deleteBook(id);
        await Swal.fire(
            'Deleted!',
            'The book has been deleted.',
            'success'
        );
        loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Cannot Delete',
            text: error.message
        });
    }
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}