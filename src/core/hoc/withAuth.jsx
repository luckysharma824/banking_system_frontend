/**
 * Higher Order Component for Route Protection
 * Wraps routes with authentication and permission checks
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import storageService from "../services/storage.service";
import permissionService from "../services/permission.service";
import { ROUTES } from "../constants/routes.constants";

/**
 * withAuth HOC
 * Protects routes that require authentication
 */
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const location = useLocation();
    const token = storageService.getToken();
    const isAuthenticated = token && !storageService.isTokenExpired();

    if (!isAuthenticated) {
      // Redirect to home/login with return URL
      return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
    }

    return <Component {...props} />;
  };
};

/**
 * withPermission HOC
 * Protects routes that require specific permissions
 */
export const withPermission = (Component, module, permission) => {
  return withAuth(function PermissionProtectedComponent(props) {
    const hasPermission = permissionService.hasPermission(module, permission);

    if (!hasPermission) {
      // Redirect to home with unauthorized message
      return (
        <Navigate to={ROUTES.HOME} state={{ unauthorized: true }} replace />
      );
    }

    return <Component {...props} />;
  });
};

/**
 * withRole HOC
 * Protects routes that require specific roles
 */
export const withRole = (Component, requiredRoles, requireAll = false) => {
  return withAuth(function RoleProtectedComponent(props) {
    const hasAccess = requireAll
      ? permissionService.hasAllRoles(requiredRoles)
      : permissionService.hasAnyRole(requiredRoles);

    if (!hasAccess) {
      // Redirect to home with unauthorized message
      return (
        <Navigate to={ROUTES.HOME} state={{ unauthorized: true }} replace />
      );
    }

    return <Component {...props} />;
  });
};

/**
 * withModuleAccess HOC
 * Protects routes that require module access
 */
export const withModuleAccess = (Component, module) => {
  return withAuth(function ModuleProtectedComponent(props) {
    const hasAccess = permissionService.hasModuleAccess(module);

    if (!hasAccess) {
      // Redirect to home with unauthorized message
      return (
        <Navigate to={ROUTES.HOME} state={{ unauthorized: true }} replace />
      );
    }

    return <Component {...props} />;
  });
};

/**
 * withAdminOnly HOC
 * Protects routes that require admin role
 */
export const withAdminOnly = (Component) => {
  return withAuth(function AdminOnlyComponent(props) {
    const isAdmin = permissionService.isAdmin();

    if (!isAdmin) {
      // Redirect to home with unauthorized message
      return (
        <Navigate to={ROUTES.HOME} state={{ unauthorized: true }} replace />
      );
    }

    return <Component {...props} />;
  });
};

/**
 * Protected Route Component
 * Flexible component for protecting routes with various requirements
 */
export const ProtectedRoute = ({
  children,
  requireAuth = true,
  module,
  permission,
  permissions,
  role,
  roles,
  requireAll = false,
  adminOnly = false,
  redirectTo = ROUTES.HOME,
}) => {
  const location = useLocation();

  // Check authentication
  if (requireAuth) {
    const token = storageService.getToken();
    const isAuthenticated = token && !storageService.isTokenExpired();

    if (!isAuthenticated) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
  }

  // Check admin only
  if (adminOnly && !permissionService.isAdmin()) {
    return <Navigate to={redirectTo} state={{ unauthorized: true }} replace />;
  }

  // Check module access
  if (module && !permission && !permissions) {
    if (!permissionService.hasModuleAccess(module)) {
      return (
        <Navigate to={redirectTo} state={{ unauthorized: true }} replace />
      );
    }
  }

  // Check single permission
  if (module && permission) {
    if (!permissionService.hasPermission(module, permission)) {
      return (
        <Navigate to={redirectTo} state={{ unauthorized: true }} replace />
      );
    }
  }

  // Check multiple permissions
  if (module && permissions && Array.isArray(permissions)) {
    const hasAccess = requireAll
      ? permissionService.hasAllPermissions(module, permissions)
      : permissionService.hasAnyPermission(module, permissions);

    if (!hasAccess) {
      return (
        <Navigate to={redirectTo} state={{ unauthorized: true }} replace />
      );
    }
  }

  // Check single role
  if (role && !permissionService.hasRole(role)) {
    return <Navigate to={redirectTo} state={{ unauthorized: true }} replace />;
  }

  // Check multiple roles
  if (roles && Array.isArray(roles)) {
    const hasAccess = requireAll
      ? permissionService.hasAllRoles(roles)
      : permissionService.hasAnyRole(roles);

    if (!hasAccess) {
      return (
        <Navigate to={redirectTo} state={{ unauthorized: true }} replace />
      );
    }
  }

  return <>{children}</>;
};

export default {
  withAuth,
  withPermission,
  withRole,
  withModuleAccess,
  withAdminOnly,
  ProtectedRoute,
};
