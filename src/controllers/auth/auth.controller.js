import jwt from "jsonwebtoken"
import authService from "../../services/auth/auth.service.js"
import bcrypt from "bcryptjs"

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
    console.log('payload =>', payload)

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "30m"
    })
    console.log('token', token)

    res.status(200).json({ message: 'login success', token: token, user: userFound.email })

}

authController.getMe = async (req, res) => {
    const userId = req.userId
    const userInfo = await authService.me(userId)

    console.log('userInfo =>', userInfo)

    res.json({ data: userInfo })
}

export default authController