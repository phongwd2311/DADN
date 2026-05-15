"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
const defaultTemplates = [
    {
        template_id: "default_1",
        template_name: "Băng tải nhẹ",
        input: { F: 2500, v: 0.8, D: 300, t1: 60, T1_ratio: 1, t2: 40, T2_ratio: 0.65, uh: 10, tmm_t1_ratio: 1.4 },
        is_default: true,
    },
    {
        template_id: "default_2",
        template_name: "Băng tải trung bình",
        input: { F: 4000, v: 1, D: 320, t1: 55, T1_ratio: 1, t2: 45, T2_ratio: 0.7, uh: 12.5, tmm_t1_ratio: 1.6 },
        is_default: true,
    },
    {
        template_id: "default_3",
        template_name: "Băng tải tải nặng",
        input: { F: 6000, v: 1.2, D: 350, t1: 50, T1_ratio: 1, t2: 50, T2_ratio: 0.75, uh: 14, tmm_t1_ratio: 1.8 },
        is_default: true,
    },
];
function validateTemplateInput(input) {
    if (typeof input !== "object" || input === null)
        return false;
    const record = input;
    const required = ["F", "v", "D", "t1", "T1_ratio", "t2", "T2_ratio", "uh"];
    return required.every((k) => typeof record[k] === "number" && Number.isFinite(record[k]));
}
router.get("/", async (req, res) => {
    try {
        const rows = await prisma_1.prisma.inputTemplate.findMany({
            where: {
                user_id: req.user.userId
            },
            orderBy: { updated_at: "desc" },
            take: 50,
        });
        const templates = [
            ...defaultTemplates,
            ...rows.map((r) => ({
                template_id: r.template_id,
                template_name: r.template_name,
                input: r.input_json,
                is_default: false,
                created_at: r.created_at,
            })),
        ];
        res.json({ templates });
    }
    catch (err) {
        console.error("Get templates error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
router.post("/", async (req, res) => {
    try {
        const { template_name, input } = req.body ?? {};
        if (typeof template_name !== "string" || !template_name.trim()) {
            res.status(400).json({ error: "Tên template không hợp lệ" });
            return;
        }
        if (!validateTemplateInput(input)) {
            res.status(400).json({ error: "Template phải có đủ 8 thông số số học bắt buộc" });
            return;
        }
        const created = await prisma_1.prisma.inputTemplate.create({
            data: {
                user_id: req.user.userId,
                template_name: template_name.trim(),
                input_json: input,
            },
        });
        res.status(201).json({
            message: "Tạo template thành công",
            template: {
                template_id: created.template_id,
                template_name: template_name.trim(),
                input,
                is_default: false,
                created_at: created.created_at,
            },
        });
    }
    catch (err) {
        console.error("Create template error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const templateId = parseInt(req.params.id, 10);
        if (Number.isNaN(templateId)) {
            res.status(400).json({ error: "ID template không hợp lệ" });
            return;
        }
        const deleted = await prisma_1.prisma.inputTemplate.deleteMany({
            where: {
                template_id: templateId,
                user_id: req.user.userId
            },
        });
        if (deleted.count === 0) {
            res.status(404).json({ error: "Không tìm thấy template" });
            return;
        }
        res.json({ message: "Đã xóa template" });
    }
    catch (err) {
        console.error("Delete template error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=templates.js.map