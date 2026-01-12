function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    
    let status = 500;
    
    if (err.message.includes('required') || err.message.includes('Invalid') || err.message.includes('borrowed book')) {
        status = 400;
    } else if (err.message.includes('not found')) {
        status = 404;
    } else if (err.message.includes('UNIQUE') || err.message.includes('exists')) {
        status = 409;
    }
    
    res.status(status).json({
        error: err.message || 'Internal server error'
    });
}

module.exports = errorHandler;