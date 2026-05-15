"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get("/", async (req, res) => {
    try {
        const drafts = await prisma_1.prisma.draftSession.findMany({
            where: {
                user_id: req.user.userId
            },
            orderBy: { updated_at: "desc" },
            take: 20,
        });
        res.json({
            drafts: drafts.map((d) => ({
                draft_id: d.draft_id,
                draft_name: d.draft_name,
                created_at: d.updated_at,
                input: d.input_json,
                result: d.result_json,
            })),
        });
    }
    catch (err) {
        console.error("Get drafts error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
router.get("/latest", async (req, res) => {
    try {
        const draft = await prisma_1.prisma.draftSession.findFirst({
            where: {
                user_id: req.user.userId
            },
            orderBy: { updated_at: "desc" },
        });
        if (!draft) {
            res.json({ draft: null });
            return;
        }
        res.json({
            draft: {
                draft_id: draft.draft_id,
                draft_name: draft.draft_name,
                created_at: draft.updated_at,
                input: draft.input_json,
                result: draft.result_json,
            },
        });
    }
    catch (err) {
        console.error("Get latest draft error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
router.post("/autosave", async (req, res) => {
    try {
        const { draft_id, draft_name, input, result } = req.body ?? {};
        if (!input || typeof input !== "object") {
            res.status(400).json({ error: "Thiếu dữ liệu input để autosave" });
            return;
        }
        const normalizedName = typeof draft_name === "string" && draft_name.trim()
            ? draft_name.trim()
            : "Draft mặc định";
        if (typeof draft_id === "number" && Number.isInteger(draft_id)) {
            const updated = await prisma_1.prisma.draftSession.updateMany({
                where: {
                    draft_id,
                    user_id: req.user.userId
                },
                data: {
                    draft_name: normalizedName,
                    input_json: input,
                    result_json: (result ?? null),
                },
            });
            if (updated.count > 0) {
                res.json({ message: "Autosave thành công", draft_id });
                return;
            }
        }
        const created = await prisma_1.prisma.draftSession.create({
            data: {
                user_id: req.user.userId,
                draft_name: normalizedName,
                input_json: input,
                result_json: (result ?? null),
            },
        });
        res.status(201).json({
            message: "Tạo draft thành công",
            draft_id: created.draft_id,
        });
    }
    catch (err) {
        console.error("Autosave draft error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const draftId = parseInt(req.params.id, 10);
        if (Number.isNaN(draftId)) {
            res.status(400).json({ error: "ID draft không hợp lệ" });
            return;
        }
        const deleted = await prisma_1.prisma.draftSession.deleteMany({
            where: {
                draft_id: draftId,
                user_id: req.user.userId
            },
        });
        if (deleted.count === 0) {
            res.status(404).json({ error: "Không tìm thấy draft" });
            return;
        }
        res.json({ message: "Đã xóa draft" });
    }
    catch (err) {
        console.error("Delete draft error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=drafts.js.map