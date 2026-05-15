import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import sessionRoutes from "./routes/sessions";
import motorRoutes from "./routes/motors";
import calculateRoutes from "./routes/calculate";
import standardsRoutes from "./routes/standards";
import reportRoutes from "./routes/report";
import dashboardRoutes from "./routes/dashboard";
import draftsRoutes from "./routes/drafts";
import templatesRoutes from "./routes/templates";

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
app.use("/api/standards", standardsRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/drafts", draftsRoutes);
app.use("/api/templates", templatesRoutes);

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
  console.log(`GearDrive API Server running at http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("  POST /api/auth/register");
  console.log("  POST /api/auth/login");
  console.log("  POST /api/auth/logout");
  console.log("  POST /api/auth/forgot-password");
  console.log("  POST /api/auth/reset-password");
  console.log("  GET  /api/auth/me");
  console.log("  GET  /api/sessions");
  console.log("  POST /api/sessions");
  console.log("  GET  /api/sessions/:id");
  console.log("  DELETE /api/sessions/:id");
  console.log("  GET  /api/motors");
  console.log("  GET  /api/motors/:id");
  console.log("  GET  /api/standards");
  console.log("  GET  /api/standards/:tableKey");
  console.log("  POST /api/report/preview");
  console.log("  POST /api/report/pdf");
  console.log("  POST /api/report/print");
  console.log("  GET  /api/dashboard");
  console.log("  GET  /api/drafts");
  console.log("  GET  /api/drafts/latest");
  console.log("  POST /api/drafts/autosave");
  console.log("  GET  /api/templates");
  console.log("  POST /api/templates");
  console.log("  GET  /api/health");
});

export default app;
