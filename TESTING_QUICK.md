# 🧪 Quick Testing Guide

## Test 1: VND → BTC Conversion

### Steps:
1. Open http://localhost:3000/crypto
2. In **Value Explorer**:
   - Click "VND" button (should show as selected)
   - Enter: `1000000` (1 triệu VND)
3. **Expected Result**:
   - See BTC amount (approx 0.0008 BTC if BTC = $50k, rate = 25k)
   - See ETH amount
   - See other crypto amounts
4. **Debug**: Open console, should see:
   ```
   [ValueExplorer] VND Conversion: {
     parsedAmount: 1000000,
     baseMoney: 'VND',
     effectiveFxRate: 25000,
     context: 'crypto'
   }
   ```

---

## Test 2: VND → Gold Conversion

### Steps:
1. Open http://localhost:3000/gold
2. In **Value Explorer**:
   - Click "VND"
   - Enter: `50000000` (50 triệu VND)
3. **Expected Result**:
   - See troy oz: ~1 oz
   - See gram: ~31 grams
   - See chi: ~8 chỉ
   - See cây: ~0.8 cây

---

## Test 3: VND → Oil Conversion

### Steps:
1. Open http://localhost:3000/oil
2. In **Value Explorer**:
   - Click "VND"
   - Enter: `2000000` (2 triệu VND)
3. **Expected Result**:
   - See barrels: ~1 barrel
   - See liters: ~159 liters
   - See gallons: ~42 gallons

---

## Test 4: Charts Load

### Currency Chart:
1. Open http://localhost:3000/currency
2. Scroll down to "Biểu đồ tỷ giá USD/VND"
3. **Expected**: Chart loads within 2-3 seconds
4. Click time ranges: 7D, 30D, 90D, 1Y
5. **Expected**: Chart updates smoothly

### Crypto Chart:
1. Open http://localhost:3000/crypto
2. Scroll to chart section
3. **Expected**: BTC chart shows by default
4. Click tabs: BTC, ETH, SOL, ADA
5. **Expected**: Chart switches to selected crypto

### Gold/Oil Charts:
1. Open http://localhost:3000/gold
2. Check XAU/USD chart loads
3. Open http://localhost:3000/oil
4. Check Brent oil chart loads

---

## Test 5: Dashboard Market Overview

### Steps:
1. Open http://localhost:3000
2. Scroll down to "📊 Tổng quan thị trường"
3. **Expected**:
   - Chart loads (default: USD/VND)
   - Top 6 table shows current prices
4. Click: USD/VND, BTC, XAU buttons
5. **Expected**: Chart switches between assets

---

## Test 6: Error Handling

### Test missing FX rate:
1. Open browser DevTools → Network tab
2. Block requests to `/api/fx`
3. Open http://localhost:3000/crypto
4. Click VND in Value Explorer
5. **Expected**: See error message: "Đang tải tỷ giá VND/USD..."

### Test conversion error:
1. Open console
2. Try VND conversion without valid rate
3. **Expected**: See error in UI + console log

---

## Test 7: Cache Performance

### First Load (No Cache):
1. Clear browser cache (Ctrl+Shift+Del)
2. Open http://localhost:3000/crypto
3. Open DevTools → Network
4. **Expected**: API calls to `/api/crypto/historical`

### Second Load (With Cache):
1. Refresh page (F5)
2. **Expected**: Much faster load, fewer API calls

### Cache Expiry:
1. Wait 2+ hours
2. Refresh page
3. **Expected**: New API calls (cache expired)

---

## ✅ Success Criteria

All tests should pass with these results:

- ✅ VND conversions show correct amounts
- ✅ No console errors (except blocked requests in error test)
- ✅ Charts load within 3 seconds
- ✅ Time range switches work smoothly
- ✅ Crypto selector tabs work
- ✅ Dashboard overview loads all data
- ✅ Error messages display when appropriate
- ✅ Cache improves load time on subsequent visits

---

## 🐛 Common Issues & Fixes

### Issue: "Không lấy được tỷ giá USD↔VND"
**Fix**: Check internet connection, API might be down. Try "Thử lại FX" button.

### Issue: Chart shows "Không có dữ liệu"
**Fix**: API endpoint might be unavailable. Check console for errors.

### Issue: VND shows 0 or NaN
**Fix**: 
1. Check console logs for `effectiveFxRate` value
2. Verify `/api/fx` returns valid rate
3. Clear cache and reload

### Issue: Chart loads slowly
**Fix**: 
1. First load always slower (fetching data)
2. Subsequent loads use cache (2hr TTL)
3. Check network speed

---

## 📱 Mobile Testing

### Test on mobile:
1. Open on phone/tablet
2. All charts should be responsive
3. Time range buttons should wrap nicely
4. Touch interactions should work smoothly

---

## 🎯 Quick Validation Commands

```bash
# Check if all services exist
ls services/

# Check if all components exist
ls components/PriceChart.jsx components/RangeSelector.jsx components/ChartSection.jsx

# Check if API routes exist
ls app/api/*/historical/route.js

# Run tests (if you have test suite)
npm test
```

---

**Quick Start**: Just run `npm run dev` and test manually following steps above!
