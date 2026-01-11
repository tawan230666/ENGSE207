const express = require('express');
const productRoutes = require('./src/presentation/routes/productRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public')); // ให้เข้าถึงไฟล์ UI ในโฟลเดอร์ public

// Routes
app.use('/api/products', productRoutes);

// Error Handling
app.use(errorHandler);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║  Product Management System (Layered)         ║
║  Server running on http://localhost:${PORT}  ║
║  API: http://localhost:${PORT}/api/products  ║
╚══════════════════════════════════════════════╝
    `);
});