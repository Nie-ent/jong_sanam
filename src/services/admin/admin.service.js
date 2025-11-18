// services/adminKey.service.js
import { randomBytes } from "crypto"
import prisma from "../../config/prisma.config.js";

const adminKeyService = {}

// 🟢 ดึงคีย์ทั้งหมด
adminKeyService.getKeyByValue = async (keyValue) => {
    if (!keyValue) return null;

    return prisma.adminInviteKey.findUnique({
        where: { keyValue },
    });
};


// 🟢 สร้างคีย์ใหม่ (เฉพาะ Super Admin)
adminKeyService.createKey = async (adminId, roleToGrant) => {
    const keyValue = randomBytes(16).toString("hex")

    const newKey = await prisma.adminInviteKey.create({
        data: {
            keyValue,
            roleToGrant,
            createdByAdminId: adminId,
        },
    })

    return newKey
}

export default adminKeyService
