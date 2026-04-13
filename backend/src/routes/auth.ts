import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { generateToken, authMiddleware, AuthRequest } from "../middleware/auth";
import { registerSchema, loginSchema } from "../validators/schemas";

const router = Router();

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate input
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Dữ liệu không hợp lệ",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { username, email, password } = parsed.data;

    // 2. Kiểm tra email/username đã tồn tại chưa
    const existing = await prisma.user.findFirst({
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
    const password_hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, email, password_hash },
    });

    // 4. Tạo token và trả về
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
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * POST /api/auth/login
 * Đăng nhập
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate input
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Dữ liệu không hợp lệ",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parsed.data;

    // 2. Tìm user theo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
      return;
    }
    // 3. So sánh password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
      return;
    }

    // 4. Tạo token
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
