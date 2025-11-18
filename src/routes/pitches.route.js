import { Router } from "express";
import pitchController from "../controllers/pitch/pitch.controller.js";

const pitchesRouter = Router()

pitchesRouter.get('/', pitchController.getAll)
pitchesRouter.get('/:id', pitchController.getById)
pitchesRouter.post('/', pitchController.create)
pitchesRouter.put('/:id', pitchController.updateData)
pitchesRouter.patch('/:id', pitchController.updateStatus)
pitchesRouter.delete('/:id', pitchController.delete)

export default pitchesRouter