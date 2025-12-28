import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./utils/ContextProvider";
import { getRemainingTime } from "./utils/DataStorage";

const UserProfile = () => {
  const { userInfo, logout } = useContext(MyContext);
  const [remainingTime, setRemainingTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateRemainingTime = () => {
      const remaining = getRemainingTime();
      if (remaining <= 0) {
        setRemainingTime("Expired");
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN: "#dc3545",
      MANAGER: "#fd7e14",
      USER: "#0d6efd",
      CUSTOMER: "#198754",
      ACCOUNTANT: "#6f42c1",
      CLERK: "#20c997",
    };
    return colors[role] || "#6c757d";
  };

  const getRoleIcon = (role) => {
    const icons = {
      ADMIN: (
        <span role="img" aria-label="crown">
          👑
        </span>
      ),
      MANAGER: (
        <span role="img" aria-label="bar chart">
          📊
        </span>
      ),
      USER: (
        <span role="img" aria-label="user">
          👤
        </span>
      ),
      CUSTOMER: (
        <span role="img" aria-label="briefcase">
          💼
        </span>
      ),
      ACCOUNTANT: (
        <span role="img" aria-label="money bag">
          💰
        </span>
      ),
      CLERK: (
        <span role="img" aria-label="memo">
          📝
        </span>
      ),
    };
    return (
      icons[role] || (
        <span role="img" aria-label="key">
          🔑
        </span>
      )
    );
  };

  const formatLoginTime = (loginTime) => {
    if (!loginTime) return "N/A";
    const date = new Date(loginTime);
    return date.toLocaleString();
  };

  if (!userInfo) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">User Profile</h2>
          </div>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>No user information available. Please login.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "800px", margin: "20px auto" }}>
        <div className="card-header">
          <h2 className="card-title">
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            User Profile
          </h2>
        </div>

        <div style={{ padding: "30px" }}>
          {/* User Avatar and Basic Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "30px",
              padding: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              color: "white",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                fontWeight: "bold",
                color: "#667eea",
              }}
            >
              {userInfo.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: "24px" }}>
                {userInfo.fullName || userInfo.username}
              </h3>
              <p style={{ margin: "5px 0 0 0", opacity: 0.9 }}>
                @{userInfo.username}
              </p>
            </div>
          </div>

          {/* User Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <div className="info-box">
              <div className="info-label">User ID</div>
              <div className="info-value">#{userInfo.userId}</div>
            </div>

            <div className="info-box">
              <div className="info-label">Username</div>
              <div className="info-value">{userInfo.username}</div>
            </div>

            {userInfo.email && (
              <div className="info-box">
                <div className="info-label">Email</div>
                <div className="info-value">{userInfo.email}</div>
              </div>
            )}

            <div className="info-box">
              <div className="info-label">Login Time</div>
              <div className="info-value" style={{ fontSize: "14px" }}>
                {formatLoginTime(userInfo.loginTime)}
              </div>
            </div>

            <div className="info-box">
              <div className="info-label">Session Expires In</div>
              <div
                className="info-value"
                style={{
                  color: getRemainingTime() < 300000 ? "#dc3545" : "#198754",
                  fontWeight: "bold",
                }}
              >
                {remainingTime}
              </div>
            </div>
          </div>

          {/* Roles Section */}
          <div style={{ marginBottom: "30px" }}>
            <h4 style={{ marginBottom: "15px", color: "#495057" }}>
              <span role="img" aria-label="theater masks">
                🎭
              </span>{" "}
              Assigned Roles
            </h4>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {userInfo.roles && userInfo.roles.length > 0 ? (
                userInfo.roles.map((role, index) => (
                  <div
                    key={index}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      background: getRoleBadgeColor(role),
                      color: "white",
                      fontWeight: "500",
                      fontSize: "14px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>
                      {getRoleIcon(role)}
                    </span>
                    <span>{role}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: "#6c757d" }}>No roles assigned</p>
              )}
            </div>
          </div>

          {/* Session Warning */}
          {getRemainingTime() > 0 && getRemainingTime() < 300000 && (
            <div
              className="alert alert-warning"
              style={{ marginBottom: "20px" }}
            >
              <span role="img" aria-label="warning">
                ⚠️
              </span>{" "}
              Your session will expire soon. Please save your work.
            </div>
          )}

          {/* Action Buttons */}
          <div className="btn-group">
            <button
              className="btn btn-danger"
              onClick={handleLogout}
              style={{ minWidth: "150px" }}
            >
              <span role="img" aria-label="door">
                🚪
              </span>{" "}
              Logout
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .info-box {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #0d6efd;
        }

        .info-label {
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .info-value {
          font-size: 16px;
          color: #212529;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
