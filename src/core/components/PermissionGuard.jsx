/**
 * Permission Guard Component
 * Wrapper component for permission-based rendering
 */

import React from "react";
import PropTypes from "prop-types";
import { usePermissions } from "../hooks/usePermissions";

/**
 * PermissionGuard Component
 * Conditionally renders children based on permissions
 */
export const PermissionGuard = ({
  children,
  module,
  permission,
  permissions,
  role,
  roles,
  requireAll = false,
  fallback = null,
  onUnauthorized,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  } = usePermissions();

  /**
   * Check if user is authorized
   */
  const isAuthorized = () => {
    // Check single permission
    if (module && permission) {
      return hasPermission(module, permission);
    }

    // Check multiple permissions
    if (module && permissions && Array.isArray(permissions)) {
      return requireAll
        ? hasAllPermissions(module, permissions)
        : hasAnyPermission(module, permissions);
    }

    // Check single role
    if (role) {
      return hasRole(role);
    }

    // Check multiple roles
    if (roles && Array.isArray(roles)) {
      return requireAll ? hasAllRoles(roles) : hasAnyRole(roles);
    }

    // If no requirements specified, deny access
    return false;
  };

  const authorized = isAuthorized();

  // Call unauthorized callback if provided
  if (!authorized && onUnauthorized) {
    onUnauthorized();
  }

  // Render children if authorized, otherwise render fallback
  return authorized ? <>{children}</> : <>{fallback}</>;
};

PermissionGuard.propTypes = {
  children: PropTypes.node.isRequired,
  module: PropTypes.string,
  permission: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  role: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
  onUnauthorized: PropTypes.func,
};

/**
 * ModuleGuard Component
 * Guards access to entire modules
 */
export const ModuleGuard = ({ children, module, fallback = null }) => {
  const { hasModuleAccess } = usePermissions();

  return hasModuleAccess(module) ? <>{children}</> : <>{fallback}</>;
};

ModuleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  module: PropTypes.string.isRequired,
  fallback: PropTypes.node,
};

/**
 * RoleGuard Component
 * Guards access based on roles
 */
export const RoleGuard = ({
  children,
  role,
  roles,
  requireAll = false,
  fallback = null,
}) => {
  const { hasRole, hasAnyRole, hasAllRoles } = usePermissions();

  const isAuthorized = () => {
    if (role) {
      return hasRole(role);
    }

    if (roles && Array.isArray(roles)) {
      return requireAll ? hasAllRoles(roles) : hasAnyRole(roles);
    }

    return false;
  };

  return isAuthorized() ? <>{children}</> : <>{fallback}</>;
};

RoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
};

/**
 * AdminGuard Component
 * Restricts access to admin only
 */
export const AdminGuard = ({ children, fallback = null }) => {
  const { isAdmin } = usePermissions();

  return isAdmin() ? <>{children}</> : <>{fallback}</>;
};

AdminGuard.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

/**
 * ManagerGuard Component
 * Restricts access to managers and above
 */
export const ManagerGuard = ({ children, fallback = null }) => {
  const { isManager, isAdmin } = usePermissions();

  return isManager() || isAdmin() ? <>{children}</> : <>{fallback}</>;
};

ManagerGuard.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default PermissionGuard;
