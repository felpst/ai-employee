import express, { Router } from "express"
import { authMiddleware } from "../auth/auth.middleware"
import companyController from "./company.controller"

const router: Router = express.Router()

router.post("/", authMiddleware, companyController.create)
router.get("/", authMiddleware, companyController.find)
router.get("/:id", authMiddleware, companyController.getById)
router.put("/:id", authMiddleware, companyController.update)
router.delete("/:id", authMiddleware, companyController.delete)

export default router
