/**
 * Custom Hook: useAuth
 * Manages authentication state and operations
 */

import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../components/utils/ContextProvider";
import storageService from "../services/storage.service";
import { ROUTES } from "../constants/routes.constants";

export const useAuth = () => {
  const {
    isAuthenticated,
    setAuthenticated,
    userInfo,
    setUserInfo,
    permissions,
    setPermissions,
    logout: contextLogout,
  } = useContext(MyContext);

  const navigate = useNavigate();

  /**
   * Login handler
   */
  const login = useCallback(
    (token, user, perms, expiresIn) => {
      // Save to storage
      storageService.saveToken(token);
      storageService.saveUserInfo(user);
      storageService.savePermissions(perms);
      storageService.saveLoginTime();

      if (expiresIn) {
        storageService.saveTokenExpiration(expiresIn);
      }

      // Update context
      setAuthenticated(true);
      setUserInfo(user);
      setPermissions(perms);
    },
    [setAuthenticated, setUserInfo, setPermissions]
  );

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    contextLogout();
    navigate(ROUTES.HOME);
  }, [contextLogout, navigate]);

  /**
   * Check if token is expired
   */
  const isTokenExpired = useCallback(() => {
    return storageService.isTokenExpired();
  }, []);

  /**
   * Get remaining session time
   */
  const getRemainingTime = useCallback(() => {
    return storageService.getRemainingTokenTime();
  }, []);

  /**
   * Refresh user info
   */
  const refreshUserInfo = useCallback(
    (updatedUserInfo) => {
      storageService.saveUserInfo(updatedUserInfo);
      setUserInfo(updatedUserInfo);
    },
    [setUserInfo]
  );

  /**
   * Update permissions
   */
  const updatePermissions = useCallback(
    (updatedPermissions) => {
      storageService.savePermissions(updatedPermissions);
      setPermissions(updatedPermissions);
    },
    [setPermissions]
  );

  return {
    // State
    isAuthenticated,
    userInfo,
    permissions,

    // Actions
    login,
    logout,
    refreshUserInfo,
    updatePermissions,

    // Utilities
    isTokenExpired,
    getRemainingTime,
  };
};

export default useAuth;
