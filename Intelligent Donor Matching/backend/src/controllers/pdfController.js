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
            .sort((a, b) => b.probability - a.probability) // Higher probability = better match (FIXED)
            .slice(0, 3)
            .map((pred, index) => {
                const donor = batchPrediction.donorIds.find(d => d.donorId === pred.donorId);
                return {
                    rank: index + 1,
                    donorId: pred.donorId,
                    donor: donor,
                    matchScore: Math.round(pred.probability * 100), // FIXED: Use probability directly
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

        // Generate Professional Medical Report
        addMedicalReportHeader(doc, batchPrediction._id, batchPrediction.user, batchPrediction.createdAt);
        addPatientDemographics(doc, recipient);
        addClinicalIndication(doc, recipient);
        addLaboratoryFindings(doc, topDonor, recipient);
        addDonorPanelResults(doc, top3Donors);
        addClinicalInterpretation(doc, reasons, topDonor);
        addRecommendations(doc, topDonor);
        addMethodology(doc);
        addCertification(doc, batchPrediction.user);

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

// ==================== MEDICAL LABORATORY REPORT FUNCTIONS ====================

// Helper: Add professional medical report header
function addMedicalReportHeader(doc, reportId, user, reportDate) {
    const pageWidth = doc.page.width;
    const margin = doc.page.margins.left;
    const contentWidth = pageWidth - margin * 2;

    // Top border line
    doc.moveTo(margin, 40)
        .lineTo(pageWidth - margin, 40)
        .strokeColor('#2c5f2d')
        .lineWidth(3)
        .stroke();

    // Institution Header
    doc.fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('NEPHROSENSE MEDICAL CENTER', margin, 50, { align: 'center' });

    doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#2c5f2d')
        .text('Department of Transplant Immunology & Histocompatibility', margin, 72, { align: 'center' });

    doc.fontSize(9)
        .fillColor('#666666')
        .text('Kidney Transplant Donor Compatibility Assessment', margin, 88, { align: 'center' });

    // Divider
    doc.moveTo(margin, 105)
        .lineTo(pageWidth - margin, 105)
        .strokeColor('#cccccc')
        .lineWidth(1)
        .stroke();

    // Report Type Banner
    doc.rect(margin, 115, contentWidth, 25)
        .fillAndStroke('#2c5f2d', '#2c5f2d');

    doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text('TRANSPLANT COMPATIBILITY REPORT', margin, 123, { align: 'center' });

    // Report Metadata
    doc.fontSize(8)
        .font('Helvetica')
        .fillColor('#333333');

    const metaY = 150;
    const col1X = margin;
    const col2X = margin + 165;
    const col3X = margin + 330;

    // Row 1
    doc.font('Helvetica-Bold').text('Report ID:', col1X, metaY);
    doc.font('Helvetica').text(reportId.toString().slice(-12).toUpperCase(), col1X + 58, metaY);

    doc.font('Helvetica-Bold').text('Report Date:', col2X, metaY);
    const dateStr = new Date(reportDate).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric' 
    });
    doc.font('Helvetica').text(dateStr, col2X + 70, metaY);

    doc.font('Helvetica-Bold').text('Report Time:', col3X, metaY);
    const timeStr = new Date(reportDate).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit' 
    });
    doc.font('Helvetica').text(timeStr, col3X + 70, metaY);

    // Row 2
    doc.font('Helvetica-Bold').text('Ordering Physician:', col1X, metaY + 14);
    doc.font('Helvetica').text(user.name, col1X + 105, metaY + 14);

    doc.font('Helvetica-Bold').text('Status:', col2X, metaY + 14);
    doc.fillColor('#2c5f2d').font('Helvetica-Bold').text('FINAL', col2X + 40, metaY + 14);

    // Bottom divider
    doc.moveTo(margin, metaY + 30)
        .lineTo(pageWidth - margin, metaY + 30)
        .strokeColor('#cccccc')
        .lineWidth(0.5)
        .stroke();

    doc.y = metaY + 45;
}

