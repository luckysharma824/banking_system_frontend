/**
 * Application-wide Constants
 * Centralized configuration values
 */

// ============================================
// Application Info
// ============================================
export const APP_INFO = {
  NAME: "Banking System",
  VERSION: "2.0.0",
  DESCRIPTION: "Comprehensive Banking Management System",
  ICON: "🏦",
};

// ============================================
// API Configuration
// ============================================
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// ============================================
// Storage Keys
// ============================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_INFO: "userInfo",
  PERMISSIONS: "permissions",
  TOKEN_EXPIRATION: "tokenExpiration",
  LOGIN_TIME: "loginTime",
  THEME: "theme",
  LANGUAGE: "language",
};

// ============================================
// Date & Time Formats
// ============================================
export const DATE_FORMATS = {
  FULL: "MMMM DD, YYYY hh:mm A",
  DATE_ONLY: "MMMM DD, YYYY",
  TIME_ONLY: "hh:mm A",
  SHORT: "MM/DD/YYYY",
  ISO: "YYYY-MM-DD",
};

// ============================================
// Currency Configuration
// ============================================
export const CURRENCY_CONFIG = {
  CODE: "INR",
  SYMBOL: "₹",
  LOCALE: "en-IN",
  DECIMAL_PLACES: 2,
};

// ============================================
// Pagination Configuration
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// ============================================
// Validation Rules
// ============================================
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PHONE: {
    PATTERN: /^[6-9]\d{9}$/,
    LENGTH: 10,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  ACCOUNT_NUMBER: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 18,
    PATTERN: /^\d+$/,
  },
  AMOUNT: {
    MIN: 1,
    MAX: 10000000,
    DECIMAL_PLACES: 2,
  },
};

// ============================================
// Toast/Alert Configuration
// ============================================
export const TOAST_CONFIG = {
  DURATION: {
    SHORT: 2000,
    MEDIUM: 4000,
    LONG: 6000,
  },
  POSITION: {
    TOP_RIGHT: "top-right",
    TOP_CENTER: "top-center",
    TOP_LEFT: "top-left",
    BOTTOM_RIGHT: "bottom-right",
    BOTTOM_CENTER: "bottom-center",
    BOTTOM_LEFT: "bottom-left",
  },
};

// ============================================
// HTTP Status Codes
// ============================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ============================================
// Account Types
// ============================================
export const ACCOUNT_TYPES = {
  SAVINGS: "SAVINGS",
  CURRENT: "CURRENT",
  FIXED_DEPOSIT: "FIXED_DEPOSIT",
  RECURRING_DEPOSIT: "RECURRING_DEPOSIT",
};

// ============================================
// Transaction Types
// ============================================
export const TRANSACTION_TYPES = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
  TRANSFER: "TRANSFER",
  LOAN_PAYMENT: "LOAN_PAYMENT",
  FEE: "FEE",
  INTEREST: "INTEREST",
};

// ============================================
// Account Status
// ============================================
export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  FROZEN: "FROZEN",
  CLOSED: "CLOSED",
};

// ============================================
// Loan Status
// ============================================
export const LOAN_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  DISBURSED: "DISBURSED",
  CLOSED: "CLOSED",
};

// ============================================
// Export All Constants
// ============================================
export default {
  APP_INFO,
  API_CONFIG,
  STORAGE_KEYS,
  DATE_FORMATS,
  CURRENCY_CONFIG,
  PAGINATION,
  VALIDATION,
  TOAST_CONFIG,
  HTTP_STATUS,
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
  ACCOUNT_STATUS,
  LOAN_STATUS,
};
