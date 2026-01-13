/**
 * Convert numbers to Vietnamese words
 * Supports large numbers up to trillions (nghìn tỷ)
 */

const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];

/**
 * Convert a group of 3 digits to Vietnamese words
 */
function convertThreeDigits(num) {
  if (num === 0) return '';
  
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  const ten = Math.floor(remainder / 10);
  const one = remainder % 10;
  
  let result = '';
  
  // Hundreds
  if (hundred > 0) {
    result += ones[hundred] + ' trăm';
    if (remainder > 0 && remainder < 10) {
      result += ' lẻ';
    }
  }
  
  // Tens
  if (ten > 1) {
    result += (result ? ' ' : '') + tens[ten];
  } else if (ten === 1) {
    result += (result ? ' ' : '') + 'mười';
  }
  
  // Ones
  if (one > 0) {
    if (ten > 1 && one === 1) {
      result += ' mốt';
    } else if (ten > 0 && one === 5) {
      result += ' lăm';
    } else {
      result += (result ? ' ' : '') + ones[one];
    }
  }
  
  return result;
}

/**
 * Convert number to Vietnamese words
 * @param {number} num - Number to convert (integer)
 * @returns {string} Vietnamese words representation
 */
export function numberToVietnameseWords(num) {
  if (typeof num !== 'number' || !Number.isFinite(num)) {
    return '';
  }
  
  // Handle negative numbers
  if (num < 0) {
    return 'âm ' + numberToVietnameseWords(-num);
  }
  
  // Handle zero
  if (num === 0) {
    return 'không đồng';
  }
  
  // Round to integer
  num = Math.round(num);
  
  // Handle very large numbers (> 999 trillion)
  if (num >= 1000000000000000) {
    return 'Số quá lớn';
  }
  
  const trillion = Math.floor(num / 1000000000000);
  const billion = Math.floor((num % 1000000000000) / 1000000000);
  const million = Math.floor((num % 1000000000) / 1000000);
  const thousand = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;
  
  let result = '';
  
  if (trillion > 0) {
    result += convertThreeDigits(trillion) + ' nghìn tỷ';
  }
  
  if (billion > 0) {
    result += (result ? ' ' : '') + convertThreeDigits(billion) + ' tỷ';
  }
  
  if (million > 0) {
    result += (result ? ' ' : '') + convertThreeDigits(million) + ' triệu';
  }
  
  if (thousand > 0) {
    result += (result ? ' ' : '') + convertThreeDigits(thousand) + ' nghìn';
  }
  
  if (remainder > 0) {
    result += (result ? ' ' : '') + convertThreeDigits(remainder);
  }
  
  // Add currency
  result += ' đồng';
  
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Format VND with Vietnamese words (compact version)
 * @param {number} amount - Amount in VND
 * @returns {string} Formatted string like "78,800,000 ₫ (Bảy tám triệu tám trăm nghìn đồng)"
 */
export function formatVNDWithWords(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return '';
  }
  
  const formatted = amount.toLocaleString('vi-VN');
  const words = numberToVietnameseWords(amount);
  
  return `${formatted} ₫ (${words})`;
}

/**
 * Get short version of Vietnamese number words (for large amounts)
 * @param {number} num - Number to convert
 * @returns {string} Short version like "78 triệu 8 trăm nghìn"
 */
export function numberToVietnameseWordsShort(num) {
  if (typeof num !== 'number' || !Number.isFinite(num)) {
    return '';
  }
  
  if (num === 0) return 'không';
  
  num = Math.round(num);
  
  // For amounts >= 1 billion, show in tỷ
  if (num >= 1000000000) {
    const billions = (num / 1000000000).toFixed(2);
    return `${billions} tỷ`;
  }
  
  // For amounts >= 1 million, show in triệu
  if (num >= 1000000) {
    const millions = (num / 1000000).toFixed(1);
    return `${millions} triệu`;
  }
  
  // For amounts >= 1 thousand, show in nghìn
  if (num >= 1000) {
    const thousands = (num / 1000).toFixed(0);
    return `${thousands} nghìn`;
  }
  
  return num.toString();
}
