import { Router } from "express";
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";

const authRoutes = Router()

authRoutes.post("/register", registerUser)
authRoutes.post("/login", loginUser)

authRoutes.get("/logout", authMiddleware, logoutUser)
authRoutes.get("/me", authMiddleware, getProfile)

authRoutes.get("/check-admin", authMiddleware, checkAdmin)

export default authRoutes