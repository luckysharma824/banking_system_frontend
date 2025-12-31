import React from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "./utils/usePermissions";
import { MODULES } from "./utils/permissionConstants";
import { Card, Button } from "react-bootstrap";
import "./styles/ModuleScreen.css";

function UserModule() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const actions = [
    {
      title: "Create User",
      description: "Add a new user to the system",
      icon: "👤➕",
      path: "/create-user",
      permission: "CREATE_USER",
      variant: "primary",
    },
    {
      title: "User Management",
      description: "View and manage existing users",
      icon: "👥",
      path: "/user-management",
      permission: "VIEW_USER",
      variant: "info",
    },
  ];

  const availableActions = actions.filter((action) =>
    hasPermission(MODULES.USER, action.permission)
  );

  if (availableActions.length === 0) {
    return (
      <div className="module-screen-container">
        <Card>
          <Card.Body>
            <div className="no-access-message">
              <h3>⚠️ No Access</h3>
              <p>
                You don't have permission to access any user management
                features.
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="module-screen-container">
      <div className="module-header">
        <h2>
          <span className="module-icon">👤</span>
          User Management
        </h2>
        <p className="module-description">
          Manage user accounts and permissions in the banking system
        </p>
      </div>

      <div className="action-grid">
        {availableActions.map((action, index) => (
          <Card key={index} className="action-card">
            <Card.Body>
              <div className="action-content">
                <div className="action-icon">{action.icon}</div>
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
                <Button
                  variant={action.variant}
                  onClick={() => navigate(action.path)}
                  className="w-100"
                >
                  {action.title}
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UserModule;
