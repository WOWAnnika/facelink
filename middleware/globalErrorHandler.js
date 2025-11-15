const path = require('path');

function globalErrorHandler(req, res) {
    res.status(404).sendFile(path.join(process.cwd(), './public/html/404.html'));
}

module.exports = globalErrorHandler;