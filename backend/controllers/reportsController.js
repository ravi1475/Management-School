const PDFDocument = require("pdfkit");

exports.generateReportPDF = (req, res) => {
  // Create a new PDF document
  const doc = new PDFDocument();
  
  // Set header to trigger download
  res.setHeader("Content-disposition", "attachment; filename=report.pdf");
  res.setHeader("Content-type", "application/pdf");
  
  // Add content to the PDF
  doc.fontSize(20).text("Reports & Analytics Dashboard", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text("This report contains trend analysis and summary data.", {
    align: "left",
  });
  
  // Additional content and styling can go here
  // For example, you can add tables, images, or charts
  
  // Pipe the PDF into the response
  doc.pipe(res);
  doc.end();
};