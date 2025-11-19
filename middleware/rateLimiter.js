const rateLimit = require("express-rate-limit");

//Login limiter
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutter
    max: 5, // 5 request pr window
    message: {error: "To many login requests"},
    skipSuccessfulRequests: true, // tæller ikke gode requests
});

//Oprettelse af post limiter
exports.postCreationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {error: "To many post attempts"},
});

//Like limiter
exports.likeLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: {error: "To many like attempts"}
});