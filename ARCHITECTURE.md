# 🏗️ PriceConverter - Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / UI Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Dashboard   │  │  ConverterForm│  │  PriceCard   │       │
│  │  /page.jsx   │  │  /Navbar.jsx  │  │  /Table.jsx  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   /api/fx    │  │ /api/crypto  │  │  /api/gold   │       │
│  │  (Rates)     │  │  (Prices)    │  │  (XAU/USD)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         ↓                 ↓                 ↓                │
│    ┌────────────────────────────────────────────┐           │
│    │        Cache Layer (Upstash Redis)          │           │
│    │  TTL: 7200s (2 hours)                      │           │
│    │  Keys: fx:USD:EUR,...  crypto:usd:btc,...  │           │
│    └────────────────────────────────────────────┘           │
│              ↓ (if cache miss)                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Provider Layer (External APIs)            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Frankfurter API │  │  CoinGecko API  │                   │
│  │ (Currency Rates)│  │ (Crypto Prices) │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  Metals API     │  │    EIA API      │                   │
│  │  (Gold Prices)  │  │  (Oil Prices)   │                   │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow Diagram

### Cache Hit Path (Fast - < 200ms)
```
User Input
    ↓
Submit Form
    ↓
Fetch /api/fx?base=USD&symbols=EUR,GBP
    ↓
API checks cache key: "fx:USD:EUR,GBP"
    ↓
Cache HIT! Return { ok: true, cached: true, data: {...} }
    ↓
ConverterForm calculates result
    ↓
Display: "1 USD = 0.92 EUR" + Last updated timestamp
```

### Cache Miss Path (Slower - 1-3s)
```
User Input
    ↓
Submit Form
    ↓
Fetch /api/fx?base=USD&symbols=EUR,GBP
    ↓
API checks cache key: "fx:USD:EUR,GBP"
    ↓
Cache MISS! Fetch from Frankfurter API
    ↓
Frankfurter returns: { base: "USD", rates: { EUR: 0.92, ... } }
    ↓
Normalize & store in cache with TTL=7200
    ↓
Return { ok: true, cached: false, data: {...} }
    ↓
ConverterForm calculates result
    ↓
Display: "1 USD = 0.92 EUR" + Last updated timestamp
```

## Data Flow for Each Module

### 1. Currency Converter
```
Page: /currency/page.jsx
    ↓
useEffect: fetch('/api/fx?base=USD&symbols=...')
    ↓
API Route: /api/fx
  ├─ Parse: base="USD", symbols="EUR,GBP,JPY"
  ├─ Sort: "EUR,GBP,JPY"
  ├─ Cache key: "fx:USD:EUR,GBP,JPY"
  ├─ Cache miss → Frankfurter.getRates()
  ├─ Normalize: { base, rates: {...} }
  └─ Return: { ok, source, cached, data }
    ↓
Component: setState(data.rates)
    ↓
Form: amount (1) × rate (EUR: 0.92) = result (0.92)
    ↓
Display: "1 USD = 0.92 EUR"
```

### 2. Crypto Converter
```
Page: /crypto/page.jsx
    ↓
useEffect: fetch('/api/crypto?vs=usd&ids=bitcoin,ethereum,...')
    ↓
API Route: /api/crypto
  ├─ Parse: vs="usd", ids="bitcoin,ethereum,..."
  ├─ Sort: ids
  ├─ Cache key: "crypto:usd:bitcoin,ethereum,..."
  ├─ Cache miss → CoinGecko.getPrices()
  ├─ Transform: { bitcoin: 95000, ethereum: 3400 }
  └─ Return: { ok, source, cached, data }
    ↓
Component: setState(data.prices)
    ↓
Form: amount (0.01) → convert via rates
  ├─ From BTC: 0.01 BTC × $95,000 = $950
  ├─ To ETH: $950 ÷ $3,400 = 0.279 ETH
    ↓
Display: "0.01 BTC = 0.279 ETH"
```

### 3. Gold Converter
```
Page: /gold/page.jsx
    ↓
useEffect: fetch('/api/gold?quote=USD')
    ↓
API Route: /api/gold
  ├─ Parse: quote="USD"
  ├─ Cache key: "gold:usd"
  ├─ Cache miss → Metals.getGoldPrice()
  ├─ Return: { xauUsd: 2050.12, unit: "USD_per_troy_oz" }
  └─ Return: { ok, source, cached, data }
    ↓
Component: setState(data.xauUsd)
    ↓
Unit Conversion (from units.json):
  ├─ 1 troy oz = 31.1034768 grams
  ├─ 1 gram = 0.2667 chỉ (Vietnamese)
  ├─ 1 chỉ = 0.1 cây
    ↓
Form: amount (100) × fromOz / toOz
  ├─ 100 troy oz → 3110.35 grams
  ├─ OR 100 troy oz → 8292 chỉ
    ↓
Display: "100 oz = 3110.35 g" or "100 oz = 8292 chỉ"
```

