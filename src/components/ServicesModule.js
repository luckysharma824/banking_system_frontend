import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "./styles/ModuleScreen.css";

function ServicesModule() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Beneficiaries",
      description: "Manage your beneficiary accounts",
      icon: "👥",
      path: "/beneficiaries",
      variant: "primary",
    },
    {
      title: "Loans",
      description: "Apply for and manage loans",
      icon: "💰",
      path: "/loans",
      variant: "success",
    },
    {
      title: "Standing Instructions",
      description: "Set up automatic recurring payments",
      icon: "🔄",
      path: "/standing-instructions",
      variant: "info",
    },
  ];

  return (
    <div className="module-screen-container">
      <div className="module-header">
        <h2>
          <span className="module-icon">⚡</span>
          Banking Services
        </h2>
        <p className="module-description">
          Access additional banking services and features
        </p>
      </div>

      <div className="action-grid">
        {services.map((service, index) => (
          <Card key={index} className="action-card">
            <Card.Body>
              <div className="action-content">
                <div className="action-icon">{service.icon}</div>
                <h3 className="action-title">{service.title}</h3>
                <p className="action-description">{service.description}</p>
                <Button
                  variant={service.variant}
                  onClick={() => navigate(service.path)}
                  className="w-100"
                >
                  {service.title}
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ServicesModule;
