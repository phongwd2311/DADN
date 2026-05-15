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
export declare const calculateSchema: z.ZodPipe<z.ZodObject<{
    F: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    v: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    D: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    L: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>>;
    t1: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    T1_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    t2: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    T2_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    uh: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
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
    tmm_t1_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    conditions: z.ZodOptional<z.ZodObject<{
        k0_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        ka_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        kdc_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        kd_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        kc_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        kbt_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    }, z.core.$strip>>;
    units: z.ZodOptional<z.ZodObject<{
        force: z.ZodOptional<z.ZodEnum<{
            N: "N";
            kN: "kN";
        }>>;
        speed: z.ZodOptional<z.ZodEnum<{
            "m/s": "m/s";
            "mm/s": "mm/s";
        }>>;
        diameter: z.ZodOptional<z.ZodEnum<{
            m: "m";
            mm: "mm";
        }>>;
        service_time: z.ZodOptional<z.ZodEnum<{
            year: "year";
            day: "day";
            h: "h";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodTransform<CalculateInput, {
    F: number;
    v: number;
    D: number;
    t1: number;
    T1_ratio: number;
    t2: number;
    T2_ratio: number;
    uh: number;
    gearbox_type: "KHAI_TRIEN" | "PHAN_DOI";
    tmm_t1_ratio: number;
    L?: number | undefined;
    external_drive_type?: "CHAIN" | "BELT" | "GEAR" | "NONE" | undefined;
    chain_layout?: "HORIZONTAL_OR_LT40" | "STEEP_GT40" | undefined;
    conditions?: {
        k0_type: number;
        ka_type: number;
        kdc_type: number;
        kd_type: number;
        kc_type: number;
        kbt_type: number;
    } | undefined;
    units?: {
        force?: "N" | "kN" | undefined;
        speed?: "m/s" | "mm/s" | undefined;
        diameter?: "m" | "mm" | undefined;
        service_time?: "year" | "day" | "h" | undefined;
    } | undefined;
}>>;
export declare const createSessionSchema: z.ZodObject<{
    session_name: z.ZodString;
    input: z.ZodPipe<z.ZodObject<{
        F: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        v: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        D: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        L: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>>;
        t1: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        T1_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        t2: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        T2_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        uh: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
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
        tmm_t1_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        conditions: z.ZodOptional<z.ZodObject<{
            k0_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            ka_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            kdc_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            kd_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            kc_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            kbt_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        }, z.core.$strip>>;
        units: z.ZodOptional<z.ZodObject<{
            force: z.ZodOptional<z.ZodEnum<{
                N: "N";
                kN: "kN";
            }>>;
            speed: z.ZodOptional<z.ZodEnum<{
                "m/s": "m/s";
                "mm/s": "mm/s";
            }>>;
            diameter: z.ZodOptional<z.ZodEnum<{
                m: "m";
                mm: "mm";
            }>>;
            service_time: z.ZodOptional<z.ZodEnum<{
                year: "year";
                day: "day";
                h: "h";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodTransform<CalculateInput, {
        F: number;
        v: number;
        D: number;
        t1: number;
        T1_ratio: number;
        t2: number;
        T2_ratio: number;
        uh: number;
        gearbox_type: "KHAI_TRIEN" | "PHAN_DOI";
        tmm_t1_ratio: number;
        L?: number | undefined;
        external_drive_type?: "CHAIN" | "BELT" | "GEAR" | "NONE" | undefined;
        chain_layout?: "HORIZONTAL_OR_LT40" | "STEEP_GT40" | undefined;
        conditions?: {
            k0_type: number;
            ka_type: number;
            kdc_type: number;
            kd_type: number;
            kc_type: number;
            kbt_type: number;
        } | undefined;
        units?: {
            force?: "N" | "kN" | undefined;
            speed?: "m/s" | "mm/s" | undefined;
            diameter?: "m" | "mm" | undefined;
            service_time?: "year" | "day" | "h" | undefined;
        } | undefined;
    }>>;
    result: z.ZodObject<{
        Plv: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        Ptd: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        eta: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        Pct: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        nlv: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        nsb: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        usb: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    }, z.core.$loose>;
}, z.core.$strip>;
export declare const updateSessionSchema: z.ZodObject<{
    session_name: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_PROGRESS: "IN_PROGRESS";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
    }>>;
    input: z.ZodOptional<z.ZodPipe<z.ZodObject<{
        F: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        v: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        D: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        L: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>>;
        t1: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        T1_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        t2: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        T2_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        uh: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
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
        tmm_t1_ratio: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        conditions: z.ZodOptional<z.ZodObject<{
            k0_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            ka_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            kdc_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            kd_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            kc_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
            kbt_type: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        }, z.core.$strip>>;
        units: z.ZodOptional<z.ZodObject<{
            force: z.ZodOptional<z.ZodEnum<{
                N: "N";
                kN: "kN";
            }>>;
            speed: z.ZodOptional<z.ZodEnum<{
                "m/s": "m/s";
                "mm/s": "mm/s";
            }>>;
            diameter: z.ZodOptional<z.ZodEnum<{
                m: "m";
                mm: "mm";
            }>>;
            service_time: z.ZodOptional<z.ZodEnum<{
                year: "year";
                day: "day";
                h: "h";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodTransform<CalculateInput, {
        F: number;
        v: number;
        D: number;
        t1: number;
        T1_ratio: number;
        t2: number;
        T2_ratio: number;
        uh: number;
        gearbox_type: "KHAI_TRIEN" | "PHAN_DOI";
        tmm_t1_ratio: number;
        L?: number | undefined;
        external_drive_type?: "CHAIN" | "BELT" | "GEAR" | "NONE" | undefined;
        chain_layout?: "HORIZONTAL_OR_LT40" | "STEEP_GT40" | undefined;
        conditions?: {
            k0_type: number;
            ka_type: number;
            kdc_type: number;
            kd_type: number;
            kc_type: number;
            kbt_type: number;
        } | undefined;
        units?: {
            force?: "N" | "kN" | undefined;
            speed?: "m/s" | "mm/s" | undefined;
            diameter?: "m" | "mm" | undefined;
            service_time?: "year" | "day" | "h" | undefined;
        } | undefined;
    }>>>;
    result: z.ZodOptional<z.ZodObject<{
        Plv: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        Ptd: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        eta: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        Pct: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        nlv: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        nsb: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
        usb: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    }, z.core.$loose>>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export {};
//# sourceMappingURL=schemas.d.ts.map