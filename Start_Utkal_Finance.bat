@echo off
title Utkal Finance Web Application
cd /d "%~dp0"
echo ==========================================================
echo    UTKAL FINANCE - SMART FINANCIAL MANAGEMENT
echo ==========================================================
echo.
echo Starting application server on http://localhost:5173 ...
echo.

start "" "http://localhost:5173"
node server.js

pause
