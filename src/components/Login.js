import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { savePermissions, saveToken, saveUserInfo } from "./utils/DataStorage";
import { MyContext } from "./utils/ContextProvider";
import config from "../config/apiConfig";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setAuthenticated, setPermissions, setUserInfo } =
    useContext(MyContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (!username.trim() || !password.trim()) {
        setMessage({
          text: "Please enter both username and password",
          type: "warning",
        });
        return;
      }

      setLoading(true);
      setMessage({ text: "", type: "" });

      const response = await axios.post(config.userLoginUrl, {
        username: username.trim(),
        password: password,
      });

      console.log("Login response:", response.data);

      // Handle different response structures
      let responseData = response.data;

      // Check if response has 'isSuccess' or 'success' field
      if (
        responseData.isSuccess === true ||
        responseData.isSuccess === false ||
        responseData.success === true ||
        responseData.success === false
      ) {
        // Structure: { isSuccess: true, data: {...} } or { success: true, data: {...} }
        const isSuccessful = responseData.isSuccess || responseData.success;

        if (isSuccessful && responseData.data) {
          const { token, permissions, userInfo, expiresIn, loginTime } =
            responseData.data;

          // Save authentication data
          saveToken(token);
          savePermissions(permissions);
          saveUserInfo({
            ...userInfo,
            expiresIn,
            loginTime,
            tokenExpiry: new Date(Date.now() + expiresIn).toISOString(),
          });

          // Update context
          setAuthenticated(true);
          setPermissions(permissions);
          setUserInfo(userInfo);

          setMessage({
            text: `Welcome back, ${userInfo.username}!`,
            type: "success",
          });

          // Clear form
          setUsername("");
          setPassword("");

          // Navigate to home after short delay
          setTimeout(() => {
            navigate("/");
          }, 500);
        } else {
          setMessage({
            text: responseData.message || "Login failed",
            type: "danger",
          });
        }
      } else if (responseData.token) {
        // Direct response structure: { token, permissions, userInfo, ... }
        const { token, permissions, userInfo, expiresIn, loginTime } =
          responseData;

        // Save authentication data
        saveToken(token);
        savePermissions(permissions);
        saveUserInfo({
          ...userInfo,
          expiresIn,
          loginTime,
          tokenExpiry: new Date(Date.now() + expiresIn).toISOString(),
        });

        // Update context
        setAuthenticated(true);
        setPermissions(permissions);
        setUserInfo(userInfo);

        setMessage({
          text: `Welcome back, ${userInfo?.username || "User"}!`,
          type: "success",
        });

        // Clear form
        setUsername("");
        setPassword("");

        // Navigate to home after short delay
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setMessage({
          text: "Invalid response format from server",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (error.response.status === 403) {
          errorMessage = "Access denied. Your account may be locked.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      setMessage({ text: errorMessage, type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "500px", margin: "50px auto" }}>
        <div className="card-header">
          <h2 className="card-title">🔐 Login</h2>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="btn-group">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading || !username.trim() || !password.trim()}
            >
              {loading ? (
                <>
                  <span
                    className="spinner"
                    style={{
                      width: "16px",
                      height: "16px",
                      borderWidth: "2px",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <strong>Note:</strong> Your session will expire in 24 hours. You'll
          need to login again.
        </div>
      </div>
    </div>
  );
};

export default Login;
