import os
import cv2
import numpy as np
import base64
import tensorflow as tf
import uuid
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join('models', 'kidney_model.h5')
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print(f"AI System Activated (Output shape: {model.output_shape})")
except Exception as e:
    model = None

def is_garbage_image(image):
   
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
   
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    high_values = np.sum(hist[200:]) / np.sum(hist) 
    
    mean_val = np.mean(gray)

    if mean_val > 170 or high_values > 0.2: 
        return True, "This is not an Ultrasound image. Please upload a scan."
    
    if laplacian_var > 1000:
        return True, "Non-medical image detected (High texture). Please upload a valid scan."
    
    if laplacian_var < 5: 
        return True, "Blank or empty image detected."

    return False, ""

def get_prediction_results(image):
    if model is None:
        return {"error": "Model not loaded"}, image

    try:
    
        is_garbage, error_msg = is_garbage_image(image)
        if is_garbage:
            return {"error": error_msg}, image

        h_orig, w_orig = image.shape[:2]
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        resized = cv2.resize(gray, (128, 128))
        input_data = resized.reshape(1, 128, 128, 1).astype(np.float32) / 255.0

        prediction = model.predict(input_data)[0]
        pred_2d = np.squeeze(prediction)
        

        confidence_val = np.max(prediction)
        if confidence_val < 0.85:
            return {"error": "Kidney structure not clearly identified. Please upload a clear Ultrasound scan."}, image

        mask_resized = cv2.resize(pred_2d, (w_orig, h_orig), interpolation=cv2.INTER_LINEAR)
        mask_binary = (mask_resized > 0.5).astype(np.uint8) * 255
        
        pixel_count = np.sum(mask_binary > 0)
        
        if pixel_count < (w_orig * h_orig * 0.02):
            return {"error": "No significant kidney structure detected."}, image

        total_pixels = w_orig * h_orig
        disease_percentage = (pixel_count / total_pixels) * 100
        
        min_thick, max_thick = 0.0, 0.0
        if pixel_count > 0:
            dist_transform = cv2.distanceTransform((mask_binary > 0).astype(np.uint8), cv2.DIST_L2, 3)
            _, max_val, _, _ = cv2.minMaxLoc(dist_transform)
            max_thick = round(max_val * 0.2, 2)
            min_thick = round(max_thick * 0.45, 2)

        if disease_percentage < 5.0:
            diag_text = "Healthy"
            color = [0, 255, 0]
        elif 5.0 <= disease_percentage < 15.0:
            diag_text = "Mild CKD"
            color = [0, 165, 255]
        else:
            diag_text = "Severe CKD"
            color = [0, 0, 255]

        annotated = image.copy()
        
        confidence = float(confidence_val) * 100

        return {
            "diagnosis": diag_text,
            "confidence": f"{round(confidence, 2)}%",
            "severity_score": int(pixel_count),
            "min_thickness": f"{min_thick} mm",
            "max_thickness": f"{max_thick} mm"
        }, annotated

    except Exception as e:
        return {"error": str(e)}, image

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(filepath)

        image = cv2.imread(filepath)
        if image is None:
            return jsonify({"error": "Invalid image format"}), 400

        data, processed_img = get_prediction_results(image)
        
        if "error" in data:
            return jsonify(data), 400

        _, buffer = cv2.imencode('.jpg', processed_img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            **data,
            "segmented_image": f"data:image/jpeg;base64,{img_base64}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "ultrasound", "port": 5002})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)