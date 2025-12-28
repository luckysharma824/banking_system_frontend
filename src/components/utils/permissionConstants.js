/**
 * Permission and Role Constants
 * Only contains static references - actual permissions come from backend
 */

import React from "react";

// Role Constants
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
  CUSTOMER: "CUSTOMER",
  ACCOUNTANT: "ACCOUNTANT",
  CLERK: "CLERK",
};

// Module Constants (these are keys in the permissions object from backend)
export const MODULES = {
  USER: "USER",
  CUSTOMER: "CUSTOMER",
  ACCOUNT: "ACCOUNT",
  TRANSACTION: "TRANSACTION",
  LOAN: "LOAN",
  BENEFICIARY: "BENEFICIARY",
  STANDING_INSTRUCTION: "STANDING_INSTRUCTION",
};

// Role Icons for UI Display (now returns JSX elements)
export const ROLE_ICONS = {
  [ROLES.ADMIN]: (
    <span role="img" aria-label="crown">
      👑
    </span>
  ),
  [ROLES.MANAGER]: (
    <span role="img" aria-label="bar chart">
      📊
    </span>
  ),
  [ROLES.USER]: (
    <span role="img" aria-label="user">
      👤
    </span>
  ),
  [ROLES.CUSTOMER]: (
    <span role="img" aria-label="briefcase">
      💼
    </span>
  ),
  [ROLES.ACCOUNTANT]: (
    <span role="img" aria-label="money bag">
      💰
    </span>
  ),
  [ROLES.CLERK]: (
    <span role="img" aria-label="memo">
      📝
    </span>
  ),
};

// Role Colors for UI Display
export const ROLE_COLORS = {
  [ROLES.ADMIN]: "#dc3545",
  [ROLES.MANAGER]: "#fd7e14",
  [ROLES.USER]: "#0d6efd",
  [ROLES.CUSTOMER]: "#198754",
  [ROLES.ACCOUNTANT]: "#6f42c1",
  [ROLES.CLERK]: "#20c997",
};

// Role Descriptions
export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: "Full system access with all permissions",
  [ROLES.MANAGER]: "Manage users and oversee operations",
  [ROLES.USER]: "Standard user with basic permissions",
  [ROLES.CUSTOMER]: "Customer-facing operations",
  [ROLES.ACCOUNTANT]: "Financial operations and reporting",
  [ROLES.CLERK]: "Data entry and basic operations",
};

/**
 * Helper function to get role icon
 * @param {string} role - Role name
 * @returns {JSX.Element} Icon emoji wrapped in accessible span
 */
export const getRoleIcon = (role) => {
  return (
    ROLE_ICONS[role] || (
      <span role="img" aria-label="key">
        🔑
      </span>
    )
  );
};

/**
 * Helper function to get role color
 * @param {string} role - Role name
 * @returns {string} Hex color code
 */
export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || "#6c757d";
};

/**
 * Helper function to get role description
 * @param {string} role - Role name
 * @returns {string} Description
 */
export const getRoleDescription = (role) => {
  return ROLE_DESCRIPTIONS[role] || "Standard user role";
};

export default {
  ROLES,
  MODULES,
  ROLE_ICONS,
  ROLE_COLORS,
  ROLE_DESCRIPTIONS,
  getRoleDescription,
};
