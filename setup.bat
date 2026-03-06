@echo off
setlocal enabledelayedexpansion
title NephroSense Setup

:: Always work relative to where THIS bat file lives, not the current directory
set ROOT=%~dp0
if "%ROOT:~-1%"=="\" set ROOT=%ROOT:~0,-1%

echo.
echo =====================================================
echo  NephroSense - First-Time Setup
echo =====================================================
echo  Project root: %ROOT%
echo.

:: Check Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found.
    echo         Install Python 3.10 or 3.11 from https://python.org
    echo         Check "Add Python to PATH" during install.
    pause
    exit /b 1
)
for /f "tokens=2 delims= " %%v in ('python --version 2^>^&1') do set PY_VER=%%v
echo [OK] Python %PY_VER% found

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=1" %%v in ('node --version 2^>^&1') do set NODE_VER=%%v
echo [OK] Node.js %NODE_VER% found

:: Create .venv
echo.
echo [1/4] Creating Python virtual environment (.venv) ...
if exist "%ROOT%\.venv" (
    echo       .venv already exists, skipping.
) else (
    python -m venv "%ROOT%\.venv"
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create .venv
        pause
        exit /b 1
    )
    echo       .venv created.
)

:: Install Python packages
echo.
echo [2/4] Installing Python packages into .venv ...

if exist "%ROOT%\services\donor-matching\ml-service\requirements.txt" (
    echo       - donor-matching ml-service ...
    "%ROOT%\.venv\Scripts\pip" install -r "%ROOT%\services\donor-matching\ml-service\requirements.txt" -q
) else ( echo [WARN] Missing: services\donor-matching\ml-service\requirements.txt )

if exist "%ROOT%\services\lifestyle\flask_app\requirements.txt" (
    echo       - lifestyle service ...
    "%ROOT%\.venv\Scripts\pip" install -r "%ROOT%\services\lifestyle\flask_app\requirements.txt" -q
) else ( echo [WARN] Missing: services\lifestyle\flask_app\requirements.txt )

if exist "%ROOT%\services\ultrasound\requirements.txt" (
    echo       - ultrasound service ...
    "%ROOT%\.venv\Scripts\pip" install -r "%ROOT%\services\ultrasound\requirements.txt" -q
) else ( echo [WARN] Missing: services\ultrasound\requirements.txt )

if exist "%ROOT%\services\urine\requirements.txt" (
    echo       - urine service ...
    "%ROOT%\.venv\Scripts\pip" install -r "%ROOT%\services\urine\requirements.txt" -q
) else ( echo [WARN] Missing: services\urine\requirements.txt )

echo       Done.

:: Install Node.js packages
echo.
echo [3/4] Installing Node.js packages ...
call npm install --prefix "%ROOT%" --silent
call npm install --prefix "%ROOT%\api-gateway" --silent
call npm install --prefix "%ROOT%\services\donor-matching\backend" --silent
call npm install --prefix "%ROOT%\frontend" --silent
echo       Done.

:: Create .env files
echo.
echo [4/4] Creating .env files ...

if not exist "%ROOT%\services\donor-matching\backend\.env" (
    (
        echo PORT=5000
        echo MONGO_URI=mongodb://localhost:27017/nephrosense
        echo JWT_SECRET=change_this_secret_key
        echo ML_SERVICE_URL=http://localhost:8000
    ) > "%ROOT%\services\donor-matching\backend\.env"
    echo       Created services\donor-matching\backend\.env
) else ( echo       services\donor-matching\backend\.env already exists. )

if not exist "%ROOT%\api-gateway\.env" (
    (
        echo PORT=8080
        echo FRONTEND_URL=http://localhost:3000
        echo DONOR_MATCHING_BACKEND_URL=http://localhost:5000
        echo DONOR_MATCHING_ML_URL=http://localhost:8000
        echo LIFESTYLE_SERVICE_URL=http://localhost:5001
        echo ULTRASOUND_SERVICE_URL=http://localhost:5002
        echo URINE_SERVICE_URL=http://localhost:5003
    ) > "%ROOT%\api-gateway\.env"
    echo       Created api-gateway\.env
) else ( echo       api-gateway\.env already exists. )

if not exist "%ROOT%\frontend\.env" (
    echo REACT_APP_API_URL=http://localhost:8080/api > "%ROOT%\frontend\.env"
    echo       Created frontend\.env
) else ( echo       frontend\.env already exists. )

echo.
echo =====================================================
echo  Setup complete!
echo.
echo  Start everything:   npm start
echo  Then open:          http://localhost:3000
echo =====================================================
echo.
pause