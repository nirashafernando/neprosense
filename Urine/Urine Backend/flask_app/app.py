import os
import cv2
import numpy as np
import uuid
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    yolo_path = os.path.join(BASE_DIR, 'model', 'best.pt')
    yolo_model = YOLO(yolo_path)
    yolo_model.fuse()
except Exception as e:
    print(f"Model Initialization Error: {e}")

BIOMARKERS = [
    "Leukocytes", "Nitrite", "Urobilinogen", "Protein", "pH", 
    "Blood", "Specific Gravity", "Ketones", "Bilirubin", "Glucose"
]

def get_detailed_analysis(name, hsv):
    """
    Result  Status .
    """
    h, s, v = hsv
    result = "Negative"
    status = "NORMAL"

    if name == "Blood":
        if s > 100: result, status = "Moderate", "ABNORMAL"
        elif s > 50: result, status = "Trace", "ABNORMAL"
    
    elif name == "Protein":
        if s > 130: result, status = "100++ mg/dL", "ABNORMAL"
        elif s > 70: result, status = "Trace", "ABNORMAL"
    
    elif name == "Glucose":
        if s > 140: result, status = "500 mg/dL", "ABNORMAL"
        elif s > 80: result, status = "100 mg/dL", "ABNORMAL"
    
    elif name == "pH":
        val = 8.0 if h > 60 else 6.5 if h > 30 else 5.0
        result = str(val)
        status = "NORMAL" if 5.0 <= val <= 7.5 else "ABNORMAL"
    
    elif name == "Nitrite" or name == "Leukocytes":
        if s > 75: result, status = "Positive", "ABNORMAL"
        
    elif name == "Specific Gravity":
        val = "1.030" if s > 120 else "1.015" if s > 60 else "1.000"
        result, status = val, "NORMAL"

    return result, status

def evaluate_total_risk(final_data):
    """
    Abnormal  (Combinations) Risk calculation.
    """
    abnormal_count = sum(1 for item in final_data if item['status'] == "ABNORMAL")
    
   
    has_blood = any(i['pad'] == 'Blood' and i['status'] == 'ABNORMAL' for i in final_data)
    has_protein = any(i['pad'] == 'Protein' and i['status'] == 'ABNORMAL' for i in final_data)


    if has_blood and has_protein:
        return "HIGH RISK (CKD INDICATION)"
    elif abnormal_count >= 5:
        return "HIGH RISK"
    elif 3 <= abnormal_count <= 4:
        return "MODERATE RISK"
    elif 1 <= abnormal_count <= 2:
        return "MILD RISK"
    else:
        return "NORMAL PHYSIOLOGY"

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image provided'}), 400
    
    file = request.files['image']
    filepath = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.jpg")
    file.save(filepath)

    try:
        img = cv2.imread(filepath)
        if img is None:
            return jsonify({'success': False, 'error': 'Failed to read image'}), 400

        results = yolo_model(img, conf=0.25)
        
        pads_coords = []
        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                pads_coords.append({
                    "coords": (x1, y1, x2, y2), 
                    "cx": (x1 + x2) / 2, 
                    "cy": (y1 + y2) / 2
                })

        if not pads_coords:
            return jsonify({'success': False, 'error': 'No biomarkers detected'}), 404

       
        x_dist = max(p['cx'] for p in pads_coords) - min(p['cx'] for p in pads_coords)
        y_dist = max(p['cy'] for p in pads_coords) - min(p['cy'] for p in pads_coords)
        
        if x_dist > y_dist:
            pads_coords.sort(key=lambda p: p['cx'])
        else:
            pads_coords.sort(key=lambda p: p['cy'])

        final_results = []
        for i, p in enumerate(pads_coords[:10]):
            name = BIOMARKERS[i] if i < len(BIOMARKERS) else f"Unknown_{i}"
            x1, y1, x2, y2 = p['coords']
            
            
            roi = img[y1:y2, x1:x2]
            h_roi, w_roi = roi.shape[:2]
            core = roi[int(h_roi*0.3):int(h_roi*0.7), int(w_roi*0.3):int(w_roi*0.7)]
            
            if core.size == 0: continue
            
           
            hsv = np.median(cv2.cvtColor(core, cv2.COLOR_BGR2HSV), axis=(0,1))
        
            res_val, stat_val = get_detailed_analysis(name, hsv)
            final_results.append({
                "pad": name,
                "diagnosis": res_val,  
                "status": stat_val    
            })

    
        total_risk = evaluate_total_risk(final_results)

        return jsonify({
            'success': True, 
            'yolo_data': final_results,
            'risk_evaluation': total_risk
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)