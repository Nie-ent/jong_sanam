import jwt from "jsonwebtoken"
import authService from "../../services/auth/auth.service.js"
import bcrypt from "bcryptjs"
import prisma from "../../config/prisma.config.js"

const authController = {}

authController.register = async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body
    const newUser = await authService.register(email, password, firstName, lastName, phoneNumber)

    res.status(201).json({ message: "create success", newUser })
}

authController.login = async (req, res) => {
    const { email, password } = req.body
    const userFound = await authService.login(email)
    const verifyPassword = await bcrypt.compare(password, userFound.passwordHash)

    if (!verifyPassword) {
        throw createHttpError(404, 'Invalid Information')
    }

    const payload = { id: userFound.id }
    // console.log('payload =>', payload)

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "30d"
    })
    // console.log('token', token)

    res.status(200).json({ message: 'login success', token: token, user: userFound.email })

}

authController.getMe = async (req, res) => {
    const userId = req.userId
    const userInfo = await authService.me(userId)


    res.json({ data: userInfo })
}

authController.findKeyInvite = async (req, res) => {

    const { adminKey } = req.body // สมมติ client ส่ง { key: "xxxx" }
    try {


        if (!adminKey) {
            return res.status(400).json({
                message: "กรุณาส่ง key ด้วย",
            });
        }

        // ✅ ตรวจสอบว่ามี key อยู่ในฐานข้อมูลหรือไม่
        const existingKey = await prisma.adminInviteKey.findUnique({
            where: { keyValue: adminKey },
        });

        if (!existingKey) {
            return res.status(404).json({
                valid: false,
                message: "key ไม่ถูกต้อง",
            });
        }

        // ✅ key พบแล้ว
        return res.status(200).json({
            valid: true,
            message: "key ถูกต้อง",
        });
    } catch (error) {
        console.error("Error verifying key:", error);
        return res.status(500).json({
            valid: false,
            message: "เกิดข้อผิดพลาดในการตรวจสอบ key",
            error: error.message,
        });
    }
};

export default authController