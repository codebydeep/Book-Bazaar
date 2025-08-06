import { Router } from "express"

import { getAllOrderDetailsForUser, getOrderDetailsById, placedOrder } from "../controllers/order.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import keyMiddleware from "../middlewares/apiKey.middleware.js"

const orderRoutes = Router()

orderRoutes.use(keyMiddleware)

orderRoutes.post("/", authMiddleware, placedOrder)
orderRoutes.get("/", authMiddleware, getAllOrderDetailsForUser)
orderRoutes.get("/:id", authMiddleware, getOrderDetailsById)

export default orderRoutes