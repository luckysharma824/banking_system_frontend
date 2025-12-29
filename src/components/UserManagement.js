import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Spinner,
  Card,
  InputGroup,
} from "react-bootstrap";
import UserService from "../services/UserService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Available roles
  const [availableRoles, setAvailableRoles] = useState([]);

  // Edit user form data
  const [editUserData, setEditUserData] = useState({
    username: "",
    password: "",
  });

  // Roles form data
  const [selectedRoles, setSelectedRoles] = useState([]);

  // User statistics
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchUserStats();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await UserService.getAllUsers();

    if (response.success) {
      setUsers(response.data);
      setFilteredUsers(response.data);
    } else {
      showMessage(response.message || "Failed to fetch users", "danger");
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    const response = await UserService.getRoles();

    if (response.success) {
      setAvailableRoles(response.data);
    }
  };

  const fetchUserStats = async () => {
    const response = await UserService.getUserStats();

    if (response.success) {
      setUserStats(response.data);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      const response = await UserService.searchUsers(searchTerm);

      if (response.success) {
        setFilteredUsers(response.data);
      } else {
        showMessage(response.message || "Search failed", "danger");
      }
      setLoading(false);
    } else {
      setFilteredUsers(users);
    }
  };

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  // Edit User Functions
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditUserData({
      username: user.username,
      password: "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    const updateData = {
      username: editUserData.username,
    };

    if (editUserData.password) {
      updateData.password = editUserData.password;
    }

    const response = await UserService.updateUser(selectedUser.id, updateData);

    if (response.success) {
      showMessage("User updated successfully", "success");
      setShowEditModal(false);
      fetchUsers();
    } else {
      showMessage(response.message || "Failed to update user", "danger");
    }
  };

  // Delete User Functions
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const response = await UserService.deleteUser(selectedUser.id);

    if (response.success) {
      showMessage("User deleted successfully", "success");
      setShowDeleteModal(false);
      fetchUsers();
      fetchUserStats();
    } else {
      showMessage(response.message || "Failed to delete user", "danger");
    }
  };

  // Manage Roles Functions
  const handleManageRolesClick = (user) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map((r) => r.name));
    setShowRolesModal(true);
  };

  const handleRolesChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedRoles(selected);
  };

  const handleRolesSubmit = async () => {
    const rolesData = selectedRoles.map((roleName) => ({ name: roleName }));
    const response = await UserService.updateUserRoles(
      selectedUser.id,
      rolesData
    );

    if (response.success) {
      showMessage("User roles updated successfully", "success");
      setShowRolesModal(false);
      fetchUsers();
    } else {
      showMessage(response.message || "Failed to update user roles", "danger");
    }
  };

  const getRoleBadgeVariant = (roleName) => {
    const roleMap = {
      ROLE_ADMIN: "danger",
      ROLE_MANAGER: "warning",
      ROLE_CASHIER: "info",
      ROLE_CLERK: "secondary",
    };
    return roleMap[roleName] || "primary";
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>User Management</h2>
        </Col>
      </Row>

      {message && (
        <Alert variant={messageType} dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {/* Statistics Cards */}
      {userStats && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <h2>{userStats.totalUsers}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Active Users</Card.Title>
                <h2>{userStats.activeUsers}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Role Distribution</Card.Title>
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                  {Object.entries(userStats.roleDistribution || {}).map(
                    ([role, count]) =>
                      count > 0 && (
                        <Badge key={role} bg={getRoleBadgeVariant(role)}>
                          {role.replace("ROLE_", "")}: {count}
                        </Badge>
                      )
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Search Bar */}
      <Row className="mb-3">
        <Col md={8}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search users by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
            {searchTerm && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFilteredUsers(users);
                }}
              >
                Clear
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="success" onClick={fetchUsers}>
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </Button>
        </Col>
      </Row>

      {/* Users Table */}
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Roles</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>
                    {user.roles &&
                      user.roles.map((role, index) => (
                        <Badge
                          key={index}
                          bg={getRoleBadgeVariant(role.name)}
                          className="me-1"
                        >
                          {role.name.replace("ROLE_", "")}
                        </Badge>
                      ))}
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleManageRolesClick(user)}
                    >
                      Roles
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editUserData.username}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                New Password (leave blank to keep current)
              </Form.Label>
              <Form.Control
                type="password"
                value={editUserData.password}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, password: e.target.value })
                }
                placeholder="Enter new password"
              />
              <Form.Text className="text-muted">
                Only enter a password if you want to change it.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user{" "}
          <strong>{selectedUser?.username}</strong>? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Manage Roles Modal */}
      <Modal show={showRolesModal} onHide={() => setShowRolesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage User Roles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Select Roles for <strong>{selectedUser?.username}</strong>
              </Form.Label>
              <Form.Select
                multiple
                size={6}
                value={selectedRoles}
                onChange={handleRolesChange}
              >
                {availableRoles.map((role, index) => (
                  <option key={index} value={role}>
                    {role.replace("ROLE_", "")}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Hold Ctrl/Cmd to select multiple roles
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRolesModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRolesSubmit}>
            Update Roles
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserManagement;
