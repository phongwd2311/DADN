import { Router, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

function validateTemplateInput(input: unknown): input is Record<string, unknown> {
  if (typeof input !== "object" || input === null) return false;
  const record = input as Record<string, unknown>;
  const required = ["F", "v", "D", "t1", "T1_ratio", "t2", "T2_ratio", "uh"];
  return required.every((k) => typeof record[k] === "number" && Number.isFinite(record[k] as number));
}

router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rows = await prisma.inputTemplate.findMany({
      where: {
        user_id: req.user!.userId
      },
      orderBy: { updated_at: "desc" },
      take: 50,
    });

    const templates = rows.map((r) => ({
      template_id: r.template_id,
      template_name: r.template_name,
      input: r.input_json,
      is_default: false,
      created_at: r.created_at,
    }));

    res.json({ templates });
  } catch (err) {
    console.error("Get templates error:", err);
    res.status(500).json({ error: "Lá»—i server" });
  }
});

router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { template_name, input } = req.body ?? {};
    if (typeof template_name !== "string" || !template_name.trim()) {
      res.status(400).json({ error: "TĂªn template khĂ´ng há»£p lá»‡" });
      return;
    }
    if (!validateTemplateInput(input)) {
      res.status(400).json({ error: "Template pháº£i cĂ³ Ä‘á»§ 8 thĂ´ng sá»‘ sá»‘ há»c báº¯t buá»™c" });
      return;
    }

    const created = await prisma.inputTemplate.create({
      data: {
        user_id: req.user!.userId,
        template_name: template_name.trim(),
        input_json: input as Prisma.InputJsonValue,
      },
    });

    res.status(201).json({
      message: "Táº¡o template thĂ nh cĂ´ng",
      template: {
        template_id: created.template_id,
        template_name: template_name.trim(),
        input,
        is_default: false,
        created_at: created.created_at,
      },
    });
  } catch (err) {
    console.error("Create template error:", err);
    res.status(500).json({ error: "Lá»—i server" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const templateId = parseInt(req.params.id as string, 10);
    if (Number.isNaN(templateId)) {
      res.status(400).json({ error: "ID template khĂ´ng há»£p lá»‡" });
      return;
    }

    const deleted = await prisma.inputTemplate.deleteMany({
      where: {
        template_id: templateId,
        user_id: req.user!.userId
      },
    });

    if (deleted.count === 0) {
      res.status(404).json({ error: "KhĂ´ng tĂ¬m tháº¥y template" });
      return;
    }

    res.json({ message: "ÄĂ£ xĂ³a template" });
  } catch (err) {
    console.error("Delete template error:", err);
    res.status(500).json({ error: "Lá»—i server" });
  }
});

export default router;

