import { Router } from "express";
import authController from "../../controllers/auth/auth.controller.js";

const authRouter = Router()

authRouter.post('/login', () => { })
authRouter.post('/register', authController.register)
// authRouter.get('/')

export default authRouter