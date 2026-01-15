const express = require('express');
const bookRoutes = require('./src/presentation/routes/bookRoutes');
const corsMiddleware = require('./src/presentation/middlewares/cors');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();
app.use(corsMiddleware);
app.use(express.json());

app.use('/api/books', bookRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║  Library Management System API (Server)       ║
║  Server running on http://0.0.0.0:${PORT}     ║
╚═══════════════════════════════════════════════╝`);
});
