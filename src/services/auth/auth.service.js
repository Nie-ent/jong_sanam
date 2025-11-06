import createHttpError from "http-errors"
import prisma from "../../config/prisma.config.js"
import bcrypt from "bcryptjs"

const authService = {}

authService.register = async (email, password, firstName, lastName, phoneNumber) => {
    const userExist = await prisma.admin.findUnique({ where: { email } })
    if (userExist) {
        throw createHttpError(409, 'this user already exist')
    }
    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = await prisma.admin.create({
        data: {
            email,
            passwordHash: hashPassword,
            firstName,
            lastName,
            phoneNumber
        }
    })
    return newUser
}

authService.login = async (email) => {

    const userFound = await prisma.admin.findUnique({ where: { email } })

    if (!userFound) {
        throw createHttpError(404, 'Invalid Information')
    }

    console.log('userFound', userFound)

    return userFound
}

authService.me = async (userId) => {

    const userInfo = await prisma.admin.findUnique({
        where: {
            id: userId
        },
        omit: {
            passwordHash: true,
            createdAt: true,
            updatedAt: true
        }
    })
    return userInfo
}

export default authService