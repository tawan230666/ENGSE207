function showBookForm(book = null) {
    const modal = document.getElementById('modal');
    const titleLabel = document.getElementById('modalTitle');
    
    // รีเซ็ตฟอร์มก่อนเปิด
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';

    if (book) {
        titleLabel.innerHTML = '<i class="fas fa-edit"></i> Edit Book';
        document.getElementById('book-id').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn;
    } else {
        titleLabel.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Book';
    }
    
    modal.style.display = 'flex';
}

function hideBookForm() {
    document.getElementById('modal').style.display = 'none';
}
