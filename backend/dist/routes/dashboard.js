"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function getNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
router.get("/", async (req, res) => {
    try {
        const userId = req.user.userId;
        const sessions = await prisma_1.prisma.calculationSession.findMany({
            where: {
                user_id: userId
            },
            orderBy: { created_at: "desc" },
            take: 100,
        });
        const draftsCount = await prisma_1.prisma.draftSession.count({
            where: {
                user_id: userId
            },
        });
        const templatesCount = await prisma_1.prisma.inputTemplate.count({
            where: {
                user_id: userId
            },
        });
        const motorsCount = await prisma_1.prisma.motorLibrary.count();
        const now = new Date();
        const last7Days = Array.from({ length: 7 }).map((_, idx) => {
            const d = new Date(now);
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - idx));
            return d;
        });
        const activity = last7Days.map((d) => {
            const end = new Date(d);
            end.setDate(end.getDate() + 1);
            const count = sessions.filter((s) => {
                if (!s.created_at)
                    return false;
                const t = new Date(s.created_at);
                return t >= d && t < end;
            }).length;
            return {
                date: d.toISOString().slice(0, 10),
                count,
            };
        });
        const recentCalculations = sessions.slice(0, 5).map((s) => {
            const result = isObject(s.result_json) ? s.result_json : {};
            const motor = isObject(result.motor)
                ? result.motor
                : {};
            return {
                session_id: s.session_id,
                session_name: s.session_name,
                created_at: s.created_at,
                pct: getNumber(result.Pct),
                motor_model: typeof motor.id === "string" ? motor.id : null,
            };
        });
        const lastCalculationAt = sessions[0]?.created_at ?? null;
        res.json({
            summary: {
                total_calculations: sessions.length,
                last_calculation_at: lastCalculationAt,
                recent_7d_total: activity.reduce((acc, it) => acc + it.count, 0),
            },
            activity,
            recent_calculations: recentCalculations,
            quick_access: {
                drafts_count: draftsCount,
                templates_count: templatesCount,
                standards_tables: 5,
                motors_count: motorsCount,
            },
        });
    }
    catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map