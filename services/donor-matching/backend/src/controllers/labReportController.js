import Tesseract from 'tesseract.js';

// ─── Medical Parameter Extraction Patterns ───────────────────────────────────

const BLOOD_GROUPS = ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'];

const extractors = {
  bloodGroup: (text) => {
    // Match blood group patterns: "Blood Group: A+", "Blood Type: O-", "A Rh+"
    const patterns = [
      /blood\s*(?:group|type)\s*[:\-]?\s*(AB|A|B|O)\s*([+-])/i,
      /(?:group|type)\s*[:\-]?\s*(AB|A|B|O)\s*([+-])/i,
      /(AB|A|B|O)\s*(?:Rh)?\s*([+-])\s*(?:ve)?/i,
      /\b(AB|A|B|O)\s*(positive|negative)\b/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const sign = (m[2] === 'positive' || m[2] === '+') ? '+' : '-';
        const group = `${m[1].toUpperCase()}${sign}`;
        if (BLOOD_GROUPS.includes(group)) return group;
      }
    }
    return null;
  },

  creatinine: (text) => {
    const patterns = [
      /(?:serum\s*)?creatinine\s*[:\-]?\s*(\d+\.?\d*)\s*(?:mg\/d[lL])?/i,
      /s\.?\s*creatinine\s*[:\-]?\s*(\d+\.?\d*)/i,
      /creat(?:inine)?\s*[:\-]?\s*(\d+\.?\d*)/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseFloat(m[1]);
        if (val >= 0.1 && val <= 20) return val.toString();
      }
    }
    return null;
  },

  gfr: (text) => {
    const patterns = [
      /e?GFR\s*[:\-]?\s*(\d+\.?\d*)\s*(?:mL\/min)?/i,
      /glomerular\s*filtration\s*rate\s*[:\-]?\s*(\d+\.?\d*)/i,
      /estimated\s*GFR\s*[:\-]?\s*(\d+\.?\d*)/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseFloat(m[1]);
        if (val >= 0 && val <= 200) return val.toString();
      }
    }
    return null;
  },

  hlaTyping: (text) => {
    // Match HLA patterns: "HLA: A1, A2, B7, B8, DR3, DR4" or "HLA-A1,A2,B7,B8,DR3,DR4"
    const patterns = [
      /HLA\s*(?:typing|type)?\s*[:\-]?\s*((?:[A-Z]+\d+[\s,;]+){5}[A-Z]+\d+)/i,
      /HLA\s*[:\-]?\s*(A\d+[\s,;]+A\d+[\s,;]+B\d+[\s,;]+B\d+[\s,;]+DR\d+[\s,;]+DR\d+)/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        // Normalize: remove spaces, use commas
        const cleaned = m[1].replace(/[\s;]+/g, ',').replace(/,+/g, ',').trim();
        const parts = cleaned.split(',').filter(Boolean);
        if (parts.length === 6) return parts.join(',').toUpperCase();
      }
    }
    return null;
  },

  bloodPressure: (text) => {
    // Returns { systolicBP, diastolicBP }
    const patterns = [
      /(?:blood\s*pressure|BP)\s*[:\-]?\s*(\d{2,3})\s*[\/]\s*(\d{2,3})\s*(?:mmHg)?/i,
      /systolic\s*[:\-]?\s*(\d{2,3})[\s\S]*?diastolic\s*[:\-]?\s*(\d{2,3})/i,
      /(\d{2,3})\s*\/\s*(\d{2,3})\s*(?:mmHg|mm\s*Hg)/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const sys = parseInt(m[1]);
        const dia = parseInt(m[2]);
        if (sys >= 60 && sys <= 250 && dia >= 40 && dia <= 150) {
          return { systolicBP: sys.toString(), diastolicBP: dia.toString() };
        }
      }
    }
    return null;
  },

  bmi: (text) => {
    const patterns = [
      /BMI\s*[:\-]?\s*(\d+\.?\d*)\s*(?:kg\/m[²2])?/i,
      /body\s*mass\s*index\s*[:\-]?\s*(\d+\.?\d*)/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseFloat(m[1]);
        if (val >= 10 && val <= 70) return val.toFixed(1);
      }
    }
    return null;
  },

  diabetes: (text) => {
    const patterns = [
      /\b(?:diabetes|diabetic|DM|type\s*[12]\s*diabetes|T[12]DM)\b/i,
      /\bdiabetes\s*mellitus\b/i,
      /\bDM\s*[:\-]?\s*(?:yes|positive|present|diagnosed)\b/i,
    ];
    for (const pat of patterns) {
      if (pat.test(text)) return true;
    }
    // Check for explicit negatives
    if (/\bno\s*diabetes\b/i.test(text) || /\bDM\s*[:\-]?\s*(?:no|negative|absent|nil)\b/i.test(text)) {
      return false;
    }
    return null;
  },

  hypertension: (text) => {
    const patterns = [
      /\b(?:hypertension|hypertensive|HTN)\b/i,
      /\bhigh\s*blood\s*pressure\b/i,
      /\bHTN\s*[:\-]?\s*(?:yes|positive|present|diagnosed)\b/i,
    ];
    for (const pat of patterns) {
      if (pat.test(text)) return true;
    }
    if (/\bno\s*hypertension\b/i.test(text) || /\bHTN\s*[:\-]?\s*(?:no|negative|absent|nil)\b/i.test(text)) {
      return false;
    }
    return null;
  },

  // --- Recipient-only fields ---

  pra: (text) => {
    const patterns = [
      /PRA\s*[:\-]?\s*(\d+\.?\d*)\s*%?/i,
      /panel\s*reactive\s*antibod(?:y|ies)\s*[:\-]?\s*(\d+\.?\d*)\s*%?/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseFloat(m[1]);
        if (val >= 0 && val <= 100) return val.toString();
      }
    }
    return null;
  },

  dialysisYears: (text) => {
    const patterns = [
      /dialysis\s*(?:for|duration|years?)?\s*[:\-]?\s*(\d+\.?\d*)\s*(?:years?|yrs?)/i,
      /on\s*dialysis\s*(?:for)?\s*(\d+\.?\d*)\s*(?:years?|yrs?)/i,
      /dialysis\s*(?:years?|duration)\s*[:\-]?\s*(\d+\.?\d*)/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseFloat(m[1]);
        if (val >= 0 && val <= 50) return val.toString();
      }
    }
    return null;
  },

  previousTransplants: (text) => {
    const patterns = [
      /previous\s*transplants?\s*[:\-]?\s*(\d+)/i,
      /prior\s*transplants?\s*[:\-]?\s*(\d+)/i,
      /transplant\s*(?:history|count)\s*[:\-]?\s*(\d+)/i,
      /number\s*of\s*(?:previous\s*)?transplants?\s*[:\-]?\s*(\d+)/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseInt(m[1]);
        if (val >= 0 && val <= 10) return val.toString();
      }
    }
    return null;
  },

  age: (text) => {
    const patterns = [
      /\bage\s*[:\-]?\s*(\d{1,3})\s*(?:years?|yrs?)?\b/i,
      /(\d{1,3})\s*(?:years?\s*old|y\/?o)\b/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseInt(m[1]);
        if (val >= 1 && val <= 90) return val.toString();
      }
    }
    return null;
  },

  gender: (text) => {
    const patterns = [
      /\b(?:sex|gender)\s*[:\-]?\s*(male|female|m|f)\b/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const v = m[1].toLowerCase();
        if (v === 'male' || v === 'm') return 'male';
        if (v === 'female' || v === 'f') return 'female';
      }
    }
    return null;
  },

  weight: (text) => {
    const patterns = [
      /\bweight\s*[:\-]?\s*(\d+\.?\d*)\s*(?:kg|kilograms?)?/i,
      /\bwt\s*[:\-]?\s*(\d+\.?\d*)\s*(?:kg)?/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseFloat(m[1]);
        if (val >= 10 && val <= 300) return val.toString();
      }
    }
    return null;
  },

  height: (text) => {
    const patterns = [
      /\bheight\s*[:\-]?\s*(\d+\.?\d*)\s*(?:cm|centimeters?)?/i,
      /\bht\s*[:\-]?\s*(\d+\.?\d*)\s*(?:cm)?/i,
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        const val = parseFloat(m[1]);
        if (val >= 60 && val <= 250) return val.toString();
      }
    }
    return null;
  },
};

