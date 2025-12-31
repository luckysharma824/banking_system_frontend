import React from "react";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import UserService from "../services/UserService";
import { Card, Button, Alert, LoadingSpinner } from "../shared/components";

function CreateUser() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = {
    username: "",
    password: "",
    roles: [],
  };

  const [userData, setUserData] = useState(user);

  const onUserChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const onRoleChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => ({
      name: option.value,
    }));

    setUserData({
      ...userData,
      roles: selected,
    });
  };

  const fetchRoleData = async () => {
    try {
      const response = await UserService.getRoles();
      if (response.success) {
        setUserRoles(response.data);
      } else {
        setMessage(response.message || "Failed to fetch roles list");
        setMessageType("danger");
      }
    } catch (error) {
      setMessage("Failed to fetch roles list");
      setMessageType("danger");
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, []);

  const handleUserChange = async () => {
    if (!userData.username || !userData.password) {
      setMessage("Username and password are required");
      setMessageType("warning");
      return;
    }

    if (userData.roles.length === 0) {
      setMessage("Please select at least one role");
      setMessageType("warning");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await UserService.createUser(userData);

      if (response.success) {
        setMessage(`User ${response.data.username} created successfully`);
        setMessageType("success");
        // Reset form
        setUserData(user);
      } else {
        setMessage(response.message || "Error creating user");
        setMessageType("danger");
      }
    } catch (error) {
      setMessage("Error creating user. Please try again.");
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Card variant="elevated">
        <Card.Header>
          <h2>Create User</h2>
        </Card.Header>
        <Card.Body>
          {message && (
            <Alert
              variant={messageType === "danger" ? "error" : messageType}
              dismissible
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          )}

          <Form className="mt-4">
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                name="username"
                value={userData.username}
                onChange={onUserChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={userData.password}
                onChange={onUserChange}
                required
                minLength={6}
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="user-role">
              <Form.Label>
                Select User Roles (Hold Ctrl/Cmd to select multiple)
              </Form.Label>
              <Form.Select
                multiple
                name="roles"
                onChange={onRoleChange}
                value={userData.roles.map((r) => r.name)}
                required
                size={5}
              >
                {userRoles.map((role, index) => (
                  <option key={index} value={role}>
                    {role.replace("ROLE_", "")}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                type="button"
                onClick={handleUserChange}
                loading={loading}
                disabled={loading}
              >
                Create User
              </Button>

              <Button
                variant="secondary"
                type="button"
                onClick={() => setUserData(user)}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CreateUser;
