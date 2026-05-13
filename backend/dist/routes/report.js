"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
function isNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}
router.post("/preview", (req, res) => {
    const body = req.body;
    if (!body || typeof body !== "object" || !body.input || !body.result) {
        res.status(400).json({ error: "Dữ liệu báo cáo không hợp lệ" });
        return;
    }
    const result = body.result;
    const chainStrength = result.chainStrength ?? {};
    const hasDesignError = chainStrength.passed === false || chainStrength.contactPassed === false;
    if (hasDesignError) {
        res.status(400).json({ error: "Không thể tạo báo cáo" });
        return;
    }
    const Plv = result.Plv;
    const Ptd = result.Ptd;
    const eta = result.eta;
    const Pct = result.Pct;
    const ut = result.ut;
    const ux = result.ux;
    const uh = result.uh;
    const formulas = [
        {
            id: "SR-05.1",
            formula: "Plv = F * v / 1000",
            substitution: isNumber(Plv) && isNumber(body.input.F) && isNumber(body.input.v)
                ? `Plv = ${body.input.F} * ${body.input.v} / 1000 = ${Plv.toFixed(4)} kW`
                : null,
        },
        {
            id: "FR-07",
            formula: "Pct = Ptd / eta",
            substitution: isNumber(Ptd) && isNumber(eta) && isNumber(Pct)
                ? `Pct = ${Ptd.toFixed(4)} / ${eta.toFixed(4)} = ${Pct.toFixed(4)} kW`
                : null,
        },
        {
            id: "FR-08",
            formula: "ut = ndc / nlv ; ux = ut / uh",
            substitution: isNumber(ut) && isNumber(ux) && isNumber(uh)
                ? `ut = ${ut.toFixed(4)} ; ux = ${ux.toFixed(4)} ; uh = ${uh.toFixed(4)}`
                : null,
        },
    ];
    res.json({
        generated_at: new Date().toISOString(),
        exportable: true,
        sections: {
            input: body.input,
            motor: body.motor,
            result: body.result,
            formulas,
            units: {
                power: "kW",
                speed: "vong/phut",
                torque: "N.mm",
                length: "mm",
                force: "N",
            },
        },
        note: "Day la ban preview backend cho SR-10. PDF/print se duoc frontend hoac service xuat file xu ly o buoc sau.",
    });
});
exports.default = router;
//# sourceMappingURL=report.js.map