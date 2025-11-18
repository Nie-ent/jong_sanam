import prisma from "../../config/prisma.config.js";
import bookingService from "../../services/booking/booking.service.js"

const bookingController = {}

bookingController.getByQuery = async (req, res) => {
    try {
        const { date, pitch } = req.query;

        let where = {
            status: { in: ["CONFIRMED", "PENDING"] }
        };

        if (date) {
            const startOfDay = new Date(`${date}T00:00:00`);
            const endOfDay = new Date(`${date}T23:59:59`);

            // ดึง booking ที่ "ทับช่วงเวลา" วันนั้น
            where.OR = [
                { startTime: { gte: startOfDay, lte: endOfDay } },
                { endTime: { gte: startOfDay, lte: endOfDay } },
                {
                    AND: [
                        { startTime: { lte: startOfDay } },
                        { endTime: { gte: endOfDay } }
                    ]
                }
            ];
        }

        if (pitch) {
            where.pitch = { name: pitch };
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                pitch: true,
                user: true
            },
            orderBy: { startTime: "asc" }
        });

        res.json(bookings);

    } catch (error) {
        console.error("Error fetching bookings", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


bookingController.getById = async (req, res) => {
    const { id } = req.params
    const bookingData = await bookingService.getById(id)
    res.status(200).json({ data: bookingData })
}

bookingController.create = async (req, res) => {
    const { userId, pitchId, startTime, endTime, totalPrice } = req.body
    const isBooking = await bookingService.create(userId, pitchId, startTime, endTime, totalPrice)
    res.status(201).json({ data: isBooking })
}

bookingController.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Missing 'status' in body" });
        }

        const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];
        status = status.toUpperCase();

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status,
                updatedAt: new Date(),
            },
            include: { user: true, pitch: true }
        });

        res.json({
            message: "Booking status updated successfully",
            data: updatedBooking,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};



bookingController.checkAvailability = async (req, res, next) => {
    try {
        const { date, time, pitchId } = req.body

        if (!date || !time || !pitchId) {
            return res.status(400).json({
                message: "Missing required fields: date, time, pitchId",
            })
        }

        const available = await bookingService.checkAvailability(date, time, pitchId)

        res.json({
            message: available
                ? "Pitch is available at the selected time"
                : "Pitch is already booked at the selected time",
            available,
        })
    } catch (error) {
        next(error)
    }
}

export default bookingController