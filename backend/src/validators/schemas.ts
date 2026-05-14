import { z } from "zod";

// ==================== AUTH ====================

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(50, "Username tối đa 50 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .max(100, "Email tối đa 100 ký tự"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu tối đa 100 ký tự"),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

// ==================== SESSION ====================
/** Schema cho dữ liệu tính toán bắt buộc */
export const calculateSchema = z
  .object({
    F: z.number({ message: "Thiếu lực vòng F" }).positive("F phải > 0"),
    v: z.number({ message: "Thiếu vận tốc v" }).positive("v phải > 0"),
    D: z.number({ message: "Thiếu đường kính D" }).positive("D phải > 0"),
    L: z.number({ message: "Thiếu thời gian phục vụ L" }).positive("L phải > 0").optional(),
    t1: z.number({ message: "Thiếu t1" }).nonnegative("t1 phải >= 0"),
    T1_ratio: z.number({ message: "Thiếu T1_ratio" }).positive("T1_ratio phải > 0"),
    t2: z.number({ message: "Thiếu t2" }).nonnegative("t2 phải >= 0"),
    T2_ratio: z.number({ message: "Thiếu T2_ratio" }).positive("T2_ratio phải > 0"),
    uh: z.number({ message: "Thiếu uh" }).positive("uh phải > 0"),
    gearbox_type: z.enum(["KHAI_TRIEN", "PHAN_DOI"] as const, {
      message: "Thiếu loại hộp giảm tốc",
    }),
    tmm_t1_ratio: z
      .number({ message: "Thiếu Tmm/T1" })
      .positive("Tmm/T1 phải > 0"),
    conditions: z.object({
      k0_type: z.number({ message: "k0_type phải là số" }).int().positive(),
      ka_type: z.number({ message: "ka_type phải là số" }).int().positive(),
      kdc_type: z.number({ message: "kdc_type phải là số" }).int().positive(),
      kd_type: z.number({ message: "kd_type phải là số" }).int().positive(),
      kc_type: z.number({ message: "kc_type phải là số" }).int().positive(),
      kbt_type: z.number({ message: "kbt_type phải là số" }).int().positive(),
    }).optional(),
  })
  .refine((data) => data.t1 + data.t2 > 0, {
    message: "t1 + t2 phải > 0",
    path: ["t1"],
  });

/** Schema cho input lưu trong session (cho phép thêm field phụ) */
const sessionInputSchema = calculateSchema.passthrough();

/** Schema cho result lưu trong session (cho phép thêm field phụ) */
const sessionResultSchema = z
  .object({
    Plv: z.number({ message: "Thiếu Plv" }),
    Ptd: z.number({ message: "Thiếu Ptd" }),
    eta: z.number({ message: "Thiếu eta" }),
    Pct: z.number({ message: "Thiếu Pct" }),
    nlv: z.number({ message: "Thiếu nlv" }),
    nsb: z.number({ message: "Thiếu nsb" }),
    usb: z.number({ message: "Thiếu usb" }),
  })
  .passthrough();

/** Schema tạo phiên tính toán (lưu JSON input + result) */
export const createSessionSchema = z.object({
  session_name: z
    .string()
    .min(1, "Tên phiên không được để trống")
    .max(100, "Tên phiên tối đa 100 ký tự")
    .transform((s) => s.trim())
    .refine(
      (s) => !/[<>/"';#]/.test(s),
      "Tên phiên không được chứa ký tự đặc biệt: < > / \" ' ; #"
    ),
  input: sessionInputSchema,
  result: sessionResultSchema,
});

export const updateSessionSchema = z.object({
  session_name: z
    .string()
    .min(1, "Tên phiên không được để trống")
    .max(100, "Tên phiên tối đa 100 ký tự")
    .transform((s) => s.trim())
    .refine(
      (s) => !/[<>/"';#]/.test(s),
      "Tên phiên không được chứa ký tự đặc biệt: < > / \" ' ; #"
    )
    .optional(),
  status: z
    .enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "FAILED"], {
      message: "Status không hợp lệ",
    })
    .optional(),
  input: sessionInputSchema.optional(),
  result: sessionResultSchema.optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
