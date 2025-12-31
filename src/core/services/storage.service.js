/**
 * Centralized Storage Service
 * Provides type-safe storage operations with encryption support
 */

import { STORAGE_KEYS } from "../constants/app.constants";

/**
 * Storage Service Class
 */
class StorageService {
  constructor() {
    this.storage = localStorage;
  }

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {boolean} encrypt - Whether to encrypt the value
   */
  setItem(key, value, encrypt = false) {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      const finalValue = encrypt ? this._encrypt(stringValue) : stringValue;
      this.storage.setItem(key, finalValue);
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error);
    }
  }

  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key not found
   * @param {boolean} decrypt - Whether to decrypt the value
   * @returns {any} Retrieved value
   */
  getItem(key, defaultValue = null, decrypt = false) {
    try {
      let value = this.storage.getItem(key);

      if (value === null || value === "undefined" || value === "null") {
        return defaultValue;
      }

      if (decrypt) {
        value = this._decrypt(value);
      }

      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`Error getting storage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  }

  /**
   * Clear all storage
   */
  clear() {
    try {
      this.storage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  /**
   * Check if key exists in storage
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  hasItem(key) {
    return this.storage.getItem(key) !== null;
  }

  /**
   * Get all keys in storage
   * @returns {Array<string>}
   */
  getAllKeys() {
    return Object.keys(this.storage);
  }

  /**
   * Simple encryption (Base64 encoding for demo - use proper encryption in production)
   * @private
   */
  _encrypt(value) {
    try {
      return btoa(value);
    } catch {
      return value;
    }
  }

  /**
   * Simple decryption (Base64 decoding for demo - use proper decryption in production)
   * @private
   */
  _decrypt(value) {
    try {
      return atob(value);
    } catch {
      return value;
    }
  }

  // ============================================
  // Auth-specific methods
  // ============================================

  /**
   * Save authentication token
   */
  saveToken(token) {
    this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Remove authentication token
   */
  removeToken() {
    this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Save user information
   */
  saveUserInfo(userInfo) {
    this.setItem(STORAGE_KEYS.USER_INFO, userInfo);
  }

  /**
   * Get user information
   */
  getUserInfo() {
    return this.getItem(STORAGE_KEYS.USER_INFO, null);
  }

  /**
   * Remove user information
   */
  removeUserInfo() {
    this.removeItem(STORAGE_KEYS.USER_INFO);
  }

  /**
   * Save permissions
   */
  savePermissions(permissions) {
    this.setItem(STORAGE_KEYS.PERMISSIONS, permissions);
  }

  /**
   * Get permissions
   */
  getPermissions() {
    return this.getItem(STORAGE_KEYS.PERMISSIONS, {});
  }

  /**
   * Remove permissions
   */
  removePermissions() {
    this.removeItem(STORAGE_KEYS.PERMISSIONS);
  }

  /**
   * Save token expiration time
   */
  saveTokenExpiration(expiresIn) {
    const expirationTime = new Date(Date.now() + expiresIn).toISOString();
    this.setItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationTime);
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration() {
    return this.getItem(STORAGE_KEYS.TOKEN_EXPIRATION);
  }

  /**
   * Remove token expiration
   */
  removeTokenExpiration() {
    this.removeItem(STORAGE_KEYS.TOKEN_EXPIRATION);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;

    const expirationDate = new Date(expiration);
    const now = new Date();
    return now >= expirationDate;
  }

  /**
   * Get remaining token time in milliseconds
   */
  getRemainingTokenTime() {
    const expiration = this.getTokenExpiration();
    if (!expiration) return 0;

    const expirationDate = new Date(expiration);
    const now = new Date();
    const remaining = expirationDate - now;
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Save login time
   */
  saveLoginTime(loginTime = new Date().toISOString()) {
    this.setItem(STORAGE_KEYS.LOGIN_TIME, loginTime);
  }

  /**
   * Get login time
   */
  getLoginTime() {
    return this.getItem(STORAGE_KEYS.LOGIN_TIME);
  }

  /**
   * Remove login time
   */
  removeLoginTime() {
    this.removeItem(STORAGE_KEYS.LOGIN_TIME);
  }

  /**
   * Clear all authentication data
   */
  clearAuthData() {
    this.removeToken();
    this.removeUserInfo();
    this.removePermissions();
    this.removeTokenExpiration();
    this.removeLoginTime();
  }

  // ============================================
  // Theme & Preferences
  // ============================================

  /**
   * Save theme preference
   */
  saveTheme(theme) {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  /**
   * Get theme preference
   */
  getTheme() {
    return this.getItem(STORAGE_KEYS.THEME, "light");
  }

  /**
   * Save language preference
   */
  saveLanguage(language) {
    this.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  /**
   * Get language preference
   */
  getLanguage() {
    return this.getItem(STORAGE_KEYS.LANGUAGE, "en");
  }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;
