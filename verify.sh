#!/usr/bin/env bash
# Quick verification script - Run this to verify project integrity

echo "🔍 PriceConverter - Project Verification"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

files_found=0
files_missing=0

# Function to check file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((files_found++))
  else
    echo -e "${RED}✗${NC} $1"
    ((files_missing++))
  fi
}

# Function to check directory exists
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
    ((files_found++))
  else
    echo -e "${RED}✗${NC} $1/"
    ((files_missing++))
  fi
}

echo "📁 Checking directories..."
check_dir "app"
check_dir "app/api"
check_dir "components"
check_dir "lib"
check_dir "lib/providers"
check_dir "data"
echo ""

echo "📄 Checking configuration files..."
check_file "package.json"
check_file "next.config.js"
check_file "tsconfig.json"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file ".eslintrc.json"
check_file ".env.example"
check_file ".gitignore"
echo ""

echo "🏠 Checking app files..."
check_file "app/layout.jsx"
check_file "app/page.jsx"
check_file "app/globals.css"
echo ""

echo "🌐 Checking API routes..."
check_file "app/api/fx/route.js"
check_file "app/api/crypto/route.js"
check_file "app/api/gold/route.js"
check_file "app/api/oil/route.js"
echo ""

echo "📑 Checking converter pages..."
check_file "app/currency/page.jsx"
check_file "app/crypto/page.jsx"
check_file "app/gold/page.jsx"
check_file "app/oil/page.jsx"
echo ""

echo "🧩 Checking components..."
check_file "components/Navbar.jsx"
check_file "components/ConverterForm.jsx"
check_file "components/PriceCard.jsx"
check_file "components/PriceTable.jsx"
check_file "components/LastUpdated.jsx"
check_file "components/Disclaimer.jsx"
check_file "components/Attribution.jsx"
echo ""

echo "📚 Checking library files..."
check_file "lib/cache.js"
check_file "lib/http.js"
check_file "lib/normalize.js"
check_file "lib/constants.js"
check_file "lib/providers/frankfurter.js"
check_file "lib/providers/coingecko.js"
check_file "lib/providers/metals.js"
check_file "lib/providers/eia.js"
echo ""

echo "📊 Checking data files..."
check_file "data/currencies.json"
check_file "data/cryptoCoins.json"
check_file "data/units.json"
echo ""

echo "📖 Checking documentation..."
check_file "README.md"
check_file "GETTING_STARTED.md"
check_file "QUICKSTART.md"
check_file "TESTING.md"
check_file "ARCHITECTURE.md"
check_file "COMPLETION_SUMMARY.md"
check_file "MASTER_CHECKLIST.md"
check_file "FILE_INDEX.md"
echo ""

echo "⚙️  Checking setup scripts..."
check_file "setup.sh"
check_file "setup.bat"
echo ""

echo "========================================"
echo -e "Found: ${GREEN}$files_found${NC} files"
if [ $files_missing -gt 0 ]; then
  echo -e "Missing: ${RED}$files_missing${NC} files"
  echo ""
  echo -e "${YELLOW}⚠️  Some files are missing!${NC}"
  exit 1
else
  echo -e "Missing: ${GREEN}0${NC} files"
  echo ""
  echo -e "${GREEN}✅ All files present and accounted for!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. npm install"
  echo "2. npm run dev"
  echo "3. Open http://localhost:3000"
  echo ""
  exit 0
fi
