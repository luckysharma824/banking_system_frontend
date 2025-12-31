import React from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "./utils/usePermissions";
import { MODULES } from "./utils/permissionConstants";
import { Card, Button } from "react-bootstrap";
import "./styles/ModuleScreen.css";

function TransactionModule() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const actions = [
    {
      title: "Deposit Money",
      description: "Deposit funds into an account",
      icon: "💵",
      path: "/deposit",
      permission: "DEPOSIT",
      variant: "success",
    },
    {
      title: "Withdraw Money",
      description: "Withdraw funds from an account",
      icon: "💸",
      path: "/withdraw",
      permission: "WITHDRAW",
      variant: "warning",
    },
    {
      title: "Transfer Money",
      description: "Transfer funds between accounts",
      icon: "↔️",
      path: "/transfer",
      permission: "TRANSFER",
      variant: "primary",
    },
    {
      title: "Transaction History",
      description: "View transaction records and history",
      icon: "📊",
      path: "/transaction-history",
      permission: "VIEW_TRANSACTION",
      variant: "info",
    },
  ];

  const availableActions = actions.filter((action) =>
    hasPermission(MODULES.TRANSACTION, action.permission)
  );

  if (availableActions.length === 0) {
    return (
      <div className="module-screen-container">
        <Card>
          <Card.Body>
            <div className="no-access-message">
              <h3>⚠️ No Access</h3>
              <p>
                You don't have permission to access any transaction features.
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
          <span className="module-icon">💳</span>
          Transaction Management
        </h2>
        <p className="module-description">
          Perform and manage financial transactions
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

export default TransactionModule;
