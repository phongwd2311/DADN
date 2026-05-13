import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { prisma } from "../lib/prisma";
import { generateToken, authMiddleware, AuthRequest } from "../middleware/auth";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/schemas";

const router = Router();

const LOGIN_ERROR_MESSAGE = "Email hoặc mật khẩu không chính xác";
const FORGOT_PASSWORD_GENERIC_MESSAGE =
  "Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu";
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Dữ liệu không hợp lệ",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { username, email, password } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      res.status(409).json({
        error:
          existing.email === email
            ? "Email đã được sử dụng"
            : "Username đã được sử dụng",
      });
      return;
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, email, password_hash },
    });

    const token = generateToken(user.user_id, user.email);

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
  } catch (err: any) {
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
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body ?? {};
    if (
      typeof email !== "string" ||
      email.trim() === "" ||
      typeof password !== "string" ||
      password.trim() === ""
    ) {
      res.status(400).json({
        error: "Vui lòng nhập đầy đủ Email và Mật khẩu",
      });
      return;
    }

    const parsed = loginSchema.safeParse({
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

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (!user) {
      res.status(401).json({ error: LOGIN_ERROR_MESSAGE });
      return;
    }

    const isValid = await bcrypt.compare(parsed.data.password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: LOGIN_ERROR_MESSAGE });
      return;
    }

    const token = generateToken(user.user_id, user.email);

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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * POST /api/auth/logout
 * Đăng xuất (revoke token hiện tại)
 */
router.post("/logout", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jti = req.user?.jti;
    const exp = req.user?.exp;

    if (!jti || !exp) {
      res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
      return;
    }

    await prisma.revokedToken.upsert({
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
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * POST /api/auth/forgot-password
 * Tạo token đặt lại mật khẩu
 */
router.post("/forgot-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Dữ liệu không hợp lệ",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { user_id: true },
    });

    let resetToken: string | null = null;

    if (user) {
      resetToken = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(resetToken).digest("hex");

      await prisma.passwordResetToken.create({
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
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * POST /api/auth/reset-password
 * Đặt lại mật khẩu bằng reset token
 */
router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Dữ liệu không hợp lệ",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");

    const resetRecord = await prisma.passwordResetToken.findUnique({
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

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { user_id: resetRecord.user_id },
        data: { password_hash: passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { used_at: new Date() },
      }),
    ]);

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (cần JWT token)
 */
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.user!.userId },
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
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
