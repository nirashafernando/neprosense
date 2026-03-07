from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import sklearn
import numpy as np
import sqlite3

app = Flask(__name__)
CORS(app)


try:
    model = joblib.load('Model/diet_model.pkl')
    scaler = joblib.load('Model/scaler.pkl')
    gender_encoder = joblib.load('Model/gender_encoder.pkl')
    print("ALL Models loaded successfully from Model folder!")
except Exception as e:
    print(f"Error loading models: {e}")
    model, scaler, gender_encoder = None, None, None



import os
os.makedirs('data', exist_ok=True)

def init_db():
    conn = sqlite3.connect('data/lifestyle.db')
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS entries
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  water REAL, 
                  calories REAL, 
                  sleep REAL, 
                  activity REAL, 
                  stress TEXT,
                  notes TEXT,
                  date TEXT DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()


init_db()

@app.route('/predict-diet', methods=['POST'])
def predict_diet():
    if not model:
        return jsonify({"error": "Models not loaded correctly"}), 500

    data = request.json
    
    try:
        age = float(data.get('age'))
        gender = data.get('gender')
        height_cm = float(data.get('height_cm'))
        weight_kg = float(data.get('weight_kg'))
        daily_steps = float(data.get('daily_steps'))
        sleep_hours = float(data.get('sleep_hours'))
        exercise_minutes = float(data.get('exercise_minutes'))
        routine_adherence = float(data.get('routine_adherence_score', 0.5))
        goal = data.get('goal', 'maintain')
       
        height_m = height_cm / 100
        bmi = weight_kg / (height_m ** 2)
        
        gender_code = gender_encoder.transform([gender])[0]
       
        features = np.array([[age, gender_code, bmi, daily_steps, sleep_hours, exercise_minutes, routine_adherence]])
     
        features_scaled = scaler.transform(features)
    
        stage = model.predict(features_scaled)[0]
        
        if gender == 'Male':
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
        else:
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
       
        activity_multipliers = {
            'Beginner': 1.2,
            'Intermediate': 1.55,
            'Advanced': 1.725
        }
        tdee = bmr * activity_multipliers.get(stage, 1.2)
       
        if goal == 'weight_loss':
            target_calories = tdee - 500
        elif goal == 'muscle_gain':
            target_calories = tdee + 300
        else:
            target_calories = tdee
     
        if stage == 'Advanced':
            macros = {'protein': 0.35, 'fat': 0.25, 'carbs': 0.40}
        elif stage == 'Intermediate':
            macros = {'protein': 0.30, 'fat': 0.30, 'carbs': 0.40}
        else: # Beginner
            macros = {'protein': 0.25, 'fat': 0.30, 'carbs': 0.45}

        result = {
            "prediction": {
                "stage": stage,
                "bmi": round(bmi, 2),
                "bmr": round(bmr, 0)
            },
            "diet_plan": {
                "daily_calories": int(target_calories),
                "protein_g": int((target_calories * macros['protein']) / 4),
                "fat_g": int((target_calories * macros['fat']) / 9),
                "carbs_g": int((target_calories * macros['carbs']) / 4)
            }
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e), "message": "Check input data format"}), 400



@app.route('/save-entry', methods=['POST', 'OPTIONS'])
@app.route('/api/save-entry', methods=['POST', 'OPTIONS'])
def save_entry():
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.json
    try:
        conn = sqlite3.connect('data/lifestyle.db')
        c = conn.cursor()
        
      
        c.execute("""INSERT INTO entries 
                     (water, calories, sleep, activity, stress, notes) 
                     VALUES (?, ?, ?, ?, ?, ?)""",
                  (data.get('waterIntake'), 
                   data.get('dailyCalories'), 
                   data.get('sleepHours'), 
                   data.get('physicalActivity'),
                   data.get('stressLevel'),
                   data.get('additionalNotes')
                   ))
                   
        conn.commit()
        conn.close()
        return jsonify({"message": "Data saved successfully", "status": "success"}), 200
    except Exception as e:
        print(f"Error saving data: {e}") # Error එක Terminal එකේ පෙන්නනවා
        return jsonify({"message": str(e), "status": "error"}), 500



@app.route('/view-data', methods=['GET'])
def view_data():
    try:
        conn = sqlite3.connect('data/lifestyle.db')
        c = conn.cursor()
        c.execute("SELECT * FROM entries")
        rows = c.fetchall()
        conn.close()
        
        results = []
        for row in rows:
            
            results.append({
                "ID": row[0],
                "Water (L)": row[1],
                "Calories (kcal)": row[2], 
                "Sleep (hrs)": row[3],
                "Activity (min)": row[4],
                "Stress": row[5],          
                "Notes": row[6],           
                "Date": row[7]
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "lifestyle", "port": 5001})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)