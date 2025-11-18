import axios from 'axios'
import { getUserProfile } from '../../services/webhook/get-line-user.service.js'
import webhookService from '../../services/webhook/webhook.service.js'
import prisma from '../../config/prisma.config.js'

const webhookController = {} // Primary object to export

// ====================================================================
// ⭐ LINE API (reply message) - Defined first as it's a simple helper
// ====================================================================
const sendLineReply = (replyToken, text) => {
    return axios.post(
        "https://api.line.me/v2/bot/message/reply",
        {
            replyToken,
            messages: [{ type: "text", text }]
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MESSAGE_API}`
            }
        }
    )
}

// ====================================================================
// ⭐ INDIVIDUAL REPLY FUNCTIONS - Defined as standard functions for clarity
// ====================================================================

// 7) Unknown message
const replyUnknown = () => {
    // ... (content of replyUnknown) ...
    return "ผมยังไม่เข้าใจข้อความนี้ครับ 😅\nคุณสามารถพิมพ์:\n• จองสนาม\n• สนามที่มี\n• ราคา\n• ตารางว่าง\n• สนามเปิดไหม\n• วิธีใช้งาน\n\nผมพร้อมช่วยเสมอครับ 😊"
}
// 6) โปรโมชัน
const replyPromotion = () => {
    return "ตอนนี้ยังไม่มีโปรโมชั่นนะครับ แต่สามารถติดตามได้เรื่อย ๆ ในห้องนี้เลยครับ 🎉"
}
// 5) วิธีใช้งานระบบ
const replyHowItWork = () => {
    // ... (content of replyHowItWork) ...
    return (
        "นี่คือวิธีใช้งานระบบครับ 🏟️\n\n" +
        "1️⃣ พิมพ์ชื่อสนามที่อยากจอง เช่น 'จองสนาม A'\n" +
        "2️⃣ ถ้าสนามเปิด ผมจะสร้างรายการจองสถานะ PENDING ให้ทันที\n" +
        "3️⃣ แอดมินจะติดต่อกลับเพื่อยืนยันอีกครั้ง\n\n" +
        "สามารถถามราคา ตารางเวลา หรือขอดูสนามทั้งหมดได้ครับ 😊"
    )
}
// 4) สถานะเปิด/ปิด
const replyPitchStatus = async (pitchName) => {
    if (!pitchName) return "สนามไหนที่คุณต้องการตรวจสอบสถานะครับ?"
    const pitch = await webhookService.getStatusByName(pitchName)
    return pitch.status === "OPEN"
        ? `สนาม ${pitch.name} เปิดให้บริการครับ`
        : `สนาม ${pitch.name} ปิดให้บริการตอนนี้ครับ`
}
// 3) ตารางรอบว่าง
const replyAvailability = async (pitchName) => {
    if (!pitchName)
        return "ต้องการดูรอบว่างของสนามไหนครับ? เช่น 'สนาม A ว่างไหม'"
    return `ขออภัยครับ ระบบเช็คตารางว่างยังอยู่ระหว่างพัฒนา 🙏`
}
// 2) ราคา
const replyPricing = async () => {
    const fields = await webhookService.getAllPitches()
    if (!fields.length) return "ยังไม่มีข้อมูลราคาในระบบครับ"
    const text = fields
        .map(f => `• ${f.name} — ${f.hourlyRate} บาท/ชั่วโมง`)
        .join("\n")
    return `📌 อัตราค่าบริการสนาม:\n\n${text}`
}
// 1) รายการสนามทั้งหมด
const replyListFields = async () => {
    const fields = await webhookService.getAllPitches()
    if (!fields.length) return "ตอนนี้ยังไม่มีข้อมูลสนามในระบบครับ"
    const list = fields.map(f => `• ${f.name}`).join("\n")
    return `สนามที่มีทั้งหมดในตอนนี้คือ:\n\n${list}\n\nสนใจจองสนามไหนแจ้งผมได้เลยครับ 🏟️`
}


// ====================================================================
// ⭐ BOOKING LOGIC (The core business logic)
// ====================================================================
const handleBookingIntent = async (pitchName, userId) => {
    const pendingBooking = await webhookService.getOrCreatePendingBooking(userId);
    const user = await webhookService.getByLineId(userId);
    let missingFields = [];

    if (!user.displayName) missingFields.push("ชื่อผู้จอง");
    if (!pitchName) missingFields.push("สนามที่ต้องการจอง");
    if (!pendingBooking?.startTime || !pendingBooking?.endTime) missingFields.push("เวลาที่ต้องการจอง");

    if (missingFields.length > 0) {
        const firstMissing = missingFields[0];
        if (firstMissing === "ชื่อผู้จอง") return "รบกวนแจ้ง **ชื่อผู้จอง** เพิ่มเติมด้วยครับ";
        if (firstMissing === "เวลาที่ต้องการจอง") {
            const bookingPitchName = pitchName || pendingBooking?.pitchName || 'สนามที่คุณเลือก';
            return `คุณต้องการจอง **${bookingPitchName}** เวลาไหนครับ? เช่น 18:00-19:00`;
        }
        return `รบกวนแจ้งข้อมูลเพิ่มเติมค่ะ: ${missingFields.join(", ")}`;
    }

    // ✅ ข้อมูลครบ → สร้าง booking
    const result = await webhookService.createBooking({
        userId: user.id,
        pitchName,
        startTime: pendingBooking.startTime,
        endTime: pendingBooking.endTime
    });

    return `✅ จองเรียบร้อยแล้วครับ!
สนาม: ${pitchName}
วันที่: ${new Date(pendingBooking.startTime).toLocaleDateString("th-TH")}
เวลา: ${new Date(pendingBooking.startTime).toLocaleTimeString("th-TH")} - ${new Date(pendingBooking.endTime).toLocaleTimeString("th-TH")}
รอแอดมินติดต่อยืนยันนะครับ 😊`;
};



// ====================================================================
// ⭐ INTENT HANDLER — จัดการทุกประเภท intent
// ====================================================================
const handleIntent = async (intent, pitchName, userId) => {
    switch (intent) {
        case "greeting":
            return "สวัสดีครับ 👋 ต้องการจองสนามหรือสอบถามข้อมูลอะไรไหมครับ?"
        case "pricing":
            return await replyPricing()
        case "pitch_status":
            return await replyPitchStatus(pitchName)
        case "booking":
            return await handleBookingIntent(pitchName, userId)
        default:
            return replyUnknown()
    }
}

// ====================================================================
// ⭐ MAIN EVENT ROUTER — เลือก handler ตามประเภท message
// ====================================================================
const processEvent = async (event, lineUserId, displayName) => {
    // Text message
    if (event.type === "message" && event.message.type === "text") {
        const text = event.message.text.trim()
        const intent = await webhookService.defineType(text)
        const pitchData = await webhookService.getAllPitches()
        const pitchList = pitchData.map(pitch => pitch.name)

        // console.log('event', event)

        const lowerText = text.toLowerCase()

        const pitchChoosed = pitchList.find(pitchName => {
            const lowerPitchName = pitchName.toLowerCase()
            return lowerText.includes(lowerPitchName) || lowerText.includes(`สนาม ${lowerPitchName}`)
        })
        if (intent === "booking") {
            const { startTime, endTime } = await webhookService.extractDateTime(text);

            console.log("⏰ Extracted:", startTime, endTime);

            // ถ้ายังไม่มีเวลา → ให้ถามเพิ่มก่อน ห้ามสร้าง Pending Booking
            if (!startTime || !endTime) {
                return "รบกวนแจ้งเวลาในการจองด้วยครับ เช่น 18:00-19:00";
            }

            // สร้าง Pending Booking เมื่อมีเวลาแล้วเท่านั้น
            await webhookService.createPendingBooking(lineUserId, {
                pitchName: pitchChoosed,
                startTime,
                endTime,
            });
        }




        console.log("🧠 INTENT:", intent)
        console.log("⚽ Pitch:", pitchChoosed || "None")
        console.log('lineUserId', lineUserId)

        return handleIntent(intent, pitchChoosed, lineUserId)
    }

    // Sticker
    if (event.type === "message" && event.message.type === "sticker") {
        return "ส่งสติกเกอร์มาน่ารักจังครับ 😄"
    }

    // Postback
    if (event.type === "postback") {
        return `ได้รับข้อมูลจากปุ่ม: ${event.postback?.data}`
    }

    // Unknown
    return "ข้อความรูปแบบนี้ยังไม่รองรับนะครับ 🙏"
}


// ====================================================================
// ⭐ PRIMARY CONTROLLER FUNCTION (The entry point)
// ====================================================================

webhookController.replyMessage = async (req, res) => {
    try {
        const event = req.body.events?.[0]
        if (!event) return res.status(400).json({ error: 'No event received' })

        const lineUserId = event.source?.userId
        const replyToken = event.replyToken
        if (!lineUserId || !replyToken)
            return res.status(400).json({ error: 'Missing metadata' })

        // ------------------------------------
        // 1) GET LINE PROFILE (best effort)
        // ------------------------------------
        let displayName = "User"
        let profileImg = null
        // ... (profile fetch logic) ...
        try {
            const userData = await getUserProfile(lineUserId)
            displayName = userData?.displayName || "User"
            profileImg = userData?.pictureUrl || null
        } catch (e) {
            console.warn("⚠ Cannot fetch LINE profile (blocked?)")
        }


        // ------------------------------------
        // 2) UPSERT USER IN DATABASE
        // ------------------------------------
        const userCreated = await webhookService.createLineUserData(
            lineUserId,
            displayName,
            profileImg
        )

        // ------------------------------------
        // 3) HANDLE MESSAGE
        // ------------------------------------
        // 💡 Called directly since processEvent is now defined globally
        const replyText = await processEvent(event, lineUserId, displayName)

        // ------------------------------------
        // 4) REPLY TO LINE
        // ------------------------------------
        // 💡 Called directly since sendLineReply is now defined globally
        await sendLineReply(replyToken, replyText)

        return res.status(200).json({
            success: true,
            message: replyText,
            user: userCreated,
        })

    } catch (error) {
        console.error("❌ Webhook Error:", error)
        return res.status(500).json({ error: "Internal error", details: error.message })
    }
}

export default webhookController