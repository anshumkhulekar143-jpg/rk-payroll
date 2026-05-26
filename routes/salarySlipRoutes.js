const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const Employee = require("../models/Employee");
const Company = require("../models/Company");
const authMiddleware = require("../middleware/auth");

router.get("/:employeeId/download", authMiddleware, async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    let company = null;
    if (employee.companyId) {
      company = await Company.findById(employee.companyId);
    }

    if (req.user.role === "superadmin") {
      if (String(employee.createdBy) !== String(req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    if (req.user.role === "companyadmin") {
      if (!req.user.companyId || String(employee.companyId) !== String(req.user.companyId)) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const filename = `Salary_Slip_${employee.employeeId || employee._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);

    doc
      .fontSize(22)
      .fillColor("#1e3a8a")
      .text(company?.companyName || "Company Name", { align: "center" });

    doc.moveDown(0.3);

    doc
      .fontSize(16)
      .fillColor("#111827")
      .text("Salary Slip", { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(11)
      .fillColor("#374151")
      .text(`Owner Name: ${company?.ownerName || "N/A"}`)
      .text(`Company Email: ${company?.email || "N/A"}`)
      .text(`Phone: ${company?.phone || "N/A"}`)
      .text(`Address: ${company?.address || "N/A"}`)
      .text(`GST Number: ${company?.gstNumber || "N/A"}`);

    doc.moveDown(1);

    doc
      .fontSize(12)
      .fillColor("#111827")
      .text(`Employee Name: ${employee.fullName || "N/A"}`)
      .text(`Employee ID: ${employee.employeeId || "N/A"}`)
      .text(`UAN No: ${employee.uanNo || "N/A"}`)
      .text(`ESI No: ${employee.esiNo || "N/A"}`)
      .text(`PF No: ${employee.pfNo || "N/A"}`)
      .text(`Aadhar No: ${employee.aadharNo || "N/A"}`)
      .text(`DOB: ${employee.dob || "N/A"}`)
      .text(`Department: ${employee.department || "N/A"}`)
      .text(`Designation: ${employee.designation || "N/A"}`)
      .text(`Phone: ${employee.phone || "N/A"}`)
      .text(`Email: ${employee.email || "N/A"}`);

    doc.moveDown(1.5);

    doc
      .fontSize(14)
      .fillColor("#1f2937")
      .text("Salary Details");

    doc.moveDown(0.5);

    const rows = [
      ["Gross Salary", `₹${employee.salary || 0}`],
      ["PF", `₹${employee.pf || 0}`],
      ["ESIC", `₹${employee.esic || 0}`],
      ["PT", `₹${employee.pt || 0}`],
      ["TDS", `₹${employee.tds || 0}`],
      ["Net Pay", `₹${employee.netPay || 0}`],
    ];

    rows.forEach(([label, value]) => {
      doc
        .fontSize(11)
        .fillColor("#111827")
        .text(label, 60, doc.y, { continued: true })
        .text(value, 350, doc.y, { align: "right" });
      doc.moveDown(0.5);
    });

    doc.moveDown(1);

    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text("This is a system generated salary slip.", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error("Salary Slip Download Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
});

module.exports = router;