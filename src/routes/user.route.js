import { Router } from "express";
import userController from "../controllers/user/user.controller.js";

const userRouter = Router()

userRouter.get('/', userController.fetchUserData)
// userRouter.patch('/:lineUserId')

export default userRouter