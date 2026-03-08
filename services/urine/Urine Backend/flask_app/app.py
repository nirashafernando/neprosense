import os
import cv2
import numpy as np
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    yolo_model = YOLO(os.path.join(BASE_DIR, 'model', 'best.pt'))
except Exception as e:
    print(f"Model Initialization Error: {e}")

BIOMARKERS = [
    "Leukocytes", "Nitrite", "Urobilinogen", "Protein", "pH", 
    "Blood", "Specific Gravity", "Ketones", "Bilirubin", "Glucose"
]

def get_detailed_analysis(name, hsv):
    h, s, v = hsv
    result = "Negative"
    status = "NORMAL"
    normal_range = "Negative"

    if name == "Leukocytes":
        normal_range = "Negative (< 10 cells/µL)"
        if s > 75: result, status = "Positive", "ABNORMAL"
    elif name == "Nitrite":
        normal_range = "Negative"
        if s > 75: result, status = "Positive", "ABNORMAL"
    elif name == "Urobilinogen":
        normal_range = "0.2 - 1.0 mg/dL"
        result = "0.2 mg/dL"
    elif name == "Protein":
        normal_range = "Negative (< 15 mg/dL)"
        if s > 130: result, status = "100++ mg/dL", "ABNORMAL"
        elif s > 70: result, status = "Trace", "ABNORMAL"
    elif name == "pH":
        normal_range = "4.5 - 8.0"
        val = 8.0 if h > 60 else 6.5 if h > 30 else 5.0
        result, status = str(val), "NORMAL" if 4.5 <= val <= 8.0 else "ABNORMAL"
    elif name == "Blood":
        normal_range = "Negative (0 cells/µL)"
        if s > 100: result, status = "Moderate", "ABNORMAL"
        elif s > 50: result, status = "Trace", "ABNORMAL"
    elif name == "Specific Gravity":
        normal_range = "1.005 - 1.030"
        val = "1.030" if s > 120 else "1.015" if s > 60 else "1.005"
        result = val
    elif name == "Ketones":
        normal_range = "Negative (< 5 mg/dL)"
        if s > 80: result, status = "Positive", "ABNORMAL"
    elif name == "Bilirubin":
        normal_range = "Negative (< 0.2 mg/dL)"
        if s > 80: result, status = "Positive", "ABNORMAL"
    elif name == "Glucose":
        normal_range = "Negative (< 30 mg/dL)"
        if s > 140: result, status = "500 mg/dL", "ABNORMAL"
        elif s > 80: result, status = "100 mg/dL", "ABNORMAL"

    return result, status, normal_range

def evaluate_total_risk(final_data):
    abnormal_count = sum(1 for item in final_data if item['status'] == "ABNORMAL")
    has_blood = any(i['pad'] == 'Blood' and i['status'] == 'ABNORMAL' for i in final_data)
    has_protein = any(i['pad'] == 'Protein' and i['status'] == 'ABNORMAL' for i in final_data)

    if has_blood and has_protein: return "HIGH RISK (CKD INDICATION)"
    if abnormal_count >= 5: return "HIGH RISK"
    if 3 <= abnormal_count <= 4: return "MODERATE RISK"
    if 1 <= abnormal_count <= 2: return "MILD RISK"
    return "NORMAL PHYSIOLOGY"

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'image' not in request.files: return jsonify({'success': False, 'error': 'No image provided'}), 400
    
    file = request.files['image']
    filepath = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.jpg")
    file.save(filepath)

    try:
        img = cv2.imread(filepath)
        if img is None: return jsonify({'success': False, 'error': 'Failed to read image'}), 400

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        if np.mean(gray) > 245 or np.mean(gray) < 10:
            return jsonify({'success': False, 'error': 'Invalid image. Please upload a clear photo of the urine strip.'}), 400

    
        results = yolo_model(img, conf=0.4) 
        pads_coords = []
        
        for r in results:
            if len(r.boxes) < 5: 
                return jsonify({'success': False, 'error': 'Garbage image or invalid urine strip detected. Please try again.'}), 400
                
            for box in r.boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                pads_coords.append({"coords": (x1, y1, x2, y2), "cx": (x1 + x2) / 2, "cy": (y1 + y2) / 2})

       
        if len(pads_coords) < 3: 
            return jsonify({'success': False, 'error': 'No valid urine strip detected. Please ensure the strip is clearly visible.'}), 400

        pads_coords.sort(key=lambda p: p['cy']) 
        
        final_results = []
        for i, p in enumerate(pads_coords[:10]):
            if i >= len(BIOMARKERS): break 
            name = BIOMARKERS[i]
            x1, y1, x2, y2 = p['coords']
            roi = img[y1:y2, x1:x2]
            if roi.size == 0: continue
            
            hsv = np.median(cv2.cvtColor(roi, cv2.COLOR_BGR2HSV), axis=(0,1))
            res_val, stat_val, norm_range = get_detailed_analysis(name, hsv)
            final_results.append({
                "pad": name, 
                "diagnosis": res_val, 
                "status": stat_val, 
                "normal_range": norm_range
            })

        return jsonify({
            'success': True, 
            'yolo_data': final_results, 
            'risk_evaluation': evaluate_total_risk(final_results)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        if os.path.exists(filepath): os.remove(filepath)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)