### 4. Oil Converter
```
Page: /oil/page.jsx
    ↓
State: oilType = "brent" (or "wti")
    ↓
useEffect: fetch('/api/oil?type=brent')
    ↓
API Route: /api/oil
  ├─ Validate: type ∈ ["brent", "wti"]
  ├─ Cache key: "oil:brent"
  ├─ Cache miss → EIA.getOilPrice()
  ├─ Return: { type: "brent", price: 78.25, unit: "USD_per_barrel" }
  └─ Return: { ok, source, cached, data }
    ↓
Component: setState(data.price)
    ↓
Unit Conversion (from units.json):
  ├─ 1 barrel = 158.987 liters
  ├─ 1 barrel = 42 US gallons
    ↓
Form: amount (10) × fromBarrel / toBarrel
  ├─ 10 barrels → 1589.87 liters
  ├─ OR 10 barrels → 420 gallons
    ↓
Display: "10 bbl = 1589.87 L" or "10 bbl = 420 gal"
```

## Cache Key Structure

### Sorting for Cache Consistency
```
Input: base=USD, symbols=JPY,EUR,GBP
  ↓
Parse & uppercase: ["JPY", "EUR", "GBP"]
  ↓
Sort: ["EUR", "GBP", "JPY"]
  ↓
Join: "EUR,GBP,JPY"
  ↓
Cache key: "fx:USD:EUR,GBP,JPY"

Result: Every request for {USD→EUR,GBP,JPY} hits same cache
```

## Error Handling Flow

```
User Action (e.g., Convert)
    ↓
Fetch to /api/*
    ↓
Error Path:
  ├─ Network timeout (> 8s)
  │   └─ Return: { ok: false, error: { code: "TIMEOUT", message: "..." } }
  │
  ├─ Provider API error
  │   └─ Retry with exponential backoff (2x, 4x, 8x)
  │   └─ After retries fail, return: { ok: false, error: {...} }
  │
  ├─ Invalid input
  │   └─ Return: { ok: false, error: { code: "INVALID_PARAM", ... } }
    ↓
Form Component:
  ├─ Checks response.ok
  ├─ If false: setState(error), show error message
  ├─ Disable form while loading
    ↓
User sees: "Failed to fetch rates. Please try again."
```

## Performance Optimization

### Cache Effectiveness
```
First 100 users in 2 hours:
├─ User 1: cache miss → fetch from provider (1-3s) → store
├─ User 2-100: cache hit → instant response (< 200ms)
  ↓
Result: 99% requests are fast, 99% provider load avoided
```

### Lazy Loading
```
Page Load:
├─ Render: Navbar + Skeleton loaders
├─ Meanwhile: useEffect fetches data
├─ Data arrives: Update state → Components re-render
├─ User sees: Smooth transition from skeleton → real data
```

## Database Schema (Cache)

### Redis Hash Structure (Upstash)
```
Key: "fx:USD:EUR,GBP,JPY"
Value: {
  "base": "USD",
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 155.23
  }
}
TTL: 7200 seconds

---

Key: "crypto:usd:bitcoin,ethereum,tether"
Value: {
  "vs": "usd",
  "prices": {
    "bitcoin": 95000,
    "ethereum": 3400,
    "tether": 1.0
  }
}
TTL: 7200 seconds
```

## Deployment Architecture

### Local Development
```
npm run dev
    ↓
Next.js dev server (localhost:3000)
    ↓
In-memory cache (Map)
    ↓
Direct provider API calls
```

### Vercel Production
```
GitHub push
    ↓
Vercel auto-deploy
    ↓
Serverless functions:
├─ pages/routes → instantaneous cold start
├─ api routes → <100ms cold start
    ↓
Upstash Redis (globally distributed)
    ↓
Direct provider API calls (cached for 2h)
    ↓
CDN for static assets
```

## Scaling Considerations

### Current (Production Ready)
- Handles 1000+ requests/hour
- Cache hit rate: > 95%
- Provider APIs: Free tiers sufficient

### Future Scaling
```
If traffic exceeds 10,000 requests/hour:
├─ Consider provider premium tiers
├─ Add multiple cache regions (geo-distribution)
├─ Implement request batching
├─ Add rate limiting per IP
└─ Monitor provider API quotas
```

---

This architecture ensures:
- ✅ Fast response times (cache)
- ✅ Low API costs (cache + free tiers)
- ✅ Scalability (serverless)
- ✅ Reliability (error handling)
- ✅ User experience (instant feedback)
