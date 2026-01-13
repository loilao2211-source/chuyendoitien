"use client";

import { useState } from 'react';
import { formatVNDWithWords, numberToVietnameseWordsShort } from '@/lib/utils/numberToVietnameseWords';

/**
 * Vietnamese Words Display Component
 * Shows VND amount in Vietnamese words with toggle
 * 
 * @param {number} amount - VND amount to display
 * @param {boolean} compact - Use compact format (78.8 triệu vs full)
 * @param {string} className - Additional CSS classes
 */
export default function VietnameseWordsDisplay({ amount, compact = false, className = '' }) {
  const [show, setShow] = useState(false);
  
  if (!amount || typeof amount !== 'number') return null;
  
  const words = compact 
    ? numberToVietnameseWordsShort(amount)
    : formatVNDWithWords(amount);
  
  return (
    <div className={`vietnamese-words-display ${className}`}>
      <button
        onClick={() => setShow(!show)}
        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
        type="button"
      >
        {show ? '✕ Ẩn bằng chữ' : '🔤 Hiện bằng chữ'}
      </button>
      
      {show && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
            {words}
          </p>
        </div>
      )}
    </div>
  );
}
