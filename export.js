// Export functionality for CV
class CVExporter {
  static async downloadPDF(mode = "single") {
    try {
      const url = `/api/cv/export/pdf?mode=${mode}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "CV.pdf";

      // Create download link
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log(`PDF downloaded: ${filename}`);
    } catch (error) {
      console.error("PDF download error:", error);
      alert(`Failed to download PDF: ${error.message}`);
    }
  }

  static async exportToPDF() {
    // Use the browser's print dialog with PDF preset
    const printStyles = `
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                    display: block !important;
                    min-height: auto !important;
                }

                /* Hide ALL controls and buttons when exporting */
                #cv-controls,
                .edit-btn,
                .export-btn,
                .dropdown-menu,
                .dropdown-toggle,
                #toolbar,
                #edit-container > *:not(#preview-content),
                #split-container,
                #editor-panel,
                #preview-panel > *:not(#preview-content),
                #preview-header {
                    display: none !important;
                }

                /* For edit page, only show the CV preview */
                #edit-container {
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                }

                #preview-content {
                    width: 100% !important;
                    height: auto !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    display: block !important;
                }

                cv-display {
                    width: 210mm !important;
                    max-width: none !important;
                    margin: 0 auto !important;
                    box-shadow: none !important;
                    page-break-inside: avoid;
                }

                @page {
                    size: A4;
                    margin: 0.5in;
                }
            }
        `;

    // Create a temporary style element
    const styleElement = document.createElement("style");
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);

    try {
      // Use the browser's print dialog
      window.print();
    } finally {
      // Remove the temporary styles after a short delay
      setTimeout(() => {
        document.head.removeChild(styleElement);
      }, 1000);
    }
  }

  static setupExportDropdown(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) {
      console.warn(`Export button with id '${buttonId}' not found`);
      return;
    }

    // Find or create dropdown menu
    let menu = button.nextElementSibling;
    if (!menu || !menu.classList.contains("dropdown-menu")) {
      menu = document.createElement("div");
      menu.className = "dropdown-menu";
      menu.innerHTML = `
                <button class="dropdown-item" data-export="pdf-download">
                    <span class="dropdown-icon">⬇️</span>
                    Download PDF (Single Page)
                </button>
                <button class="dropdown-item" data-export="pdf-print">
                    <span class="dropdown-icon">🖨️</span>
                    Download PDF (Print Layout)
                </button>
                <button class="dropdown-item" data-export="browser-print">
                    <span class="dropdown-icon">📄</span>
                    Print/Save via Browser
                </button>
            `;
      button.parentNode.insertBefore(menu, button.nextSibling);
      console.log(`Created dropdown menu for ${buttonId}`);
    }

    // Toggle dropdown on button click
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("show");

      // Close other dropdowns
      document.querySelectorAll(".dropdown-menu.show").forEach((otherMenu) => {
        if (otherMenu !== menu) {
          otherMenu.classList.remove("show");
        }
      });
    });

    // Handle export option clicks
    menu.addEventListener("click", async (e) => {
      const exportType = e.target.closest(".dropdown-item")?.dataset.export;
      if (exportType === "pdf-download") {
        await CVExporter.downloadPDF("single");
        menu.classList.remove("show");
      } else if (exportType === "pdf-print") {
        await CVExporter.downloadPDF("print");
        menu.classList.remove("show");
      } else if (exportType === "browser-print") {
        await CVExporter.exportToPDF();
        menu.classList.remove("show");
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      menu.classList.remove("show");
    });

    // Prevent dropdown from closing when clicking inside it
    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}

// Auto-setup export dropdowns when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  CVExporter.setupExportDropdown("export-dropdown-btn");
  CVExporter.setupExportDropdown("edit-export-dropdown-btn");
});

// Export for use in other scripts
window.CVExporter = CVExporter;
