@echo off

:: Clean up node_modules
rmdir /s /q frontend\node_modules
rmdir /s /q backend\node_modules

:: Install and build frontend
cd frontend
call npm install --no-optional
call npm run build
cd ..

:: Install backend dependencies
cd backend
call npm install --no-optional
cd ..
