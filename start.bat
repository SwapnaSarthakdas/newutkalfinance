@echo off
title Utkal Finance Web Application
cd /d "%~dp0"
echo ====================================================
echo   Starting Utkal Finance Application Server...
echo ====================================================
echo.

if not exist "dist\index.html" (
    echo Building latest assets...
    call npm run build
)

node server.js --open
pause
