@echo off
title New Utkal Finance Web Application
cd /d "%~dp0"
echo ==========================================================
echo    NEW UTKAL FINANCE - SMART FINANCIAL MANAGEMENT
echo ==========================================================
echo.

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install
)

REM Check if dist exists; if not, compile production bundle
if not exist "dist\index.html" (
    echo [2/3] Building production assets...
    call npm run build
)

echo [3/3] Launching application server and opening browser...
echo Local URL: http://localhost:5173/
echo.

node server.js --open

pause
