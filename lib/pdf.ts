import PDFDocument from "pdfkit";

export function generateWeeklyPdf(options: {
  weekRange: string;
  avgScore: number;
  topMood: string;
  insights: string;
  quote: string;
}) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.fontSize(20).text("Insight Journal – Weekly Summary", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Week: ${options.weekRange}`, { align: "center" });
  doc.moveDown(1.5);

  doc.fontSize(14).text("Highlights", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).list([
    `Average mood score: ${(options.avgScore * 100).toFixed(0)}%`,
    `Top mood: ${options.topMood}`,
  ]);

  doc.moveDown(1.2);
  doc.fontSize(14).text("AI Insight", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(options.insights);

  doc.moveDown(1.2);
  doc.fontSize(14).text("Motivational Quote", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`“${options.quote}”`, { align: "center", oblique: true });

  doc.end();
  return doc;
}


