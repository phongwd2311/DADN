import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export declare const calculateSchema: z.ZodObject<{
    F: z.ZodNumber;
    v: z.ZodNumber;
    D: z.ZodNumber;
    t1: z.ZodNumber;
    T1_ratio: z.ZodNumber;
    t2: z.ZodNumber;
    T2_ratio: z.ZodNumber;
    uh: z.ZodNumber;
    gearbox_type: z.ZodEnum<{
        KHAI_TRIEN: "KHAI_TRIEN";
        PHAN_DOI: "PHAN_DOI";
    }>;
    external_drive_type: z.ZodOptional<z.ZodEnum<{
        CHAIN: "CHAIN";
        BELT: "BELT";
        GEAR: "GEAR";
        NONE: "NONE";
    }>>;
    chain_layout: z.ZodOptional<z.ZodEnum<{
        HORIZONTAL_OR_LT40: "HORIZONTAL_OR_LT40";
        STEEP_GT40: "STEEP_GT40";
    }>>;
    tmm_t1_ratio: z.ZodNumber;
}, z.core.$strip>;
export declare const createSessionSchema: z.ZodObject<{
    session_name: z.ZodString;
    input: z.ZodObject<{
        F: z.ZodNumber;
        v: z.ZodNumber;
        D: z.ZodNumber;
        t1: z.ZodNumber;
        T1_ratio: z.ZodNumber;
        t2: z.ZodNumber;
        T2_ratio: z.ZodNumber;
        uh: z.ZodNumber;
        gearbox_type: z.ZodEnum<{
            KHAI_TRIEN: "KHAI_TRIEN";
            PHAN_DOI: "PHAN_DOI";
        }>;
        external_drive_type: z.ZodOptional<z.ZodEnum<{
            CHAIN: "CHAIN";
            BELT: "BELT";
            GEAR: "GEAR";
            NONE: "NONE";
        }>>;
        chain_layout: z.ZodOptional<z.ZodEnum<{
            HORIZONTAL_OR_LT40: "HORIZONTAL_OR_LT40";
            STEEP_GT40: "STEEP_GT40";
        }>>;
        tmm_t1_ratio: z.ZodNumber;
    }, z.core.$loose>;
    result: z.ZodObject<{
        Plv: z.ZodNumber;
        Ptd: z.ZodNumber;
        eta: z.ZodNumber;
        Pct: z.ZodNumber;
        nlv: z.ZodNumber;
        nsb: z.ZodNumber;
        usb: z.ZodNumber;
    }, z.core.$loose>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
//# sourceMappingURL=schemas.d.ts.map