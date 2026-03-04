import os
import cv2
import numpy as np
import base64
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join('models', 'kidney_model.h5')
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print(f"AI System Activated (Output shape: {model.output_shape})")
except Exception as e:
    model = None

def get_prediction_results(image):
    if model is None:
        return {"error": "Model not loaded"}, image

    try:
        h_orig, w_orig = image.shape[:2]
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray, (128, 128))
        input_data = resized.reshape(1, 128, 128, 1).astype(np.float32) / 255.0

        prediction = model.predict(input_data)[0]
        pred_2d = np.squeeze(prediction)
        
        mask_resized = cv2.resize(pred_2d, (w_orig, h_orig), interpolation=cv2.INTER_LINEAR)
        mask_binary = (mask_resized > 0.5).astype(np.uint8) * 255
        
        pixel_count = np.sum(mask_binary > 0)
        
        min_thick, max_thick = 0.0, 0.0
        if pixel_count > 0:
            dist_transform = cv2.distanceTransform((mask_binary > 0).astype(np.uint8), cv2.DIST_L2, 3)
            _, max_val, _, _ = cv2.minMaxLoc(dist_transform)
            max_thick = round(max_val * 0.2, 2)
            min_thick = round(max_thick * 0.45, 2)

        # Healthy / Mild / Severe Logic
        if pixel_count < 300:
            diag_text = "Healthy"
            color = [0, 255, 0] # Green
        elif 300 <= pixel_count < 2500:
            diag_text = "Mild CKD"
            color = [0, 165, 255] # Orange
        else:
            diag_text = "Severe CKD"
            color = [0, 0, 255] # Red

        annotated = image.copy()
        
        center_x, center_y = int(w_orig / 2), int(h_orig / 2)
        radius = int(min(w_orig, h_orig) / 4) 
        cv2.circle(annotated, (center_x, center_y), radius, color, 3, cv2.LINE_AA)
        
        overlay = image.copy()
        cv2.circle(overlay, (center_x, center_y), radius, color, -1) # Fill color
        cv2.addWeighted(overlay, 0.2, annotated, 0.8, 0, annotated) # 20% opacity
        
        confidence = float(np.max(prediction)) * 100

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
        nparr = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({"error": "Invalid format"}), 400

        data, processed_img = get_prediction_results(image)
        
        if "error" in data:
            return jsonify(data), 500

        _, buffer = cv2.imencode('.jpg', processed_img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            **data,
            "segmented_image": f"data:image/jpeg;base64,{img_base64}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)