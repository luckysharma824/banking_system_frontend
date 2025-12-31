import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "../../components/utils/ContextProvider";
import { usePermissions } from "../hooks/usePermissions";

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and/or specific permissions
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} props.module - Required module access (optional)
 * @param {string} props.permission - Required permission (optional)
 * @param {string} props.role - Required role (optional)
 * @param {string} props.redirectTo - Path to redirect if unauthorized (default: '/login')
 */
export const ProtectedRoute = ({
  children,
  module,
  permission,
  role,
  redirectTo = "/login",
}) => {
  const { isAuthenticated } = useContext(MyContext);
  const { hasPermission, hasModuleAccess, hasRole } = usePermissions();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role if specified
  if (role && !hasRole(role)) {
    return <Navigate to="/" replace />;
  }

  // Check module and permission if specified
  if (module && permission && !hasPermission(module, permission)) {
    return <Navigate to="/" replace />;
  }

  // Check module access only if no specific permission required
  if (module && !permission && !hasModuleAccess(module)) {
    return <Navigate to="/" replace />;
  }

  // All checks passed, render children
  return children;
};
