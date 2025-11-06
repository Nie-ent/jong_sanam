import prisma from "../config/prisma.config.js"
export default async (id) => {
    return await prisma.admin.findUnique({
        where: { id },
        omit: {
            passwordHash: true,
            createdAt: true,
            updatedAt: true
        }
    })
}