// Helper: Add patient demographics section
function addPatientDemographics(doc, recipient) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;
    const startY = doc.y + 10;

    // Section header
    doc.rect(margin, startY, contentWidth, 18)
        .fillAndStroke('#f0f0f0', '#cccccc')
        .lineWidth(0.5);

    doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('RECIPIENT DEMOGRAPHICS', margin + 5, startY + 5);

    // Content box
    const contentY = startY + 22;
    doc.rect(margin, contentY, contentWidth, 75)
        .strokeColor('#cccccc')
        .lineWidth(0.5)
        .stroke();

    doc.fontSize(9)
        .fillColor('#333333');

    const dataY = contentY + 12;
    const col1X = margin + 15;
    const col2X = margin + 180;
    const col3X = margin + 350;

    // Row 1
    doc.font('Helvetica-Bold').text('Recipient ID:', col1X, dataY);
    doc.font('Helvetica').text(recipient.recipientId, col1X + 75, dataY);

    doc.font('Helvetica-Bold').text('Blood Type:', col2X, dataY);
    doc.fillColor('#c62828').font('Helvetica-Bold').text(recipient.bloodGroup, col2X + 65, dataY);

    doc.fillColor('#333333').font('Helvetica-Bold').text('Age:', col3X, dataY);
    doc.font('Helvetica').text(`${recipient.age} years`, col3X + 30, dataY);

    // Row 2
    doc.font('Helvetica-Bold').text('Gender:', col1X, dataY + 20);
    doc.font('Helvetica').text(recipient.gender || 'Not Specified', col1X + 75, dataY + 20);

    doc.font('Helvetica-Bold').text('Dialysis Duration:', col2X, dataY + 20);
    doc.font('Helvetica').text(`${recipient.dialysisYears || 0} years`, col2X + 100, dataY + 20);

    doc.font('Helvetica-Bold').text('Urgency:', col3X, dataY + 20);
    const urgency = recipient.urgencyScore || 'Not Specified';
    doc.fillColor(urgency >= 8 ? '#c62828' : urgency >= 5 ? '#f57c00' : '#2c5f2d')
        .font('Helvetica-Bold').text(urgency, col3X + 50, dataY + 20);

    // Row 3 - HLA Typing
    if (recipient.hlaType) {
        doc.fillColor('#333333').font('Helvetica-Bold').fontSize(9).text('HLA Typing:', col1X, dataY + 40);
        doc.font('Helvetica').fontSize(8).text(recipient.hlaType, col1X + 75, dataY + 40, { width: contentWidth - 90 });
    }

    doc.y = contentY + 85;
}

// Helper: Add clinical indication
function addClinicalIndication(doc, recipient) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;
    const startY = doc.y + 10;

    // Section header
    doc.rect(margin, startY, contentWidth, 18)
        .fillAndStroke('#f0f0f0', '#cccccc')
        .lineWidth(0.5);

    doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('CLINICAL INDICATION', margin + 5, startY + 5);

    // Content
    const contentY = startY + 22;
    doc.rect(margin, contentY, contentWidth, 35)
        .strokeColor('#cccccc')
        .lineWidth(0.5)
        .stroke();

    doc.fontSize(9)
        .font('Helvetica')
        .fillColor('#333333')
        .text(
            'Pre-transplant donor-recipient compatibility assessment for kidney transplantation. ' +
            'Evaluation includes HLA typing, crossmatch prediction, and immunological risk stratification.',
            margin + 10,
            contentY + 10,
            { width: contentWidth - 20, align: 'justify' }
        );

    doc.moveDown(4);
}

