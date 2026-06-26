@echo off
title AI Flashcards
cd /d "%~dp0"
echo.
echo ================================
echo    AI Flashcards - 智能学习卡片
echo ================================
echo.
echo 正在启动服务...
start "" http://localhost:3000
call npm run start
pause
