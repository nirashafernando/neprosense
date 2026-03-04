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
    print(f"Model Error: {e}")

PAD_ORDER = ["Leukocytes", "Nitrite", "Urobilinogen", "Protein", "pH", "Blood", "Specific Gravity", "Ketones", "Bilirubin", "Glucose"]

def get_diagnosis(name, hsv):
    h, s, v = hsv
    if name == "Nitrite": return "Positive" if (s > 70) else "Negative"
    if name == "Glucose": return "500 mg/dL" if s > 140 else "100 mg/dL" if s > 80 else "Negative"
    if name == "Protein": return "100++" if s > 130 else "Trace" if s > 70 else "Negative"
    if name == "pH": return "8.0" if h > 60 else "6.5" if h > 30 else "5.0"
    if name == "Specific Gravity": return "1.030" if s > 120 else "1.015" if s > 60 else "1.000"
    if name == "Blood": return "Moderate" if s > 100 else "Trace" if s > 50 else "Negative"
    return "Normal" if s < 80 else "Positive"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    print("--- New Request Received ---")
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image'}), 400
    
    file = request.files['image']
    filepath = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.jpg")
    file.save(filepath)

    try:
        img = cv2.imread(filepath)
        img = cv2.resize(img, (640, 640))
        results = yolo_model(img, conf=0.3)
        
        pads = []
        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                pads.append({"coords": (x1, y1, x2, y2), "y": (y1+y2)//2})

        pads.sort(key=lambda x: x['y'])
        final = []
        for i, p in enumerate(pads[:10]):
            name = PAD_ORDER[i] if i < len(PAD_ORDER) else "Unknown"
            x1, y1, x2, y2 = p['coords']
            roi = img[y1:y2, x1:x2]
            hsv = np.mean(cv2.cvtColor(roi, cv2.COLOR_BGR2HSV), axis=(0,1))
            diag = get_diagnosis(name, hsv)
            final.append({"pad": name, "diagnosis": diag})

        print(f"Detected {len(final)} pads")
        return jsonify({'success': True, 'yolo_data': final})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)