import PDFDocument from 'pdfkit';
import BatchPredictionRequest from '../models/BatchPredictionRequest.js';

// @desc    Generate PDF report for batch prediction
// @route   GET /api/predictions/batch/:id/pdf
// @access  Private
export const generateMatchingReportPDF = async (req, res) => {
    try {
        // Fetch prediction details
        const batchPrediction = await BatchPredictionRequest.findById(req.params.id)
            .populate('recipientId')
            .populate('donorIds')
            .populate('user', 'name email role');

        if (!batchPrediction) {
            return res.status(404).json({
                success: false,
                message: 'Batch prediction not found'
            });
        }

        // Authorization check
        if (batchPrediction.user._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this prediction'
            });
        }

        // Get top 3 donors
        const top3Donors = batchPrediction.predictions
            .sort((a, b) => a.probability - b.probability)
            .slice(0, 3)
            .map((pred, index) => {
                const donor = batchPrediction.donorIds.find(d => d.donorId === pred.donorId);
                return {
                    rank: index + 1,
                    donorId: pred.donorId,
                    donor: donor,
                    matchScore: Math.round((1 - pred.probability) * 100),
                    probability: pred.probability,
                    riskCategory: pred.riskCategory,
                    parameters: {
                        bloodGroup: donor?.bloodGroup || 'N/A',
                        age: donor?.age || 0,
                        bmi: donor?.bmi || 0,
                        gfr: donor?.gfr || 0,
                        hlaMatchScore: pred.hlaMatchScore || 0,
                        diabetes: donor?.diabetes || false,
                        hypertension: donor?.hypertension || false,
                        smoking: donor?.smoking || false
                    }
                };
            });

        const recipient = batchPrediction.recipientId;
        const topDonor = top3Donors[0];

        // Generate explanations
        const reasons = generateMatchExplanation(topDonor, recipient);

        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="Donor_Matching_Report_${req.params.id.slice(-8)}.pdf"`
        );

        // Pipe PDF to response
        doc.pipe(res);

        // Generate PDF content
        addReportHeader(doc, batchPrediction._id);
        addRecipientSection(doc, recipient);
        addTopDonorSection(doc, topDonor);
        addExplanationSection(doc, reasons);
        addComparisonTable(doc, top3Donors);
        addDisclaimer(doc, batchPrediction.user);

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF report',
            error: error.message
        });
    }
};

// Helper: Add report header
function addReportHeader(doc, reportId) {
    const pageWidth = doc.page.width;
    const margin = doc.page.margins.left;
    const contentWidth = pageWidth - margin * 2;

    // Medical green brand color
    doc.fillColor('#43a047');

    // Title
    doc.fontSize(24)
        .font('Helvetica-Bold')
        .text('NEPHROSENSE', margin, 50, { align: 'center' });

    doc.fontSize(14)
        .fillColor('#666666')
        .font('Helvetica')
        .text('Donor-Recipient Matching Report', { align: 'center' });

    // Divider line
    doc.moveTo(margin, 110)
        .lineTo(pageWidth - margin, 110)
        .strokeColor('#43a047')
        .lineWidth(2)
        .stroke();

    // Report metadata
    doc.fontSize(10)
        .fillColor('#424242')
        .font('Helvetica');

    const metaY = 125;
    doc.text(`Report ID: ${reportId.toString().slice(-8).toUpperCase()}`, margin, metaY);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 200, metaY, { width: 200, align: 'right' });

    doc.moveDown(2);
}

// Helper: Add recipient information section
function addRecipientSection(doc, recipient) {
    const margin = doc.page.margins.left;
    const y = doc.y + 20;

    // Section header
    doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#43a047')
        .text('RECIPIENT INFORMATION', margin, y);

    // Underline
    doc.moveTo(margin, y + 18)
        .lineTo(margin + 250, y + 18)
        .strokeColor('#43a047')
        .lineWidth(1.5)
        .stroke();

    // Content
    doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#424242');

    const contentY = y + 30;
    const col1X = margin;
    const col2X = margin + 250;

    doc.text(`Recipient ID: ${recipient.recipientId}`, col1X, contentY);
    doc.text(`Age: ${recipient.age} years`, col2X, contentY);

    doc.text(`Blood Group: ${recipient.bloodGroup}`, col1X, contentY + 15);
    doc.text(`Urgency Score: ${recipient.urgencyScore || 'N/A'}`, col2X, contentY + 15);

    doc.text(`Dialysis Duration: ${recipient.dialysisYears || 0} years`, col1X, contentY + 30);

    if (recipient.name) {
        doc.text(`Name: ${recipient.name}`, col1X, contentY + 45);
    }

    doc.moveDown(3.5);
}

// Helper: Add top donor section with highlight
function addTopDonorSection(doc, topDonor) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;
    const y = doc.y + 20;

    // Highlighted box for top match
    doc.rect(margin - 5, y - 5, contentWidth + 10, 120)
        .fillAndStroke('#e8f5e9', '#43a047')
        .lineWidth(2);

    // Star icon (using text)
    doc.fontSize(20)
        .fillColor('#43a047')
        .font('Helvetica-Bold')
        .text('★', margin + 5, y + 5);

    // Title
    doc.fontSize(14)
        .fillColor('#43a047')
        .text('TOP RECOMMENDED DONOR', margin + 35, y + 10);

    // Donor details
    doc.fontSize(11)
        .fillColor('#424242')
        .font('Helvetica-Bold');

    const detailY = y + 35;
    const col1X = margin + 10;
    const col2X = margin + 270;

    doc.text(`Donor ID: ${topDonor.donorId}`, col1X, detailY);
    doc.text(`Match Score: ${topDonor.matchScore}%`, col2X, detailY);

    // Risk category with color coding
    const riskCategory = topDonor.riskCategory?.category || 'Unknown';
    let riskColor = '#666666';
    if (riskCategory.includes('Low')) riskColor = '#43a047';
    else if (riskCategory.includes('Medium')) riskColor = '#f57c00';
    else if (riskCategory.includes('High')) riskColor = '#d32f2f';

    doc.fillColor(riskColor)
        .text(`Risk Category: ${riskCategory}`, col1X, detailY + 15);

    doc.fillColor('#424242')
        .text(`Rejection Risk: ${Math.round(topDonor.probability * 100)}%`, col2X, detailY + 15);

    // Parameters
    doc.fontSize(10)
        .font('Helvetica');

    const paramY = detailY + 40;
    doc.text(`Blood Group: ${topDonor.parameters.bloodGroup}`, col1X, paramY);
    doc.text(`Age: ${topDonor.parameters.age} years`, col2X, paramY);

    doc.text(`eGFR: ${topDonor.parameters.gfr} ml/min`, col1X, paramY + 15);
    doc.text(`HLA Match: ${topDonor.parameters.hlaMatchScore}/6`, col2X, paramY + 15);

    doc.text(`BMI: ${topDonor.parameters.bmi}`, col1X, paramY + 30);

    doc.moveDown(5);
}

// Helper: Add explanation section
function addExplanationSection(doc, reasons) {
    const margin = doc.page.margins.left;
    const y = doc.y + 20;

    // Section header
    doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#43a047')
        .text('WHY THIS DONOR IS RECOMMENDED', margin, y);

    // Underline
    doc.moveTo(margin, y + 18)
        .lineTo(margin + 300, y + 18)
        .strokeColor('#43a047')
        .lineWidth(1.5)
        .stroke();

    // Bullet points
    doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#424242');

    let bulletY = y + 30;
    reasons.forEach((reason, index) => {
        // Bullet
        doc.circle(margin + 5, bulletY + 5, 2)
            .fill('#43a047');

        // Text
        doc.fillColor('#424242')
            .text(reason, margin + 15, bulletY, { width: 480 });

        bulletY = doc.y + 5;
    });

    doc.moveDown(2);
}

// Helper: Add comparison table
function addComparisonTable(doc, donors) {
    const margin = doc.page.margins.left;
    const y = doc.y + 20;

    // Check if we need a new page
    if (y > 650) {
        doc.addPage();
    }

    // Section header
    doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#43a047')
        .text('TOP 3 DONOR COMPARISON', margin, doc.y);

    // Underline
    const titleY = doc.y - 14;
    doc.moveTo(margin, titleY + 18)
        .lineTo(margin + 250, titleY + 18)
        .strokeColor('#43a047')
        .lineWidth(1.5)
        .stroke();

    doc.moveDown(1.5);

    // Table setup
    const tableTop = doc.y;
    const col1X = margin;
    const col2X = margin + 150;
    const col3X = margin + 280;
    const col4X = margin + 410;
    const rowHeight = 25;

    // Table header
    doc.rect(col1X, tableTop, 495, rowHeight)
        .fill('#f5f5f5');

    doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#424242')
        .text('Parameter', col1X + 5, tableTop + 8)
        .text('#1 ' + donors[0].donorId, col2X + 5, tableTop + 8)
        .text('#2 ' + (donors[1]?.donorId || 'N/A'), col3X + 5, tableTop + 8)
        .text('#3 ' + (donors[2]?.donorId || 'N/A'), col4X + 5, tableTop + 8);

    // Table rows
    const rows = [
        { label: 'Match Score', values: donors.map(d => `${d.matchScore}%`) },
        { label: 'Blood Group', values: donors.map(d => d.parameters.bloodGroup) },
        { label: 'Age', values: donors.map(d => `${d.parameters.age} yrs`) },
        { label: 'eGFR', values: donors.map(d => `${d.parameters.gfr} ml/min`) },
        { label: 'HLA Match', values: donors.map(d => `${d.parameters.hlaMatchScore}/6`) },
        { label: 'BMI', values: donors.map(d => d.parameters.bmi.toFixed(1)) },
        { label: 'Risk', values: donors.map(d => d.riskCategory?.category?.split(' ')[0] || 'N/A') }
    ];

    doc.font('Helvetica');
    let currentY = tableTop + rowHeight;

    rows.forEach((row, index) => {
        // Alternate row colors
        if (index % 2 === 1) {
            doc.rect(col1X, currentY, 495, rowHeight)
                .fill('#fafafa');
        }

        doc.fillColor('#424242')
            .text(row.label, col1X + 5, currentY + 8)
            .text(row.values[0] || 'N/A', col2X + 5, currentY + 8)
            .text(row.values[1] || 'N/A', col3X + 5, currentY + 8)
            .text(row.values[2] || 'N/A', col4X + 5, currentY + 8);

        currentY += rowHeight;
    });

    // Table border
    doc.rect(col1X, tableTop, 495, rowHeight * (rows.length + 1))
        .stroke('#cccccc');

    doc.moveDown(3);
}

// Helper: Add disclaimer
function addDisclaimer(doc, user) {
    const margin = doc.page.margins.left;
    const pageHeight = doc.page.height;
    const bottomMargin = doc.page.margins.bottom;

    // Position at bottom of page
    const disclaimerY = pageHeight - bottomMargin - 100;

    if (doc.y < disclaimerY) {
        doc.y = disclaimerY;
    }

    // Disclaimer box
    doc.rect(margin, doc.y, 495, 80)
        .fillAndStroke('#fff3cd', '#ffc107')
        .lineWidth(1);

    // Content
    doc.fontSize(9)
        .font('Helvetica-Bold')
        .fillColor('#856404')
        .text('CLINICAL DISCLAIMER', margin + 10, doc.y - 70);

    doc.fontSize(8)
        .font('Helvetica')
        .text(
            'This report is generated by an AI-assisted clinical decision support system. ' +
            'It is intended to support, not replace, professional clinical judgment. ' +
            'All transplant decisions must be made by qualified medical professionals.',
            margin + 10,
            doc.y - 50,
            { width: 475, align: 'justify' }
        );

    // Footer
    doc.fontSize(7)
        .fillColor('#666666')
        .text(`Generated by: NephroSense v1.0 | User: ${user.name} (${user.role})`, margin, pageHeight - bottomMargin - 15, {
            width: 495,
            align: 'center'
        });
}

// Helper: Generate human-readable explanations
function generateMatchExplanation(topDonor, recipient) {
    const reasons = [];
    const params = topDonor.parameters;

    // Blood group
    if (params.bloodGroup === recipient.bloodGroup) {
        reasons.push(`Perfect blood type match (${params.bloodGroup} → ${recipient.bloodGroup})`);
    } else {
        reasons.push(`Blood type compatible (${params.bloodGroup} → ${recipient.bloodGroup})`);
    }

    // Age
    const ageDiff = Math.abs(params.age - recipient.age);
    if (ageDiff < 15) {
        reasons.push(`Excellent age compatibility (${ageDiff} year difference, optimal range)`);
    } else if (ageDiff < 25) {
        reasons.push(`Good age compatibility (${ageDiff} year difference, acceptable range)`);
    } else {
        reasons.push(`Age difference of ${ageDiff} years within acceptable limits`);
    }

    // HLA
    if (params.hlaMatchScore >= 5) {
        reasons.push(`Strong HLA tissue compatibility (${params.hlaMatchScore}/6 antigens matched)`);
    } else if (params.hlaMatchScore >= 3) {
        reasons.push(`Adequate HLA tissue compatibility (${params.hlaMatchScore}/6 antigens matched)`);
    }

    // Kidney function
    if (params.gfr >= 90) {
        reasons.push(`Excellent donor kidney function (eGFR: ${params.gfr} ml/min/1.73m²)`);
    } else if (params.gfr >= 60) {
        reasons.push(`Good donor kidney function (eGFR: ${params.gfr} ml/min/1.73m²)`);
    }

    // Health
    if (!params.diabetes && !params.hypertension && !params.smoking) {
        reasons.push('Clean donor health profile (no diabetes, hypertension, or smoking history)');
    } else {
        const conditions = [];
        if (params.diabetes) conditions.push('diabetes');
        if (params.hypertension) conditions.push('hypertension');
        if (params.smoking) conditions.push('smoking');
        reasons.push(`Donor has managed ${conditions.join(', ')} - monitored risk factors`);
    }

    // Overall risk
    if (topDonor.riskCategory?.category === 'Low Risk') {
        reasons.push('Low rejection risk prediction based on comprehensive AI analysis');
    }

    return reasons;
}

export default { generateMatchingReportPDF };
