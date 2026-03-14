@echo off
setlocal

echo ==========================================
echo   📚 BookStore Project Setup & Start
echo ==========================================

:: 1. Check for .env file in Backend
if not exist "backend\.env" (
    echo [0/4] Creating default .env file for Backend...
    echo PORT=5000 > "backend\.env"
    echo MONGODB_URI=mongodb://localhost:27017/bookstore >> "backend\.env"
    echo JWT_SECRET=mysecretkeybookstore123 >> "backend\.env"
    echo .env file created with default settings.
)

:: 2. Backend Dependencies
echo.
echo [1/4] Checking Backend node_modules...
if not exist "backend\node_modules\" (
    echo.
    echo Node modules not found for Backend. Running "npm install"...
    cd backend
    call npm install
    cd ..
) else (
    echo Backend dependencies are already installed. Skipping...
)

:: 3. Frontend Dependencies
echo.
echo [2/4] Checking Frontend node_modules...
if not exist "frontend\node_modules\" (
    echo.
    echo Node modules not found for Frontend. Running "npm install"...
    cd frontend
    call npm install
    cd ..
) else (
    echo Frontend dependencies are already installed. Skipping...
)

:: 4. Optional Database Seeding (For First-time users)
echo.
echo ==========================================
echo   📦 Database Setup
echo ==========================================
set /p seedChoice="Do you want to seed/reset the database with 30 demo books? [y/N]: "
if /I "%seedChoice%"=="y" (
    echo Seeding database...
    cd backend
    call node seed.js
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [!] ERROR: Could not connect to MongoDB. 
        echo Please ensure MongoDB is installed and running on your device!
        pause
        exit /b 1
    )
    cd ..
)

:: 5. Starting the Application
echo.
echo ==========================================
echo   🚀 Starting BookStore...
echo ==========================================
echo.
echo [Terminal 1] Backend server starting...
start "📚 BookStore Backend" cmd /c "cd backend && npm run dev"

echo [Terminal 2] Frontend app starting...
start "📚 BookStore Frontend" cmd /c "cd frontend && npm start"

echo.
echo Success! 
echo.
echo ➔ Store URL: http://localhost:4200
echo ➔ API URL:   http://localhost:5000
echo.
echo IMPORTANT: Ensure MongoDB is running on:
echo mongodb://localhost:27017/bookstore
echo.
pause
