import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js";

const authRoutes = Router()

authRoutes.post("/register", registerUser)
authRoutes.post("/login", loginUser)
authRoutes.get("/logout", logoutUser)

export default authRoutes