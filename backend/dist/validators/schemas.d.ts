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
}, z.core.$strip>;
/** Schema tạo phiên tính toán (lưu JSON input + result) */
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
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
//# sourceMappingURL=schemas.d.ts.map