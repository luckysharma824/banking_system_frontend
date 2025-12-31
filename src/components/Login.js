import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { savePermissions, saveToken, saveUserInfo } from "./utils/DataStorage";
import { MyContext } from "./utils/ContextProvider";
import config from "../config/apiConfig";
import { Card, Button, Alert } from "../shared/components";

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
      if (responseData.isSuccess === true) {
        // Structure: { isSuccess: true, data: {...} } or { success: true, data: {...} }
        console.log("Detected structure with isSuccess field");
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
      <Card
        variant="elevated"
        style={{ maxWidth: "500px", margin: "50px auto" }}
      >
        <Card.Header>
          <h2 className="card-title">
            <span role="img" aria-label="locked with key">
              🔐
            </span>{" "}
            Login
          </h2>
        </Card.Header>

        <Card.Body>
          {message.text && (
            <Alert
              variant={message.type === "danger" ? "error" : message.type}
              dismissible
              onClose={() => setMessage({ text: "", type: "" })}
            >
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoFocus
                autoComplete="username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <span role="img" aria-label="eye">
                      👁️
                    </span>
                  ) : (
                    <span role="img" aria-label="eye in speech bubble">
                      👁️‍🗨️
                    </span>
                  )}
                </button>
              </div>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading || !username.trim() || !password.trim()}
            >
              Login
            </Button>
          </Form>

          <Alert
            variant="info"
            style={{
              marginTop: "20px",
              fontSize: "14px",
            }}
          >
            <strong>Note:</strong> Your session will expire in 24 hours. You'll
            need to login again.
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
