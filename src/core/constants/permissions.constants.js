/**
 * Permission and Role Constants
 * Centralized permission management for RBAC (Role-Based Access Control)
 */

// ============================================
// Role Constants
// ============================================
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
  CLERK: "CLERK",
  ACCOUNTANT: "ACCOUNTANT",
  AUDITOR: "AUDITOR",
  CUSTOMER: "CUSTOMER",
};

// ============================================
// Module Constants
// ============================================
export const MODULES = {
  USER: "USER",
  CUSTOMER: "CUSTOMER",
  ACCOUNT: "ACCOUNT",
  TRANSACTION: "TRANSACTION",
  LOAN: "LOAN",
  BENEFICIARY: "BENEFICIARY",
  STANDING_INSTRUCTION: "STANDING_INSTRUCTION",
  REPORT: "REPORT",
  AUDIT: "AUDIT",
};

// ============================================
// Permission Constants by Module
// ============================================
export const PERMISSIONS = {
  USER: {
    CREATE: "CREATE_USER",
    VIEW: "VIEW_USER",
    UPDATE: "UPDATE_USER",
    DELETE: "DELETE_USER",
    MANAGE_ROLES: "MANAGE_ROLES",
    MANAGE_PERMISSIONS: "MANAGE_PERMISSIONS",
  },

  CUSTOMER: {
    CREATE: "CREATE_CUSTOMER",
    VIEW: "VIEW_CUSTOMER",
    UPDATE: "UPDATE_CUSTOMER",
    DELETE: "DELETE_CUSTOMER",
    SEARCH: "SEARCH_CUSTOMER",
  },

  ACCOUNT: {
    CREATE: "CREATE_ACCOUNT",
    VIEW: "VIEW_ACCOUNT",
    UPDATE: "UPDATE_ACCOUNT",
    DELETE: "DELETE_ACCOUNT",
    CLOSE: "CLOSE_ACCOUNT",
    ACTIVATE: "ACTIVATE_ACCOUNT",
    FREEZE: "FREEZE_ACCOUNT",
  },

  TRANSACTION: {
    DEPOSIT: "DEPOSIT",
    WITHDRAW: "WITHDRAW",
    TRANSFER: "TRANSFER",
    VIEW: "VIEW_TRANSACTION",
    APPROVE: "APPROVE_TRANSACTION",
    REVERSE: "REVERSE_TRANSACTION",
  },

  LOAN: {
    CREATE: "CREATE_LOAN",
    VIEW: "VIEW_LOAN",
    APPROVE: "APPROVE_LOAN",
    REJECT: "REJECT_LOAN",
    DISBURSE: "DISBURSE_LOAN",
  },

  BENEFICIARY: {
    ADD: "ADD_BENEFICIARY",
    VIEW: "VIEW_BENEFICIARY",
    UPDATE: "UPDATE_BENEFICIARY",
    DELETE: "DELETE_BENEFICIARY",
  },

  STANDING_INSTRUCTION: {
    CREATE: "CREATE_SI",
    VIEW: "VIEW_SI",
    UPDATE: "UPDATE_SI",
    DELETE: "DELETE_SI",
    EXECUTE: "EXECUTE_SI",
  },

  REPORT: {
    GENERATE: "GENERATE_REPORT",
    VIEW: "VIEW_REPORT",
    EXPORT: "EXPORT_REPORT",
  },

  AUDIT: {
    VIEW: "VIEW_AUDIT",
    EXPORT: "EXPORT_AUDIT",
  },
};

// ============================================
// Role Hierarchy (for determining privilege levels)
// ============================================
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 100,
  [ROLES.MANAGER]: 80,
  [ROLES.AUDITOR]: 70,
  [ROLES.ACCOUNTANT]: 60,
  [ROLES.CASHIER]: 50,
  [ROLES.CLERK]: 40,
  [ROLES.CUSTOMER]: 10,
};

// ============================================
// Role Metadata for UI Display
// ============================================
export const ROLE_METADATA = {
  [ROLES.ADMIN]: {
    icon: "👑",
    color: "#dc3545",
    label: "Administrator",
    description: "Full system access with all permissions",
    badge: "danger",
  },
  [ROLES.MANAGER]: {
    icon: "📊",
    color: "#fd7e14",
    label: "Manager",
    description: "Manage users and oversee operations",
    badge: "warning",
  },
  [ROLES.CASHIER]: {
    icon: "💰",
    color: "#28a745",
    label: "Cashier",
    description: "Handle cash transactions and customer service",
    badge: "success",
  },
  [ROLES.CLERK]: {
    icon: "📝",
    color: "#20c997",
    label: "Clerk",
    description: "Data entry and basic operations",
    badge: "info",
  },
  [ROLES.ACCOUNTANT]: {
    icon: "🧮",
    color: "#6f42c1",
    label: "Accountant",
    description: "Financial operations and reporting",
    badge: "primary",
  },
  [ROLES.AUDITOR]: {
    icon: "🔍",
    color: "#6610f2",
    label: "Auditor",
    description: "Audit logs and compliance monitoring",
    badge: "secondary",
  },
  [ROLES.CUSTOMER]: {
    icon: "👤",
    color: "#17a2b8",
    label: "Customer",
    description: "Customer portal access",
    badge: "info",
  },
};

// ============================================
// Helper Functions
// ============================================

/**
 * Get role metadata
 * @param {string} role - Role name
 * @returns {Object} Role metadata
 */
export const getRoleMetadata = (role) => {
  return (
    ROLE_METADATA[role] || {
      icon: "🔑",
      color: "#6c757d",
      label: role,
      description: "Unknown role",
      badge: "secondary",
    }
  );
};

/**
 * Get role icon
 * @param {string} role - Role name
 * @returns {string} Icon emoji
 */
export const getRoleIcon = (role) => {
  return getRoleMetadata(role).icon;
};

/**
 * Get role color
 * @param {string} role - Role name
 * @returns {string} Hex color code
 */
export const getRoleColor = (role) => {
  return getRoleMetadata(role).color;
};

/**
 * Get role label
 * @param {string} role - Role name
 * @returns {string} Human-readable label
 */
export const getRoleLabel = (role) => {
  return getRoleMetadata(role).label;
};

/**
 * Check if role1 has higher privilege than role2
 * @param {string} role1 - First role
 * @param {string} role2 - Second role
 * @returns {boolean}
 */
export const hasHigherPrivilege = (role1, role2) => {
  return (ROLE_HIERARCHY[role1] || 0) > (ROLE_HIERARCHY[role2] || 0);
};

/**
 * Get all roles sorted by hierarchy
 * @returns {Array<string>} Sorted role names
 */
export const getSortedRoles = () => {
  return Object.keys(ROLE_HIERARCHY).sort(
    (a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a]
  );
};
