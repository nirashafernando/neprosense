@echo off
set PYTHONUTF8=1
cd /d "%~dp0Ultra backend\flask_app"
"%~dp0..\..\.venv\Scripts\python.exe" app.py
