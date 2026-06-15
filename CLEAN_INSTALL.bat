@echo off
echo Closing Node processes if any...
taskkill /F /IM node.exe >nul 2>nul
echo Cleaning old installs and lock files...
rmdir /S /Q node_modules 2>nul
rmdir /S /Q backend\node_modules 2>nul
del /F /Q package-lock.json 2>nul
del /F /Q backend\package-lock.json 2>nul
call npm config set registry https://registry.npmjs.org/
echo Installing frontend packages...
call npm install --registry=https://registry.npmjs.org/
echo Installing backend packages...
cd backend
call npm install --registry=https://registry.npmjs.org/
cd ..
echo Done.
pause
