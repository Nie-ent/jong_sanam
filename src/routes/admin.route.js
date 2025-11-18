import adminKeyController from '../controllers/admin/admin.controller.js'
import { Router } from "express";

const adminRouter = Router();

// สร้าง key ใหม่
adminRouter.post("/", adminKeyController.createKey);

// ตรวจสอบ key
adminRouter.get("/:inviteKey", adminKeyController.getAllKeys);

adminRouter.post("/admin", adminKeyController.registerAdmin)

export default adminRouter;
