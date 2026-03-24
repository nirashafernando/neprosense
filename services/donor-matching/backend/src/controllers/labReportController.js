import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// ─── Gemini AI Setup (lazy — env vars not available at module load time in ESM)
// dotenv.config() runs AFTER all ES module imports resolve, so we must
// create the client on first use, not at module level.
let _genAI = null;
function getGenAI() {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY environment variable is not set.');
    _genAI = new GoogleGenerativeAI(key);
    console.log(`  [Gemini] Initialized with key ...${key.slice(-6)}`);
  }
  return _genAI;
}

// ─── Extraction Prompt ────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `You are a medical data extraction assistant specializing in Sri Lankan hospital lab reports.

Analyze this lab report carefully and extract ONLY values that are clearly the MEASURED TEST RESULTS.

Return ONLY a valid JSON object with these exact keys. Use null for any value not found.

{
  "age": <patient age as integer, e.g. 63>,
  "gender": <"male" or "female" — look for Sex/Gender field>,
  "bloodGroup": <one of "A+","A-","B+","B-","AB+","AB-","O+","O-" or null>,
  "creatinine": <SERUM CREATININE measured result value as number in mg/dL, NOT the reference range>,
  "gfr": <eGFR or GFR MEASURED result value as number in mL/min/1.73m². IGNORE the CKD staging reference table (>90, 60-89, 45-59, 30-44 etc.) — extract only the patient's actual measured value>,
  "bloodPressure": <blood pressure as "systolic/diastolic" string or null>,
  "bmi": <BMI as number or null>,
  "hlaTyping": <HLA typing result string or null>,
  "pra": <PRA percentage as number or null>,
  "dialysisYears": <years on dialysis as number or null>,
  "previousTransplants": <number of previous transplants or null>,
  "fastingGlucose": <FASTING PLASMA GLUCOSE result as number in mg/dL or null>,
  "randomGlucose": <RANDOM PLASMA GLUCOSE or RBS result as number in mg/dL or null>,
  "hba1c": <HbA1c percentage as number or null>,
  "diabetes": <derive from glucose tests: true if fasting glucose >=126 OR random glucose >=200 OR HbA1c >=6.5, false if glucose test present but values below thresholds, null if no glucose test in report>,
  "hypertension": <true if patient has hypertension noted, false if explicitly normal, null if not mentioned>,
  "smoking": <true if patient smokes, false if non-smoker noted, null if not mentioned>
}

CRITICAL RULES:
1. For GFR: the CKD staging table lists ranges (>90, 60-89, 45-59, 30-44, 15-29, <15). These are reference ranges. Extract ONLY the patient's actual GFR measurement on its own line (e.g. "GFR  32  mL/min").
2. For creatinine: the reference range is usually "0.5-1.1". Extract ONLY the RESULT column value.
3. Return ONLY the JSON object. No markdown. No explanation. No code blocks.`;

// ─── PDF Text Extraction (no canvas needed) ───────────────────────────────────

async function extractPdfText(pdfBuffer) {
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    verbosity: 0,
  });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    let lastY = null;
    for (const item of content.items) {
      if ('str' in item) {
        const y = item.transform?.[5];
        if (lastY !== null && Math.abs(y - lastY) > 5) {
          fullText += '\n';
        } else if (lastY !== null) {
          fullText += ' ';
        }
        fullText += item.str;
        lastY = y;
      }
    }
    fullText += '\n';
  }

  return fullText.trim();
}

// ─── Gemini Extraction ────────────────────────────────────────────────────────

async function extractWithGemini(input, mimeType) {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-flash-latest' });

  let parts;
  if (typeof input === 'string') {
    // PDF text — send as text prompt
    parts = [EXTRACTION_PROMPT + '\n\nLAB REPORT TEXT:\n' + input];
  } else {
    // Image buffer — send as vision
    parts = [
      EXTRACTION_PROMPT,
      { inlineData: { data: input.toString('base64'), mimeType } },
    ];
  }

  const result = await model.generateContent(parts);
  const raw = result.response.text().trim();

  // Strip markdown code fences if present
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gemini returned non-JSON: ${raw.slice(0, 200)}`);

  const parsed = JSON.parse(jsonMatch[0]);
  console.log('  [Gemini] Raw extraction:', JSON.stringify(parsed));
  return parsed;
}

// ─── Map Gemini output to form fields ────────────────────────────────────────

