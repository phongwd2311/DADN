import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  buildGearboxRatioTable,
  CHAIN_MAX_PITCH_TABLE,
  CHAIN_Z1_TABLE,
  getPmaxBySprocketSpeed,
  getStandardsTableData,
  StandardTableKey,
} from "../constants/standards";

const router = Router();

const STANDARD_TABLES: Array<{ key: StandardTableKey; title: string }> = [
  { key: "P1.2", title: "Động cơ điện" },
  { key: "3.1", title: "Tỷ số truyền hộp giảm tốc" },
  { key: "5.4", title: "Số răng đĩa xích" },
  { key: "5.5", title: "Thông số xích" },
  { key: "5.8", title: "Bước xích cho phép" },
];

router.get("/", (_req: Request, res: Response): void => {
  res.json({ tables: STANDARD_TABLES });
});

router.get("/:tableKey", async (req: Request, res: Response): Promise<void> => {
  try {
    const tableKey = req.params.tableKey as StandardTableKey;

    if (!STANDARD_TABLES.some((table) => table.key === tableKey)) {
      res.status(404).json({ error: "Không tìm thấy bảng tiêu chuẩn" });
      return;
    }

    if (tableKey === "P1.2") {
      const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined;
      const minPower = typeof req.query.minPower === "string" ? Number(req.query.minPower) : undefined;
      const maxPower = typeof req.query.maxPower === "string" ? Number(req.query.maxPower) : undefined;
      const minSpeed = typeof req.query.minSpeed === "string" ? Number(req.query.minSpeed) : undefined;
      const maxSpeed = typeof req.query.maxSpeed === "string" ? Number(req.query.maxSpeed) : undefined;

      const motors = await prisma.motorLibrary.findMany({
        where: {
          ...(q ? { model: { contains: q, mode: "insensitive" } } : {}),
          ...(Number.isFinite(minPower) ? { rated_power: { gte: minPower } } : {}),
          ...(Number.isFinite(maxPower)
            ? {
                rated_power: {
                  ...(Number.isFinite(minPower) ? { gte: minPower } : {}),
                  lte: maxPower,
                },
              }
            : {}),
          ...(Number.isFinite(minSpeed) ? { rated_speed: { gte: minSpeed } } : {}),
          ...(Number.isFinite(maxSpeed)
            ? {
                rated_speed: {
                  ...(Number.isFinite(minSpeed) ? { gte: minSpeed } : {}),
                  lte: maxSpeed,
                },
              }
            : {}),
        },
        orderBy: [{ rated_power: "asc" }, { rated_speed: "asc" }],
      });

      res.json({ table: "P1.2", total: motors.length, data: motors });
      return;
    }

    if (tableKey === "3.1") {
      const gearboxType = req.query.gearboxType === "PHAN_DOI" ? "PHAN_DOI" : "KHAI_TRIEN";
      const minUh = typeof req.query.minUh === "string" ? Number(req.query.minUh) : undefined;
      const maxUh = typeof req.query.maxUh === "string" ? Number(req.query.maxUh) : undefined;

      let rows = buildGearboxRatioTable(gearboxType);

      if (Number.isFinite(minUh)) {
        rows = rows.filter((row) => row.uh >= Number(minUh));
      }

      if (Number.isFinite(maxUh)) {
        rows = rows.filter((row) => row.uh <= Number(maxUh));
      }

      res.json({ table: "3.1", gearboxType, total: rows.length, data: rows });
      return;
    }

    if (tableKey === "5.4") {
      const u = typeof req.query.u === "string" ? Number(req.query.u) : undefined;

      if (!Number.isFinite(u)) {
        res.json({ table: "5.4", data: CHAIN_Z1_TABLE });
        return;
      }

      const uVal = Number(u);
      const matched = CHAIN_Z1_TABLE.find((row) => uVal >= row.u_from && uVal < row.u_to) ?? CHAIN_Z1_TABLE[CHAIN_Z1_TABLE.length - 1];
      const z1Formula = Math.max(15, Math.round(29 - 2 * uVal));

      res.json({
        table: "5.4",
        query: { u: uVal },
        recommended: {
          z1_formula: z1Formula,
          z1_table_range: [matched.z1_to, matched.z1_from],
        },
        data: CHAIN_Z1_TABLE,
      });
      return;
    }

    if (tableKey === "5.8") {
      const n = typeof req.query.n === "string" ? Number(req.query.n) : undefined;

      if (!Number.isFinite(n)) {
        res.json({ table: "5.8", data: CHAIN_MAX_PITCH_TABLE });
        return;
      }

      const nVal = Number(n);

      res.json({
        table: "5.8",
        query: { n: nVal },
        recommended: { p_max: getPmaxBySprocketSpeed(nVal) },
        data: CHAIN_MAX_PITCH_TABLE,
      });
      return;
    }

    res.json({ table: tableKey, data: getStandardsTableData(tableKey) });
  } catch (err) {
    console.error("Standards error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
