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
/** Schema cho dữ liệu tính toán bắt buộc */
export declare const calculateSchema: z.ZodObject<{
    F: z.ZodNumber;
    v: z.ZodNumber;
    D: z.ZodNumber;
    L: z.ZodOptional<z.ZodNumber>;
    t1: z.ZodNumber;
    T1_ratio: z.ZodNumber;
    t2: z.ZodNumber;
    T2_ratio: z.ZodNumber;
    uh: z.ZodNumber;
    gearbox_type: z.ZodEnum<{
        KHAI_TRIEN: "KHAI_TRIEN";
        PHAN_DOI: "PHAN_DOI";
    }>;
    tmm_t1_ratio: z.ZodNumber;
    conditions: z.ZodOptional<z.ZodObject<{
        k0_type: z.ZodNumber;
        ka_type: z.ZodNumber;
        kdc_type: z.ZodNumber;
        kd_type: z.ZodNumber;
        kc_type: z.ZodNumber;
        kbt_type: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Schema tạo phiên tính toán (lưu JSON input + result) */
export declare const createSessionSchema: z.ZodObject<{
    session_name: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    input: z.ZodObject<{
        F: z.ZodNumber;
        v: z.ZodNumber;
        D: z.ZodNumber;
        L: z.ZodOptional<z.ZodNumber>;
        t1: z.ZodNumber;
        T1_ratio: z.ZodNumber;
        t2: z.ZodNumber;
        T2_ratio: z.ZodNumber;
        uh: z.ZodNumber;
        gearbox_type: z.ZodEnum<{
            KHAI_TRIEN: "KHAI_TRIEN";
            PHAN_DOI: "PHAN_DOI";
        }>;
        tmm_t1_ratio: z.ZodNumber;
        conditions: z.ZodOptional<z.ZodObject<{
            k0_type: z.ZodNumber;
            ka_type: z.ZodNumber;
            kdc_type: z.ZodNumber;
            kd_type: z.ZodNumber;
            kc_type: z.ZodNumber;
            kbt_type: z.ZodNumber;
        }, z.core.$strip>>;
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
export declare const updateSessionSchema: z.ZodObject<{
    session_name: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_PROGRESS: "IN_PROGRESS";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
    }>>;
    input: z.ZodOptional<z.ZodObject<{
        F: z.ZodNumber;
        v: z.ZodNumber;
        D: z.ZodNumber;
        L: z.ZodOptional<z.ZodNumber>;
        t1: z.ZodNumber;
        T1_ratio: z.ZodNumber;
        t2: z.ZodNumber;
        T2_ratio: z.ZodNumber;
        uh: z.ZodNumber;
        gearbox_type: z.ZodEnum<{
            KHAI_TRIEN: "KHAI_TRIEN";
            PHAN_DOI: "PHAN_DOI";
        }>;
        tmm_t1_ratio: z.ZodNumber;
        conditions: z.ZodOptional<z.ZodObject<{
            k0_type: z.ZodNumber;
            ka_type: z.ZodNumber;
            kdc_type: z.ZodNumber;
            kd_type: z.ZodNumber;
            kc_type: z.ZodNumber;
            kbt_type: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$loose>>;
    result: z.ZodOptional<z.ZodObject<{
        Plv: z.ZodNumber;
        Ptd: z.ZodNumber;
        eta: z.ZodNumber;
        Pct: z.ZodNumber;
        nlv: z.ZodNumber;
        nsb: z.ZodNumber;
        usb: z.ZodNumber;
    }, z.core.$loose>>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
//# sourceMappingURL=schemas.d.ts.map