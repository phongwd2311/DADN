"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get("/", async (req, res) => {
    try {
        const sessions = await prisma_1.prisma.calculationSession.findMany({
            where: {
                user_id: req.user.userId,
            },
            orderBy: { updated_at: "desc" },
            include: {
                design_inputs: true,
                design_results: {
                    include: {
                        shafts: { orderBy: { shaft_order: "asc" } },
                    },
                },
            },
        });
        res.json({ sessions, total: sessions.length });
    }
    catch (err) {
        console.error("Get sessions error:", err);
        res.status(500).json({ error: "Loi server" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id, 10);
        if (isNaN(sessionId)) {
            res.status(400).json({ error: "ID khong hop le" });
            return;
        }
        const session = await prisma_1.prisma.calculationSession.findFirst({
            where: {
                session_id: sessionId,
                user_id: req.user.userId,
            },
            include: {
                design_inputs: true,
                design_results: {
                    include: {
                        shafts: { orderBy: { shaft_order: "asc" } },
                        bearings: true,
                        gear_drives: true,
                        housings: true,
                    },
                },
                ai_suggestions: {
                    include: { motor: true },
                },
            },
        });
        if (!session) {
            res.status(404).json({ error: "Khong tim thay phien tinh toan" });
            return;
        }
        res.json({ session });
    }
    catch (err) {
        console.error("Get session detail error:", err);
        res.status(500).json({ error: "Loi server" });
    }
});
async function getUniqueSessionName(originalName, userId, excludeSessionId) {
    let candidate = originalName;
    let suffix = 1;
    while (suffix <= 100) {
        const existing = await prisma_1.prisma.calculationSession.findFirst({
            where: {
                user_id: userId,
                session_name: candidate,
                ...(excludeSessionId ? { session_id: { not: excludeSessionId } } : {}),
            },
            select: { session_id: true },
        });
        if (!existing) {
            return candidate;
        }
        candidate = `${originalName} (${suffix})`;
        suffix += 1;
    }
    return `${originalName} (${Date.now()})`;
}
router.post("/", async (req, res) => {
    try {
        const parsed = schemas_1.createSessionSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Du lieu khong hop le",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { session_name, input, result } = parsed.data;
        const uniqueSessionName = await getUniqueSessionName(session_name, req.user.userId);
        const session = await prisma_1.prisma.calculationSession.create({
            data: {
                session_name: uniqueSessionName,
                user_id: req.user.userId,
                status: "DRAFT",
                is_synced: true,
                input_json: input,
                result_json: result,
            },
            include: {
                design_inputs: true,
                design_results: {
                    include: {
                        shafts: { orderBy: { shaft_order: "asc" } },
                        bearings: true,
                        gear_drives: true,
                        housings: true,
                    },
                },
            },
        });
        res.status(201).json({
            message: "Tao phien tinh toan thanh cong",
            session,
        });
    }
    catch (err) {
        console.error("Create session error:", err);
        res.status(500).json({ error: "Loi server" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id, 10);
        if (isNaN(sessionId)) {
            res.status(400).json({ error: "ID khong hop le" });
            return;
        }
        const parsed = schemas_1.updateSessionSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Du lieu khong hop le",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const found = await prisma_1.prisma.calculationSession.findFirst({
            where: {
                session_id: sessionId,
                user_id: req.user.userId,
            },
            select: { session_id: true, session_name: true },
        });
        if (!found) {
            res.status(404).json({ error: "Khong tim thay phien tinh toan" });
            return;
        }
        const { session_name, status, input, result } = parsed.data;
        let finalSessionName = found.session_name;
        if (session_name) {
            finalSessionName = await getUniqueSessionName(session_name, req.user.userId, sessionId);
        }
        const updatedSession = await prisma_1.prisma.calculationSession.update({
            where: { session_id: sessionId },
            data: {
                ...(session_name ? { session_name: finalSessionName } : {}),
                ...(status ? { status } : {}),
                ...(input ? { input_json: input } : {}),
                ...(result ? { result_json: result } : {}),
            },
            include: {
                design_inputs: true,
                design_results: {
                    include: {
                        shafts: { orderBy: { shaft_order: "asc" } },
                        bearings: true,
                        gear_drives: true,
                        housings: true,
                    },
                },
            },
        });
        res.json({
            message: "Cap nhat phien tinh toan thanh cong",
            session: updatedSession,
        });
    }
    catch (err) {
        console.error("Update session error:", err);
        res.status(500).json({ error: "Loi server" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id, 10);
        if (isNaN(sessionId)) {
            res.status(400).json({ error: "ID khong hop le" });
            return;
        }
        const session = await prisma_1.prisma.calculationSession.findFirst({
            where: {
                session_id: sessionId,
                user_id: req.user.userId,
            },
            select: { session_id: true },
        });
        if (!session) {
            res.status(404).json({ error: "Khong tim thay phien tinh toan" });
            return;
        }
        await prisma_1.prisma.calculationSession.delete({
            where: { session_id: sessionId },
        });
        res.json({ message: "Da xoa phien tinh toan" });
    }
    catch (err) {
        console.error("Delete session error:", err);
        res.status(500).json({ error: "Loi server" });
    }
});
exports.default = router;
//# sourceMappingURL=sessions.js.map