// Helper: Add laboratory findings (top donor results)
function addLaboratoryFindings(doc, topDonor, recipient) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;
    const startY = doc.y + 10;

    // Section header
    doc.rect(margin, startY, contentWidth, 18)
        .fillAndStroke('#f0f0f0', '#cccccc')
        .lineWidth(0.5);

    doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('LABORATORY FINDINGS - PRIMARY DONOR CANDIDATE', margin + 5, startY + 5);

    // Donor ID badge
    doc.fontSize(8)
        .fillColor('#ffffff')
        .text(`Donor: ${topDonor.donorId}`, pageWidth - margin - 100, startY + 6);

    // Content box
    const contentY = startY + 22;
    
    // Table header
    const tableTop = contentY;
    const rowHeight = 20;
    
    doc.rect(margin, tableTop, contentWidth, rowHeight)
        .fillAndStroke('#e8f5e9', '#2c5f2d')
        .lineWidth(0.5);

    doc.fontSize(8)
        .font('Helvetica-Bold')
        .fillColor('#1a472a');

    const col1 = margin + 10;
    const col2 = margin + 200;
    const col3 = margin + 320;
    const col4 = margin + 440;

    doc.text('TEST', col1, tableTop + 6);
    doc.text('RESULT', col2, tableTop + 6);
    doc.text('REFERENCE', col3, tableTop + 6);
    doc.text('FLAG', col4, tableTop + 6);

    // Test results
    const tests = [
        {
            name: 'ABO Blood Group',
            result: topDonor.parameters.bloodGroup,
            reference: 'Compatible with recipient',
            flag: topDonor.parameters.bloodGroup === recipient.bloodGroup ? 'MATCH' : 'COMPAT',
            flagColor: topDonor.parameters.bloodGroup === recipient.bloodGroup ? '#2c5f2d' : '#f57c00'
        },
        {
            name: 'HLA Compatibility',
            result: `${topDonor.parameters.hlaMatchScore}/6 antigens`,
            reference: '≥4/6 optimal',
            flag: topDonor.parameters.hlaMatchScore >= 4 ? 'OPTIMAL' : 'ACCEPT',
            flagColor: topDonor.parameters.hlaMatchScore >= 4 ? '#2c5f2d' : '#f57c00'
        },
        {
            name: 'Estimated GFR',
            result: `${topDonor.parameters.gfr} mL/min/1.73m²`,
            reference: '≥90 optimal',
            flag: topDonor.parameters.gfr >= 90 ? 'NORMAL' : topDonor.parameters.gfr >= 60 ? 'ACCEPT' : 'LOW',
            flagColor: topDonor.parameters.gfr >= 90 ? '#2c5f2d' : topDonor.parameters.gfr >= 60 ? '#f57c00' : '#c62828'
        },
        {
            name: 'Donor Age',
            result: `${topDonor.parameters.age} years`,
            reference: '18-60 optimal',
            flag: topDonor.parameters.age >= 18 && topDonor.parameters.age <= 60 ? 'OPTIMAL' : 'REVIEW',
            flagColor: topDonor.parameters.age >= 18 && topDonor.parameters.age <= 60 ? '#2c5f2d' : '#f57c00'
        },
        {
            name: 'Body Mass Index',
            result: topDonor.parameters.bmi.toFixed(1),
            reference: '18.5-27.5',
            flag: topDonor.parameters.bmi >= 18.5 && topDonor.parameters.bmi <= 27.5 ? 'NORMAL' : 'REVIEW',
            flagColor: topDonor.parameters.bmi >= 18.5 && topDonor.parameters.bmi <= 27.5 ? '#2c5f2d' : '#f57c00'
        },
        {
            name: 'Comorbidity Screen',
            result: [
                topDonor.parameters.diabetes && 'DM',
                topDonor.parameters.hypertension && 'HTN',
                topDonor.parameters.smoking && 'Smoker'
            ].filter(Boolean).join(', ') || 'None detected',
            reference: 'None preferred',
            flag: !topDonor.parameters.diabetes && !topDonor.parameters.hypertension && !topDonor.parameters.smoking ? 'CLEAR' : 'NOTED',
            flagColor: !topDonor.parameters.diabetes && !topDonor.parameters.hypertension && !topDonor.parameters.smoking ? '#2c5f2d' : '#f57c00'
        },
        {
            name: 'Rejection Risk Score',
            result: `${Math.round(topDonor.probability * 100)}%`,
            reference: '<20% low risk',
            flag: topDonor.probability < 0.2 ? 'LOW' : topDonor.probability < 0.4 ? 'MODERATE' : 'HIGH',
            flagColor: topDonor.probability < 0.2 ? '#2c5f2d' : topDonor.probability < 0.4 ? '#f57c00' : '#c62828'
        }
    ];

    doc.fontSize(8)
        .font('Helvetica');

    let currentY = tableTop + rowHeight;

    tests.forEach((test, index) => {
        // Alternate row colors
        if (index % 2 === 0) {
            doc.rect(margin, currentY, contentWidth, rowHeight)
                .fillAndStroke('#fafafa', '#e0e0e0')
                .lineWidth(0.5);
        } else {
            doc.rect(margin, currentY, contentWidth, rowHeight)
                .strokeColor('#e0e0e0')
                .lineWidth(0.5)
                .stroke();
        }

        doc.fillColor('#333333')
            .font('Helvetica')
            .text(test.name, col1, currentY + 6);

        doc.font('Helvetica-Bold')
            .text(test.result, col2, currentY + 6);

        doc.font('Helvetica')
            .fontSize(7)
            .fillColor('#666666')
            .text(test.reference, col3, currentY + 7);

        doc.font('Helvetica-Bold')
            .fontSize(7)
            .fillColor(test.flagColor)
            .text(test.flag, col4, currentY + 7);

        currentY += rowHeight;
    });

    // Table border
    doc.rect(margin, tableTop, contentWidth, rowHeight * (tests.length + 1))
        .strokeColor('#2c5f2d')
        .lineWidth(1)
        .stroke();

    doc.moveDown(10);
}

