function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err.message);

    let statusCode = 500;

    // ถ้าเป็น error เรื่อง validation ให้ตอบ 400
    if (err.message.includes('required') || 
        err.message.includes('Invalid') ||
        err.message.includes('must be')) {
        statusCode = 400;
    }

    if (err.message.includes('not found')) {
        statusCode = 404;
    }

    res.status(statusCode).json({
        error: err.message || 'Internal server error'
    });
}

module.exports = errorHandler;