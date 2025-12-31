/**
 * HTTP Client Service
 * Centralized HTTP client with interceptors, error handling, and retry logic
 */

import axios from "axios";
import storageService from "./storage.service";
import { API_CONFIG, HTTP_STATUS } from "../constants/app.constants";

/**
 * Create axios instance with default configuration
 */
const httpClient = axios.create({
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Adds authorization token to all requests
 */
httpClient.interceptors.request.use(
  (config) => {
    const token = storageService.getToken();

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 ${config.method?.toUpperCase()} ${config.url}`,
        config.data
      );
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response scenarios and errors
 */
httpClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data
      );
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
        error.response?.data || error.message
      );
    }

    // Handle 401 Unauthorized
    if (
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Clear auth data and redirect to login
      storageService.clearAuthData();
      window.location.href = "/";

      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
      console.error("Access denied: Insufficient permissions");
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error: Please check your internet connection");
    }

    return Promise.reject(error);
  }
);

/**
 * HTTP Client Service Class
 */
class HttpService {
  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} config - Axios config
   * @returns {Promise}
   */
  async get(url, config = {}) {
    try {
      const response = await httpClient.get(url, config);
      return this._handleSuccess(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise}
   */
  async post(url, data = {}, config = {}) {
    try {
      const response = await httpClient.post(url, data, config);
      return this._handleSuccess(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise}
   */
  async put(url, data = {}, config = {}) {
    try {
      const response = await httpClient.put(url, data, config);
      return this._handleSuccess(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * PATCH request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise}
   */
  async patch(url, data = {}, config = {}) {
    try {
      const response = await httpClient.patch(url, data, config);
      return this._handleSuccess(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Axios config
   * @returns {Promise}
   */
  async delete(url, config = {}) {
    try {
      const response = await httpClient.delete(url, config);
      return this._handleSuccess(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Handle successful response
   * @private
   */
  _handleSuccess(response) {
    return {
      success: true,
      data: response.data?.data || response.data,
      message: response.data?.message || "Success",
      status: response.status,
    };
  }

  /**
   * Handle error response
   * @private
   */
  _handleError(error) {
    const errorResponse = {
      success: false,
      data: null,
      message: "An error occurred",
      status: error.response?.status || 500,
      errors: null,
    };

    if (error.response) {
      // Server responded with error
      errorResponse.message = error.response.data?.message || error.message;
      errorResponse.errors = error.response.data?.errors || null;
    } else if (error.request) {
      // Request made but no response
      errorResponse.message =
        "No response from server. Please check your connection.";
    } else {
      // Something else happened
      errorResponse.message = error.message;
    }

    return errorResponse;
  }

  /**
   * Request with retry logic
   * @param {Function} requestFn - Request function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Delay between retries in ms
   */
  async withRetry(
    requestFn,
    maxRetries = API_CONFIG.RETRY_ATTEMPTS,
    delay = API_CONFIG.RETRY_DELAY
  ) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          console.log(
            `Retry attempt ${attempt}/${maxRetries} after ${delay}ms`
          );
          await this._sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Sleep helper for retry logic
   * @private
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Upload file
   * @param {string} url - Upload URL
   * @param {FormData} formData - Form data with file
   * @param {Function} onProgress - Progress callback
   */
  async uploadFile(url, formData, onProgress) {
    try {
      const response = await httpClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      return this._handleSuccess(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Download file
   * @param {string} url - Download URL
   * @param {string} filename - File name
   */
  async downloadFile(url, filename) {
    try {
      const response = await httpClient.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);

      return this._handleSuccess(response);
    } catch (error) {
      return this._handleError(error);
    }
  }
}

// Export singleton instance
const httpService = new HttpService();
export default httpService;
export { httpClient };
