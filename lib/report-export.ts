import type { ChartPoint, Client, Project, Stat, TaskColumn } from "@/types/dashboard";

export type ReportPayload = {
  stats: Stat[];
  chartData: ChartPoint[];
  projects: Project[];
  clients: Client[];
  taskColumns: TaskColumn[];
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createPdfDocument(lines: string[]) {
  const content = lines
    .slice(0, 42)
    .map((line, index) => {
      const size = index === 0 ? 20 : index < 3 ? 12 : 10;
      const y = 742 - index * 16;
      return `BT /F1 ${size} Tf 48 ${y} Td (${escapePdfText(line)}) Tj ET`;
    })
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

export function exportDashboardPdf(payload: ReportPayload) {
  const lines = [
    "FawwazCode Executive Report",
    `Generated: May 2026`,
    "",
    "Key Metrics",
    ...payload.stats.map((stat) => `${stat.label}: ${stat.value} (${stat.change})`),
    "",
    "Revenue Intelligence",
    ...payload.chartData.map(
      (item) =>
        `${item.label}: revenue Rp${item.revenue * 16} jt, projects ${item.projects}, task completion ${item.tasks}%`,
    ),
    "",
    "Active Projects",
    ...payload.projects.map(
      (project) =>
        `${project.name} - ${project.client} - ${project.status} - ${project.progress}% - ${project.deadline}`,
    ),
    "",
    "Client Overview",
    ...payload.clients.map(
      (client) => `${client.name} (${client.company}) - ${client.value} - health ${client.health}%`,
    ),
  ];

  downloadBlob(
    new Blob([createPdfDocument(lines)], { type: "application/pdf" }),
    "Freelance-report.pdf",
  );
}

function table(title: string, rows: string[][]) {
  return `
    <h2>${title}</h2>
    <table>
      ${rows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${String(cell).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`).join("")}</tr>`,
        )
        .join("")}
    </table>
  `;
}

export function exportDashboardExcel(payload: ReportPayload) {
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #111827; }
          h2 { margin-top: 24px; color: #155e75; }
          table { border-collapse: collapse; margin-bottom: 16px; }
          td { border: 1px solid #d4d4d8; padding: 8px 12px; }
          tr:first-child td { font-weight: bold; background: #ecfeff; }
        </style>
      </head>
      <body>
        <h1>FawwazCode Executive Report</h1>
        <p>Generated: May 2026</p>
        ${table("Key Metrics", [
          ["Metric", "Value", "Change"],
          ...payload.stats.map((stat) => [stat.label, stat.value, stat.change]),
        ])}
        ${table("Revenue Intelligence", [
          ["Month", "Revenue (Rp jt)", "Projects", "Task Completion"],
          ...payload.chartData.map((item) => [
            item.label,
            String(item.revenue * 16),
            String(item.projects),
            `${item.tasks}%`,
          ]),
        ])}
        ${table("Projects", [
          ["Project", "Client", "Status", "Priority", "Progress", "Deadline", "Budget"],
          ...payload.projects.map((project) => [
            project.name,
            project.client,
            project.status,
            project.priority,
            `${project.progress}%`,
            project.deadline,
            project.budget,
          ]),
        ])}
        ${table("Clients", [
          ["Client", "Company", "Value", "Health"],
          ...payload.clients.map((client) => [
            client.name,
            client.company,
            client.value,
            `${client.health}%`,
          ]),
        ])}
      </body>
    </html>
  `;

  downloadBlob(
    new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" }),
    "Freelance-report.xls",
  );
}
