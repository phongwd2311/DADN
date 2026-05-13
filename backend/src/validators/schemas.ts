import { z } from "zod";

// ==================== AUTH ====================

const passwordSchema = z
  .string()
  .min(8, "Mật khẩu không phù hợp")
  .max(20, "Mật khẩu không phù hợp")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Mật khẩu không phù hợp");

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(50, "Username tối đa 50 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .max(100, "Email tối đa 100 ký tự"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token không hợp lệ"),
  newPassword: passwordSchema,
});

// ==================== SESSION ====================

export const calculateSchema = z
  .object({
    F: z.number({ message: "Thiếu lực vòng F" }).positive("F phải > 0"),
    v: z.number({ message: "Thiếu vận tốc v" }).positive("v phải > 0"),
    D: z.number({ message: "Thiếu đường kính D" }).positive("D phải > 0"),
    t1: z.number({ message: "Thiếu t1" }).nonnegative("t1 phải >= 0"),
    T1_ratio: z.number({ message: "Thiếu T1_ratio" }).positive("T1_ratio phải > 0"),
    t2: z.number({ message: "Thiếu t2" }).nonnegative("t2 phải >= 0"),
    T2_ratio: z.number({ message: "Thiếu T2_ratio" }).positive("T2_ratio phải > 0"),
    uh: z.number({ message: "Thiếu uh" }).positive("uh phải > 0"),
    gearbox_type: z.enum(["KHAI_TRIEN", "PHAN_DOI"] as const, {
      message: "Thiếu loại hộp giảm tốc",
    }),
    external_drive_type: z
      .enum(["CHAIN", "BELT", "GEAR", "NONE"] as const, {
        message: "Loại bộ truyền ngoài không hợp lệ",
      })
      .optional(),
    chain_layout: z
      .enum(["HORIZONTAL_OR_LT40", "STEEP_GT40"] as const, {
        message: "Cấu hình bộ truyền xích không hợp lệ",
      })
      .optional(),
    tmm_t1_ratio: z
      .number({ message: "Thiếu Tmm/T1" })
      .positive("Tmm/T1 phải > 0"),
  })
  .refine((data) => data.t1 + data.t2 > 0, {
    message: "t1 + t2 phải > 0",
    path: ["t1"],
  });

const sessionInputSchema = calculateSchema.passthrough();

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

export const createSessionSchema = z.object({
  session_name: z.string().min(1, "Tên phiên không được để trống").max(255),
  input: sessionInputSchema,
  result: sessionResultSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
