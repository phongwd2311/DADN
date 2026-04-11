import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET /api/motors
 * Lấy danh sách động cơ từ thư viện
 * 
 * Query params:
 *   ?minPower=5    — Lọc động cơ có công suất >= 5 kW
 *   ?minSpeed=1000 — Lọc động cơ có tốc độ >= 1000 rpm
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const minPower = req.query.minPower ? parseFloat(req.query.minPower as string) : undefined;
    const minSpeed = req.query.minSpeed ? parseFloat(req.query.minSpeed as string) : undefined;

    const motors = await prisma.motorLibrary.findMany({
      where: {
        ...(minPower !== undefined && { rated_power: { gte: minPower } }),
        ...(minSpeed !== undefined && { rated_speed: { gte: minSpeed } }),
      },
      orderBy: { rated_power: "asc" },
    });

    res.json({ motors, total: motors.length });
  } catch (err) {
    console.error("Get motors error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * GET /api/motors/:id
 * Lấy chi tiết một động cơ
 */
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const motorId = parseInt(req.params.id as string, 10);

    if (isNaN(motorId)) {
      res.status(400).json({ error: "ID không hợp lệ" });
      return;
    }

    const motor = await prisma.motorLibrary.findUnique({
      where: { motor_id: motorId },
    });

    if (!motor) {
      res.status(404).json({ error: "Không tìm thấy động cơ" });
      return;
    }

    res.json({ motor });
  } catch (err) {
    console.error("Get motor detail error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
