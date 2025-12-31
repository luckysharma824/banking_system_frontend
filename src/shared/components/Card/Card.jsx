/**
 * Reusable Card Component
 * Flexible card component with multiple variants
 */

import React from "react";
import PropTypes from "prop-types";
import "./Card.css";

const Card = ({
  children,
  className = "",
  variant = "default",
  elevation = 1,
  hoverable = false,
  onClick,
  header,
  footer,
  title,
  subtitle,
  icon,
  actions,
  ...props
}) => {
  const cardClasses = [
    "custom-card",
    `card-${variant}`,
    `card-elevation-${elevation}`,
    hoverable && "card-hoverable",
    onClick && "card-clickable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {/* Header Section */}
      {(header || title || subtitle || icon) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
            {header}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}

      {/* Body Section */}
      <div className="card-body">{children}</div>

      {/* Footer Section */}
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    "default",
    "primary",
    "success",
    "warning",
    "danger",
    "info",
    "elevated",
    "outlined",
    "interactive",
  ]),
  elevation: PropTypes.oneOf([0, 1, 2, 3, 4]),
  hoverable: PropTypes.bool,
  onClick: PropTypes.func,
  header: PropTypes.node,
  footer: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  actions: PropTypes.node,
};

// Subcomponents for more flexible usage
Card.Header = ({ children, className = "", ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = "", ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = "", ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
