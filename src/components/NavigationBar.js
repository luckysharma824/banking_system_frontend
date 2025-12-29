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
                  <NavDropdown title="User" id="user-nav-dropdown">
                    {hasPermission(MODULES.USER, "CREATE_USER") && (
                      <NavDropdown.Item as={Link} to="/create-user">
                        Create User
                      </NavDropdown.Item>
                    )}
                    {hasPermission(MODULES.USER, "VIEW_USER") && (
                      <NavDropdown.Item as={Link} to="/user-management">
                        User Management
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                )}
                {hasModuleAccess(MODULES.CUSTOMER) && (
                  <NavDropdown title="Customer" id="customer-nav-dropdown">
                    {hasPermission(MODULES.CUSTOMER, "CREATE_CUSTOMER") && (
                      <NavDropdown.Item as={Link} to="/create-customer">
                        Create Customer
                      </NavDropdown.Item>
                    )}
                    {hasPermission(MODULES.CUSTOMER, "VIEW_CUSTOMER") && (
                      <NavDropdown.Item as={Link} to="/customer/search">
                        Search Customer
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                )}
                {hasModuleAccess(MODULES.ACCOUNT) && (
                  <NavDropdown title="Account" id="account-nav-dropdown">
                    {hasPermission(MODULES.ACCOUNT, "CREATE_ACCOUNT") && (
                      <NavDropdown.Item as={Link} to="/create-account">
                        Create Account
                      </NavDropdown.Item>
                    )}
                    {hasPermission(MODULES.ACCOUNT, "VIEW_ACCOUNT") && (
                      <NavDropdown.Item as={Link} to="/account-search">
                        Search Account
                      </NavDropdown.Item>
                    )}
                    {hasPermission(MODULES.ACCOUNT, "VIEW_ACCOUNT") && (
                      <NavDropdown.Item as={Link} to="/check-balance">
                        Check Balance
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/account-management">
                      Manage Accounts
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                {hasModuleAccess(MODULES.TRANSACTION) && (
                  <NavDropdown
                    title="Transaction"
                    id="transaction-nav-dropdown"
                  >
                    {hasPermission(MODULES.TRANSACTION, "DEPOSIT") && (
                      <NavDropdown.Item as={Link} to="/deposit">
                        Deposit Money
                      </NavDropdown.Item>
                    )}
                    {hasPermission(MODULES.TRANSACTION, "WITHDRAW") && (
                      <NavDropdown.Item as={Link} to="/withdraw">
                        Withdraw Money
                      </NavDropdown.Item>
                    )}
                    {hasPermission(MODULES.TRANSACTION, "TRANSFER") && (
                      <NavDropdown.Item as={Link} to="/transfer">
                        Transfer Money
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Divider />
                    {hasPermission(MODULES.TRANSACTION, "VIEW_TRANSACTION") && (
                      <NavDropdown.Item as={Link} to="/transaction-history">
                        Transaction History
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                )}
                <NavDropdown title="Services" id="services-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/beneficiaries">
                    <span role="img" aria-label="people">
                      👥
                    </span>{" "}
                    Beneficiaries
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/loans">
                    <span role="img" aria-label="money bag">
                      💰
                    </span>{" "}
                    Loans
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/standing-instructions">
                    <span role="img" aria-label="refresh">
                      🔄
                    </span>{" "}
                    Standing Instructions
                  </NavDropdown.Item>
                </NavDropdown>
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
