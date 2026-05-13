import { CHAIN_POWER_TABLE, CHAIN_TABLE } from "./chainTables";
import { GEARBOX_RATIO_OPTIONS, GearboxType } from "./gearbox";

export type StandardTableKey = "P1.2" | "3.1" | "5.4" | "5.5" | "5.8";

export const CHAIN_Z1_TABLE = [
  { u_from: 1, u_to: 2, z1_from: 31, z1_to: 27, chain_type: "ROLLER" },
  { u_from: 2, u_to: 3, z1_from: 27, z1_to: 25, chain_type: "ROLLER" },
  { u_from: 3, u_to: 4, z1_from: 25, z1_to: 23, chain_type: "ROLLER" },
  { u_from: 4, u_to: 5, z1_from: 23, z1_to: 21, chain_type: "ROLLER" },
  { u_from: 5, u_to: 6, z1_from: 21, z1_to: 17, chain_type: "ROLLER" },
  { u_from: 6, u_to: Number.POSITIVE_INFINITY, z1_from: 17, z1_to: 15, chain_type: "ROLLER" },
];

export const CHAIN_MAX_PITCH_TABLE = [
  { n_max: 100, p_max: 50.8 },
  { n_max: 200, p_max: 44.45 },
  { n_max: 300, p_max: 38.1 },
  { n_max: 500, p_max: 31.75 },
  { n_max: 700, p_max: 25.4 },
  { n_max: 1000, p_max: 19.05 },
  { n_max: 1500, p_max: 15.875 },
  { n_max: 2000, p_max: 12.7 },
];

export const CHAIN_KBT_TABLE = [
  { v_max: 1, kbt: 1.0 },
  { v_max: 2, kbt: 1.1 },
  { v_max: 4, kbt: 1.2 },
  { v_max: Number.POSITIVE_INFINITY, kbt: 1.3 },
];

export function getKbtByChainSpeed(vChain: number): number {
  const normalized = Number.isFinite(vChain) && vChain > 0 ? vChain : 0;
  return CHAIN_KBT_TABLE.find((item) => normalized <= item.v_max)?.kbt ?? 1.3;
}

export function getPmaxBySprocketSpeed(n: number): number {
  const normalized = Number.isFinite(n) && n > 0 ? n : 0;
  return CHAIN_MAX_PITCH_TABLE.find((item) => normalized <= item.n_max)?.p_max ?? 12.7;
}

export function buildGearboxRatioTable(type: GearboxType) {
  const { u1Values, u2Values } = GEARBOX_RATIO_OPTIONS[type];
  const rows: Array<{ gearbox_type: GearboxType; u1: number; u2: number; uh: number }> = [];

  for (const u1 of u1Values) {
    for (const u2 of u2Values) {
      rows.push({
        gearbox_type: type,
        u1,
        u2,
        uh: Number((u1 * u2).toFixed(4)),
      });
    }
  }

  return rows.sort((a, b) => a.uh - b.uh);
}

export function getStandardsTableData(table: StandardTableKey) {
  if (table === "5.4") {
    return CHAIN_Z1_TABLE;
  }

  if (table === "5.5") {
    return {
      chain_specs: CHAIN_TABLE,
      chain_power: CHAIN_POWER_TABLE,
    };
  }

  if (table === "5.8") {
    return CHAIN_MAX_PITCH_TABLE;
  }

  if (table === "3.1") {
    return {
      KHAI_TRIEN: buildGearboxRatioTable("KHAI_TRIEN"),
      PHAN_DOI: buildGearboxRatioTable("PHAN_DOI"),
    };
  }

  return null;
}