// Helper: Add donor panel results table
function addDonorPanelResults(doc, donors) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;

    // Check if new page needed
    if (doc.y > 650) {
        doc.addPage();
        doc.y = 50;
    }

    const startY = doc.y + 10;

    // Section header
    doc.rect(margin, startY, contentWidth, 18)
        .fillAndStroke('#f0f0f0', '#cccccc')
        .lineWidth(0.5);

    doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('DONOR PANEL - COMPARATIVE ANALYSIS', margin + 5, startY + 5);

    // Table setup
    const tableTop = startY + 22;
    const rowHeight = 22;
    const col1Width = 140;
    const col2Width = 118;
    const col3Width = 118;
    const col4Width = 119;

    const col1X = margin;
    const col2X = col1X + col1Width;
    const col3X = col2X + col2Width;
    const col4X = col3X + col3Width;

    // Table header
    doc.rect(col1X, tableTop, col1Width + col2Width + col3Width + col4Width, rowHeight)
        .fillAndStroke('#2c5f2d', '#1a472a')
        .lineWidth(0.5);

    doc.fontSize(8)
        .font('Helvetica-Bold')
        .fillColor('#ffffff');

    doc.text('Parameter', col1X + 8, tableTop + 7);
    doc.text(`Rank 1: ${donors[0].donorId}`, col2X + 5, tableTop + 7);
    doc.text(`Rank 2: ${donors[1]?.donorId || 'N/A'}`, col3X + 5, tableTop + 7);
    doc.text(`Rank 3: ${donors[2]?.donorId || 'N/A'}`, col4X + 5, tableTop + 7);

    // Data rows
    const parameters = [
        {
            name: 'Compatibility Score',
            getValue: (d) => `${d.matchScore}%`,
            getColor: (d) => d.matchScore >= 80 ? '#2c5f2d' : '#f57c00'
        },
        {
            name: 'Blood Group',
            getValue: (d) => d.parameters.bloodGroup,
            getColor: () => '#c62828'
        },
        {
            name: 'HLA Match',
            getValue: (d) => `${d.parameters.hlaMatchScore}/6`,
            getColor: (d) => d.parameters.hlaMatchScore >= 4 ? '#2c5f2d' : '#666666'
        },
        {
            name: 'eGFR (mL/min/1.73m²)',
            getValue: (d) => d.parameters.gfr,
            getColor: (d) => d.parameters.gfr >= 90 ? '#2c5f2d' : d.parameters.gfr >= 60 ? '#f57c00' : '#c62828'
        },
        {
            name: 'Age (years)',
            getValue: (d) => d.parameters.age,
            getColor: () => '#666666'
        },
        {
            name: 'BMI',
            getValue: (d) => d.parameters.bmi.toFixed(1),
            getColor: (d) => d.parameters.bmi >= 18.5 && d.parameters.bmi <= 27.5 ? '#2c5f2d' : '#f57c00'
        },
        {
            name: 'Comorbidities',
            getValue: (d) => {
                const conditions = [];
                if (d.parameters.diabetes) conditions.push('DM');
                if (d.parameters.hypertension) conditions.push('HTN');
                if (d.parameters.smoking) conditions.push('Smoker');
                return conditions.length > 0 ? conditions.join(', ') : 'None';
            },
            getColor: (d) => (!d.parameters.diabetes && !d.parameters.hypertension && !d.parameters.smoking) ? '#2c5f2d' : '#f57c00'
        },
        {
            name: 'Rejection Risk',
            getValue: (d) => d.riskCategory?.category || 'N/A',
            getColor: (d) => {
                const cat = d.riskCategory?.category || '';
                if (cat.includes('Low')) return '#2c5f2d';
                if (cat.includes('Medium')) return '#f57c00';
                return '#c62828';
            }
        }
    ];

    let currentY = tableTop + rowHeight;

    parameters.forEach((param, index) => {
        // Alternate row colors
        const bgColor = index % 2 === 0 ? '#fafafa' : '#ffffff';
        doc.rect(col1X, currentY, col1Width + col2Width + col3Width + col4Width, rowHeight)
            .fillAndStroke(bgColor, '#e0e0e0')
            .lineWidth(0.5);

        // Parameter name
        doc.fontSize(8)
            .font('Helvetica')
            .fillColor('#333333')
            .text(param.name, col1X + 8, currentY + 7);

        // Values for each donor
        [donors[0], donors[1], donors[2]].forEach((donor, i) => {
            const colX = [col2X, col3X, col4X][i];
            if (donor) {
                const value = param.getValue(donor);
                const color = param.getColor(donor);
                
                doc.font('Helvetica-Bold')
                    .fillColor(color)
                    .text(value, colX + 5, currentY + 7);
            } else {
                doc.font('Helvetica')
                    .fillColor('#999999')
                    .text('—', colX + 5, currentY + 7);
            }
        });

        currentY += rowHeight;
    });

    // Table border
    doc.rect(col1X, tableTop, col1Width + col2Width + col3Width + col4Width, rowHeight * (parameters.length + 1))
        .strokeColor('#2c5f2d')
        .lineWidth(1)
        .stroke();

    doc.moveDown(3);
}

