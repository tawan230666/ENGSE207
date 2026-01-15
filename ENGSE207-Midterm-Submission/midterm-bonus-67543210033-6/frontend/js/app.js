let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Bind Theme & Modal Buttons
    document.getElementById('theme-toggle-btn').onclick = () => document.body.classList.toggle('dark-mode');
    document.getElementById('add-book-btn').onclick = () => showBookForm();
    document.getElementById('book-form').onsubmit = handleFormSubmit;

    // 2. Bind Filter Tabs (แก้บั๊กกดไม่ได้)
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(btn => {
        btn.onclick = (e) => {
            // ลบ active เก่า
            tabs.forEach(t => t.classList.remove('active'));
            // ใส่ active ใหม่
            e.target.classList.add('active');
            
            // อัปเดตตัวแปรและโหลดใหม่
            currentFilter = e.target.dataset.filter;
            fetchAndRenderBooks();
        };
    });

    // 3. Load Data
    fetchAndRenderBooks();
}

async function fetchAndRenderBooks() {
    try {
        const result = await api.getAllBooks(currentFilter);
        const books = result.data || [];
        const stats = result.statistics; // รับค่าสถิติที่ถูกต้องจาก Backend

        // อัปเดตตัวเลข (จะไม่เพี้ยนแล้ว)
        if (stats) {
            document.getElementById('stat-total').innerText = stats.total;
            document.getElementById('stat-available').innerText = stats.available;
            document.getElementById('stat-borrowed').innerText = stats.borrowed;
        }

        renderBookList(books);
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

// Logic บันทึก (เพิ่ม/แก้ไข)
async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const isbnVal = document.getElementById('isbn').value.trim();

    // Check ISBN Format
    if (!/^(97[89])\d{10}$/.test(isbnVal)) {
        Swal.fire({ icon: 'error', title: 'รูปแบบไม่ถูกต้อง', text: 'ISBN ต้องเป็นเลข 13 หลัก และขึ้นต้นด้วย 978 หรือ 979' });
        return;
    }

    const bookData = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        isbn: isbnVal
    };

    try {
        if (id) await api.updateBook(id, bookData);
        else await api.createBook(bookData);
        
        hideBookForm();
        Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1000, showConfirmButton: false });
        fetchAndRenderBooks();
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
    }
}

// --- Global Functions (เพื่อให้ onclick ใน HTML มองเห็น) ---
window.handleBorrow = async (id) => {
    try { await api.borrowBook(id); fetchAndRenderBooks(); }
    catch (e) { Swal.fire('Error', e.message, 'error'); }
};

window.handleReturn = async (id) => {
    try { await api.returnBook(id); fetchAndRenderBooks(); }
    catch (e) { Swal.fire('Error', e.message, 'error'); }
};

window.handleDelete = async (id, status) => {
    if (status === 'borrowed') {
        Swal.fire({ icon: 'warning', title: 'ลบไม่ได้!', text: 'หนังสือถูกยืมอยู่ ต้องคืนก่อนถึงจะลบได้' });
        return;
    }
    Swal.fire({
        title: 'ยืนยันการลบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ลบเลย'
    }).then(async (res) => {
        if (res.isConfirmed) {
            try { await api.deleteBook(id); fetchAndRenderBooks(); }
            catch (e) { Swal.fire('Error', e.message, 'error'); }
        }
    });
};

window.handleEdit = async (id) => {
    try {
        const res = await api.getBookById(id);
        showBookForm(res.data || res);
    } catch (e) { Swal.fire('Error', 'ไม่สามารถดึงข้อมูลได้', 'error'); }
};
