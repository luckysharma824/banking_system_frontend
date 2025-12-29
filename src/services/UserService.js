import axios from "axios";
import config from "../config/apiConfig";
import { getToken } from "../components/utils/DataStorage";

/**
 * Service for managing users, roles, and permissions
 */
class UserService {
  /**
   * Get authentication headers
   */
  getHeaders(isTokenRequest) {
    const token = getToken();

    // Validate token exists and is not empty
    if (
      !isTokenRequest ||
      !token ||
      token === "undefined" ||
      token === "null"
    ) {
      console.warn(
        "No authentication required or no valid authentication token found"
      );
      return {
        "Content-Type": "application/json",
      };
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Create a new user
   * @param {Object} userData - User data { username, password, roles: [{name: 'ROLE_NAME'}] }
   * @returns {Promise} User creation response
   */
  async createUser(userData) {
    try {
      const response = await axios.post(`${config.createUserUrl}`, userData, {
        headers: this.getHeaders(true),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create user",
        error: error.response?.data,
      };
    }
  }

  /**
   * Get all users
   * @returns {Promise} List of all users
   */
  async getAllUsers() {
    try {
      const response = await axios.get(`${config.getAllUsersUrl}`, {
        headers: this.getHeaders(true),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch users",
        error: error.response?.data,
      };
    }
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise} User details
   */
  async getUserById(userId) {
    try {
      const response = await axios.get(`${config.getUserByIdUrl}${userId}`, {
        headers: this.getHeaders(true),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch user details",
        error: error.response?.data,
      };
    }
  }

  /**
   * Update user details
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Update response
   */
  async updateUser(userId, userData) {
    try {
      const response = await axios.put(
        `${config.updateUserUrl}${userId}`,
        userData,
        {
          headers: this.getHeaders(true),
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user",
        error: error.response?.data,
      };
    }
  }

  /**
   * Delete/Deactivate user
   * @param {number} userId - User ID
   * @returns {Promise} Delete response
   */
  async deleteUser(userId) {
    try {
      const response = await axios.delete(`${config.deleteUserUrl}${userId}`, {
        headers: this.getHeaders(true),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete user",
        error: error.response?.data,
      };
    }
  }

  /**
   * Get all available roles
   * @returns {Promise} List of role enums
   */
  async getRoles() {
    try {
      const response = await axios.get(`${config.getRolesUrl}`, {
        headers: this.getHeaders(false),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching roles:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch roles",
        error: error.response?.data,
      };
    }
  }

  /**
   * Add or update role with permissions
   * @param {Object} roleData - Role data { name, modulePermissions: [{moduleName, permissions: []}] }
   * @returns {Promise} Role creation/update response
   */
  async addRole(roleData) {
    try {
      const response = await axios.post(`${config.addRoleUrl}`, roleData, {
        headers: this.getHeaders(false),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error adding role:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add role",
        error: error.response?.data,
      };
    }
  }

  /**
   * Get all permissions for all roles
   * @returns {Promise} List of roles with their module permissions
   */
  async getPermissions() {
    try {
      const response = await axios.get(`${config.getPermissionsUrl}`, {
        headers: this.getHeaders(false),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch permissions",
        error: error.response?.data,
      };
    }
  }

  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {Object} passwordData - { oldPassword, newPassword }
   * @returns {Promise} Password change response
   */
  async changePassword(userId, passwordData) {
    try {
      const response = await axios.put(
        `${config.changePasswordUrl}${userId}`,
        passwordData,
        {
          headers: this.getHeaders(true),
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error changing password:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to change password",
        error: error.response?.data,
      };
    }
  }

  /**
   * Update user roles
   * @param {number} userId - User ID
   * @param {Array} roles - Array of role objects [{name: 'ROLE_NAME'}]
   * @returns {Promise} Update response
   */
  async updateUserRoles(userId, roles) {
    try {
      const response = await axios.put(
        `${config.updateUserRolesUrl}${userId}`,
        { roles },
        {
          headers: this.getHeaders(true),
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error updating user roles:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user roles",
        error: error.response?.data,
      };
    }
  }

  /**
   * Get user statistics (for admin dashboard)
   * @returns {Promise} User statistics
   */
  async getUserStats() {
    try {
      const response = await axios.get(`${config.getUserStatsUrl}`, {
        headers: this.getHeaders(true),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch user statistics",
        error: error.response?.data,
      };
    }
  }

  /**
   * Search users by username or other criteria
   * @param {string} searchTerm - Search term
   * @returns {Promise} Search results
   */
  async searchUsers(searchTerm) {
    try {
      const response = await axios.get(
        `${config.searchUsersUrl}?search=${encodeURIComponent(searchTerm)}`,
        {
          headers: this.getHeaders(true),
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error searching users:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to search users",
        error: error.response?.data,
      };
    }
  }
}

export default new UserService();
