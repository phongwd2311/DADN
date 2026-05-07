"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
// Tất cả routes trong file này đều yêu cầu đăng nhập
router.use(auth_1.authMiddleware);
/**
 * GET /api/sessions
 * Lấy danh sách phiên tính toán của user hiện tại
 */
router.get("/", async (req, res) => {
    try {
        const sessions = await prisma_1.prisma.calculationSession.findMany({
            where: { user_id: req.user.userId },
            orderBy: { created_at: "desc" },
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
        res.status(500).json({ error: "Lỗi server" });
    }
});
/**
 * GET /api/sessions/:id
 * Lấy chi tiết một phiên (bao gồm tất cả dữ liệu liên quan)
 */
router.get("/:id", async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id, 10);
        if (isNaN(sessionId)) {
            res.status(400).json({ error: "ID không hợp lệ" });
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
            res.status(404).json({ error: "Không tìm thấy phiên tính toán" });
            return;
        }
        res.json({ session });
    }
    catch (err) {
        console.error("Get session detail error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
/**
 * POST /api/sessions
 * Tạo phiên tính toán mới (chỉ lưu trữ Input + Result)
 *
 * Body mẫu:
 * {
 *   "session_name": "Băng tải 1 - Lực 5000N",
 *   "input": { "F": 5000, "v": 1.2, "D": 300, "t1": 60, "t2": 40, "T1_ratio": 1, "T2_ratio": 0.65, "uh": 10, "gearbox_type": "KHAI_TRIEN", "tmm_t1_ratio": 1.4 },
 *   "result": { "Plv": 6.0, "Ptd": 6.5, "eta": 0.85, "Pct": 7.65, "nlv": 76.4, "usb": 25, "nsb": 1910 }
 * }
 * }
 */
router.post("/", async (req, res) => {
    try {
        // 1. Validate input
        const parsed = schemas_1.createSessionSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Dữ liệu không hợp lệ",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { session_name, input, result } = parsed.data;
        // 2. Tạo session và lưu JSON input/result
        const session = await prisma_1.prisma.calculationSession.create({
            data: {
                session_name,
                user_id: req.user.userId,
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
            message: "Tạo phiên tính toán thành công",
            session,
        });
    }
    catch (err) {
        console.error("Create session error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
/**
 * DELETE /api/sessions/:id
 * Xóa phiên tính toán (cascade xóa tất cả dữ liệu liên quan)
 */
router.delete("/:id", async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id, 10);
        if (isNaN(sessionId)) {
            res.status(400).json({ error: "ID không hợp lệ" });
            return;
        }
        // Kiểm tra quyền sở hữu
        const session = await prisma_1.prisma.calculationSession.findFirst({
            where: {
                session_id: sessionId,
                user_id: req.user.userId,
            },
        });
        if (!session) {
            res.status(404).json({ error: "Không tìm thấy phiên tính toán" });
            return;
        }
        // Xóa (các bảng con sẽ tự xóa theo nhờ onDelete: Cascade trong schema)
        await prisma_1.prisma.calculationSession.delete({
            where: { session_id: sessionId },
        });
        res.json({ message: "Đã xóa phiên tính toán" });
    }
    catch (err) {
        console.error("Delete session error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=sessions.js.map