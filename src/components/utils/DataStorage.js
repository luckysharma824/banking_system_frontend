// Utility to handle storing, retrieving, and removing token
export const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
  console.log(getToken());
};

export const savePermissions = (permissions) => {
  localStorage.setItem("permissions", JSON.stringify(permissions));
};

export const getPermissions = () => {
  const permissions = localStorage.getItem("permissions");
  if (permissions && permissions !== "undefined") {
    return JSON.parse(permissions);
  }
  return {};
};

export const removePermissions = () => {
  localStorage.removeItem("permissions");
};

// User Information Management
export const saveUserInfo = (userInfo) => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo && userInfo !== "undefined") {
    return JSON.parse(userInfo);
  }
  return null;
};

export const removeUserInfo = () => {
  localStorage.removeItem("userInfo");
};

// Session Management
export const saveLoginTime = (loginTime) => {
  localStorage.setItem("loginTime", loginTime);
};

export const getLoginTime = () => {
  return localStorage.getItem("loginTime");
};

export const removeLoginTime = () => {
  localStorage.removeItem("loginTime");
};

export const saveTokenExpiration = (expiresIn) => {
  const expirationTime = new Date(Date.now() + expiresIn).toISOString();
  localStorage.setItem("tokenExpiration", expirationTime);
};

export const getTokenExpiration = () => {
  return localStorage.getItem("tokenExpiration");
};

export const removeTokenExpiration = () => {
  localStorage.removeItem("tokenExpiration");
};

// Check if token is expired
export const isTokenExpired = () => {
  const expiration = getTokenExpiration();
  if (!expiration) return true;

  const expirationDate = new Date(expiration);
  const now = new Date();
  return now >= expirationDate;
};

// Get remaining time in milliseconds
export const getRemainingTime = () => {
  const expiration = getTokenExpiration();
  if (!expiration) return 0;

  const expirationDate = new Date(expiration);
  const now = new Date();
  const remaining = expirationDate - now;
  return remaining > 0 ? remaining : 0;
};

// Clear All Authentication Data
export const clearAll = () => {
  removeToken();
  removePermissions();
  removeUserInfo();
  removeLoginTime();
  removeTokenExpiration();
};

// Role Checking Utilities
export const hasRole = (roleName) => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) return false;
  return userInfo.roles.includes(roleName);
};

export const hasAnyRole = (roleNames) => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) return false;
  return roleNames.some((role) => userInfo.roles.includes(role));
};

export const hasAllRoles = (roleNames) => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) return false;
  return roleNames.every((role) => userInfo.roles.includes(role));
};
