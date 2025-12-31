/**
 * Loading Spinner Component
 * Reusable loading indicator with multiple variants
 */

import React from "react";
import PropTypes from "prop-types";
import "./LoadingSpinner.css";

export const LoadingSpinner = ({
  size = "medium",
  variant = "primary",
  fullScreen = false,
  text = "",
  overlay = false,
}) => {
  if (fullScreen || overlay) {
    return (
      <div
        className={`spinner-overlay ${
          overlay ? "spinner-overlay-transparent" : ""
        }`}
      >
        <div className="spinner-container">
          <div className={`spinner spinner-${size} spinner-${variant}`} />
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-inline">
      <div className={`spinner spinner-${size} spinner-${variant}`} />
      {text && <span className="spinner-text-inline">{text}</span>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["primary", "secondary", "light", "dark"]),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  overlay: PropTypes.bool,
};

export default LoadingSpinner;
