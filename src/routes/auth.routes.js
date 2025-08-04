import { Router } from "express";
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.Middleware.js";

const authRoutes = Router()

authRoutes.post("/register", registerUser)
authRoutes.post("/login", loginUser)
authRoutes.get("/logout", authMiddleware, logoutUser)

authRoutes.get("/me", authMiddleware, getProfile)

export default authRoutes