import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Mở rộng Request để gắn thông tin user sau khi xác thực
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "geardrive-default-secret-change-me";

/**
 * Tạo JWT token cho user
 */
export function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Middleware: Kiểm tra JWT token từ header Authorization
 * Sử dụng: router.get('/protected', authMiddleware, handler)
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Không tìm thấy token. Vui lòng đăng nhập." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
    return;
  }
}
