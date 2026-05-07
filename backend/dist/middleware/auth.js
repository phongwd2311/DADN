"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "geardrive-default-secret-change-me";
/**
 * Tạo JWT token cho user
 */
function generateToken(userId, email) {
    return jsonwebtoken_1.default.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}
/**
 * Middleware: Kiểm tra JWT token từ header Authorization
 * Sử dụng: router.get('/protected', authMiddleware, handler)
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Không tìm thấy token. Vui lòng đăng nhập." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // lưu vào req.user để dùng các router khác mà không cần phải gửi id từ frontend lên
        req.user = decoded;
        // cho phép đi vào router chính
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
        return;
    }
}
//# sourceMappingURL=auth.js.map