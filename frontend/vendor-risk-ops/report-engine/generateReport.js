import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

import template from "./reportTemplate.js";

// Import your frontend dummy data
import {
  portfolioData,
  vendorList,
  vendorDetailData,
  alertsData,
  complianceData,
  auditLogs,
} from "../app/dummyData.js";

// Resolve paths safely (ES module compatibility)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Combine all report data
const reportData = {
  portfolioData,
  vendorList,
  vendorDetailData,
  alertsData,
  complianceData,
  auditLogs,
};

// Output paths
const OUTPUT_DIR = path.join(__dirname, "output");
const HTML_PATH = path.join(OUTPUT_DIR, "report.html");
const PDF_PATH = path.join(OUTPUT_DIR, "vendor-risk-report.pdf");
const cssPath = path.join(__dirname, "reportStyles.css");
const css = await fs.readFile(cssPath, "utf8");
async function generateReport() {
  console.log("Generating Vendor Risk Report...");

  // Ensure output directory exists
  await fs.ensureDir(OUTPUT_DIR);

  // Generate HTML from template
  const html = template(reportData, css);

  await fs.writeFile(HTML_PATH, html);

  console.log("HTML report created.");

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  // Load HTML file
  await page.goto(`file://${HTML_PATH}`, {
    waitUntil: "networkidle0",
  });

  // wait for charts to exist
  await page.waitForSelector("canvas");

  // give charts time to render
  await page.evaluate(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  // Generate PDF
  await page.pdf({
    path: PDF_PATH,
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  console.log("PDF report generated successfully.");
  console.log("Location:", PDF_PATH);
}

// Run generator
generateReport();
