/**
 * Alert Component
 * Reusable alert/notification component
 */

import React from "react";
import PropTypes from "prop-types";
import "./Alert.css";

export const Alert = ({
  children,
  variant = "info",
  dismissible = false,
  onClose,
  icon,
  title,
  className = "",
  ...props
}) => {
  const defaultIcons = {
    success: "✓",
    info: "ℹ",
    warning: "⚠",
    danger: "✕",
  };

  const alertClasses = ["custom-alert", `alert-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="alert-content">
        {(icon || defaultIcons[variant]) && (
          <span className="alert-icon">{icon || defaultIcons[variant]}</span>
        )}
        <div className="alert-body">
          {title && <div className="alert-title">{title}</div>}
          <div className="alert-message">{children}</div>
        </div>
      </div>
      {dismissible && (
        <button
          className="alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["success", "info", "warning", "danger"]),
  dismissible: PropTypes.bool,
  onClose: PropTypes.func,
  icon: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default Alert;
