const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir todos los archivos desde el nivel raíz
app.use(express.static(path.join(__dirname)));

// Ruta para generar el PDF
app.get("/download-pdf", async (req, res) => {
  try {
    // Inicia Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Carga el archivo HTML desde el nivel raíz
    const htmlFilePath = path.join(__dirname, "manifiesto.html");
    const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Genera el PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
      printBackground: true,
    });

    await browser.close();

    // Devuelve el PDF como descarga
    res.setHeader("Content-Disposition", 'attachment; filename="manifiesto.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).send("Error al generar el PDF.");
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});