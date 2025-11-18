import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.config.js";
import adminKeyService from "../../services/admin/admin.service.js";

const adminKeyController = {};

// GET /api/admin/keys/:inviteKey
adminKeyController.getAllKeys = async (req, res, next) => {
    try {
        const inviteKey = "admin69e55a719beb06394d7f670fdd334e68";
        const keyWithoutAdmin = inviteKey.slice(5);
        console.log(keyWithoutAdmin); // 69e55a719beb06394d7f670fdd334e68

        const key = await adminKeyService.getKeyByValue(keyWithoutAdmin);

        if (!key) {
            return res.status(404).json({ success: false, message: "Key not found" });
        }

        res.json({ success: true, key });
    } catch (err) {
        next(err);
    }
};

adminKeyController.registerAdmin = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phoneNumber, role } = req.body;

        if (!email || !password || !firstName || !lastName || !phoneNumber || !role) {
            throw createHttpError(400, "Missing required fields");
        }

        // ตรวจสอบว่ามี email อยู่แล้วหรือไม่
        const existingUser = await prisma.admin.findUnique({ where: { email } });
        if (existingUser) {
            throw createHttpError(400, "Email already exists");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // สร้าง user ใหม่
        const newUser = await prisma.admin.create({
            data: {
                email,
                passwordHash: hashedPassword,
                firstName,
                lastName,
                phoneNumber,
                role, // STAFF หรือ SUPER_ADMIN
            },
        });

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/admin/keys
adminKeyController.createKey = async (req, res, next) => {
    try {
        const { roleToGrant } = req.body;
        const adminId = req.user?.id || null; // ถ้าใช้ middleware auth

        const newKey = await adminKeyService.createKey(adminId, roleToGrant);

        res.status(201).json({
            success: true,
            key: newKey,
        });
    } catch (err) {
        next(err);
    }
};

export default adminKeyController;
