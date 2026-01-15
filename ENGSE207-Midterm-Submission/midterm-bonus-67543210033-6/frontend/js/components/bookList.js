function renderBookList(books) {
    const container = document.getElementById('book-list');
    if (!container) return;

    if (!books || books.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px; color:var(--gray);">
                <i class="fas fa-folder-open" style="font-size:3rem; margin-bottom:15px; opacity:0.5;"></i>
                <p>No books found.</p>
            </div>`;
        return;
    }

    container.innerHTML = books.map(book => {
        const isBorrowed = book.status === 'borrowed';
        // เลือก class สำหรับแถบสีด้านข้าง
        const statusClass = isBorrowed ? 'status-borrowed' : 'status-available';
        const pillClass = isBorrowed ? 'pill-borrowed' : 'pill-available';
        
        return `
        <div class="card ${statusClass}">
            <div class="card-header">
                <h3 class="book-title">${book.title}</h3>
                <span class="status-pill ${pillClass}">${book.status}</span>
            </div>
            
            <div class="book-meta">
                <div><i class="fas fa-user"></i> ${book.author}</div>
                <div><i class="fas fa-barcode"></i> <span style="font-family:monospace; letter-spacing:1px;">${book.isbn}</span></div>
            </div>
            
            <div class="card-actions">
                ${isBorrowed 
                    ? `<button class="btn btn-return" onclick="window.handleReturn('${book.id}')">
                         <i class="fas fa-undo"></i> Return
                       </button>`
                    : `<button class="btn btn-borrow" onclick="window.handleBorrow('${book.id}')">
                         <i class="fas fa-hand-holding"></i> Borrow
                       </button>`
                }
                
                <button class="btn btn-edit" onclick="window.handleEdit('${book.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                
                <button class="btn btn-delete" 
                    ${isBorrowed ? 'disabled title="ต้องคืนหนังสือก่อน"' : ''}
                    onclick="window.handleDelete('${book.id}', '${book.status}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`;
    }).join('');
}
