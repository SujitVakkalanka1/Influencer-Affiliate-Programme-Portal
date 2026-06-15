@echo off
cd backend
echo Starting backend on http://localhost:5000
echo Backend will use MongoDB from backend\.env MONGO_URI.
echo If this fails, install MongoDB Community Server or use MongoDB Atlas.
call npm run dev
pause
