export type GearboxType = "KHAI_TRIEN" | "PHAN_DOI";

export const PRELIM_UX = 2.5;

export const GEARBOX_RATIO_OPTIONS: Record<GearboxType, { u1Values: number[]; u2Values: number[] }> = {
  KHAI_TRIEN: {
    u1Values: [3, 3.5, 4, 4.5, 5, 5.5, 6],
    u2Values: [2, 2.5, 3, 3.5, 4, 4.5, 5],
  },
  PHAN_DOI: {
    u1Values: [2.5, 3, 3.5, 4, 4.5, 5],
    u2Values: [2.5, 3, 3.5, 4, 4.5, 5],
  },
};
