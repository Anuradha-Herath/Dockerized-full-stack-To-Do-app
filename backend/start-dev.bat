@echo off
echo Starting TodoMaster Backend in Development Mode...
set NODE_ENV=development
cd /d "%~dp0"
npm run dev
