"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post("/register", async (req, res) => {
    try {
        // 1. Validate input
        const parsed = schemas_1.registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Dữ liệu không hợp lệ",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { username, email, password } = parsed.data;
        // 2. Kiểm tra email/username đã tồn tại chưa
        const existing = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existing) {
            res.status(409).json({
                error: existing.email === email
                    ? "Email đã được sử dụng"
                    : "Username đã được sử dụng",
            });
            return;
        }
        // 3. Hash password và tạo user
        const password_hash = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma_1.prisma.user.create({
            data: { username, email, password_hash },
        });
        // 4. Tạo token và trả về
        const token = (0, auth_1.generateToken)(user.user_id, user.email);
        res.status(201).json({
            message: "Đăng ký thành công",
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error("DEBUG - Register Error Details:", err);
        res.status(500).json({
            error: "Lỗi server chi tiết",
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});
/**
 * POST /api/auth/login
 * Đăng nhập
 */
router.post("/login", async (req, res) => {
    try {
        // 1. Validate input
        const parsed = schemas_1.loginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Dữ liệu không hợp lệ",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { email, password } = parsed.data;
        // 2. Tìm user theo email
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
            return;
        }
        // 3. So sánh password
        const isValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValid) {
            res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
            return;
        }
        // 4. Tạo token
        const token = (0, auth_1.generateToken)(user.user_id, user.email);
        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (cần JWT token)
 */
router.get("/me", auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { user_id: req.user.userId },
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                join_date: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: "Không tìm thấy người dùng" });
            return;
        }
        res.json({ user });
    }
    catch (err) {
        console.error("Get me error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map