// Helper: Add clinical interpretation
function addClinicalInterpretation(doc, reasons, topDonor) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;

    // Check if new page needed
    if (doc.y > 650) {
        doc.addPage();
        doc.y = 50;
    }

    const startY = doc.y + 10;

    // Section header
    doc.rect(margin, startY, contentWidth, 18)
        .fillAndStroke('#f0f0f0', '#cccccc')
        .lineWidth(0.5);

    doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('CLINICAL INTERPRETATION', margin + 5, startY + 5);

    // Content - calculate height first, draw box, then add text
    const contentY = startY + 22;
    
    // Calculate approximate height based on reasons count
    const estimatedHeight = 80 + (reasons.length * 18);
    
    // Draw content box
    doc.rect(margin, contentY, contentWidth, estimatedHeight)
        .strokeColor('#cccccc')
        .lineWidth(0.5)
        .stroke();

    doc.fontSize(9)
        .font('Helvetica')
        .fillColor('#333333');

    let textY = contentY + 12;

    // Primary finding
    doc.font('Helvetica-Bold')
        .text('Primary Finding:', margin + 10, textY);
    
    const riskText = topDonor.riskCategory?.category || 'Assessment completed';
    doc.font('Helvetica')
        .text(
            ` Donor ${topDonor.donorId} identified as optimal match with ${riskText.toLowerCase()} ` +
            `and ${topDonor.matchScore}% compatibility score.`,
            margin + 95,
            textY,
            { width: contentWidth - 105 }
        );

    textY = doc.y + 10;

    // Key factors
    doc.font('Helvetica-Bold')
        .text('Key Clinical Factors:', margin + 10, textY);
    
    textY = doc.y + 6;

    reasons.forEach((reason, index) => {
        doc.fontSize(8.5)
            .font('Helvetica')
            .fillColor('#555555');
        
        // Bullet point
        doc.circle(margin + 15, textY + 4, 1.5)
            .fillAndStroke('#2c5f2d', '#2c5f2d');
        
        doc.fillColor('#333333')
            .text(reason, margin + 22, textY, { width: contentWidth - 32 });
        
        textY = doc.y + 5;
    });

    doc.y = contentY + estimatedHeight + 15;
}

