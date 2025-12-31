import React, { useContext, useEffect, useState } from "react";
import Login from "./Login";
import { MyContext } from "./utils/ContextProvider";
import { Link } from "react-router-dom";
import { usePermissions } from "./utils/usePermissions";
import DashboardService from "../services/DashboardService";
import { Card, Button, LoadingSpinner, Alert } from "../shared/components";
import "./styles/Dashboard.css";

function Home() {
  const { isAuthenticated, userInfo } = useContext(MyContext);
  const { hasModuleAccess, isAdmin, hasRole } = usePermissions();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Home - isAuthenticated:", isAuthenticated);
    console.log("Home - userInfo:", userInfo);

    if (isAuthenticated) {
      loadDashboardData();
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    return () => clearInterval(timer);
  }, [isAuthenticated, userInfo]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const stats = await DashboardService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Use mock data from service
      setDashboardStats(DashboardService.getMockStats());
    } finally {
      setLoading(false);
    }
  };

  // Get quick action items based on user permissions
  const getQuickActions = () => {
    const actions = [];

    if (hasModuleAccess("CUSTOMER")) {
      actions.push({
        title: "Customer Management",
        description: "Search and manage customers",
        icon: "👥",
        link: "/customer/search",
        color: "#3498db",
      });
    }

    if (hasModuleAccess("ACCOUNT")) {
      actions.push({
        title: "Account Management",
        description: "View and manage accounts",
        icon: "🏦",
        link: "/account-management",
        color: "#2ecc71",
      });
    }

    if (hasModuleAccess("TRANSACTION")) {
      actions.push({
        title: "Transactions",
        description: "Process transactions",
        icon: "💸",
        link: "/transaction-history",
        color: "#e74c3c",
      });
    }

    if (isAdmin()) {
      actions.push({
        title: "User Management",
        description: "Manage system users",
        icon: "👤",
        link: "/create-user",
        color: "#9b59b6",
      });
    }

    return actions;
  };

  // Get statistics cards based on role and data
  const getStatisticsCards = () => {
    if (!dashboardStats) return [];

    const stats = [];

    if (hasRole("ROLE_ADMIN")) {
      stats.push(
        {
          label: "System Health",
          value: dashboardStats.systemHealth || "Excellent",
          icon: "✅",
          color: "#27ae60",
        },
        {
          label: "Active Users",
          value: dashboardStats.activeUsers || "24",
          icon: "👥",
          color: "#3498db",
        },
        {
          label: "Total Accounts",
          value: dashboardStats.totalAccounts || "156",
          icon: "🏦",
          color: "#9b59b6",
        },
        {
          label: "Security Status",
          value: dashboardStats.securityStatus || "Secure",
          icon: "🔒",
          color: "#16a085",
        }
      );
    } else if (hasRole("ROLE_MANAGER")) {
      stats.push(
        {
          label: "Team Size",
          value: dashboardStats.teamSize || "8",
          icon: "👥",
          color: "#3498db",
        },
        {
          label: "Pending Approvals",
          value: dashboardStats.pendingApprovals || "3",
          icon: "⏳",
          color: "#f39c12",
        },
        {
          label: "Reports",
          value: dashboardStats.reportsGenerated || "12",
          icon: "📊",
          color: "#9b59b6",
        }
      );
    } else if (hasRole("ROLE_CASHIER")) {
      stats.push(
        {
          label: "Today's Transactions",
          value: dashboardStats.todayTransactions || "45",
          icon: "💰",
          color: "#27ae60",
        },
        {
          label: "Cash Balance",
          value: dashboardStats.cashBalance || "$25,400",
          icon: "💵",
          color: "#3498db",
        },
        {
          label: "Customers Served",
          value: dashboardStats.customersServed || "32",
          icon: "😊",
          color: "#e67e22",
        }
      );
    } else if (hasRole("ROLE_CLERK")) {
      stats.push(
        {
          label: "Accounts Created",
          value: dashboardStats.accountsCreated || "12",
          icon: "🏦",
          color: "#3498db",
        },
        {
          label: "Documents Processed",
          value: dashboardStats.documentsProcessed || "28",
          icon: "📄",
          color: "#27ae60",
        },
        {
          label: "Tasks Completed",
          value: dashboardStats.tasksCompleted || "34",
          icon: "✓",
          color: "#16a085",
        }
      );
    }

    return stats;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="background-home">
      <h1>Banking System</h1>
      {!isAuthenticated ? (
        <Login />
      ) : (
        <div className="dashboard-container">
          {/* Welcome Header */}
          <Card className="dashboard-header">
            <div className="welcome-section">
              <h1 className="welcome-greeting">
                {greeting}, {userInfo?.fullName || userInfo?.username || "User"}
                !
              </h1>
              <p className="welcome-subtitle">
                Welcome back to your banking dashboard
              </p>
            </div>
            <div className="datetime-section">
              <div className="current-time">{formatTime(currentTime)}</div>
              <div className="current-date">{formatDate(currentTime)}</div>
            </div>
          </Card>

          {/* User Info Card */}
          <Card className="user-info-card" variant="elevated">
            <div className="user-avatar">
              {(userInfo?.fullName || userInfo?.username || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{userInfo?.fullName || userInfo?.username || "User"}</h3>
              <p className="user-email">
                {userInfo?.email || "No email provided"}
              </p>
              {userInfo?.roles && userInfo.roles.length > 0 && (
                <div className="user-roles">
                  {userInfo.roles.map((role, index) => (
                    <span key={index} className="role-badge">
                      {role.replace("ROLE_", "")}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Button variant="primary" size="sm" as={Link} to="/profile">
              View Profile →
            </Button>
          </Card>

          {/* Loading State */}
          {loading && (
            <Card>
              <LoadingSpinner text="Loading dashboard data..." />
            </Card>
          )}

          {/* Statistics Cards */}
          {!loading && getStatisticsCards().length > 0 && (
            <div className="statistics-section">
              <h2 className="section-title">Today's Overview</h2>
              <div className="statistics-grid">
                {getStatisticsCards().map((stat, index) => (
                  <Card
                    key={index}
                    className="stat-card"
                    variant="outlined"
                    style={{
                      borderLeftColor: stat.color,
                      borderLeftWidth: "4px",
                    }}
                  >
                    <div className="stat-icon" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!loading && getQuickActions().length > 0 && (
            <div className="quick-actions-section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="quick-actions-grid">
                {getQuickActions().map((action, index) => (
                  <Card
                    key={index}
                    as={Link}
                    to={action.link}
                    className="action-card"
                    variant="interactive"
                    style={{ "--hover-color": action.color }}
                  >
                    <div className="action-icon">{action.icon}</div>
                    <div className="action-content">
                      <h3 className="action-title">{action.title}</h3>
                      <p className="action-description">{action.description}</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity / Notifications */}
          {!loading && (
            <div className="activity-section">
              <h2 className="section-title">System Status</h2>
              <Card className="activity-card">
                <Alert variant="success" style={{ marginBottom: "1rem" }}>
                  <div className="activity-item">
                    <div className="activity-content">
                      <p className="activity-title">System Online</p>
                      <p className="activity-time">All services operational</p>
                    </div>
                  </div>
                </Alert>
                <Alert variant="success" style={{ marginBottom: "1rem" }}>
                  <div className="activity-item">
                    <div className="activity-content">
                      <p className="activity-title">Security Active</p>
                      <p className="activity-time">
                        All security measures enabled
                      </p>
                    </div>
                  </div>
                </Alert>
                <Alert variant="info">
                  <div className="activity-item">
                    <div className="activity-content">
                      <p className="activity-title">Last Login</p>
                      <p className="activity-time">
                        {new Date().toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </Alert>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
