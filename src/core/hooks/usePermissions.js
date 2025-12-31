/**
 * Enhanced Custom Hook for Permissions and Role-Based Access Control
 * Provides comprehensive permission checking utilities
 */

import { useContext, useMemo, useCallback } from "react";
import { MyContext } from "../../components/utils/ContextProvider";
import permissionService from "../services/permission.service";

/**
 * usePermissions Hook
 * @returns {Object} Permission utilities and state
 */
export const usePermissions = () => {
  const { permissions, userInfo, isAuthenticated } = useContext(MyContext);

  /**
   * Memoized permission checks to avoid recalculations
   */
  const permissionUtils = useMemo(
    () => ({
      permissions,
      userInfo,
      isAuthenticated,
      roles: userInfo?.roles || [],
    }),
    [permissions, userInfo, isAuthenticated]
  );

  /**
   * Check if user has specific permission in a module
   */
  const hasPermission = useCallback((module, permission) => {
    return permissionService.hasPermission(module, permission);
  }, []);

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = useCallback((module, permissionList) => {
    return permissionService.hasAnyPermission(module, permissionList);
  }, []);

  /**
   * Check if user has ALL of the specified permissions
   */
  const hasAllPermissions = useCallback((module, permissionList) => {
    return permissionService.hasAllPermissions(module, permissionList);
  }, []);

  /**
   * Check if user has access to a module
   */
  const hasModuleAccess = useCallback((module) => {
    return permissionService.hasModuleAccess(module);
  }, []);

  /**
   * Get all accessible modules
   */
  const getAccessibleModules = useCallback(() => {
    return permissionService.getAccessibleModules();
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role) => {
    return permissionService.hasRole(role);
  }, []);

  /**
   * Check if user has ANY of the specified roles
   */
  const hasAnyRole = useCallback((roleList) => {
    return permissionService.hasAnyRole(roleList);
  }, []);

  /**
   * Check if user has ALL of the specified roles
   */
  const hasAllRoles = useCallback((roleList) => {
    return permissionService.hasAllRoles(roleList);
  }, []);

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return permissionService.isAdmin();
  }, []);

  /**
   * Check if user is manager
   */
  const isManager = useCallback(() => {
    return permissionService.isManager();
  }, []);

  /**
   * Check if user has higher privilege than specified role
   */
  const hasHigherPrivilegeThan = useCallback((role) => {
    return permissionService.hasHigherPrivilegeThan(role);
  }, []);

  /**
   * Get user's highest privilege role
   */
  const getHighestPrivilegeRole = useCallback(() => {
    return permissionService.getHighestPrivilegeRole();
  }, []);

  /**
   * Check if user can perform action
   */
  const canPerformAction = useCallback((requirement) => {
    return permissionService.canPerformAction(requirement);
  }, []);

  /**
   * Get all permissions for a module
   */
  const getModulePermissions = useCallback((module) => {
    return permissionService.getModulePermissions(module);
  }, []);

  /**
   * Check if user can manage another user
   */
  const canManageUser = useCallback((targetUserRoles) => {
    return permissionService.canManageUser(targetUserRoles);
  }, []);

  return {
    // State
    ...permissionUtils,

    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModuleAccess,
    getAccessibleModules,
    getModulePermissions,

    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isManager,
    hasHigherPrivilegeThan,
    getHighestPrivilegeRole,

    // Combined checks
    canPerformAction,
    canManageUser,
  };
};

export default usePermissions;
