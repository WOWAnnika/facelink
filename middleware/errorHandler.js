const path = require('path');


module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;

    let errorPage;
    switch (statusCode) {
        case 403:
            errorPage = "403.html";
            break;
        case 500:
        default:
            errorPage = "500.html";
            break;
    }

    res.status(statusCode).sendFile(
        path.join(process.cwd(), "./public/html", errorPage)
    );
    next();
};