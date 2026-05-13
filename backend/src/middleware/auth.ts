import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    jti?: string;
    exp?: number;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "geardrive-default-secret-change-me";

/**
 * Tạo JWT token cho user
 */
export function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: "7d",
    jwtid: randomUUID(),
  });
}

/**
 * Middleware: Kiểm tra JWT token từ header Authorization
 * Sử dụng: router.get('/protected', authMiddleware, handler)
 */
export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Không tìm thấy token. Vui lòng đăng nhập." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      jti?: string;
      exp?: number;
    };

    if (!decoded.jti) {
      res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
      return;
    }

    const revokedToken = await prisma.revokedToken.findUnique({
      where: { jti: decoded.jti },
      select: { jti: true },
    });

    if (revokedToken) {
      res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
      return;
    }

    // lưu vào req.user để dùng các router khác mà không cần phải gửi id từ frontend lên
    req.user = decoded;
    // cho phép đi vào router chính
    next();
  } catch (err) {
    res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
    return;
  }
}
