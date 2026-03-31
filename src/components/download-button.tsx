"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";

/**
 * Button that captures #resume-content and exports it as a PDF.
 * Uses html2canvas → jsPDF pipeline for clean output.
 */
export function DownloadButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const el = document.getElementById("resume-content");
    if (!el) return;

    setLoading(true);

    try {
      // Render the resume to canvas at 2x resolution
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // Create A4-size PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Scale to fit PDF width
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      // If content fits one page
      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, scaledHeight);
      } else {
        // Multi-page handling
        let y = 0;
        while (y < imgHeight) {
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = imgWidth;
          const remainingHeight = imgHeight - y;
          pageCanvas.height = Math.min(
            pdfHeight / ratio,
            remainingHeight
          );

          const ctx = pageCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              canvas,
              0, y,                             // source position
              imgWidth, pageCanvas.height,       // source dimensions
              0, 0,                              // destination position
              imgWidth, pageCanvas.height         // destination dimensions
            );

            const pageData = pageCanvas.toDataURL("image/png");
            if (y > 0) pdf.addPage();
            pdf.addImage(
              pageData,
              "PNG",
              0,
              0,
              pdfWidth,
              pageCanvas.height * ratio
            );
          }

          y += pageCanvas.height;
        }
      }

      pdf.save("resume.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200",
        "bg-gradient-to-r from-emerald-500 to-teal-500",
        "hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25",
        "active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Generating…
        </>
      ) : (
        <>
          <Download size={16} />
          Download PDF
        </>
      )}
    </button>
  );
}
