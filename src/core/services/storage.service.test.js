/**
 * Tests for Storage Service
 * @jest-environment jsdom
 */

import { StorageService } from "../storage.service";

describe("StorageService", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("Token Management", () => {
    test("should save and retrieve token", () => {
      const token = "test-jwt-token";
      StorageService.saveToken(token);
      expect(StorageService.getToken()).toBe(token);
    });

    test("should return null when no token exists", () => {
      expect(StorageService.getToken()).toBeNull();
    });

    test("should detect expired token", () => {
      const expiredToken = "expired-token";
      const pastExpiry = Date.now() - 10000; // 10 seconds ago

      StorageService.saveToken(expiredToken, pastExpiry);
      expect(StorageService.isTokenExpired()).toBe(true);
    });

    test("should detect valid token", () => {
      const validToken = "valid-token";
      const futureExpiry = Date.now() + 3600000; // 1 hour from now

      StorageService.saveToken(validToken, futureExpiry);
      expect(StorageService.isTokenExpired()).toBe(false);
    });
  });

  describe("User Info Management", () => {
    test("should save and retrieve user info", () => {
      const userInfo = {
        userId: 1,
        username: "testuser",
        email: "test@example.com",
        roles: ["ROLE_ADMIN"],
      };

      StorageService.saveUserInfo(userInfo);
      const retrieved = StorageService.getUserInfo();

      expect(retrieved).toEqual(userInfo);
      expect(retrieved.username).toBe("testuser");
    });

    test("should return null when no user info exists", () => {
      expect(StorageService.getUserInfo()).toBeNull();
    });
  });

  describe("Permissions Management", () => {
    test("should save and retrieve permissions", () => {
      const permissions = ["CREATE_USER", "VIEW_USER", "UPDATE_USER"];

      StorageService.savePermissions(permissions);
      const retrieved = StorageService.getPermissions();

      expect(retrieved).toEqual(permissions);
      expect(retrieved.length).toBe(3);
    });

    test("should return empty array when no permissions exist", () => {
      expect(StorageService.getPermissions()).toEqual([]);
    });
  });

  describe("Clear Auth Data", () => {
    test("should clear all authentication data", () => {
      // Set up test data
      StorageService.saveToken("test-token");
      StorageService.saveUserInfo({ userId: 1, username: "test" });
      StorageService.savePermissions(["CREATE_USER"]);

      // Clear all
      StorageService.clearAuthData();

      // Verify all cleared
      expect(StorageService.getToken()).toBeNull();
      expect(StorageService.getUserInfo()).toBeNull();
      expect(StorageService.getPermissions()).toEqual([]);
    });
  });
});
