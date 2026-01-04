 NephroSense
AI-Powered CKD Monitoring & Clinical Decision Support System
NephroSense is a modular, AI-driven healthcare decision support system designed to assist in early detection, monitoring, and clinical decision-making for Chronic Kidney Disease (CKD).
The system integrates four independent yet interconnected AI components, each addressing a critical stage of kidney disease management.

1. System Overview
Chronic Kidney Disease management requires continuous monitoring, accurate diagnosis, and high-stakes clinical decisions such as kidney transplantation. Existing systems are often fragmented, manual, or lack explainability.
NephroSense addresses these gaps by providing:
•	Automated medical image and test analysis
•	Personalized lifestyle guidance
•	Explainable donor–recipient transplant matching
•	Unified reporting and clinical dashboards

2. System Components
1.	Lifestyle Prediction & Advisory Component
2.	Urine Test Strip Analysis Component
3.	Intelligent Donor–Recipient Matching Component
4.	Clinical Ultrasound Image Analysis Component
Each component can function independently or as part of the integrated NephroSense platform.

3. High-Level Architecture
Architecture Style: Conceptual Modular Client–Server Architecture
Layers:
•	Presentation Layer: Web / Mobile Interface (React)
•	Application Layer: Backend API (Node.js / FastAPI)
•	Intelligence Layer: ML & DL Models
•	Data Layer: Secure Medical Databases
•	Reporting Layer: PDF & Dashboard Outputs
All components share:
•	Secure authentication
•	Standardized APIs
•	Centralized reporting logic

4. Technologies Used (Overall)
Frontend
•	React
•	Tailwind CSS
•	Axios
Backend
•	Node.js
•	Express.js
•	FastAPI
•	JWT Authentication
•	PDFKit
Machine Learning & AI
•	Python 3.x
•	Scikit-learn
•	TensorFlow / Keras
•	XGBoost
•	OpenCV
•	YOLOv8
Data & Utilities
•	Pandas
•	NumPy
•	Matplotlib
•	Roboflow
•	MongoDB / PostgreSQL

5. How to Run the System (General)
Prerequisites
•	Python 3.9+
•	Node.js 18+
•	MongoDB (local or Atlas)
•	Git
•	pip / npm
Clone Repository
git clone https://github.com/your-org/nephrosense.git
cd nephrosense

•	Component 1: Lifestyle Prediction & Advisory System
 Purpose
Predict CKD risk based on lifestyle and clinical data and generate personalized lifestyle recommendations.
Machine Learning Models
•	Logistic Regression
•	Random Forest
•	XGBoost
•	Gradient Boosting
Features Used
Numeric
•	Age
•	BMI
•	Daily Steps
•	Sleep Hours
•	Exercise Minutes
•	Routine Adherence Score
Categorical
•	Gender (One-Hot Encoded)
Data Preprocessing
•	StandardScaler
•	OneHotEncoder
•	ColumnTransformer
•	Pipeline to prevent data leakage
Output
•	Fitness / risk classification
•	Personalized diet & lifestyle plan
How to Run
cd lifestyle-component
pip install -r requirements.txt
python main.py

•	Component 2: Urine Test Strip Analysis System
 Purpose
Automatically analyze urine test strip images to extract biomarker values for early CKD screening.
System Flow
1.	Image upload
2.	White balance correction
3.	YOLO-based pad detection
4.	HSV feature extraction
5.	SVM classification
Models Used
•	YOLOv8 – Pad detection
•	SVM – Test result classification
Libraries Used
•	Ultralytics (YOLOv8)
•	OpenCV
•	NumPy
•	Pandas
•	Scikit-learn
•	Matplotlib
•	Roboflow
Output
•	Detected strip pads
•	Predicted test results (Normal / High)
•	Visualized results
How to Run
cd urine-test-component
pip install -r requirements.txt
python urine_analysis.py

•	Component 3: Intelligent Donor–Recipient Matching System
 Purpose
Support clinicians in kidney transplant decisions using risk prediction, donor ranking, and explainable AI.
Machine Learning Models
•	Primary: Random Forest Classifier
•	Evaluated: Logistic Regression, Gradient Boosting, SVM
Key Features
•	Donor Age, BMI, eGFR
•	Recipient Age, PRA, Dialysis Duration
•	HLA Match Score
•	Donor Risk Index
•	Compatibility Index
Explainability
•	Feature importance
•	Donor comparison tables
•	Human-readable clinical explanations
Output
•	Risk category (Low / Medium / High)
•	Ranked donor list
•	Professional PDF medical report
How to Run
cd donor-matching-component
pip install -r requirements.txt
python d_ml.py

•	Component 4: Clinical Ultrasound Image Analysis
 Purpose
Analyze kidney ultrasound images to predict kidney health and CKD stage.
Core Technologies
•	OpenCV – Image preprocessing
•	TensorFlow / Keras – CNN-based analysis
•	Scikit-learn – Random Forest classification
•	Roboflow – Dataset handling
•	FPDF – Report generation
Processing Pipeline
1.	Image upload
2.	Noise reduction & normalization
3.	Feature extraction
4.	ML inference
5.	PDF report generation
Output
•	Kidney health prediction
•	Visualized ultrasound analysis
•	Structured clinical report
How to Run
cd ultrasound-component
pip install -r requirements.txt
jupyter notebook Ultra_Final.ipynb

 Reporting & Visualization
All components support:
•	Structured result visualization
•	Clinical-friendly outputs
•	PDF report generation
•	Explainable insights

 Ethical & Security Considerations
•	Patient data anonymization
•	Secure storage of medical records
•	Advisory-only AI predictions
•	Clinician validation required
•	Academic and medical ethics compliance

