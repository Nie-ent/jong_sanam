import jwt from "jsonwebtoken"
import userService from "../../services/user.service.js"
import createHttpError from "http-errors"

export default async (req, res, next) => {

    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw createHttpError(401, 'Unauthorized')
    }
    const token = authorization.split(" ")[1]

    if (!token) {
        throw createHttpError(401, 'Unauthorized')
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const foundUser = await userService(payload.id)
    console.log('foundUser', foundUser)
    req.userId = foundUser.id
    next()
}