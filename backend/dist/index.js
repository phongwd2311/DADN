"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const sessions_1 = __importDefault(require("./routes/sessions"));
const motors_1 = __importDefault(require("./routes/motors"));
const calculate_1 = __importDefault(require("./routes/calculate"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// ==================== Middleware ====================
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ==================== Routes ====================
app.use("/api/auth", auth_1.default);
app.use("/api/sessions", sessions_1.default);
app.use("/api/motors", motors_1.default);
app.use("/api/calculate", calculate_1.default);
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
exports.default = app;
//# sourceMappingURL=index.js.map