import { rateLimit } from "express-rate-limit"

const limiter = rateLimit({
    windowMs: 60 * 1000 * 60 * 24,
    limit: 10,
    message: "Rate limiting exceeds || Try after sometime!"
})

export default limiter