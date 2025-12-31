import React from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "./utils/usePermissions";
import { MODULES } from "./utils/permissionConstants";
import { Card, Button } from "react-bootstrap";
import "./styles/ModuleScreen.css";

function AccountModule() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const actions = [
    {
      title: "Create Account",
      description: "Open a new bank account for a customer",
      icon: "🏦",
      path: "/create-account",
      permission: "CREATE_ACCOUNT",
      variant: "primary",
    },
    {
      title: "Search Account",
      description: "Find and view account details",
      icon: "🔍",
      path: "/account-search",
      permission: "VIEW_ACCOUNT",
      variant: "info",
    },
    {
      title: "Check Balance",
      description: "View account balance information",
      icon: "💰",
      path: "/check-balance",
      permission: "VIEW_ACCOUNT",
      variant: "success",
    },
    {
      title: "Manage Accounts",
      description: "View and manage all accounts",
      icon: "⚙️",
      path: "/account-management",
      permission: "VIEW_ACCOUNT",
      variant: "secondary",
    },
  ];

  const availableActions = actions.filter((action) =>
    hasPermission(MODULES.ACCOUNT, action.permission)
  );

  if (availableActions.length === 0) {
    return (
      <div className="module-screen-container">
        <Card>
          <Card.Body>
            <div className="no-access-message">
              <h3>⚠️ No Access</h3>
              <p>
                You don't have permission to access any account management
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
          <span className="module-icon">🏦</span>
          Account Management
        </h2>
        <p className="module-description">
          Manage bank accounts and account operations
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

export default AccountModule;
