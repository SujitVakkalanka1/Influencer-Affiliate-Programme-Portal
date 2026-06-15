@echo off
echo Installing frontend packages...
call npm install
if errorlevel 1 pause & exit /b 1

echo Installing backend packages...
cd backend
call npm install
if errorlevel 1 pause & exit /b 1
cd ..

echo.
echo Done. MongoDB version installed.
echo Next: set backend\.env MONGO_URI if needed, then run 2-start-backend.bat and 3-start-frontend.bat.
pause
