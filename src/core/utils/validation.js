/**
 * Validation Utilities
 * Reusable validation functions
 */

import { VALIDATION } from "../constants/app.constants";

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  let strength = 0;

  if (!password) {
    return { isValid: false, errors: ["Password is required"], strength: 0 };
  }

  // Length check
  if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
    errors.push(
      `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`
    );
  } else {
    strength += 20;
  }

  if (password.length > VALIDATION.PASSWORD.MAX_LENGTH) {
    errors.push(
      `Password must not exceed ${VALIDATION.PASSWORD.MAX_LENGTH} characters`
    );
  }

  // Uppercase check
  if (VALIDATION.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    strength += 20;
  }

  // Lowercase check
  if (VALIDATION.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    strength += 20;
  }

  // Number check
  if (VALIDATION.PASSWORD.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    strength += 20;
  }

  // Special character check
  if (
    VALIDATION.PASSWORD.REQUIRE_SPECIAL_CHAR &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    errors.push("Password must contain at least one special character");
  } else {
    strength += 20;
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    strengthLabel: getPasswordStrengthLabel(strength),
  };
};

/**
 * Get password strength label
 * @param {number} strength - Strength percentage
 * @returns {string} Strength label
 */
export const getPasswordStrengthLabel = (strength) => {
  if (strength >= 80) return "Strong";
  if (strength >= 60) return "Good";
  if (strength >= 40) return "Fair";
  if (strength >= 20) return "Weak";
  return "Very Weak";
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
  const errors = [];

  if (!username) {
    return { isValid: false, errors: ["Username is required"] };
  }

  if (username.length < VALIDATION.USERNAME.MIN_LENGTH) {
    errors.push(
      `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters`
    );
  }

  if (username.length > VALIDATION.USERNAME.MAX_LENGTH) {
    errors.push(
      `Username must not exceed ${VALIDATION.USERNAME.MAX_LENGTH} characters`
    );
  }

  if (!VALIDATION.USERNAME.PATTERN.test(username)) {
    errors.push(
      "Username can only contain letters, numbers, underscores, and hyphens"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  const errors = [];

  if (!email) {
    return { isValid: false, errors: ["Email is required"] };
  }

  if (!VALIDATION.EMAIL.PATTERN.test(email)) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  const errors = [];

  if (!phone) {
    return { isValid: false, errors: ["Phone number is required"] };
  }

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length !== VALIDATION.PHONE.LENGTH) {
    errors.push(`Phone number must be ${VALIDATION.PHONE.LENGTH} digits`);
  }

  if (!VALIDATION.PHONE.PATTERN.test(cleaned)) {
    errors.push("Invalid phone number format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate account number
 * @param {string} accountNumber - Account number to validate
 * @returns {Object} Validation result
 */
export const validateAccountNumber = (accountNumber) => {
  const errors = [];

  if (!accountNumber) {
    return { isValid: false, errors: ["Account number is required"] };
  }

  if (accountNumber.length < VALIDATION.ACCOUNT_NUMBER.MIN_LENGTH) {
    errors.push(
      `Account number must be at least ${VALIDATION.ACCOUNT_NUMBER.MIN_LENGTH} digits`
    );
  }

  if (accountNumber.length > VALIDATION.ACCOUNT_NUMBER.MAX_LENGTH) {
    errors.push(
      `Account number must not exceed ${VALIDATION.ACCOUNT_NUMBER.MAX_LENGTH} digits`
    );
  }

  if (!VALIDATION.ACCOUNT_NUMBER.PATTERN.test(accountNumber)) {
    errors.push("Account number must contain only digits");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate amount
 * @param {number} amount - Amount to validate
 * @param {number} minAmount - Minimum amount
 * @param {number} maxAmount - Maximum amount
 * @returns {Object} Validation result
 */
export const validateAmount = (
  amount,
  minAmount = VALIDATION.AMOUNT.MIN,
  maxAmount = VALIDATION.AMOUNT.MAX
) => {
  const errors = [];

  if (amount === null || amount === undefined || amount === "") {
    return { isValid: false, errors: ["Amount is required"] };
  }

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    errors.push("Invalid amount");
  }

  if (numAmount < minAmount) {
    errors.push(`Amount must be at least ${minAmount}`);
  }

  if (numAmount > maxAmount) {
    errors.push(`Amount must not exceed ${maxAmount}`);
  }

  if (numAmount <= 0) {
    errors.push("Amount must be greater than zero");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = "Field") => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return {
      isValid: false,
      errors: [`${fieldName} is required`],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
};

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @param {boolean} allowFuture - Allow future dates
 * @param {boolean} allowPast - Allow past dates
 * @returns {Object} Validation result
 */
export const validateDate = (date, allowFuture = true, allowPast = true) => {
  const errors = [];

  if (!date) {
    return { isValid: false, errors: ["Date is required"] };
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    errors.push("Invalid date");
    return { isValid: false, errors };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (!allowFuture && dateObj > now) {
    errors.push("Future dates are not allowed");
  }

  if (!allowPast && dateObj < now) {
    errors.push("Past dates are not allowed");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validatePassword,
  validateUsername,
  validateEmail,
  validatePhone,
  validateAccountNumber,
  validateAmount,
  validateRequired,
  validateDate,
  getPasswordStrengthLabel,
};
