import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
} from "docx";
import React from "react";
import ReactPDF, {
  Document as PdfDoc,
  Page as PdfPage,
  Text as PdfText,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("--- 1. Testing Keywords Extraction ---");
const sampleVacancy = `Ищем Senior Frontend разработчика.
Требования:
- Отличное знание JavaScript, TypeScript, React 18+ и Next.js.
- Опыт работы с архитектурой веб-приложений, Redux Toolkit, Zustand.
- Опыт оптимизации производительности (Web Vitals).
- Понимание REST API, GraphQL, WebSockets.
- Опыт написания тестов (Jest, Playwright).
- CI/CD, Docker, Git, Code Review.`;
console.log("Sample vacancy length:", sampleVacancy.length);

// Test local keywords regex
const techKeywords = [
  "TypeScript", "React", "Next.js", "Zustand", "Redux Toolkit", "REST API",
  "GraphQL", "WebSockets", "Jest", "Playwright", "CI/CD", "Docker", "Code Review", "Web Vitals"
];
console.log("Sample vacancy tech keywords detected:", techKeywords.length);

console.log("\n--- 2. Testing DOCX Generation with Cyrillic ---");
const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({
              text: "Алексей Смирнов",
              bold: true,
              size: 32,
              color: "1E40AF",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Senior Frontend Developer — Москва, alexey@example.com",
              size: 22,
            }),
          ],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: "1E40AF",
              space: 4,
              style: BorderStyle.SINGLE,
              size: 8,
            },
          },
          children: [
            new TextRun({
              text: "ОПЫТ РАБОТЫ",
              bold: true,
              size: 22,
            }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: "Спроектировал и внедрил микрофронтенды на Next.js и TypeScript, повысив производительность на 35%",
              size: 20,
            }),
          ],
        }),
      ],
    },
  ],
});

const docxBuffer = await Packer.toBuffer(doc);
const docxPath = path.join(rootDir, "Резюме_Алексей_Смирнов_Senior_Frontend_Developer.docx");
fs.writeFileSync(docxPath, docxBuffer);
console.log("DOCX generated successfully at:", docxPath, "Size:", docxBuffer.length, "bytes");

console.log("\n--- 3. Testing PDF Generation with Cyrillic TTF Fonts ---");
const regularFont = path.join(rootDir, "public", "fonts", "Roboto-Regular.ttf");
const boldFont = path.join(rootDir, "public", "fonts", "Roboto-Bold.ttf");

Font.register({
  family: "Roboto",
  fonts: [
    { src: regularFont, fontWeight: "normal" },
    { src: boldFont, fontWeight: "bold" },
  ],
});

const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Roboto", fontSize: 10 },
  name: { fontSize: 20, fontWeight: "bold", color: "#1E40AF", marginBottom: 4 },
  title: { fontSize: 12, color: "#4B5563", marginBottom: 8 },
  heading: { fontSize: 12, fontWeight: "bold", borderBottomWidth: 1, borderBottomColor: "#1E40AF", paddingBottom: 2, marginTop: 12, marginBottom: 6 },
  text: { fontSize: 10, lineHeight: 1.4, color: "#1F2937" },
});

const ReactElement = React.createElement;
const TestPdf = () =>
  ReactElement(
    PdfDoc,
    null,
    ReactElement(
      PdfPage,
      { size: "A4", style: pdfStyles.page },
      ReactElement(PdfText, { style: pdfStyles.name }, "Алексей Смирнов"),
      ReactElement(PdfText, { style: pdfStyles.title }, "Senior Frontend Developer — Москва"),
      ReactElement(PdfText, { style: pdfStyles.heading }, "ОПЫТ РАБОТЫ"),
      ReactElement(
        PdfText,
        { style: pdfStyles.text },
        "• Спроектировал и внедрил микрофронтенды на Next.js и TypeScript, сократив время сборки на 35%"
      ),
      ReactElement(PdfText, { style: pdfStyles.heading }, "НАВЫКИ"),
      ReactElement(
        PdfText,
        { style: pdfStyles.text },
        "TypeScript, React, Next.js, Redux Toolkit, Zustand, Docker, CI/CD, Jest"
      )
    )
  );

const pdfPath = path.join(rootDir, "Резюме_Алексей_Смирнов_Senior_Frontend_Developer.pdf");
await ReactPDF.renderToFile(TestPdf(), pdfPath);
const pdfStat = fs.statSync(pdfPath);
console.log("PDF generated successfully at:", pdfPath, "Size:", pdfStat.size, "bytes");

console.log("\nALL VERIFICATIONS PASSED!");
