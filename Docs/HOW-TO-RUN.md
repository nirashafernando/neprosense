# NephroSense — How to Run on a New PC

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org/ |
| Python | 3.9–3.13 | https://www.python.org/ |
| Git | any | https://git-scm.com/ |

> **No local MongoDB needed** — the project connects to MongoDB Atlas (cloud). The connection string is already configured.

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/your-org/nephrosense.git
cd nephrosense
```

---

## Step 2 — Create the Shared Python Virtual Environment

All Python services share one `.venv` at the project root.

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

---

## Step 3 — Install Python Dependencies

```bash
# Donor Matching ML service (FastAPI)
pip install -r services/donor-matching/ml-service/requirements.txt

# Lifestyle service (Flask)
pip install -r services/lifestyle/flask_app/requirements.txt

# Ultrasound & Urine services
pip install flask flask-cors
```

---

## Step 4 — Install Node Dependencies

Run all of these from the **project root**:

```bash
# Root orchestrator (concurrently)
npm install

# API Gateway
npm --prefix api-gateway install

# Donor Matching Node.js backend
npm --prefix services/donor-matching/backend install

# React frontend
npm --prefix frontend install
```

---

## Step 5 — Run Everything

From the project root, one command starts all 7 services:

```bash
npm start
```

Then open **http://localhost:3000** in your browser.

---

## What Gets Started

| Service | Port | Technology |
|---------|------|------------|
| React Frontend | 3000 | React |
| Donor Matching Backend | 5000 | Node.js / Express |
| Lifestyle Prediction | 5001 | Python / Flask |
| Ultrasound Analysis | 5002 | Python / Flask |
| Urine Analysis | 5003 | Python / Flask |
| Donor Matching ML | 8000 | Python / FastAPI |
| API Gateway | 8080 | Node.js / Express |

---

## Run Individual Services (for Debugging)

```bash
npm run service:frontend      # React frontend
npm run service:gateway       # API Gateway
npm run service:donor-api     # Donor Matching backend
npm run service:ml            # Donor Matching ML service
npm run service:lifestyle     # Lifestyle Flask service
npm run service:ultrasound    # Ultrasound Flask service
npm run service:urine         # Urine Flask service
```

---

## Health Check — Verify All Services Are Live

After running `npm start`, open each URL in your browser (or use `curl`). Every service should return `{"status": "ok"}` or a welcome message.

| Service | Health Check URL | Expected Response |
|---------|-----------------|-------------------|
| React Frontend | http://localhost:3000 | NephroSense UI loads |
| API Gateway | http://localhost:8080/health | `{"status":"ok"}` |
| Donor Matching Backend | http://localhost:5000/health | `{"status":"ok"}` |
| Donor Matching ML | http://localhost:8000/health | `{"status":"ok"}` |
| Lifestyle Service | http://localhost:5001/health | `{"status":"ok"}` |
| Ultrasound Service | http://localhost:5002/health | `{"status":"ok"}` |
| Urine Service | http://localhost:5003/health | `{"status":"ok"}` |

> **Quick test with curl (PowerShell):**
> ```powershell
> 5000,5001,5002,5003,8000,8080 | ForEach-Object { 
>     $r = try { Invoke-WebRequest "http://localhost:$_/health" -UseBasicParsing } catch { $null }
>     if ($r) { Write-Host "[OK]  :$_" -ForegroundColor Green } else { Write-Host "[DEAD] :$_" -ForegroundColor Red }
> }
> ```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `python not found` | Make sure Python is added to PATH; try `py` on Windows |
| Port already in use | `npx kill-port 5000` (replace with the port number) |
| Python service crashes on startup | Activate the venv first: `.venv\Scripts\activate` |
| `Module not found` in Python | Re-run `pip install -r requirements.txt` with the venv active |
| Frontend shows blank / API errors | Make sure the API Gateway on port 8080 is running |
| `concurrently not found` | Run `npm install` from the project root again |
