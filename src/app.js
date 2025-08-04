import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import booksRoutes from "./routes/books.routes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/books", booksRoutes)

export default app