import createHttpError from "http-errors"
import prisma from "../../config/prisma.config.js"

const pitchService = {}

pitchService.create = async (name, type, hourlyRate, status, addedByAdminId) => {

    const isAvaliable = await prisma.pitch.findUnique({ where: { name } })

    if (isAvaliable) {
        throw createHttpError(400, "This pitch already alive in your list")
    }

    const newPitch = await prisma.pitch.create({
        data: {
            name,
            type,
            hourlyRate,
            addedByAdminId
        }
    })
    return newPitch
}

pitchService.getAll = async () => {
    return await prisma.pitch.findMany()
}

pitchService.getById = async (pitchId) => {
    const data = await prisma.pitch.findUnique({
        where: { id: pitchId }
    })

    if (!data) {
        throw createHttpError(404, 'data not found')
    }

    return data
}

pitchService.updateData = async (id, name, type, hourlyRate) => {

    const data = await prisma.pitch.findUnique({
        where: { id }
    })

    if (!data) {
        throw createHttpError(404, "this pitch are not avaliable")
    }

    return prisma.pitch.update({
        where: { id },
        data: {
            name,
            type,
            hourlyRate
        }
    })
}

pitchService.updateStatus = async (pitchId, status) => {
    const isAlive = await prisma.pitch.findUnique({
        where: { id: pitchId }
    })


    if (!isAlive) {
        throw createHttpError(404, 'no longer avaliable pitch')
    }

    return await prisma.pitch.update({
        where: { id: pitchId },
        data: { status }

    })

}

pitchService.delete = async (pitchId) => {

    const isAlive = await prisma.pitch.findUnique({
        where: { id: pitchId }
    })

    if (!isAlive) {
        throw createHttpError(404, 'no longer avaliable pitch')
    }

    return await prisma.pitch.delete({
        where:
            { id: pitchId }
    })
}

export default pitchService