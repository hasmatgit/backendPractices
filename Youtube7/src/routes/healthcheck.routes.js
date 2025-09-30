import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js"
//it have no controller and model




const router = Router()

router.route("/").get(healthcheck)

export default router