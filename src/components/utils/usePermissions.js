import { useContext } from "react";
import { MyContext } from "./ContextProvider";

/**
 * Custom hook for permission and role-based access control
 * @returns {Object} Permission checking utilities
 */
export const usePermissions = () => {
  const { permissions, userInfo } = useContext(MyContext);

  /**
   * Check if user has a specific permission in a module
   * @param {string} module - Module name (e.g., "ACCOUNT", "TRANSACTION")
   * @param {string} permission - Permission name (e.g., "CREATE_ACCOUNT")
   * @returns {boolean}
   */
  const hasPermission = (module, permission) => {
    if (!permissions || !module) return false;
    return (
      permissions.hasOwnProperty(module) &&
      Array.isArray(permissions[module]) &&
      permissions[module].includes(permission)
    );
  };

  /**
   * Check if user has ANY of the specified permissions in a module
   * @param {string} module - Module name
   * @param {string[]} permissionList - Array of permission names
   * @returns {boolean}
   */
  const hasAnyPermission = (module, permissionList) => {
    if (!permissions || !module || !Array.isArray(permissionList)) return false;
    return permissionList.some((perm) => hasPermission(module, perm));
  };

  /**
   * Check if user has ALL of the specified permissions in a module
   * @param {string} module - Module name
   * @param {string[]} permissionList - Array of permission names
   * @returns {boolean}
   */
  const hasAllPermissions = (module, permissionList) => {
    if (!permissions || !module || !Array.isArray(permissionList)) return false;
    return permissionList.every((perm) => hasPermission(module, perm));
  };

  /**
   * Check if user has access to a module (has any permission in it)
   * @param {string} module - Module name
   * @returns {boolean}
   */
  const hasModuleAccess = (module) => {
    if (!permissions || !module) return false;
    return (
      permissions.hasOwnProperty(module) &&
      Array.isArray(permissions[module]) &&
      permissions[module].length > 0
    );
  };

  /**
   * Check if user has a specific role
   * @param {string} role - Role name (e.g., "ADMIN", "MANAGER")
   * @returns {boolean}
   */
  const hasRole = (role) => {
    if (!userInfo || !userInfo.roles || !Array.isArray(userInfo.roles))
      return false;
    return userInfo.roles.includes(role);
  };

  /**
   * Check if user has ANY of the specified roles
   * @param {string[]} roleList - Array of role names
   * @returns {boolean}
   */
  const hasAnyRole = (roleList) => {
    if (!userInfo || !userInfo.roles || !Array.isArray(roleList)) return false;
    return roleList.some((role) => userInfo.roles.includes(role));
  };

  /**
   * Check if user has ALL of the specified roles
   * @param {string[]} roleList - Array of role names
   * @returns {boolean}
   */
  const hasAllRoles = (roleList) => {
    if (!userInfo || !userInfo.roles || !Array.isArray(roleList)) return false;
    return roleList.every((role) => userInfo.roles.includes(role));
  };

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole("ADMIN");
  };

  /**
   * Get all permissions for a specific module
   * @param {string} module - Module name
   * @returns {string[]} Array of permissions
   */
  const getModulePermissions = (module) => {
    if (!permissions || !module || !permissions.hasOwnProperty(module))
      return [];
    return permissions[module] || [];
  };

  /**
   * Get all available modules
   * @returns {string[]} Array of module names
   */
  const getAvailableModules = () => {
    if (!permissions) return [];
    return Object.keys(permissions);
  };

  /**
   * Check multiple conditions with AND logic
   * @param {Function[]} conditions - Array of condition functions
   * @returns {boolean}
   */
  const checkAll = (conditions) => {
    if (!Array.isArray(conditions)) return false;
    return conditions.every((condition) =>
      typeof condition === "function" ? condition() : false
    );
  };

  /**
   * Check multiple conditions with OR logic
   * @param {Function[]} conditions - Array of condition functions
   * @returns {boolean}
   */
  const checkAny = (conditions) => {
    if (!Array.isArray(conditions)) return false;
    return conditions.some((condition) =>
      typeof condition === "function" ? condition() : false
    );
  };

  return {
    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModuleAccess,

    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,

    // Utility functions
    getModulePermissions,
    getAvailableModules,
    checkAll,
    checkAny,

    // Raw data (for advanced use)
    permissions,
    userInfo,
  };
};

export default usePermissions;
