// =================== PDF EXPORT (WITH WATERMARK) ====================

function exportPDF(tableId, title) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const logo = "/LK-Net-POS/assets/logo.png"; // << SAME LOGO PATH YOU USE

    // ===== DRAW WATERMARK =====
    const watermarkImg = new Image();
    watermarkImg.src = logo;

    watermarkImg.onload = () => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);

        // Title
        pdf.text(title, 105, 15, { align: "center" });

        // Draw watermark (center)
        pdf.setGState(pdf.GState({ opacity: 0.15 }));
        pdf.addImage(watermarkImg, 'PNG', 40, 70, 130, 100);
        pdf.setGState(pdf.GState({ opacity: 1 }));

        // ===== TABLE EXPORT =====
        pdf.autoTable({
            html: tableId,
            theme: "striped",
            styles: { fontSize: 11, halign: 'center' },
            headStyles: { fillColor: [21, 101, 192] },
            startY: 35,
            didDrawPage: (data) => {
                // Header Logo on all pages
                pdf.addImage(watermarkImg, "PNG", 10, 6, 18, 18);
                pdf.setFontSize(12);
                pdf.text("LK Net Centre", 30, 15);
            }
        });

        pdf.save(`${title}.pdf`);
    };
}

// =================== USAGE SAMPLE ====================
// exportPDF('#salesTable', 'Daily Report');
