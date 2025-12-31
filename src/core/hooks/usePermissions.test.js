/**
 * Tests for usePermissions Hook
 */

import { renderHook } from "@testing-library/react";
import { usePermissions } from "../usePermissions";
import { StorageService } from "../../services/storage.service";

// Mock the storage service
jest.mock("../../services/storage.service");

describe("usePermissions Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Permission Checking", () => {
    test("should return true when user has specific permission", () => {
      StorageService.getPermissions.mockReturnValue([
        "USER.CREATE_USER",
        "USER.VIEW_USER",
      ]);

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasPermission("USER", "CREATE_USER")).toBe(true);
    });

    test("should return false when user lacks permission", () => {
      StorageService.getPermissions.mockReturnValue(["USER.VIEW_USER"]);

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasPermission("USER", "DELETE_USER")).toBe(false);
    });
  });

  describe("Module Access", () => {
    test("should return true when user has module access", () => {
      StorageService.getPermissions.mockReturnValue([
        "USER.CREATE_USER",
        "ACCOUNT.VIEW_ACCOUNT",
      ]);

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasModuleAccess("USER")).toBe(true);
      expect(result.current.hasModuleAccess("ACCOUNT")).toBe(true);
    });

    test("should return false when user lacks module access", () => {
      StorageService.getPermissions.mockReturnValue(["USER.VIEW_USER"]);

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasModuleAccess("TRANSACTION")).toBe(false);
    });
  });

  describe("Role Checking", () => {
    test("should identify admin role", () => {
      StorageService.getUserInfo.mockReturnValue({
        userId: 1,
        username: "admin",
        roles: ["ROLE_ADMIN"],
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.isAdmin()).toBe(true);
    });

    test("should identify manager role", () => {
      StorageService.getUserInfo.mockReturnValue({
        userId: 2,
        username: "manager",
        roles: ["ROLE_MANAGER"],
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.isManager()).toBe(true);
    });

    test("should return false for non-admin user", () => {
      StorageService.getUserInfo.mockReturnValue({
        userId: 3,
        username: "cashier",
        roles: ["ROLE_CASHIER"],
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.isAdmin()).toBe(false);
    });
  });

  describe("Get Accessible Modules", () => {
    test("should return list of accessible modules", () => {
      StorageService.getPermissions.mockReturnValue([
        "USER.CREATE_USER",
        "USER.VIEW_USER",
        "ACCOUNT.VIEW_ACCOUNT",
        "TRANSACTION.DEPOSIT",
      ]);

      const { result } = renderHook(() => usePermissions());
      const modules = result.current.getAccessibleModules();

      expect(modules).toContain("USER");
      expect(modules).toContain("ACCOUNT");
      expect(modules).toContain("TRANSACTION");
      expect(modules.length).toBe(3);
    });
  });
});
