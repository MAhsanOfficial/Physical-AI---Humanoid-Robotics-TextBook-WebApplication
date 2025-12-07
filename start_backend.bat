@echo off
echo Starting Physical AI Book Backend...

echo Checking Configuration...
python backend/config_check.py
if %errorlevel% neq 0 (
    echo [ERROR] Configuration check failed. Please fix the issues above.
    pause
    exit /b %errorlevel%
)

echo.
echo Installing dependencies (if needed)...
pip install -r requirements.txt > nul 2>&1

echo.
echo Starting Server...
python -m uvicorn backend.api.main:app --reload --port 8000

pause
