"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
const LOGIN_ERROR_MESSAGE = "Email hoặc mật khẩu không chính xác";
const FORGOT_PASSWORD_GENERIC_MESSAGE = "Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu";
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post("/register", async (req, res) => {
    try {
        const parsed = schemas_1.registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Dữ liệu không hợp lệ",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { username, email, password } = parsed.data;
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
        const password_hash = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma_1.prisma.user.create({
            data: { username, email, password_hash },
        });
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
        console.error("Register error:", err);
        res.status(500).json({
            error: "Lỗi server chi tiết",
            message: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }
});
/**
 * POST /api/auth/login
 * Đăng nhập
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body ?? {};
        if (typeof email !== "string" ||
            email.trim() === "" ||
            typeof password !== "string" ||
            password.trim() === "") {
            res.status(400).json({
                error: "Vui lòng nhập đầy đủ Email và Mật khẩu",
            });
            return;
        }
        const parsed = schemas_1.loginSchema.safeParse({
            email: email.trim(),
            password,
        });
        if (!parsed.success) {
            res.status(400).json({
                error: "Dữ liệu không hợp lệ",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: parsed.data.email },
        });
        if (!user) {
            res.status(401).json({ error: LOGIN_ERROR_MESSAGE });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(parsed.data.password, user.password_hash);
        if (!isValid) {
            res.status(401).json({ error: LOGIN_ERROR_MESSAGE });
            return;
        }
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
 * POST /api/auth/logout
 * Đăng xuất (revoke token hiện tại)
 */
router.post("/logout", auth_1.authMiddleware, async (req, res) => {
    try {
        const jti = req.user?.jti;
        const exp = req.user?.exp;
        if (!jti || !exp) {
            res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
            return;
        }
        await prisma_1.prisma.revokedToken.upsert({
            where: { jti },
            create: {
                jti,
                expires_at: new Date(exp * 1000),
            },
            update: {
                expires_at: new Date(exp * 1000),
                revoked_at: new Date(),
            },
        });
        res.json({ message: "Đăng xuất thành công" });
    }
    catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
/**
 * POST /api/auth/forgot-password
 * Tạo token đặt lại mật khẩu
 */
router.post("/forgot-password", async (req, res) => {
    try {
        const parsed = schemas_1.forgotPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Dữ liệu không hợp lệ",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: parsed.data.email },
            select: { user_id: true },
        });
        let resetToken = null;
        if (user) {
            resetToken = (0, crypto_1.randomBytes)(32).toString("hex");
            const tokenHash = (0, crypto_1.createHash)("sha256").update(resetToken).digest("hex");
            await prisma_1.prisma.passwordResetToken.create({
                data: {
                    user_id: user.user_id,
                    token_hash: tokenHash,
                    expires_at: new Date(Date.now() + RESET_TOKEN_TTL_MS),
                },
            });
        }
        res.json({
            message: FORGOT_PASSWORD_GENERIC_MESSAGE,
            ...(process.env.NODE_ENV !== "production" && resetToken
                ? { reset_token: resetToken }
                : {}),
        });
    }
    catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
/**
 * POST /api/auth/reset-password
 * Đặt lại mật khẩu bằng reset token
 */
router.post("/reset-password", async (req, res) => {
    try {
        const parsed = schemas_1.resetPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Dữ liệu không hợp lệ",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const tokenHash = (0, crypto_1.createHash)("sha256").update(parsed.data.token).digest("hex");
        const resetRecord = await prisma_1.prisma.passwordResetToken.findUnique({
            where: { token_hash: tokenHash },
            select: {
                id: true,
                user_id: true,
                expires_at: true,
                used_at: true,
            },
        });
        if (!resetRecord || resetRecord.used_at || resetRecord.expires_at <= new Date()) {
            res.status(400).json({
                error: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
            });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(parsed.data.newPassword, 12);
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.user.update({
                where: { user_id: resetRecord.user_id },
                data: { password_hash: passwordHash },
            }),
            prisma_1.prisma.passwordResetToken.update({
                where: { id: resetRecord.id },
                data: { used_at: new Date() },
            }),
        ]);
        res.json({ message: "Đặt lại mật khẩu thành công" });
    }
    catch (err) {
        console.error("Reset password error:", err);
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