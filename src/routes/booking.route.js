import { Router } from "express";
import bookingController from "../controllers/booking/booking.controller.js";

const bookingRouter = Router();

bookingRouter.get('/', bookingController.getByQuery);
bookingRouter.get('/:id', bookingController.getById);
bookingRouter.post('/', bookingController.create);

// check availability → ใช้ route แยกชัดเจน
bookingRouter.post('/check', bookingController.checkAvailability);

bookingRouter.patch('/:id', bookingController.updateStatus);

export default bookingRouter;
