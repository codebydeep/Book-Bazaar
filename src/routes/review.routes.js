import { Router } from "express";

import { addReviewForBook, deleteReviewForBook, getAllReviewsForBook } from "../controllers/review.controllers.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";

const reviewRoutes = Router()

reviewRoutes.post("/books/:bookId/reviews", authMiddleware, addReviewForBook)
reviewRoutes.get("/books/:bookId/reviews", authMiddleware, getAllReviewsForBook)
reviewRoutes.delete("/reviews/:id", authMiddleware, checkAdmin, deleteReviewForBook)

export default reviewRoutes