import { Router, Request, Response } from "express";

const router = Router();

type ReportRequestBody = {
  input?: Record<string, unknown>;
  result?: Record<string, unknown>;
  motor?: Record<string, unknown> | null;
};

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseReportBody(body: unknown): { ok: true; body: ReportRequestBody } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Du lieu bao cao khong hop le" };
  }

  const reportBody = body as ReportRequestBody;
  if (!reportBody.input || !reportBody.result) {
    return { ok: false, error: "Du lieu bao cao khong hop le" };
  }

  const chainStrength = (reportBody.result.chainStrength as Record<string, unknown> | undefined) ?? {};
  const hasDesignError = chainStrength.passed === false || chainStrength.contactPassed === false;
  if (hasDesignError) {
    return { ok: false, error: "Khong the tao bao cao" };
  }

  return { ok: true, body: reportBody };
}

function buildPreviewData(body: ReportRequestBody) {
  const result = body.result as Record<string, unknown>;

  const Plv = result.Plv;
  const Ptd = result.Ptd;
  const eta = result.eta;
  const Pct = result.Pct;
  const ut = result.ut;
  const ux = result.ux;
  const uh = result.uh;

  const formulas = [
    {
      id: "SR-05.1",
      formula: "Plv = F * v / 1000",
      substitution:
        isNumber(Plv) && isNumber(body.input?.F) && isNumber(body.input?.v)
          ? `Plv = ${body.input.F} * ${body.input.v} / 1000 = ${Plv.toFixed(4)} kW`
          : null,
    },
    {
      id: "FR-07",
      formula: "Pct = Ptd / eta",
      substitution:
        isNumber(Ptd) && isNumber(eta) && isNumber(Pct)
          ? `Pct = ${Ptd.toFixed(4)} / ${eta.toFixed(4)} = ${Pct.toFixed(4)} kW`
          : null,
    },
    {
      id: "FR-08",
      formula: "ut = ndc / nlv ; ux = ut / uh",
      substitution:
        isNumber(ut) && isNumber(ux) && isNumber(uh)
          ? `ut = ${ut.toFixed(4)} ; ux = ${ux.toFixed(4)} ; uh = ${uh.toFixed(4)}`
          : null,
    },
  ];

  return {
    generated_at: new Date().toISOString(),
    exportable: true,
    sections: {
      input: body.input,
      motor: body.motor,
      result: body.result,
      formulas,
      units: {
        power: "kW",
        speed: "vong/phut",
        torque: "N.mm",
        length: "mm",
        force: "N",
      },
    },
  };
}

function sanitizePdfText(value: unknown): string {
  const raw = String(value ?? "");
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/[()\\]/g, "\\$&");
}

