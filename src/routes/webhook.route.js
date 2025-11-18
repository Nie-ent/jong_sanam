import { Router } from "express";
import webhookController from "../controllers/webhook/webhook.controller.js";

const webhookRouter = Router()

webhookRouter.post('/', webhookController.replyMessage)

export default webhookRouter