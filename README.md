<div align="center">
  <img src="Intelligent Donor Matching/logo.png" alt="NephroSense Logo" width="200"/>
  
  # NephroSense
  
  ### AI-Powered CKD Monitoring & Clinical Decision Support System
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
  [![React](https://img.shields.io/badge/React-19.1+-61DAFB.svg)](https://reactjs.org/)
  
  *Empowering healthcare professionals with intelligent tools for Chronic Kidney Disease management*
  
</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [System Components](#system-components)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [ML Model Information](#ml-model-information)
- [Development](#development)
- [Security & Ethics](#security--ethics)
- [License](#license)

---

## Overview

**NephroSense** is a comprehensive, modular AI-driven healthcare decision support system designed to revolutionize Chronic Kidney Disease (CKD) management. The platform integrates four independent yet interconnected AI components, each addressing critical stages of kidney disease diagnosis, monitoring, and treatment.

### Why NephroSense?

Chronic Kidney Disease management requires continuous monitoring, accurate diagnosis, and high-stakes clinical decisions such as kidney transplantation. Existing systems are often:
- **Fragmented** - Disconnected tools and workflows
- **Manual** - Time-consuming and error-prone processes
- **Opaque** - Lack of explainability in AI predictions

NephroSense addresses these gaps by providing:
- **Automated medical image and test analysis**
- **Personalized lifestyle guidance**
- **Explainable donor–recipient transplant matching**
- **Unified reporting and clinical dashboards**

---

## Key Features

### Intelligent Analysis
- **Multi-modal AI** - Combines image analysis, test interpretation, and predictive modeling
- **Real-time Processing** - Instant results for clinical decision-making
- **Explainable AI** - Transparent predictions with feature importance and reasoning

### Clinical Integration
- **Professional Reporting** - Generate comprehensive PDF medical reports
- **Dashboard Visualization** - Intuitive interfaces for healthcare professionals
- **Batch Processing** - Handle multiple predictions efficiently

### Enterprise-Grade Security
- **JWT Authentication** - Secure user authentication and authorization
- **Data Encryption** - Protected patient information
- **HIPAA-Compliant** - Medical data privacy standards

### Comprehensive Monitoring
- **Lifestyle Tracking** - Monitor patient habits and adherence
- **Risk Prediction** - Early detection of CKD progression
- **Donor Matching** - Intelligent transplant compatibility analysis

---

## System Architecture

![NephroSense Architecture](Docs/architectural%20diagram.png)

### Architecture Overview

NephroSense follows a **modular microservices architecture** with clear separation of concerns:

#### **Presentation Layer**
- **Frontend**: React-based SPA with responsive design
- **User Interfaces**: Patient portals, clinician dashboards, admin panels

#### **Application Layer**
- **Backend API**: Node.js/Express REST API
- **ML Service**: Python/FastAPI microservice for ML predictions
- **Authentication**: JWT-based secure authentication

#### **Intelligence Layer**
- **Donor Matching Model**: Random Forest classifier for transplant compatibility
- **Lifestyle Prediction**: XGBoost and ensemble models
- **Urine Analysis**: YOLO + SVM for test strip interpretation
- **Ultrasound Analysis**: CNN-based kidney image classification

#### **Data Layer**
- **MongoDB**: NoSQL database for flexible medical records
- **Model Storage**: Serialized ML models (PKL format)
- **File Storage**: Secure storage for medical images and reports

#### **Reporting Layer**
- **PDF Generation**: Professional medical reports (PDFKit)
- **Visualization**: Charts and graphs for clinical insights
- **Export Capabilities**: Batch report generation

---

## System Components

### 1. Lifestyle Prediction & Advisory System

**Purpose**: Predict CKD risk based on lifestyle and clinical data, generate personalized recommendations.

**Machine Learning Models**:
- Logistic Regression
- Random Forest
- XGBoost
- Gradient Boosting

**Features Used**:
- **Numeric**: Age, BMI, Daily Steps, Sleep Hours, Exercise Minutes, Routine Adherence Score
- **Categorical**: Gender (One-Hot Encoded)

**Output**:
- Fitness/risk classification
- Personalized diet & lifestyle plan

---

### 2. Urine Test Strip Analysis System

**Purpose**: Automatically analyze urine test strip images for early CKD screening.

**System Flow**:
1. Image upload
2. White balance correction
3. YOLO-based pad detection
4. HSV feature extraction
5. SVM classification

**Models Used**:
- **YOLOv8** - Pad detection
- **SVM** - Test result classification

**Output**:
- Detected strip pads
- Predicted test results (Normal/High)
- Visualized results

---

### 3. Intelligent Donor–Recipient Matching System

**Purpose**: Support clinicians in kidney transplant decisions using risk prediction, donor ranking, and explainable AI.

**Machine Learning Models**:
- **Primary**: Random Forest Classifier (94.2% accuracy)
- **Evaluated**: Logistic Regression, Gradient Boosting, SVM

**Key Features**:
- Donor: Age, BMI, eGFR
- Recipient: Age, PRA, Dialysis Duration
- HLA Match Score
- Donor Risk Index
- Compatibility Index

**Explainability**:
- Feature importance visualization
- Donor comparison tables
- Human-readable clinical explanations

**Output**:
- Risk category (Low/Medium/High)
- Ranked donor list
- Professional PDF medical report

---

### 4. Clinical Ultrasound Image Analysis

**Purpose**: Analyze kidney ultrasound images to predict kidney health and CKD stage.

**Core Technologies**:
- **OpenCV** - Image preprocessing
- **TensorFlow/Keras** - CNN-based analysis
- **Scikit-learn** - Random Forest classification
- **Roboflow** - Dataset handling

**Processing Pipeline**:
1. Image upload
2. Noise reduction & normalization
3. Feature extraction
4. ML inference
5. PDF report generation

**Output**:
- Kidney health prediction
- Visualized ultrasound analysis
- Structured clinical report

---

## Technology Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| React 19.1 | UI framework |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React Router | Navigation |
| Lucide React | Icons |
| jsPDF | Client-side PDF generation |

### **Backend**
| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| PDFKit | Server-side PDF generation |
| bcryptjs | Password hashing |

### **ML Service**
| Technology | Purpose |
|------------|---------|
| Python 3.9+ | Programming language |
| FastAPI | API framework |
| Scikit-learn | ML algorithms |
| XGBoost | Gradient boosting |
| Pandas | Data manipulation |
| NumPy | Numerical computing |

### **Machine Learning & AI**
| Technology | Purpose |
|------------|---------|
| Random Forest | Donor matching classification |
| XGBoost | Lifestyle prediction |
| YOLOv8 | Object detection (urine strips) |
| SVM | Classification |
| TensorFlow/Keras | Deep learning (ultrasound) |
| OpenCV | Image processing |

---

## Project Structure

```
NeproSense/
├── Intelligent Donor Matching/
│   ├── backend/                    # Node.js/Express API
│   │   ├── src/
│   │   │   ├── config/            # Database configuration
│   │   │   ├── controllers/       # Route controllers
│   │   │   ├── middleware/        # Auth middleware
│   │   │   ├── models/            # Mongoose models
│   │   │   ├── routes/            # API routes
│   │   │   └── server.js          # Entry point
│   │   ├── .env                   # Environment variables
│   │   └── package.json
│   │
│   ├── frontend/                   # React SPA (Donor Matching)
│   │   ├── src/
│   │   │   ├── components/        # Reusable components
│   │   │   ├── pages/             # Page components
│   │   │   ├── contexts/          # React contexts
│   │   │   ├── lib/               # Utilities
│   │   │   ├── App.js             # Main app component
│   │   │   └── index.js           # Entry point
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── ml-service/                 # Python ML microservice
│   │   ├── model/                 # Trained models
│   │   ├── main.py                # FastAPI application
│   │   └── requirements.txt
│   │
│   ├── Donor-Matching-Model/      # ML model development
│   │   ├── donor.ipynb            # Jupyter notebook
│   │   ├── d_ml.py                # Model training script
│   │   ├── kidney_donor_dataset.csv
│   │   ├── donor_match_model_final_random_forest.pkl
│   │   ├── feature_importance.png
│   │   └── model_comparison_analysis.png
│   │
│   └── logo.png
│
├── LifestylePrediction/            # Lifestyle Prediction Component
│   └── src/                        # React frontend
│       ├── components/             # UI components
│       ├── App.js                  # Main app component
│       ├── App.css                 # Styling
│       └── index.js                # Entry point
│
├── Docs/
│   └── architectural diagram.png  # System architecture
│
└── README.md                       # This file
```

---

## Getting Started

### Prerequisites

Before running NephroSense, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))
- **npm** (comes with Node.js)
- **pip** (comes with Python)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-org/nephrosense.git
cd nephrosense
cd "Intelligent Donor Matching"
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nephrosense
JWT_SECRET=your_jwt_secret_key_here
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ML_SERVICE_URL=http://localhost:8000
```

#### 4. ML Service Setup

```bash
cd ../ml-service
pip install -r requirements.txt
```

Create a `.env` file in the `ml-service` directory:

```env
PORT=8000
MODEL_PATH=./model
```

---

## Configuration

### Environment Variables

#### Backend (`backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/nephrosense` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `ML_SERVICE_URL` | ML service endpoint | `http://localhost:8000` |
| `NODE_ENV` | Environment mode | `development` |

#### Frontend (`frontend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | `http://localhost:5000/api` |
| `REACT_APP_ML_SERVICE_URL` | ML service endpoint | `http://localhost:8000` |

#### ML Service (`ml-service/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | ML service port | `8000` |
| `MODEL_PATH` | Path to trained models | `./model` |

---

## Running the Application

### Development Mode

Open **three separate terminals**:

#### Terminal 1: Backend
```bash
cd "Intelligent Donor Matching/backend"
npm run dev
```
Backend will run on `http://localhost:5000`

#### Terminal 2: Frontend
```bash
cd "Intelligent Donor Matching/frontend"
npm start
```
Frontend will run on `http://localhost:3000`

#### Terminal 3: ML Service
```bash
cd "Intelligent Donor Matching/ml-service"
python main.py
```
ML Service will run on `http://localhost:8000`

### Production Mode

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

#### ML Service
```bash
cd ml-service
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. John Doe",
  "email": "john.doe@hospital.com",
  "password": "securePassword123",
  "role": "doctor"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@hospital.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Dr. John Doe",
    "email": "john.doe@hospital.com",
    "role": "doctor"
  }
}
```

---

### Donor Management Endpoints

#### Create Donor
```http
POST /api/donors
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "age": 35,
  "bloodType": "O+",
  "bmi": 24.5,
  "egfr": 95,
  "medicalHistory": "No significant history"
}
```

#### Get All Donors
```http
GET /api/donors
Authorization: Bearer {token}
```

#### Get Donor by ID
```http
GET /api/donors/:id
Authorization: Bearer {token}
```

---

### Recipient Management Endpoints

#### Create Recipient
```http
POST /api/recipients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Patient",
  "age": 45,
  "bloodType": "O+",
  "pra": 15,
  "dialysisDuration": 24,
  "urgencyLevel": "high"
}
```

#### Get All Recipients
```http
GET /api/recipients
Authorization: Bearer {token}
```

---

### Prediction Endpoints

#### Single Prediction
```http
POST /api/predictions/predict
Authorization: Bearer {token}
Content-Type: application/json

{
  "donorId": "507f1f77bcf86cd799439011",
  "recipientId": "507f191e810c19729de860ea"
}
```

**Response:**
```json
{
  "prediction": {
    "riskCategory": "Low",
    "compatibilityScore": 0.87,
    "recommendation": "Highly compatible match",
    "featureImportance": {
      "hlaMatch": 0.35,
      "ageCompatibility": 0.22,
      "egfrScore": 0.18
    }
  }
}
```

#### Batch Prediction
```http
POST /api/predictions/batch
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipientId": "507f191e810c19729de860ea",
  "donorIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ]
}
```

#### Download Prediction Report
```http
GET /api/predictions/:id/report
Authorization: Bearer {token}
```

Returns a PDF report of the prediction results.

---

### ML Service Endpoints

#### Lifestyle Prediction
```http
POST /predict/lifestyle
Content-Type: application/json

{
  "age": 45,
  "bmi": 27.5,
  "dailySteps": 5000,
  "sleepHours": 6.5,
  "exerciseMinutes": 30,
  "routineAdherence": 75,
  "gender": "Male"
}
```

---

## ML Model Information

### Donor Matching Model

**Model Type**: Random Forest Classifier

**Performance Metrics**:
- **Accuracy**: 94.2%
- **Precision**: 93.8%
- **Recall**: 94.5%
- **F1-Score**: 94.1%

**Feature Importance** (Top 5):
1. HLA Match Score (35%)
2. Donor eGFR (22%)
3. Age Compatibility (18%)
4. Donor Risk Index (12%)
5. Compatibility Index (8%)

**Training Dataset**:
- **Size**: 10,000+ donor-recipient pairs
- **Features**: 15 clinical and demographic variables
- **Target**: Transplant success (Binary classification)

**Model Files**:
- `donor_match_model_final_random_forest.pkl` - Trained model
- `feature_importance.png` - Feature importance visualization
- `model_comparison_analysis.png` - Model comparison charts

### Lifestyle Prediction Model

**Model Type**: XGBoost Classifier

**Performance Metrics**:
- **Accuracy**: 91.5%
- **AUC-ROC**: 0.93

**Features**: Age, BMI, Daily Steps, Sleep Hours, Exercise Minutes, Routine Adherence, Gender

---

## Development

### Code Style

- **JavaScript**: ESLint with Airbnb config
- **Python**: PEP 8 style guide
- **React**: Functional components with hooks

### Testing

#### Backend Tests
```bash
cd backend
npm test
```

#### Frontend Tests
```bash
cd frontend
npm test
```

#### ML Service Tests
```bash
cd ml-service
pytest
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Security & Ethics

### Data Privacy
- Patient data anonymization
- Secure storage of medical records
- Encrypted data transmission (HTTPS)
- HIPAA compliance standards

### AI Ethics
- **Advisory-only predictions** - AI assists, not replaces clinicians
- **Explainable AI** - Transparent decision-making process
- **Clinician validation required** - Human oversight mandatory
- **Bias mitigation** - Regular model audits for fairness
- **Academic and medical ethics compliance**

### Security Measures
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Environment variable protection

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **NephroSense Research Team** - For developing this comprehensive CKD management system
- **Medical Advisors** - For clinical guidance and validation
- **Open Source Community** - For the amazing tools and libraries

---

## Contact & Support

For questions, issues, or collaboration opportunities:

- **Email**: support@nephrosense.com
- **GitHub Issues**: [Report a bug](https://github.com/your-org/nephrosense/issues)
- **Documentation**: [Full Documentation](https://docs.nephrosense.com)

---

<div align="center">
  
  **Made by the NephroSense Team**
  
  *Advancing kidney disease management through AI innovation*
  
</div>
