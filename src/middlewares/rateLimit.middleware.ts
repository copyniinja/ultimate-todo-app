import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 2 * 60000, // 2 mins
  limit: 60, // 60 request in 2 mins
  standardHeaders: true, // Add rate limit info inside http header
  legacyHeaders: false, // Disable legacy header
  message: {
    error: "You have sent too many request.Please try again later.",
  },
});
export function rateLimitMiddleware() {
  return limiter;
}
