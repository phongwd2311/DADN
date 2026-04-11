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

/** Schema cho thông số đầu vào thiết kế */
const designInputSchema = z.object({
  force_f: z.number().optional(),
  velocity_v: z.number().optional(),
  diameter_d: z.number().optional(),
  lifespan_l: z.number().optional(),
  t1_percent: z.number().optional(),
  t1_torque: z.number().optional(),
  t2_percent: z.number().optional(),
  t2_torque: z.number().optional(),
});

/** Schema cho thông số từng trục */
const shaftSchema = z.object({
  shaft_order: z.number(),
  power_p: z.number().optional(),
  speed_n: z.number().optional(),
  torque_t: z.number().optional(),
  material: z.string().optional(),
  diameter_d: z.number().optional(),
});

/** Schema cho ổ lăn */
const bearingSchema = z.object({
  position: z.string().optional(),
  bearing_model: z.string().optional(),
  inner_diameter_d: z.number().optional(),
  dynamic_capacity_c: z.number().optional(),
  calculated_life_lh: z.number().optional(),
});

/** Schema cho bánh răng */
const gearDriveSchema = z.object({
  gear_type: z.string().optional(),
  module: z.number().optional(),
  teeth_number: z.number().optional(),
  center_distance: z.number().optional(),
});

/** Schema cho vỏ hộp */
const housingSchema = z.object({
  material: z.string().optional(),
  wall_thickness: z.number().optional(),
  distance_center: z.number().optional(),
});

/** Schema cho kết quả tổng hợp */
const designResultSchema = z.object({
  equivalent_power: z.number().optional(),
  total_efficiency: z.number().optional(),
  required_power_pct: z.number().optional(),
  total_ratio_ut: z.number().optional(),
  u1_ratio: z.number().optional(),
  u2_ratio: z.number().optional(),
  shafts: z.array(shaftSchema).optional(),
  bearings: z.array(bearingSchema).optional(),
  gear_drives: z.array(gearDriveSchema).optional(),
  housings: z.array(housingSchema).optional(),
});

/** Schema tạo phiên tính toán (gộp Input + Result) */
export const createSessionSchema = z.object({
  session_name: z.string().min(1, "Tên phiên không được để trống").max(255),
  input: designInputSchema.optional(),
  result: designResultSchema.optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
