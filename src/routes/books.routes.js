import { Router } from "express";
import { addBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/books.controllers.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";

const booksRoutes = Router()

booksRoutes.post("/", authMiddleware, checkAdmin, addBook)
booksRoutes.get("/", getBooks)
booksRoutes.get("/:id", getBookById)

booksRoutes.put("/:id", authMiddleware, checkAdmin, updateBook)
booksRoutes.delete("/:id", authMiddleware, checkAdmin, deleteBook)

export default booksRoutes