import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "./utils/ContextProvider";
import { usePermissions } from "./utils/usePermissions";
import { MODULES, getRoleIcon } from "./utils/permissionConstants";

function NavigationBar() {
  const { isAuthenticated, userInfo, logout } = useContext(MyContext);
  const { hasPermission, hasModuleAccess } = usePermissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{ fontWeight: "bold", fontSize: "20px" }}
        >
          <span role="img" aria-label="bank">
            🏦
          </span>{" "}
          Banking System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {isAuthenticated ? (
              <>
                {hasModuleAccess(MODULES.USER) && (
                  <Nav.Link as={Link} to="/user-module">
                    User
                  </Nav.Link>
                )}
                {hasModuleAccess(MODULES.CUSTOMER) && (
                  <Nav.Link as={Link} to="/customer-module">
                    Customer
                  </Nav.Link>
                )}
                {hasModuleAccess(MODULES.ACCOUNT) && (
                  <Nav.Link as={Link} to="/account-module">
                    Account
                  </Nav.Link>
                )}
                {hasModuleAccess(MODULES.TRANSACTION) && (
                  <Nav.Link as={Link} to="/transaction-module">
                    Transaction
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/services-module">
                  Services
                </Nav.Link>
              </>
            ) : null}
          </Nav>

          {/* Right-side User Menu */}
          {isAuthenticated && userInfo && (
            <Nav>
              <NavDropdown
                title={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {userInfo.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                    <span>{userInfo.username}</span>
                    {userInfo.roles && userInfo.roles.length > 0 && (
                      <span style={{ fontSize: "16px" }}>
                        {getRoleIcon(userInfo.roles[0])}
                      </span>
                    )}
                  </span>
                }
                id="user-nav-dropdown"
                align="end"
              >
                <div
                  style={{
                    padding: "10px 20px",
                    borderBottom: "1px solid #dee2e6",
                    minWidth: "220px",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    {userInfo.fullName || userInfo.username}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6c757d" }}>
                    ID: #{userInfo.userId}
                  </div>
                  {userInfo.roles && userInfo.roles.length > 0 && (
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                      }}
                    >
                      {userInfo.roles.map((role, index) => (
                        <span
                          key={index}
                          style={{
                            fontSize: "10px",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: "#e7f3ff",
                            color: "#0d6efd",
                            fontWeight: "500",
                          }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <NavDropdown.Item as={Link} to="/profile">
                  <span role="img" aria-label="user">
                    👤
                  </span>{" "}
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  style={{ color: "#dc3545" }}
                >
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
