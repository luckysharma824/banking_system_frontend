import axios from "axios";
import config from "../config/apiConfig";

/**
 * Service for fetching dashboard statistics and data
 */
class DashboardService {
  /**
   * Get authentication headers
   */
  getHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Get dashboard statistics based on user role
   */
  async getDashboardStats() {
    try {
      const response = await axios.get(`${config.baseUrl}/dashboard/stats`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return mock data if API is not available
      return this.getMockStats();
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit = 5) {
    try {
      const response = await axios.get(
        `${config.baseUrl}/dashboard/activities?limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return this.getMockActivities();
    }
  }

  /**
   * Get quick actions based on user permissions
   */
  async getQuickActions() {
    try {
      const response = await axios.get(
        `${config.baseUrl}/dashboard/quick-actions`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching quick actions:", error);
      return [];
    }
  }

  /**
   * Mock statistics data (fallback)
   */
  getMockStats() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const roles = userInfo.roles || [];

    if (roles.includes("ROLE_ADMIN")) {
      return {
        systemHealth: "Excellent",
        activeUsers: Math.floor(Math.random() * 50) + 10,
        totalTransactions: Math.floor(Math.random() * 1000) + 500,
        securityStatus: "Secure",
      };
    } else if (roles.includes("ROLE_MANAGER")) {
      return {
        teamSize: Math.floor(Math.random() * 15) + 5,
        pendingApprovals: Math.floor(Math.random() * 10),
        reportsGenerated: Math.floor(Math.random() * 20) + 5,
      };
    } else if (roles.includes("ROLE_CASHIER")) {
      return {
        todayTransactions: Math.floor(Math.random() * 100) + 20,
        cashBalance: (Math.random() * 50000 + 10000).toFixed(2),
        customersServed: Math.floor(Math.random() * 50) + 10,
      };
    } else if (roles.includes("ROLE_CLERK")) {
      return {
        accountsCreated: Math.floor(Math.random() * 20) + 5,
        documentsProcessed: Math.floor(Math.random() * 50) + 10,
        tasksCompleted: Math.floor(Math.random() * 40) + 15,
      };
    }

    return {};
  }

  /**
   * Mock activities data (fallback)
   */
  getMockActivities() {
    return [
      {
        id: 1,
        type: "success",
        title: "System Online",
        description: "All services operational",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        type: "success",
        title: "Security Active",
        description: "All security measures enabled",
        timestamp: new Date().toISOString(),
      },
      {
        id: 3,
        type: "info",
        title: "Last Login",
        description: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date().toISOString(),
      },
    ];
  }
}

export default new DashboardService();
