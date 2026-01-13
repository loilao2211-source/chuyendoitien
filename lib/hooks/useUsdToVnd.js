"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchUsdToVnd } from '@/services/fxService';

const FALLBACK_ERROR = 'Không lấy được tỷ giá USD↔VND. Đang dùng tỷ giá dự phòng.';

/**
 * React hook for USD to VND exchange rate
 * Uses unified fxService.js as single source of truth
 * 
 * @returns {Object} { usdVndRate, fxOk, fxError, fxLoading, refetchFx }
 */
// Options allow passing prefetched FX rate from Price Gateway to avoid extra API calls
export function useUsdToVnd({ prefetchedRate = null, disableFetch = false } = {}) {
  const [usdVndRate, setUsdVndRate] = useState(null);
  const [fxError, setFxError] = useState(null);
  const [fxLoading, setFxLoading] = useState(true);
  const [fxOk, setFxOk] = useState(false);
  const didWarnRef = useRef(false);

  const fetchFx = useCallback(async () => {
    if (disableFetch) {
      setFxLoading(false);
      return;
    }

    setFxLoading(true);
    
    try {
      const rate = await fetchUsdToVnd();
      
      if (rate && typeof rate === 'number') {
        setUsdVndRate(rate);
        setFxOk(true);
        setFxError(null);
        didWarnRef.current = false;
      } else {
        // Invalid rate
        setUsdVndRate(25300);
        setFxError(FALLBACK_ERROR);
        setFxOk(false);
        
        if (!didWarnRef.current) {
          console.warn('[useUsdToVnd] Invalid rate received from fxService');
          didWarnRef.current = true;
        }
      }
    } catch (error) {
      // fxService handles all fallbacks internally
      console.warn('[useUsdToVnd] Error from fxService:', error.message);
      setUsdVndRate(25300);
      setFxError(FALLBACK_ERROR);
      setFxOk(false);
      
      if (!didWarnRef.current) {
        didWarnRef.current = true;
      }
    } finally {
      setFxLoading(false);
    }
  }, []);

  useEffect(() => {
    // If prefetchedRate is provided, use it and skip network
    if (prefetchedRate && typeof prefetchedRate === 'number') {
      setUsdVndRate(prefetchedRate);
      setFxOk(true);
      setFxError(null);
      setFxLoading(false);
      return;
    }

    fetchFx();
  }, [fetchFx, prefetchedRate]);

  return {
    usdToVnd: usdVndRate,
    usdVndRate,
    fxOk,
    fxError,
    fxLoading,
    refetchFx: fetchFx,
    retryFx: fetchFx,
  };
}
