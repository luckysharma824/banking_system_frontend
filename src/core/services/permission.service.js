/**
 * Permission Service
 * Centralized permission checking and role validation
 */

import storageService from "./storage.service";
import {
  MODULES,
  ROLES,
  ROLE_HIERARCHY,
  hasHigherPrivilege,
} from "../constants/permissions.constants";

class PermissionService {
  /**
   * Get current user's permissions
   * @returns {Object} Permissions object
   */
  getPermissions() {
    return storageService.getPermissions();
  }

  /**
   * Get current user info
   * @returns {Object} User info
   */
  getUserInfo() {
    return storageService.getUserInfo();
  }

  /**
   * Get current user's roles
   * @returns {Array<string>} User roles
   */
  getUserRoles() {
    const userInfo = this.getUserInfo();
    return userInfo?.roles || [];
  }

  /**
   * Check if user has specific permission in a module
   * @param {string} module - Module name
   * @param {string} permission - Permission name
   * @returns {boolean}
   */
  hasPermission(module, permission) {
    const permissions = this.getPermissions();

    if (!permissions || !module || !permission) {
      return false;
    }

    return (
      permissions.hasOwnProperty(module) &&
      Array.isArray(permissions[module]) &&
      permissions[module].includes(permission)
    );
  }

  /**
   * Check if user has ANY of the specified permissions in a module
   * @param {string} module - Module name
   * @param {Array<string>} permissionList - Array of permission names
   * @returns {boolean}
   */
  hasAnyPermission(module, permissionList) {
    if (!Array.isArray(permissionList)) {
      return false;
    }

    return permissionList.some((permission) =>
      this.hasPermission(module, permission)
    );
  }

  /**
   * Check if user has ALL of the specified permissions in a module
   * @param {string} module - Module name
   * @param {Array<string>} permissionList - Array of permission names
   * @returns {boolean}
   */
  hasAllPermissions(module, permissionList) {
    if (!Array.isArray(permissionList)) {
      return false;
    }

    return permissionList.every((permission) =>
      this.hasPermission(module, permission)
    );
  }

  /**
   * Check if user has access to a module (has any permission in it)
   * @param {string} module - Module name
   * @returns {boolean}
   */
  hasModuleAccess(module) {
    const permissions = this.getPermissions();

    if (!permissions || !module) {
      return false;
    }

    return (
      permissions.hasOwnProperty(module) &&
      Array.isArray(permissions[module]) &&
      permissions[module].length > 0
    );
  }

  /**
   * Get all modules user has access to
   * @returns {Array<string>} List of accessible modules
   */
  getAccessibleModules() {
    const permissions = this.getPermissions();
    return Object.keys(permissions).filter(
      (module) =>
        Array.isArray(permissions[module]) && permissions[module].length > 0
    );
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role name
   * @returns {boolean}
   */
  hasRole(role) {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  /**
   * Check if user has ANY of the specified roles
   * @param {Array<string>} roleList - Array of role names
   * @returns {boolean}
   */
  hasAnyRole(roleList) {
    if (!Array.isArray(roleList)) {
      return false;
    }

    const roles = this.getUserRoles();
    return roleList.some((role) => roles.includes(role));
  }

  /**
   * Check if user has ALL of the specified roles
   * @param {Array<string>} roleList - Array of role names
   * @returns {boolean}
   */
  hasAllRoles(roleList) {
    if (!Array.isArray(roleList)) {
      return false;
    }

    const roles = this.getUserRoles();
    return roleList.every((role) => roles.includes(role));
  }

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.hasRole(ROLES.ADMIN);
  }

  /**
   * Check if user is manager
   * @returns {boolean}
   */
  isManager() {
    return this.hasRole(ROLES.MANAGER);
  }

  /**
   * Check if user has higher privilege than specified role
   * @param {string} role - Role to compare against
   * @returns {boolean}
   */
  hasHigherPrivilegeThan(role) {
    const roles = this.getUserRoles();
    return roles.some((userRole) => hasHigherPrivilege(userRole, role));
  }

  /**
   * Get user's highest privilege role
   * @returns {string|null} Highest privilege role
   */
  getHighestPrivilegeRole() {
    const roles = this.getUserRoles();

    if (roles.length === 0) {
      return null;
    }

    return roles.reduce((highest, current) => {
      if (!highest || hasHigherPrivilege(current, highest)) {
        return current;
      }
      return highest;
    }, null);
  }

  /**
   * Check if user can perform action based on permission or role
   * @param {Object} requirement - Permission requirement { module, permission } or { roles }
   * @returns {boolean}
   */
  canPerformAction(requirement) {
    // Check by permission
    if (requirement.module && requirement.permission) {
      return this.hasPermission(requirement.module, requirement.permission);
    }

    // Check by permissions array
    if (requirement.module && requirement.permissions) {
      if (requirement.requireAll) {
        return this.hasAllPermissions(
          requirement.module,
          requirement.permissions
        );
      }
      return this.hasAnyPermission(requirement.module, requirement.permissions);
    }

    // Check by role
    if (requirement.roles) {
      if (requirement.requireAll) {
        return this.hasAllRoles(requirement.roles);
      }
      return this.hasAnyRole(requirement.roles);
    }

    return false;
  }

  /**
   * Get all permissions for a specific module
   * @param {string} module - Module name
   * @returns {Array<string>} List of permissions
   */
  getModulePermissions(module) {
    const permissions = this.getPermissions();
    return permissions[module] || [];
  }

  /**
   * Check if current user can manage another user based on role hierarchy
   * @param {Array<string>} targetUserRoles - Target user's roles
   * @returns {boolean}
   */
  canManageUser(targetUserRoles) {
    // Admin can manage everyone
    if (this.isAdmin()) {
      return true;
    }

    const currentHighestRole = this.getHighestPrivilegeRole();

    // Check if current user has higher privilege than target user's highest role
    const targetHighestRole = targetUserRoles.reduce((highest, current) => {
      if (!highest || hasHigherPrivilege(current, highest)) {
        return current;
      }
      return highest;
    }, null);

    return (
      currentHighestRole &&
      hasHigherPrivilege(currentHighestRole, targetHighestRole)
    );
  }

  /**
   * Clear all permission data (on logout)
   */
  clearPermissions() {
    storageService.clearAuthData();
  }
}

// Export singleton instance
const permissionService = new PermissionService();
export default permissionService;
