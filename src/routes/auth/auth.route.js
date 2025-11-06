import { Router } from "express";
import authController from "../../controllers/auth/auth.controller.js";
import authMiddleware from "../../middlewares/auth/auth.middleware.js";

const authRouter = Router()

authRouter.post('/auth/login', authController.login)
authRouter.post('/auth/register', authController.register)
authRouter.get('/auth/me', authMiddleware, authController.getMe)

export default authRouter