/**
 * Tests for PermissionGuard Component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { PermissionGuard } from "../PermissionGuard";
import { usePermissions } from "../../hooks/usePermissions";

// Mock the usePermissions hook
jest.mock("../../hooks/usePermissions");

describe("PermissionGuard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render children when user has permission", () => {
    usePermissions.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(true),
    });

    render(
      <PermissionGuard module="USER" permission="CREATE_USER">
        <div>Protected Content</div>
      </PermissionGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("should not render children when user lacks permission", () => {
    usePermissions.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(false),
    });

    render(
      <PermissionGuard module="USER" permission="CREATE_USER">
        <div>Protected Content</div>
      </PermissionGuard>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  test("should render fallback when provided and user lacks permission", () => {
    usePermissions.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(false),
    });

    render(
      <PermissionGuard
        module="USER"
        permission="CREATE_USER"
        fallback={<div>Access Denied</div>}
      >
        <div>Protected Content</div>
      </PermissionGuard>
    );

    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  test("should render children when checking module access", () => {
    usePermissions.mockReturnValue({
      hasModuleAccess: jest.fn().mockReturnValue(true),
    });

    render(
      <PermissionGuard module="USER">
        <div>Module Content</div>
      </PermissionGuard>
    );

    expect(screen.getByText("Module Content")).toBeInTheDocument();
  });

  test("should check role when role prop is provided", () => {
    usePermissions.mockReturnValue({
      hasRole: jest.fn().mockReturnValue(true),
    });

    render(
      <PermissionGuard role="ROLE_ADMIN">
        <div>Admin Content</div>
      </PermissionGuard>
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
