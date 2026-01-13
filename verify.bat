@echo off
REM Quick verification script for Windows
REM Run this to verify project integrity

setlocal enabledelayedexpansion

echo.
echo Project Verification
echo ====================
echo.

set /a files_found=0
set /a files_missing=0

REM Helper function to check file
call :check_file "package.json"
call :check_file "next.config.js"
call :check_file "tsconfig.json"
call :check_file "app\layout.jsx"
call :check_file "app\page.jsx"
call :check_file "app\api\fx\route.js"
call :check_file "app\api\crypto\route.js"
call :check_file "app\api\gold\route.js"
call :check_file "app\api\oil\route.js"
call :check_file "app\currency\page.jsx"
call :check_file "app\crypto\page.jsx"
call :check_file "app\gold\page.jsx"
call :check_file "app\oil\page.jsx"
call :check_file "components\Navbar.jsx"
call :check_file "components\ConverterForm.jsx"
call :check_file "components\PriceCard.jsx"
call :check_file "components\PriceTable.jsx"
call :check_file "lib\cache.js"
call :check_file "lib\http.js"
call :check_file "lib\normalize.js"
call :check_file "lib\providers\frankfurter.js"
call :check_file "lib\providers\coingecko.js"
call :check_file "data\currencies.json"
call :check_file "data\cryptoCoins.json"
call :check_file "README.md"
call :check_file "TESTING.md"

echo.
echo ====================
echo Files found: %files_found%
if %files_missing% gtr 0 (
  echo Files missing: %files_missing%
  echo.
  echo WARNING: Some files are missing!
  pause
  exit /b 1
) else (
  echo Files missing: 0
  echo.
  echo SUCCESS: All files present!
  echo.
  echo Next steps:
  echo 1. npm install
  echo 2. npm run dev
  echo 3. Open http://localhost:3000
  echo.
  pause
  exit /b 0
)

REM Subroutine to check file
:check_file
if exist %1 (
  echo [OK] %~1
  set /a files_found+=1
) else (
  echo [MISSING] %~1
  set /a files_missing+=1
)
exit /b 0
