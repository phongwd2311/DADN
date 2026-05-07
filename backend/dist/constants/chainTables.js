"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_REF = exports.ELASTIC_MODULUS = exports.CHAIN_USE_FACTORS = exports.CONTACT_STRESS_ALLOW = exports.SAFETY_FACTOR_TABLE = exports.CHAIN_POWER_TABLE = exports.CHAIN_TABLE = void 0;
exports.CHAIN_TABLE = [
    { p: 12.7, Q: 18200, q: 0.71, A: 39.6, dc: 4.45, B: 5.8, dl: 8.51 },
    { p: 15.875, Q: 22700, q: 0.9, A: 54.8, dc: 5.08, B: 6.48, dl: 10.16 },
    { p: 19.05, Q: 31800, q: 1.52, A: 105.8, dc: 5.96, B: 12.7, dl: 11.91 },
    { p: 25.4, Q: 56700, q: 2.57, A: 179.7, dc: 7.94, B: 15.88, dl: 15.88 },
    { p: 31.75, Q: 88500, q: 3.73, A: 262, dc: 9.55, B: 19.05, dl: 19.05 },
    { p: 38.1, Q: 127000, q: 5.52, A: 394, dc: 11.1, B: 25.4, dl: 22.23 },
    { p: 44.45, Q: 172400, q: 7.5, A: 473, dc: 12.7, B: 25.4, dl: 25.4 },
    { p: 50.8, Q: 226800, q: 9.7, A: 646, dc: 14.29, B: 31.75, dl: 28.58 },
];
exports.CHAIN_POWER_TABLE = [
    { n01: 50, values: [0.18, 0.38, 0.63, 1.41, 2.49, 4.05, 5.71, 8.3] },
    { n01: 100, values: [0.33, 0.69, 1.16, 2.57, 4.54, 7.34, 10.3, 15.0] },
    { n01: 200, values: [0.6, 1.27, 2.12, 4.67, 8.22, 13.2, 18.5, 26.8] },
    { n01: 300, values: [0.84, 1.78, 2.96, 6.51, 11.4, 18.3, 25.6, 37.1] },
    { n01: 400, values: [1.07, 2.25, 3.74, 8.22, 14.4, 23.0, 32.1, 46.4] },
    { n01: 500, values: [1.29, 2.7, 4.48, 9.84, 17.2, 27.5, 38.3, 55.3] },
    { n01: 600, values: [1.49, 3.12, 5.18, 11.3, 19.8, 31.6, 43.9, 63.3] },
    { n01: 800, values: [1.86, 3.89, 6.45, 14.1, 24.6, 39.0, 54.1, 77.8] },
    { n01: 1000, values: [2.2, 4.59, 7.6, 16.5, 28.8, 45.7, 63.2, 90.8] },
    { n01: 1200, values: [2.5, 5.22, 8.63, 18.7, 32.5, 51.4, 71.1, 102] },
    { n01: 1600, values: [3.03, 6.32, 10.4, 22.4, 38.8, 61.0, 84.0, 120] },
    { n01: 2000, values: [3.46, 7.2, 11.9, 25.4, 43.9, 68.9, 94.5, 135] },
];
exports.SAFETY_FACTOR_TABLE = [
    { p: 12.7, s_min: 7.0 },
    { p: 15.875, s_min: 7.8 },
    { p: 19.05, s_min: 8.5 },
    { p: 25.4, s_min: 9.3 },
    { p: 31.75, s_min: 9.7 },
    { p: 38.1, s_min: 10.2 },
    { p: 44.45, s_min: 10.5 },
    { p: 50.8, s_min: 10.8 },
];
exports.CONTACT_STRESS_ALLOW = 600;
exports.CHAIN_USE_FACTORS = {
    k0: 1,
    ka: 1,
    kdc: 1,
    kbt: 1.3,
    kd: 1.2,
    kc: 1,
    kf: 4,
    kx: 1.15,
};
exports.ELASTIC_MODULUS = 2.1e5;
exports.CHAIN_REF = {
    z01: 25,
    n01: 200,
};
//# sourceMappingURL=chainTables.js.map