@echo off
REM PriceConverter Quick Start Script (Windows)

echo.
echo ==================================
echo PriceConverter - Quick Start
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo.
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo Node.js version: %NODE_VERSION%
echo npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully
echo.

REM Build check
echo Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed. Check the errors above.
    pause
    exit /b 1
)
echo Build successful
echo.

REM Setup environment
if not exist .env.local (
    echo Creating .env.local...
    copy .env.example .env.local
    echo Created .env.local (update with your API keys if needed)
) else (
    echo WARNING: .env.local already exists (keeping current configuration)
)

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. npm run dev    - Start development server (http://localhost:3000)
echo 2. npm run build  - Production build
echo 3. npm start      - Start production server
echo.
echo For more info, see README.md
echo For testing guide, see TESTING.md
echo.
pause
