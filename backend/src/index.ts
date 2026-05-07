import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import sessionRoutes from "./routes/sessions";
import motorRoutes from "./routes/motors";
import calculateRoutes from "./routes/calculate";

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================
app.use(cors());
app.use(express.json());

// ==================== Routes ====================
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/motors", motorRoutes);
app.use("/api/calculate", calculateRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "GearDrive Backend API",
  });
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     🚀 GearDrive API Server Running     ║
  ║                                          ║
  ║     http://localhost:${PORT}             ║
  ║                                          ║
  ║     Endpoints:                           ║
  ║       POST /api/auth/register            ║
  ║       POST /api/auth/login               ║
  ║       GET  /api/auth/me                  ║
  ║       GET  /api/sessions                 ║
  ║       POST /api/sessions                 ║
  ║       GET  /api/sessions/:id             ║
  ║       DELETE /api/sessions/:id           ║
  ║       GET  /api/motors                   ║
  ║       GET  /api/motors/:id               ║
  ║       GET  /api/health                   ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
