import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { createSessionSchema } from "../validators/schemas";

const router = Router();

// Tất cả routes trong file này đều yêu cầu đăng nhập
router.use(authMiddleware);

/**
 * GET /api/sessions
 * Lấy danh sách phiên tính toán của user hiện tại
 */
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await prisma.calculationSession.findMany({
      where: { user_id: req.user!.userId },
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
  } catch (err) {
    console.error("Get sessions error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * GET /api/sessions/:id
 * Lấy chi tiết một phiên (bao gồm tất cả dữ liệu liên quan)
 */
router.get("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = parseInt(req.params.id as string, 10);

    if (isNaN(sessionId)) {
      res.status(400).json({ error: "ID không hợp lệ" });
      return;
    }

    const session = await prisma.calculationSession.findFirst({
      where: {
        session_id: sessionId,
        user_id: req.user!.userId,
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
  } catch (err) {
    console.error("Get session detail error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * POST /api/sessions
 * Tạo phiên tính toán mới (gộp Input + Result trong 1 request)
 * 
 * Body mẫu:
 * {
 *   "session_name": "Băng tải 1 - Lực 5000N",
 *   "input": { "force_f": 5000, "velocity_v": 1.2, "diameter_d": 300 },
 *   "result": {
 *     "equivalent_power": 6.0,
 *     "total_efficiency": 0.85,
 *     "shafts": [
 *       { "shaft_order": 1, "power_p": 5.1, "speed_n": 1450, "torque_t": 33580 },
 *       { "shaft_order": 2, "power_p": 4.9, "speed_n": 362, "torque_t": 129300 }
 *     ]
 *   }
 * }
 */
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. Validate input
    const parsed = createSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Dữ liệu không hợp lệ",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { session_name, input, result } = parsed.data;

    // 2. Tạo session với nested create (tất cả trong 1 transaction)
    const session = await prisma.calculationSession.create({
      data: {
        session_name,
        user_id: req.user!.userId,
        is_synced: true,

        // Tạo bản ghi DesignInput nếu có
        ...(input && {
          design_inputs: {
            create: input,
          },
        }),

        // Tạo bản ghi DesignResult + các bảng con nếu có
        ...(result && {
          design_results: {
            create: {
              equivalent_power: result.equivalent_power,
              total_efficiency: result.total_efficiency,
              required_power_pct: result.required_power_pct,
              total_ratio_ut: result.total_ratio_ut,
              u1_ratio: result.u1_ratio,
              u2_ratio: result.u2_ratio,

              // Nested: Tạo các trục
              ...(result.shafts && {
                shafts: { create: result.shafts },
              }),

              // Nested: Tạo ổ lăn
              ...(result.bearings && {
                bearings: { create: result.bearings },
              }),

              // Nested: Tạo bánh răng
              ...(result.gear_drives && {
                gear_drives: { create: result.gear_drives },
              }),

              // Nested: Tạo vỏ hộp
              ...(result.housings && {
                housings: { create: result.housings },
              }),
            },
          },
        }),
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
  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * DELETE /api/sessions/:id
 * Xóa phiên tính toán (cascade xóa tất cả dữ liệu liên quan)
 */
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = parseInt(req.params.id as string, 10);

    if (isNaN(sessionId)) {
      res.status(400).json({ error: "ID không hợp lệ" });
      return;
    }

    // Kiểm tra quyền sở hữu
    const session = await prisma.calculationSession.findFirst({
      where: {
        session_id: sessionId,
        user_id: req.user!.userId,
      },
    });

    if (!session) {
      res.status(404).json({ error: "Không tìm thấy phiên tính toán" });
      return;
    }

    // Xóa (các bảng con sẽ tự xóa theo nhờ onDelete: Cascade trong schema)
    await prisma.calculationSession.delete({
      where: { session_id: sessionId },
    });

    res.json({ message: "Đã xóa phiên tính toán" });
  } catch (err) {
    console.error("Delete session error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
