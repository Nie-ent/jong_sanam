import prisma from "../../config/prisma.config.js"

const fetchUserService = {}

fetchUserService.fetchUser = async () => {
    const data = await prisma.user.findMany()
    return data
}

export default fetchUserService