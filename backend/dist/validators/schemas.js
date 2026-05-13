"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionSchema = exports.calculateSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// ==================== AUTH ====================
const passwordSchema = zod_1.z
    .string()
    .min(8, "Mật khẩu không phù hợp")
    .max(20, "Mật khẩu không phù hợp")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Mật khẩu không phù hợp");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username phải có ít nhất 3 ký tự")
        .max(50, "Username tối đa 50 ký tự"),
    email: zod_1.z
        .string()
        .email("Email không hợp lệ")
        .max(100, "Email tối đa 100 ký tự"),
    password: passwordSchema,
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email không hợp lệ"),
    password: zod_1.z.string().min(1, "Vui lòng nhập mật khẩu"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email không hợp lệ"),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token không hợp lệ"),
    newPassword: passwordSchema,
});
// ==================== SESSION ====================
exports.calculateSchema = zod_1.z
    .object({
    F: zod_1.z.number({ message: "Thiếu lực vòng F" }).positive("F phải > 0"),
    v: zod_1.z.number({ message: "Thiếu vận tốc v" }).positive("v phải > 0"),
    D: zod_1.z.number({ message: "Thiếu đường kính D" }).positive("D phải > 0"),
    t1: zod_1.z.number({ message: "Thiếu t1" }).nonnegative("t1 phải >= 0"),
    T1_ratio: zod_1.z.number({ message: "Thiếu T1_ratio" }).positive("T1_ratio phải > 0"),
    t2: zod_1.z.number({ message: "Thiếu t2" }).nonnegative("t2 phải >= 0"),
    T2_ratio: zod_1.z.number({ message: "Thiếu T2_ratio" }).positive("T2_ratio phải > 0"),
    uh: zod_1.z.number({ message: "Thiếu uh" }).positive("uh phải > 0"),
    gearbox_type: zod_1.z.enum(["KHAI_TRIEN", "PHAN_DOI"], {
        message: "Thiếu loại hộp giảm tốc",
    }),
    external_drive_type: zod_1.z
        .enum(["CHAIN", "BELT", "GEAR", "NONE"], {
        message: "Loại bộ truyền ngoài không hợp lệ",
    })
        .optional(),
    chain_layout: zod_1.z
        .enum(["HORIZONTAL_OR_LT40", "STEEP_GT40"], {
        message: "Cấu hình bộ truyền xích không hợp lệ",
    })
        .optional(),
    tmm_t1_ratio: zod_1.z
        .number({ message: "Thiếu Tmm/T1" })
        .positive("Tmm/T1 phải > 0"),
})
    .refine((data) => data.t1 + data.t2 > 0, {
    message: "t1 + t2 phải > 0",
    path: ["t1"],
});
const sessionInputSchema = exports.calculateSchema.passthrough();
const sessionResultSchema = zod_1.z
    .object({
    Plv: zod_1.z.number({ message: "Thiếu Plv" }),
    Ptd: zod_1.z.number({ message: "Thiếu Ptd" }),
    eta: zod_1.z.number({ message: "Thiếu eta" }),
    Pct: zod_1.z.number({ message: "Thiếu Pct" }),
    nlv: zod_1.z.number({ message: "Thiếu nlv" }),
    nsb: zod_1.z.number({ message: "Thiếu nsb" }),
    usb: zod_1.z.number({ message: "Thiếu usb" }),
})
    .passthrough();
exports.createSessionSchema = zod_1.z.object({
    session_name: zod_1.z.string().min(1, "Tên phiên không được để trống").max(255),
    input: sessionInputSchema,
    result: sessionResultSchema,
});
//# sourceMappingURL=schemas.js.map