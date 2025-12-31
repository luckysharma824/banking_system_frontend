/**
 * Utility Functions
 * Common helper functions used across the application
 */

import { CURRENCY_CONFIG, DATE_FORMATS } from "../constants/app.constants";

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale for formatting
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (
  amount,
  locale = CURRENCY_CONFIG.LOCALE,
  currency = CURRENCY_CONFIG.CODE
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: CURRENCY_CONFIG.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY_CONFIG.DECIMAL_PLACES,
  }).format(amount);
};

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 2) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = DATE_FORMATS.DATE_ONLY) => {
  const d = typeof date === "string" ? new Date(date) : date;

  if (!d || isNaN(d.getTime())) {
    return "Invalid Date";
  }

  const options = {
    "MMMM DD, YYYY hh:mm A": {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
    "MMMM DD, YYYY": {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    "hh:mm A": {
      hour: "2-digit",
      minute: "2-digit",
    },
    "MM/DD/YYYY": {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
    "YYYY-MM-DD": {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  };

  const dateOptions = options[format] || options["MMMM DD, YYYY"];
  return d.toLocaleString("en-US", dateOptions);
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50, suffix = "...") => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + suffix;
};

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeFirst = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalize all words
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 10) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  if (typeof obj === "string") return obj.trim().length === 0;
  return false;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Validate phone number (Indian)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const pattern = /^[6-9]\d{9}$/;
  return pattern.test(phone);
};

/**
 * Mask account number
 * @param {string} accountNumber - Account number to mask
 * @param {number} visibleDigits - Number of visible digits at end
 * @returns {string} Masked account number
 */
export const maskAccountNumber = (accountNumber, visibleDigits = 4) => {
  if (!accountNumber) return "";

  const len = accountNumber.length;
  if (len <= visibleDigits) return accountNumber;

  const masked = "*".repeat(len - visibleDigits);
  const visible = accountNumber.slice(-visibleDigits);

  return masked + visible;
};

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @param {number} decimals - Decimal places
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total, decimals = 2) => {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

/**
 * Sort array of objects
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Order (asc/desc)
 * @returns {Array} Sorted array
 */
export const sortByKey = (array, key, order = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Download file
 * @param {Blob} blob - File blob
 * @param {string} filename - File name
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Copy to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
};

export default {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPhoneNumber,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  generateId,
  deepClone,
  isEmpty,
  debounce,
  throttle,
  isValidEmail,
  isValidPhone,
  maskAccountNumber,
  calculatePercentage,
  getInitials,
  sortByKey,
  groupBy,
  downloadFile,
  copyToClipboard,
};
