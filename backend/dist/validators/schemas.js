"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionSchema = exports.calculateSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// ==================== AUTH ====================
exports.registerSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username phải có ít nhất 3 ký tự")
        .max(50, "Username tối đa 50 ký tự"),
    email: zod_1.z
        .string()
        .email("Email không hợp lệ")
        .max(100, "Email tối đa 100 ký tự"),
    password: zod_1.z
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .max(100, "Mật khẩu tối đa 100 ký tự"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email không hợp lệ"),
    password: zod_1.z.string().min(1, "Vui lòng nhập mật khẩu"),
});
// ==================== SESSION ====================
/** Schema cho dữ liệu tính toán bắt buộc */
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
    tmm_t1_ratio: zod_1.z
        .number({ message: "Thiếu Tmm/T1" })
        .positive("Tmm/T1 phải > 0"),
})
    .refine((data) => data.t1 + data.t2 > 0, {
    message: "t1 + t2 phải > 0",
    path: ["t1"],
});
/** Schema cho input lưu trong session (cho phép thêm field phụ) */
const sessionInputSchema = exports.calculateSchema.passthrough();
/** Schema cho result lưu trong session (cho phép thêm field phụ) */
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
/** Schema tạo phiên tính toán (lưu JSON input + result) */
exports.createSessionSchema = zod_1.z.object({
    session_name: zod_1.z.string().min(1, "Tên phiên không được để trống").max(255),
    input: sessionInputSchema,
    result: sessionResultSchema,
});
//# sourceMappingURL=schemas.js.map