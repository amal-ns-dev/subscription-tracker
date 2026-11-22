import rateLimit from "express-rate-limit";

const rateLimiterMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,               // 100 requests per IP
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

export default rateLimiterMiddleware;