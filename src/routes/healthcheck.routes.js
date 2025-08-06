import { Router } from "express";

import healthCheck from "../controllers/healthCheck.controllers.js";

const healthCheckRoutes = Router()

healthCheckRoutes.get("/", healthCheck)

export default healthCheckRoutes