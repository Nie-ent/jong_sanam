import prisma from "../../config/prisma.config.js";

const webhookService = {

    // =======================
    // User
    // =======================
    getByLineId: async (lineUserId) => {
        return prisma.user.findUnique({ where: { lineUserId } });
    },

    createLineUserData: async (lineUserId, displayName, profileImg) => {
        return prisma.user.upsert({
            where: { lineUserId },
            update: { displayName, profileImg },
            create: { lineUserId, displayName, profileImg }
        });
    },

    // =======================
    // Pitch
    // =======================
    getAllPitches: async () => prisma.pitch.findMany(),

    getStatusByName: async (pitchName) => prisma.pitch.findUnique({
        where: { name: pitchName }
    }),

    // =======================
    // Booking
    // =======================
    getOrCreatePendingBooking: async (lineUserId) => {
        const user = await prisma.user.findUnique({ where: { lineUserId } });
        if (!user) return null;

        let pending = await prisma.booking.findFirst({
            where: { userId: user.id, status: "PENDING" }
        });

        if (!pending) {
            pending = await prisma.booking.create({
                data: {
                    userId: user.id,
                    pitchId: null,
                    startTime: new Date(),
                    endTime: new Date(),
                    status: "PENDING"
                }
            });
        }

        return pending;
    },

    createPendingBooking: async (lineUserId, { pitchName, startTime, endTime }) => {
        const user = await prisma.user.findUnique({ where: { lineUserId } });
        if (!user) throw new Error("User not found");

        const pitch = pitchName
            ? await prisma.pitch.findUnique({ where: { name: pitchName } })
            : null;

        return prisma.booking.create({
            data: {
                userId: user.id,
                pitchId: pitch?.id ?? null,
                startTime: startTime ?? new Date(),
                endTime: endTime ?? new Date(),
                status: "PENDING"
            }
        });
    },

    updatePendingBooking: async (lineUserId, { pitchName, startTime, endTime }) => {
        const user = await prisma.user.findUnique({ where: { lineUserId } });
        if (!user) throw new Error("User not found");

        const pitch = pitchName
            ? await prisma.pitch.findUnique({ where: { name: pitchName } })
            : null;

        let pending = await prisma.booking.findFirst({
            where: { userId: user.id, status: "PENDING" }
        });

        if (!pending) {
            // สร้างใหม่
            pending = await prisma.booking.create({
                data: {
                    userId: user.id,
                    pitchId: pitch?.id ?? null,
                    startTime: startTime ?? new Date(),
                    endTime: endTime ?? new Date(),
                    status: "PENDING"
                }
            });
            return pending;
        }

        // อัปเดต
        return prisma.booking.update({
            where: { id: pending.id },
            data: {
                pitchId: pitch?.id ?? pending.pitchId,
                startTime: startTime ?? pending.startTime,
                endTime: endTime ?? pending.endTime
            }
        });
    },

    getPendingBooking: async (lineUserId) => {
        const user = await prisma.user.findUnique({ where: { lineUserId } });
        if (!user) return null;

        return prisma.booking.findFirst({
            where: { userId: user.id, status: "PENDING" }
        });
    },

    createBooking: async ({ userId, pitchName, startTime, endTime }) => {
        const pitch = await prisma.pitch.findUnique({ where: { name: pitchName } });
        if (!pitch) throw new Error("Pitch not found");

        return prisma.booking.create({
            data: { userId, pitchId: pitch.id, startTime, endTime, status: "PENDING" }
        });
    },

    // =======================
    // Utils
    // =======================
    extractDateTime: async (text) => {
        const pattern = /(\d{1,2}[:.]\d{2})\s*-\s*(\d{1,2}[:.]\d{2})/;
        const match = text.match(pattern);
        if (!match) return { startTime: null, endTime: null };

        const [_, start, end] = match;
        const today = new Date().toISOString().split("T")[0];

        return {
            startTime: new Date(`${today}T${start.replace(".", ":")}:00`),
            endTime: new Date(`${today}T${end.replace(".", ":")}:00`)
        };
    },

    defineType: async (text) => {
        const lower = text.toLowerCase();
        if (lower.includes("ราคา")) return "pricing";
        if (lower.includes("เปิด") || lower.includes("ปิด")) return "pitch_status";
        if (lower.includes("จอง")) return "booking";
        if (lower.includes("ว่าง")) return "availability";
        return "unknown";
    }

};

export default webhookService;
