import jwt from "jsonwebtoken"
import authService from "../../services/auth/auth.service.js"

const authController = {}

authController.register = async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body
    const newUser = await authService.register(email, password, firstName, lastName, phoneNumber)

    res.status(201).json({ message: "create success", newUser })
}

authController.login = async (req, res) => {
    const { email, password } = req.body
    const { passwordHash, id } = authService.login(email, password)
    const verifyPassword = await bcrypt.compare(password, passwordHash)
    if (!verifyPassword) {
        throw createHttpError(404, 'Invalid Information')
    }
    const payload = id
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "15d"
    })

    res.status(200).json({ message: 'login success', token: token })

}

export default authController