import { Router } from "express";
import authRouter from "./auth.route.js";
import pitchesRouter from "./pitches.route.js";

import authMiddleware from "../middlewares/auth/auth.middleware.js";
import adminRouter from "./admin.route.js";
import bookingRouter from "./booking.route.js";
import webhookRouter from "./webhook.route.js";
import userRouter from "./user.route.js";

const mainRouter = Router()


mainRouter.use('/api/auth', authRouter)
mainRouter.use('/api/keys', adminRouter)
mainRouter.use('/api/pitches', authMiddleware, pitchesRouter)
mainRouter.use('/api/bookings', authMiddleware, bookingRouter)
mainRouter.use('/api/users', authMiddleware, userRouter)
mainRouter.use('/webhook', webhookRouter)

export default mainRouter