"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_KBT_TABLE = exports.CHAIN_MAX_PITCH_TABLE = exports.CHAIN_Z1_TABLE = void 0;
exports.getKbtByChainSpeed = getKbtByChainSpeed;
exports.getPmaxBySprocketSpeed = getPmaxBySprocketSpeed;
exports.buildGearboxRatioTable = buildGearboxRatioTable;
exports.getStandardsTableData = getStandardsTableData;
const chainTables_1 = require("./chainTables");
const gearbox_1 = require("./gearbox");
exports.CHAIN_Z1_TABLE = [
    { u_from: 1, u_to: 2, z1_from: 31, z1_to: 27, chain_type: "ROLLER" },
    { u_from: 2, u_to: 3, z1_from: 27, z1_to: 25, chain_type: "ROLLER" },
    { u_from: 3, u_to: 4, z1_from: 25, z1_to: 23, chain_type: "ROLLER" },
    { u_from: 4, u_to: 5, z1_from: 23, z1_to: 21, chain_type: "ROLLER" },
    { u_from: 5, u_to: 6, z1_from: 21, z1_to: 17, chain_type: "ROLLER" },
    { u_from: 6, u_to: Number.POSITIVE_INFINITY, z1_from: 17, z1_to: 15, chain_type: "ROLLER" },
];
exports.CHAIN_MAX_PITCH_TABLE = [
    { n_max: 100, p_max: 50.8 },
    { n_max: 200, p_max: 44.45 },
    { n_max: 300, p_max: 38.1 },
    { n_max: 500, p_max: 31.75 },
    { n_max: 700, p_max: 25.4 },
    { n_max: 1000, p_max: 19.05 },
    { n_max: 1500, p_max: 15.875 },
    { n_max: 2000, p_max: 12.7 },
];
exports.CHAIN_KBT_TABLE = [
    { v_max: 1, kbt: 1.0 },
    { v_max: 2, kbt: 1.1 },
    { v_max: 4, kbt: 1.2 },
    { v_max: Number.POSITIVE_INFINITY, kbt: 1.3 },
];
function getKbtByChainSpeed(vChain) {
    const normalized = Number.isFinite(vChain) && vChain > 0 ? vChain : 0;
    return exports.CHAIN_KBT_TABLE.find((item) => normalized <= item.v_max)?.kbt ?? 1.3;
}
function getPmaxBySprocketSpeed(n) {
    const normalized = Number.isFinite(n) && n > 0 ? n : 0;
    return exports.CHAIN_MAX_PITCH_TABLE.find((item) => normalized <= item.n_max)?.p_max ?? 12.7;
}
function buildGearboxRatioTable(type) {
    const { u1Values, u2Values } = gearbox_1.GEARBOX_RATIO_OPTIONS[type];
    const rows = [];
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
function getStandardsTableData(table) {
    if (table === "5.4") {
        return exports.CHAIN_Z1_TABLE;
    }
    if (table === "5.5") {
        return {
            chain_specs: chainTables_1.CHAIN_TABLE,
            chain_power: chainTables_1.CHAIN_POWER_TABLE,
        };
    }
    if (table === "5.8") {
        return exports.CHAIN_MAX_PITCH_TABLE;
    }
    if (table === "3.1") {
        return {
            KHAI_TRIEN: buildGearboxRatioTable("KHAI_TRIEN"),
            PHAN_DOI: buildGearboxRatioTable("PHAN_DOI"),
        };
    }
    return null;
}
//# sourceMappingURL=standards.js.map