const DONOR_FIELDS    = ['bloodGroup','creatinine','gfr','hlaTyping','bloodPressure','bmi','diabetes','hypertension','smoking','age','gender'];
const RECIPIENT_FIELDS = [...DONOR_FIELDS, 'pra','dialysisYears','previousTransplants'];

// Keys Gemini returns that map 1-to-1 to form fields
const DIRECT_KEYS = new Set([
  'age','gender','bloodGroup','creatinine','gfr','bloodPressure',
  'bmi','hlaTyping','pra','dialysisYears','previousTransplants',
  'diabetes','hypertension','smoking',
]);

function mapGeminiToFields(geminiData, targetFields) {
  const extracted = {};
  const notFound  = [];

  // ── Derive diabetes if not directly returned ───────────────────────────────
  if (geminiData.diabetes === null || geminiData.diabetes === undefined) {
    const fg = geminiData.fastingGlucose;
    const rg = geminiData.randomGlucose;
    const a1c = geminiData.hba1c;
    if (fg !== null && fg !== undefined)    geminiData.diabetes = fg >= 126;
    else if (rg !== null && rg !== undefined) geminiData.diabetes = rg >= 200;
    else if (a1c !== null && a1c !== undefined) geminiData.diabetes = a1c >= 6.5;
  }

  for (const field of targetFields) {
    const val = geminiData[field];
    if (val !== null && val !== undefined) {
      extracted[field] = val;
    } else {
      notFound.push(field);
    }
  }

  return { extracted, notFound };
}

// ─── Main Controller ──────────────────────────────────────────────────────────

export const extractFromReport = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded. Please upload a PDF or image file.',
      });
    }

    const type   = req.body.type || 'donor';
    const fields = type === 'recipient' ? RECIPIENT_FIELDS : DONOR_FIELDS;

    console.log(`\n📄 Processing ${req.files.length} lab report(s) for ${type}...`);

    // Merge extractions from all uploaded files
    let mergedGemini = {};

    for (const file of req.files) {
      console.log(`  Processing: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB, ${file.mimetype})`);

      const isPDF = file.mimetype === 'application/pdf';
      let geminiData;

      if (isPDF) {
        console.log(`  [PDF] Extracting text layer...`);
        const text = await extractPdfText(file.buffer);

        if (!text || text.length < 30) {
          console.warn(`  [PDF] No text layer found — may be a scanned PDF.`);
          return res.status(422).json({
            success: false,
            unreadable: true,
            message: 'This PDF appears to be a scanned image without a text layer. Please upload the report as a JPG or PNG image instead.',
          });
        }

        console.log(`  [PDF] Extracted ${text.length} chars. Sending to Gemini...`);
        geminiData = await extractWithGemini(text, null);
      } else {
        console.log(`  [Image] Sending to Gemini Vision...`);
        geminiData = await extractWithGemini(file.buffer, file.mimetype);
      }

      // Merge: non-null values from later reports override earlier ones
      for (const [k, v] of Object.entries(geminiData)) {
        if (v !== null && v !== undefined) mergedGemini[k] = v;
      }
    }

    // Map to form fields
    const { extracted: extractedFields, notFound } = mapGeminiToFields(mergedGemini, fields);

    console.log(`  ✅ Extracted ${Object.keys(extractedFields).length} fields, ${notFound.length} not found`);
    console.log(`  Extracted:`, extractedFields);

    // ── Unreadable / non-medical report detection ──────────────────────────
    if (Object.keys(extractedFields).length === 0) {
      return res.status(422).json({
        success: false,
        unreadable: true,
        message: 'No recognisable medical data was found in this report. This may not be a compatible lab report, or the image quality may be too low. Please verify the file and enter values manually.',
      });
    }

    return res.status(200).json({
      success: true,
      extractedFields,
      notFound,
      confidence: 99, // Gemini vision is far more reliable than OCR
      filesProcessed: req.files.length,
    });

  } catch (error) {
    console.error('Lab report extraction error:', error);

    // Gemini-specific error messages
    const msg = error.message || '';
    if (msg.includes('API_KEY') || msg.includes('401')) {
      return res.status(500).json({ success: false, message: 'AI service configuration error. Please contact the administrator.' });
    }
    if (msg.includes('429') || msg.includes('quota')) {
      return res.status(429).json({ success: false, message: 'AI service is temporarily busy. Please wait a moment and try again.' });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to process lab report. Please try again or enter values manually.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
