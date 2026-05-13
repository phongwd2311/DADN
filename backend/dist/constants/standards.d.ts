import { GearboxType } from "./gearbox";
export type StandardTableKey = "P1.2" | "3.1" | "5.4" | "5.5" | "5.8";
export declare const CHAIN_Z1_TABLE: {
    u_from: number;
    u_to: number;
    z1_from: number;
    z1_to: number;
    chain_type: string;
}[];
export declare const CHAIN_MAX_PITCH_TABLE: {
    n_max: number;
    p_max: number;
}[];
export declare const CHAIN_KBT_TABLE: {
    v_max: number;
    kbt: number;
}[];
export declare function getKbtByChainSpeed(vChain: number): number;
export declare function getPmaxBySprocketSpeed(n: number): number;
export declare function buildGearboxRatioTable(type: GearboxType): {
    gearbox_type: GearboxType;
    u1: number;
    u2: number;
    uh: number;
}[];
export declare function getStandardsTableData(table: StandardTableKey): {
    u_from: number;
    u_to: number;
    z1_from: number;
    z1_to: number;
    chain_type: string;
}[] | {
    n_max: number;
    p_max: number;
}[] | {
    chain_specs: {
        p: number;
        Q: number;
        q: number;
        A: number;
        dc: number;
        B: number;
        dl: number;
    }[];
    chain_power: {
        n01: number;
        values: number[];
    }[];
    KHAI_TRIEN?: undefined;
    PHAN_DOI?: undefined;
} | {
    KHAI_TRIEN: {
        gearbox_type: GearboxType;
        u1: number;
        u2: number;
        uh: number;
    }[];
    PHAN_DOI: {
        gearbox_type: GearboxType;
        u1: number;
        u2: number;
        uh: number;
    }[];
    chain_specs?: undefined;
    chain_power?: undefined;
} | null;
//# sourceMappingURL=standards.d.ts.map