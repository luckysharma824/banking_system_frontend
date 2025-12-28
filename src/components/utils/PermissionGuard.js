import React from "react";
import { usePermissions } from "./usePermissions";

/**
 * Permission Guard Component - Conditionally renders children based on permission/role checks
 *
 * Usage Examples:
 *
 * 1. Check single permission:
 *    <PermissionGuard module="ACCOUNT" permission="CREATE_ACCOUNT">
 *      <CreateAccountButton />
 *    </PermissionGuard>
 *
 * 2. Check role:
 *    <PermissionGuard role="ADMIN">
 *      <AdminPanel />
 *    </PermissionGuard>
 *
 * 3. Check multiple roles (any):
 *    <PermissionGuard roles={["ADMIN", "MANAGER"]} anyRole>
 *      <ManagementPanel />
 *    </PermissionGuard>
 *
 * 4. Check multiple roles (all):
 *    <PermissionGuard roles={["ADMIN", "MANAGER"]} allRoles>
 *      <SpecialFeature />
 *    </PermissionGuard>
 *
 * 5. With fallback:
 *    <PermissionGuard role="ADMIN" fallback={<div>Access Denied</div>}>
 *      <AdminContent />
 *    </PermissionGuard>
 *
 * 6. Custom condition:
 *    <PermissionGuard condition={() => hasPermission("ACCOUNT", "VIEW_ACCOUNT") && isAdmin()}>
 *      <SpecialView />
 *    </PermissionGuard>
 */
const PermissionGuard = ({
  children,

  // Permission-based checks
  module,
  permission,
  permissions,
  anyPermission,
  allPermissions,

  // Role-based checks
  role,
  roles,
  anyRole,
  allRoles,

  // Module access check
  moduleAccess,

  // Admin check
  adminOnly,

  // Custom condition function
  condition,

  // Fallback content when permission denied
  fallback = null,

  // Invert the check (show when NOT having permission)
  inverse = false,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModuleAccess,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
  } = usePermissions();

  let hasAccess = false;

  // Check custom condition first
  if (typeof condition === "function") {
    hasAccess = condition();
  }
  // Admin-only check
  else if (adminOnly) {
    hasAccess = isAdmin();
  }
  // Module access check
  else if (moduleAccess) {
    hasAccess = hasModuleAccess(moduleAccess);
  }
  // Single role check
  else if (role) {
    hasAccess = hasRole(role);
  }
  // Multiple roles check (any)
  else if (roles && anyRole) {
    hasAccess = hasAnyRole(roles);
  }
  // Multiple roles check (all)
  else if (roles && allRoles) {
    hasAccess = hasAllRoles(roles);
  }
  // Multiple roles check (default: any)
  else if (roles) {
    hasAccess = hasAnyRole(roles);
  }
  // Single permission check
  else if (module && permission) {
    hasAccess = hasPermission(module, permission);
  }
  // Multiple permissions check (any)
  else if (module && permissions && anyPermission) {
    hasAccess = hasAnyPermission(module, permissions);
  }
  // Multiple permissions check (all)
  else if (module && permissions && allPermissions) {
    hasAccess = hasAllPermissions(module, permissions);
  }
  // Multiple permissions check (default: any)
  else if (module && permissions) {
    hasAccess = hasAnyPermission(module, permissions);
  }

  // Apply inverse if specified
  if (inverse) {
    hasAccess = !hasAccess;
  }

  // Render children if has access, otherwise render fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
