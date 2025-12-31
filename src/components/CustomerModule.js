import React from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "./utils/usePermissions";
import { MODULES } from "./utils/permissionConstants";
import { Card, Button } from "react-bootstrap";
import "./styles/ModuleScreen.css";

function CustomerModule() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const actions = [
    {
      title: "Create Customer",
      description: "Register a new customer in the system",
      icon: "🆕",
      path: "/create-customer",
      permission: "CREATE_CUSTOMER",
      variant: "primary",
    },
    {
      title: "Search Customer",
      description: "Find and view customer details",
      icon: "🔍",
      path: "/customer/search",
      permission: "VIEW_CUSTOMER",
      variant: "info",
    },
  ];

  const availableActions = actions.filter((action) =>
    hasPermission(MODULES.CUSTOMER, action.permission)
  );

  if (availableActions.length === 0) {
    return (
      <div className="module-screen-container">
        <Card>
          <Card.Body>
            <div className="no-access-message">
              <h3>⚠️ No Access</h3>
              <p>
                You don't have permission to access any customer management
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
          <span className="module-icon">👥</span>
          Customer Management
        </h2>
        <p className="module-description">
          Manage customer accounts and information
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

export default CustomerModule;
