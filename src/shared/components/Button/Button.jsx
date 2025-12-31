/**
 * Reusable Button Component
 * Flexible button with multiple variants and sizes
 */

import React from "react";
import PropTypes from "prop-types";
import "./Button.css";

export const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  onClick,
  type = "button",
  ...props
}) => {
  const buttonClasses = [
    "custom-btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && "btn-full-width",
    loading && "btn-loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="btn-icon btn-icon-left">{icon}</span>
          )}
          <span className="btn-text">{children}</span>
          {icon && iconPosition === "right" && (
            <span className="btn-icon btn-icon-right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
    "outline-primary",
    "outline-secondary",
    "outline-success",
    "outline-danger",
    "link",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;
