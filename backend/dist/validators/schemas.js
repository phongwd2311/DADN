"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSessionSchema = exports.createSessionSchema = exports.calculateSchema = exports.loginSchema = exports.registerSchema = void 0;
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
    L: zod_1.z.number({ message: "Thiếu thời gian phục vụ L" }).positive("L phải > 0").optional(),
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
    conditions: zod_1.z.object({
        k0_type: zod_1.z.number({ message: "k0_type phải là số" }).int().positive(),
        ka_type: zod_1.z.number({ message: "ka_type phải là số" }).int().positive(),
        kdc_type: zod_1.z.number({ message: "kdc_type phải là số" }).int().positive(),
        kd_type: zod_1.z.number({ message: "kd_type phải là số" }).int().positive(),
        kc_type: zod_1.z.number({ message: "kc_type phải là số" }).int().positive(),
        kbt_type: zod_1.z.number({ message: "kbt_type phải là số" }).int().positive(),
    }).optional(),
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
    session_name: zod_1.z
        .string()
        .min(1, "Tên phiên không được để trống")
        .max(100, "Tên phiên tối đa 100 ký tự")
        .transform((s) => s.trim())
        .refine((s) => !/[<>/"';#]/.test(s), "Tên phiên không được chứa ký tự đặc biệt: < > / \" ' ; #"),
    input: sessionInputSchema,
    result: sessionResultSchema,
});
exports.updateSessionSchema = zod_1.z.object({
    session_name: zod_1.z
        .string()
        .min(1, "Tên phiên không được để trống")
        .max(100, "Tên phiên tối đa 100 ký tự")
        .transform((s) => s.trim())
        .refine((s) => !/[<>/"';#]/.test(s), "Tên phiên không được chứa ký tự đặc biệt: < > / \" ' ; #")
        .optional(),
    status: zod_1.z
        .enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "FAILED"], {
        message: "Status không hợp lệ",
    })
        .optional(),
    input: sessionInputSchema.optional(),
    result: sessionResultSchema.optional(),
});
//# sourceMappingURL=schemas.js.map