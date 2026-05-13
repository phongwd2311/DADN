import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        jti?: string;
        exp?: number;
    };
}
/**
 * Tạo JWT token cho user
 */
export declare function generateToken(userId: number, email: string): string;
/**
 * Middleware: Kiểm tra JWT token từ header Authorization
 * Sử dụng: router.get('/protected', authMiddleware, handler)
 */
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map