// Helper: Add recommendations
function addRecommendations(doc, topDonor) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;

    // Check if new page needed
    if (doc.y > 680) {
        doc.addPage();
        doc.y = 50;
    }

    const startY = doc.y + 10;

    // Section header
    doc.rect(margin, startY, contentWidth, 18)
        .fillAndStroke('#f0f0f0', '#cccccc')
        .lineWidth(0.5);

    doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('CLINICAL RECOMMENDATIONS', margin + 5, startY + 5);

    // Content
    const contentY = startY + 22;
    
    const recommendations = [
        'Proceed with comprehensive pre-transplant workup including crossmatch testing',
        'Confirm ABO compatibility with direct blood typing',
        'Perform virtual crossmatch and assess donor-specific antibodies (DSA)',
        'Complete infectious disease screening panel for both donor and recipient',
        'Conduct detailed cardiovascular and pulmonary assessment',
        'Review immunosuppression protocol with transplant team',
        'Schedule multidisciplinary team conference for final evaluation'
    ];

    // Calculate box height
    const boxHeight = 15 + (recommendations.length * 18);
    
    // Draw content box
    doc.rect(margin, contentY, contentWidth, boxHeight)
        .strokeColor('#cccccc')
        .lineWidth(0.5)
        .stroke();

    doc.fontSize(8.5)
        .font('Helvetica')
        .fillColor('#333333');

    let textY = contentY + 12;

    recommendations.forEach((rec, index) => {
        // Number badge
        doc.circle(margin + 15, textY + 4, 7)
            .fillAndStroke('#2c5f2d', '#1a472a')
            .lineWidth(0.5);
        
        doc.fontSize(7)
            .fillColor('#ffffff')
            .font('Helvetica-Bold')
            .text((index + 1).toString(), margin + 12, textY + 1);

        // Recommendation text
        doc.fontSize(8.5)
            .fillColor('#333333')
            .font('Helvetica')
            .text(rec, margin + 28, textY, { width: contentWidth - 38 });
        
        textY = doc.y + 7;
    });

    doc.y = contentY + boxHeight + 15;
}

