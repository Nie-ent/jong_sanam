import { Router } from "express";
import authController from "../controllers/auth/auth.controller.js";
import authMiddleware from "../middlewares/auth/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { loginRequestDto, registerRequestDto } from "../dto/auth.dto.js";

const authRouter = Router()

authRouter.post('/login', validateBody(loginRequestDto), authController.login)
authRouter.post('/key', authController.findKeyInvite)
authRouter.post('/register', validateBody(registerRequestDto), authController.register)
authRouter.get('/me', authMiddleware, authController.getMe)

export default authRouter