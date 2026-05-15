import { z } from "zod";

// ==================== AUTH ====================

const passwordSchema = z
  .string()
  .min(8, "Mat khau khong phu hop")
  .max(20, "Mat khau khong phu hop")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Mat khau khong phu hop");

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username phai co it nhat 3 ky tu")
    .max(50, "Username toi da 50 ky tu"),
  email: z
    .string()
    .email("Email khong hop le")
    .max(100, "Email toi da 100 ky tu"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Email khong hop le"),
  password: z.string().min(1, "Vui long nhap mat khau"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email khong hop le"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token khong hop le"),
  newPassword: passwordSchema,
});

// ==================== SESSION ====================

const normalizeNumericInput = (value: unknown): unknown => {
  if (typeof value !== "string") return value;
  const sanitized = value.trim().replace(",", ".").replace(/\s+/g, "");
  if (sanitized.length === 0) return value;
  const numeric = Number(sanitized);
  return Number.isFinite(numeric) ? numeric : value;
};

const numberField = (requiredMessage: string) =>
  z.preprocess(normalizeNumericInput, z.number({ message: requiredMessage }));

const positiveNumberField = (requiredMessage: string, positiveMessage: string) =>
  z.preprocess(
    normalizeNumericInput,
    z.number({ message: requiredMessage }).positive(positiveMessage),
  );

const nonnegativeNumberField = (requiredMessage: string, nonnegativeMessage: string) =>
  z.preprocess(
    normalizeNumericInput,
    z.number({ message: requiredMessage }).nonnegative(nonnegativeMessage),
  );

const positiveIntNumberField = (requiredMessage: string) =>
  z.preprocess(normalizeNumericInput, z.number({ message: requiredMessage }).int().positive());

const unitsSchema = z
  .object({
    force: z.enum(["N", "kN"]).optional(),
    speed: z.enum(["m/s", "mm/s"]).optional(),
    diameter: z.enum(["mm", "m"]).optional(),
    service_time: z.enum(["h", "day", "year"]).optional(),
  })
  .optional();

type CalculateInput = {
  F: number;
  v: number;
  D: number;
  L?: number;
  t1: number;
  T1_ratio: number;
  t2: number;
  T2_ratio: number;
  uh: number;
  gearbox_type: "KHAI_TRIEN" | "PHAN_DOI";
  external_drive_type?: "CHAIN" | "BELT" | "GEAR" | "NONE";
  chain_layout?: "HORIZONTAL_OR_LT40" | "STEEP_GT40";
  tmm_t1_ratio: number;
  conditions?: {
    k0_type: number;
    ka_type: number;
    kdc_type: number;
    kd_type: number;
    kc_type: number;
    kbt_type: number;
  };
  units?: {
    force?: "N" | "kN";
    speed?: "m/s" | "mm/s";
    diameter?: "mm" | "m";
    service_time?: "h" | "day" | "year";
  };
};

const normalizeUnits = (input: CalculateInput): CalculateInput => {
  const units = input.units ?? {};
  const forceUnit = units.force ?? "N";
  const speedUnit = units.speed ?? "m/s";
  const diameterUnit = units.diameter ?? "mm";
  const serviceTimeUnit = units.service_time ?? "h";

  const normalizedF = forceUnit === "kN" ? input.F * 1000 : input.F;
  const normalizedV = speedUnit === "mm/s" ? input.v / 1000 : input.v;
  const normalizedD = diameterUnit === "m" ? input.D * 1000 : input.D;

  let normalizedL = input.L;
  if (typeof normalizedL === "number") {
    if (serviceTimeUnit === "day") normalizedL = normalizedL * 24;
    if (serviceTimeUnit === "year") normalizedL = normalizedL * 365 * 24;
  }

  return {
    ...input,
    F: normalizedF,
    v: normalizedV,
    D: normalizedD,
    L: normalizedL,
    units: {
      force: "N",
      speed: "m/s",
      diameter: "mm",
      service_time: "h",
    },
  };
};

const calculateBaseSchema = z
  .object({
    F: positiveNumberField("Thieu luc vong F", "F phai > 0"),
    v: positiveNumberField("Thieu van toc v", "v phai > 0"),
    D: positiveNumberField("Thieu duong kinh D", "D phai > 0"),
    L: positiveNumberField("Thieu thoi gian phuc vu L", "L phai > 0").optional(),
    t1: nonnegativeNumberField("Thieu t1", "t1 phai >= 0"),
    T1_ratio: positiveNumberField("Thieu T1_ratio", "T1_ratio phai > 0"),
    t2: nonnegativeNumberField("Thieu t2", "t2 phai >= 0"),
    T2_ratio: positiveNumberField("Thieu T2_ratio", "T2_ratio phai > 0"),
    uh: positiveNumberField("Thieu uh", "uh phai > 0"),
    gearbox_type: z.enum(["KHAI_TRIEN", "PHAN_DOI"] as const, {
      message: "Thieu loai hop giam toc",
    }),
    external_drive_type: z
      .enum(["CHAIN", "BELT", "GEAR", "NONE"] as const, {
        message: "Loai bo truyen ngoai khong hop le",
      })
      .optional(),
    chain_layout: z
      .enum(["HORIZONTAL_OR_LT40", "STEEP_GT40"] as const, {
        message: "Cau hinh bo truyen xich khong hop le",
      })
      .optional(),
    tmm_t1_ratio: positiveNumberField("Thieu Tmm/T1", "Tmm/T1 phai > 0"),
    conditions: z
      .object({
        k0_type: positiveIntNumberField("k0_type phai la so"),
        ka_type: positiveIntNumberField("ka_type phai la so"),
        kdc_type: positiveIntNumberField("kdc_type phai la so"),
        kd_type: positiveIntNumberField("kd_type phai la so"),
        kc_type: positiveIntNumberField("kc_type phai la so"),
        kbt_type: positiveIntNumberField("kbt_type phai la so"),
      })
      .optional(),
    units: unitsSchema,
  })
  .refine((data) => data.t1 + data.t2 > 0, {
    message: "t1 + t2 phai > 0",
    path: ["t1"],
  })
  .transform((data) => normalizeUnits(data as CalculateInput));

export const calculateSchema = calculateBaseSchema;

const sessionInputSchema = calculateBaseSchema;

const sessionResultSchema = z
  .object({
    Plv: numberField("Thieu Plv"),
    Ptd: numberField("Thieu Ptd"),
    eta: numberField("Thieu eta"),
    Pct: numberField("Thieu Pct"),
    nlv: numberField("Thieu nlv"),
    nsb: numberField("Thieu nsb"),
    usb: numberField("Thieu usb"),
  })
  .passthrough();

const sessionNameSchema = z
  .string()
  .trim()
  .min(3, "Ten phien phai co it nhat 3 ky tu")
  .max(100, "Ten phien toi da 100 ky tu")
  .regex(/^[\p{L}\p{N} _()/:-]+$/u, "Ten phien chi duoc chua chu, so, khoang trang, -, _, (), :, /")
  .refine((value) => !/[<>"';#]/.test(value), {
    message: "Ten phien khong duoc chua ky tu dac biet: < > \" ' ; #",
  });

export const createSessionSchema = z.object({
  session_name: sessionNameSchema,
  input: sessionInputSchema,
  result: sessionResultSchema,
});

export const updateSessionSchema = z.object({
  session_name: sessionNameSchema.optional(),
  status: z
    .enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "FAILED"], {
      message: "Status khong hop le",
    })
    .optional(),
  input: sessionInputSchema.optional(),
  result: sessionResultSchema.optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
