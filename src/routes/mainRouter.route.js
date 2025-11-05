import { Router } from "express";
import authRouter from "./auth/auth.route.js";

const mainRouter = Router()

mainRouter.use('/api', authRouter)
// mainRouter.use('/webhook')

export default mainRouter