// Helper: Add methodology section
function addMethodology(doc) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;

    // Check if new page needed
    if (doc.y > 680) {
        doc.addPage();
        doc.y = 50;
    }

    const startY = doc.y + 10;

    // Section header
    doc.rect(margin, startY, contentWidth, 18)
        .fillAndStroke('#f0f0f0', '#cccccc')
        .lineWidth(0.5);

    doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('METHODOLOGY', margin + 5, startY + 5);

    // Content
    const contentY = startY + 22;
    const boxHeight = 75;
    
    doc.rect(margin, contentY, contentWidth, boxHeight)
        .strokeColor('#cccccc')
        .lineWidth(0.5)
        .stroke();

    doc.fontSize(8)
        .font('Helvetica')
        .fillColor('#333333')
        .text(
            'This report utilizes advanced machine learning algorithms trained on comprehensive transplant outcome data. ' +
            'The compatibility assessment incorporates multiple clinical parameters including HLA typing, blood group compatibility, ' +
            'renal function markers, demographic factors, and comorbidity profiles. Risk stratification is performed using ' +
            'validated prediction models with consideration of immunological, surgical, and long-term graft survival factors.',
            margin + 10,
            contentY + 10,
            { width: contentWidth - 20, align: 'justify', lineGap: 2 }
        );

    doc.fontSize(7.5)
        .fillColor('#666666')
        .text(
            'Reference Standards: UNOS allocation guidelines, KDIGO Clinical Practice Guidelines, ASHI Standards',
            margin + 10,
            doc.y + 6,
            { width: contentWidth - 20 }
        );

    doc.y = contentY + boxHeight + 15;
}

// Helper: Add certification and signature
function addCertification(doc, user) {
    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const bottomMargin = doc.page.margins.bottom;
    const contentWidth = pageWidth - margin * 2;

    // Check if we need a new page for certification
    if (doc.y > pageHeight - bottomMargin - 140) {
        doc.addPage();
        doc.y = 50;
    }

    const certStartY = doc.y + 10;
    const boxHeight = 85;

    // Certification box
    doc.rect(margin, certStartY, contentWidth, boxHeight)
        .fillAndStroke('#fffef7', '#e0e0e0')
        .lineWidth(0.5);

    // Header
    doc.fontSize(8)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text('REPORT AUTHENTICATION', margin + 10, certStartY + 8, {
            width: contentWidth - 20
        });

    // Description text
    doc.fontSize(7.5)
        .font('Helvetica')
        .fillColor('#333333')
        .text(
            `This report has been generated by the NephroSense AI-Powered Clinical Decision Support System and reviewed ` +
            `for accuracy. The findings and recommendations are based on available clinical data at the time of analysis.`,
            margin + 10,
            certStartY + 22,
            { width: contentWidth - 20, align: 'justify', lineGap: 1 }
        );

    // Signature line
    const signY = certStartY + 55;
    
    doc.moveTo(margin + 10, signY)
        .lineTo(margin + 200, signY)
        .strokeColor('#333333')
        .lineWidth(0.5)
        .stroke();

    // Physician name
    doc.fontSize(7.5)
        .font('Helvetica-Bold')
        .fillColor('#1a472a')
        .text(`${user.name}, ${user.role}`, margin + 10, signY + 5, {
            width: 190
        });

    // Timestamp
    doc.font('Helvetica')
        .fontSize(7)
        .fillColor('#666666')
        .text(`Generated: ${new Date().toLocaleString('en-US')}`, margin + 10, signY + 18, {
            width: 190
        });

    // Move Y position past the certification box
    doc.y = certStartY + boxHeight + 10;

    // Footer bar - positioned at absolute bottom of page
    const footerY = pageHeight - bottomMargin - 15;
    
    doc.rect(0, footerY - 5, pageWidth, 20)
        .fillAndStroke('#2c5f2d', '#2c5f2d');

    doc.fontSize(7)
        .fillColor('#ffffff')
        .font('Helvetica')
        .text('NephroSense Medical Center | Department of Transplant Immunology', margin, footerY, {
            width: contentWidth / 2,
            align: 'left'
        });

    doc.text('Page 1 | Confidential Medical Document', pageWidth - margin - 200, footerY, {
            width: 200,
            align: 'right'
        });
}

// Helper: Generate match explanation text based on donor parameters
function generateMatchExplanation(topDonor, recipient) {
    const params = topDonor.parameters;
    const reasons = [];

    // Blood compatibility
    if (params.bloodGroup === recipient.bloodGroup) {
        reasons.push(`Perfect ABO blood group match (${params.bloodGroup})`);
    } else {
        reasons.push(`Compatible blood group (Donor: ${params.bloodGroup}, Recipient: ${recipient.bloodGroup})`);
    }

    // Age compatibility
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