// Fields to extract per entity type
const DONOR_FIELDS = [
  'bloodGroup', 'creatinine', 'gfr', 'hlaTyping', 'bloodPressure',
  'bmi', 'diabetes', 'hypertension', 'age', 'gender', 'weight', 'height',
];

const RECIPIENT_FIELDS = [
  ...DONOR_FIELDS,
  'pra', 'dialysisYears', 'previousTransplants',
];

// ─── OCR + Extraction Controller ─────────────────────────────────────────────

async function ocrFile(fileBuffer) {
  const { data: { text, confidence } } = await Tesseract.recognize(fileBuffer, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        console.log(`  OCR progress: ${(m.progress * 100).toFixed(0)}%`);
      }
    },
  });
  return { text, confidence };
}

export const extractFromReport = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded. Please upload a PDF or image file.',
      });
    }

    const type = req.body.type || 'donor'; // 'donor' or 'recipient'
    const fieldsToExtract = type === 'recipient' ? RECIPIENT_FIELDS : DONOR_FIELDS;

    console.log(`\n📄 Processing ${req.files.length} lab report(s) for ${type}...`);

    // OCR all uploaded files and combine text
    let combinedText = '';
    let avgConfidence = 0;

    for (const file of req.files) {
      console.log(`  Processing: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)`);
      const { text, confidence } = await ocrFile(file.buffer);
      combinedText += '\n' + text;
      avgConfidence += confidence;
    }

    avgConfidence = avgConfidence / req.files.length;
    console.log(`  Combined text length: ${combinedText.length} chars, avg confidence: ${avgConfidence.toFixed(1)}%`);

    // Extract parameters
    const extractedFields = {};
    const notFound = [];

    for (const fieldName of fieldsToExtract) {
      if (!extractors[fieldName]) continue;

      const result = extractors[fieldName](combinedText);

      if (fieldName === 'bloodPressure') {
        // Special: bloodPressure returns { systolicBP, diastolicBP }
        if (result) {
          extractedFields.systolicBP = result.systolicBP;
          extractedFields.diastolicBP = result.diastolicBP;
        } else {
          notFound.push('systolicBP', 'diastolicBP');
        }
      } else if (result !== null && result !== undefined) {
        extractedFields[fieldName] = result;
      } else {
        notFound.push(fieldName);
      }
    }

    console.log(`  ✅ Extracted ${Object.keys(extractedFields).length} fields, ${notFound.length} not found`);
    console.log(`  Extracted:`, extractedFields);

    return res.status(200).json({
      success: true,
      extractedFields,
      notFound,
      rawText: combinedText.trim(),
      confidence: parseFloat(avgConfidence.toFixed(1)),
      filesProcessed: req.files.length,
    });
  } catch (error) {
    console.error('Lab report extraction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process lab report. Please try again or enter values manually.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