function toPdf(contentLines: string[]): Buffer {
  const contentStream = contentLines.join("\n");
  const objects: string[] = [];

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "<< /Type /Pages /Count 1 /Kids [3 0 R] >>";
  objects[3] =
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[5] = `<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}\nendstream`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let id = 1; id <= 5; id += 1) {
    offsets[id] = Buffer.byteLength(pdf, "utf8");
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 6\n0000000000 65535 f \n`;
  for (let id = 1; id <= 5; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

function buildPdfLines(preview: ReturnType<typeof buildPreviewData>): string[] {
  const lines: string[] = [];

  const generatedAt = new Date(preview.generated_at).toLocaleString("vi-VN");
  const input = (preview.sections.input as Record<string, unknown>) ?? {};
  const result = (preview.sections.result as Record<string, unknown>) ?? {};
  const formulas = Array.isArray(preview.sections.formulas) ? preview.sections.formulas : [];

  lines.push("BT /F1 15 Tf 50 800 Td (GEARDRIVE TECHNICAL REPORT) Tj ET");
  lines.push(`BT /F1 10 Tf 50 784 Td (${sanitizePdfText(`Generated at: ${generatedAt}`)}) Tj ET`);

  const dataRows: Array<[string, unknown]> = [
    ["Input F (N)", input.F],
    ["Input v (m/s)", input.v],
    ["Input D (mm)", input.D],
    ["Input L (h)", input.L],
    ["Result Plv (kW)", result.Plv],
    ["Result Ptd (kW)", result.Ptd],
    ["Result Pct (kW)", result.Pct],
    ["Result eta", result.eta],
    ["Result ut", result.ut],
    ["Result ux", result.ux],
    ["Result uh", result.uh],
  ];

  let y = 760;
  for (const [label, value] of dataRows) {
    lines.push(`BT /F1 10 Tf 50 ${y} Td (${sanitizePdfText(`${label}: ${value ?? "N/A"}`)}) Tj ET`);
    y -= 14;
  }

  y -= 8;
  lines.push(`BT /F1 12 Tf 50 ${y} Td (Calculation formulas) Tj ET`);
  y -= 16;

  for (const item of formulas) {
    if (!item || typeof item !== "object") continue;
    const id = sanitizePdfText((item as Record<string, unknown>).id ?? "N/A");
    const formula = sanitizePdfText((item as Record<string, unknown>).formula ?? "N/A");
    const substitution = sanitizePdfText((item as Record<string, unknown>).substitution ?? "N/A");

    lines.push(`BT /F1 10 Tf 50 ${y} Td (${id}: ${formula}) Tj ET`);
    y -= 14;
    lines.push(`BT /F1 9 Tf 60 ${y} Td (${substitution}) Tj ET`);
    y -= 16;

    if (y < 60) {
      break;
    }
  }

  return lines;
}

function buildPrintHtml(preview: ReturnType<typeof buildPreviewData>): string {
  const generatedAt = new Date(preview.generated_at).toLocaleString("vi-VN");
  const input = (preview.sections.input as Record<string, unknown>) ?? {};
  const result = (preview.sections.result as Record<string, unknown>) ?? {};
  const formulas = Array.isArray(preview.sections.formulas) ? preview.sections.formulas : [];

  const formulaHtml = formulas
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const row = item as Record<string, unknown>;
      return `<li><strong>${row.id ?? "N/A"}:</strong> ${row.formula ?? "N/A"}<br/><em>${row.substitution ?? ""}</em></li>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>GearDrive Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 32px; color: #222; }
      h1 { margin-bottom: 4px; }
      .meta { color: #666; margin-bottom: 20px; font-size: 12px; }
      .grid { display: grid; grid-template-columns: 220px 1fr; row-gap: 8px; }
      .key { font-weight: 700; }
      h2 { margin-top: 24px; margin-bottom: 10px; }
      li { margin-bottom: 10px; }
      em { color: #0d6b30; font-family: Consolas, monospace; }
    </style>
  </head>
  <body>
    <h1>GearDrive Technical Report</h1>
    <div class="meta">Generated at: ${generatedAt}</div>

    <h2>Inputs</h2>
    <div class="grid">
      <div class="key">F (N)</div><div>${input.F ?? "N/A"}</div>
      <div class="key">v (m/s)</div><div>${input.v ?? "N/A"}</div>
      <div class="key">D (mm)</div><div>${input.D ?? "N/A"}</div>
      <div class="key">L (h)</div><div>${input.L ?? "N/A"}</div>
    </div>

    <h2>Results</h2>
    <div class="grid">
      <div class="key">Plv (kW)</div><div>${result.Plv ?? "N/A"}</div>
      <div class="key">Ptd (kW)</div><div>${result.Ptd ?? "N/A"}</div>
      <div class="key">Pct (kW)</div><div>${result.Pct ?? "N/A"}</div>
      <div class="key">eta</div><div>${result.eta ?? "N/A"}</div>
      <div class="key">ut</div><div>${result.ut ?? "N/A"}</div>
      <div class="key">ux</div><div>${result.ux ?? "N/A"}</div>
      <div class="key">uh</div><div>${result.uh ?? "N/A"}</div>
    </div>

    <h2>Formulas</h2>
    <ol>${formulaHtml}</ol>
  </body>
</html>`;
}

router.post("/preview", (req: Request, res: Response): void => {
  const parsed = parseReportBody(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  res.json({
    ...buildPreviewData(parsed.body),
    note: "Preview data for report generation.",
  });
});

router.post("/pdf", (req: Request, res: Response): void => {
  const parsed = parseReportBody(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const preview = buildPreviewData(parsed.body);
  const pdfBuffer = toPdf(buildPdfLines(preview));
  const fileName = `geardrive-report-${Date.now()}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=\"${fileName}\"`);
  res.setHeader("Content-Length", String(pdfBuffer.byteLength));
  res.status(200).send(pdfBuffer);
});

router.post("/print", (req: Request, res: Response): void => {
  const parsed = parseReportBody(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const preview = buildPreviewData(parsed.body);
  const html = buildPrintHtml(preview);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
});

export default router;
