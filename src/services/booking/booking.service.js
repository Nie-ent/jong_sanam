import createHttpError from "http-errors"
import prisma from "../../config/prisma.config.js"

const bookingService = {}

bookingService.getAll = async (date, pitch_id) => {
    let where = {}

    if (date) {
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        where.startTime = {
            gte: startOfDay,
            lte: endOfDay,
        }
    }

    if (pitch_id) {
        where.pitchId = pitch_id
    }

    const bookings = await prisma.booking.findMany({
        where,
        include: {
            user: true,
            pitch: true,
        },
        orderBy: {
            startTime: "asc",
        },
    })

    return bookings
}


bookingService.getById = async (id) => {
    const isAvaliable = await prisma.booking.findUnique(
        { where: { id } }
    )
    if (!isAvaliable) {
        throw createHttpError(404, 'not found booking')
    }
    return isAvaliable
}

bookingService.create = async (userId, pitchId, startTime, endTime) => {
    if (!userId || !pitchId || !startTime || !endTime) {
        throw new Error("Missing required fields");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const pitch = await prisma.pitch.findUnique({ where: { id: pitchId } });
    if (!pitch) throw new Error("Pitch not found");

    const start = new Date(startTime);
    const end = new Date(endTime);

    const overlap = await prisma.booking.findFirst({
        where: {
            pitchId,
            startTime: { lt: end },
            endTime: { gt: start },
        },
    });

    if (overlap) throw new Error("This pitch is already booked during the selected time.");

    return await prisma.booking.create({
        data: {
            userId,
            pitchId,
            startTime: start,
            endTime: end,
        },
    });

};

bookingService.updateStatus = async (id, status) => {
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"]

    if (!validStatuses.includes(status)) {
        throw createHttpError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`)
    }

    const existingBooking = await prisma.booking.findUnique({
        where: { id },
    })

    if (!existingBooking) {
        throw createHttpError(404, "Booking not found")
    }

    const updatedBooking = await prisma.booking.update({
        where: { id },
        data: {
            status,
            updatedAt: new Date(),
        },
    })

    return updatedBooking
}

bookingService.checkAvailability = async (date, time, pitchId) => {

    const startTime = new Date(`${date}T${time}:00.000Z`)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000)

    const pitch = await prisma.pitch.findUnique({ where: { id: pitchId } })
    if (!pitch) throw createHttpError(404, "Pitch not found")

    const overlap = await prisma.booking.findFirst({
        where: {
            pitchId,
            startTime: { lt: endTime },
            endTime: { gt: startTime },
        },
    })

    return !overlap
}


export default bookingService