/**
 * Application Routes Constants
 * Centralized route management for better maintainability
 */

export const ROUTES = {
  // Public Routes
  HOME: "/",

  // User Module Routes
  USER: {
    CREATE: "/user/create",
    MANAGEMENT: "/user/management",
    PROFILE: "/user/profile",
  },

  // Customer Module Routes
  CUSTOMER: {
    CREATE: "/customer/create",
    SEARCH: "/customer/search",
    DETAILS: "/customer/:id",
  },

  // Account Module Routes
  ACCOUNT: {
    CREATE: "/account/create",
    SEARCH: "/account/search",
    MANAGEMENT: "/account/management",
    CHECK_BALANCE: "/account/balance",
    DETAILS: "/account/:id",
  },

  // Transaction Module Routes
  TRANSACTION: {
    DEPOSIT: "/transaction/deposit",
    WITHDRAW: "/transaction/withdraw",
    TRANSFER: "/transaction/transfer",
    HISTORY: "/transaction/history",
  },

  // Services Routes
  SERVICES: {
    BENEFICIARIES: "/services/beneficiaries",
    LOANS: "/services/loans",
    STANDING_INSTRUCTIONS: "/services/standing-instructions",
  },
};

/**
 * Get full route path
 * @param {string} route - Route constant
 * @param {Object} params - Route parameters
 * @returns {string} Full route path
 */
export const getRoutePath = (route, params = {}) => {
  let path = route;
  Object.keys(params).forEach((key) => {
    path = path.replace(`:${key}`, params[key]);
  });
  return path;
};

/**
 * Check if route is public (doesn't require authentication)
 * @param {string} path - Route path
 * @returns {boolean}
 */
export const isPublicRoute = (path) => {
  const publicRoutes = [ROUTES.HOME];
  return publicRoutes.includes(path);
};
