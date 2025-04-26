import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { removeToken } from "./utils/DataStorage";
import { MyContext } from "./utils/ContextProvider";

function NavigationBar() {
  const { isAuthenticated, permissions, setAuthenticated, setPermissions } =
    useContext(MyContext);

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
    setPermissions({});
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Banking System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {isAuthenticated ? (
              <>
                {permissions.hasOwnProperty("USER") && (
                  <NavDropdown title="User" id="basic-nav-dropdown">
                    {permissions.USER.includes("CREATE_USER") && (
                      <NavDropdown.Item as={Link} to="/create-user">
                        Create User
                      </NavDropdown.Item>
                    )}
                    {permissions.USER.includes("VIEW_CUSTOMER") && (
                      <NavDropdown.Item as={Link} to="/">
                        Search User
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                )}
                {permissions.hasOwnProperty("CUSTOMER") && (
                  <NavDropdown title="Customer" id="basic-nav-dropdown">
                    {permissions.CUSTOMER.includes("CREATE_CUSTOMER") && (
                      <NavDropdown.Item as={Link} to="/create-customer">
                        Create Customer
                      </NavDropdown.Item>
                    )}
                    {permissions.CUSTOMER.includes("VIEW_CUSTOMER") && (
                      <NavDropdown.Item as={Link} to="/customer/search">
                        Search Customer
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                )}
                {permissions.hasOwnProperty("ACCOUNT") && (
                  <NavDropdown title="Account" id="basic-nav-dropdown">
                    {permissions.ACCOUNT.includes("CREATE_ACCOUNT") && (
                      <NavDropdown.Item as={Link} to="/create-account">
                        Create Account
                      </NavDropdown.Item>
                    )}
                    {permissions.ACCOUNT.includes("VIEW_ACCOUNT") && (
                      <NavDropdown.Item as={Link} to="/account-search">
                        Search Account
                      </NavDropdown.Item>
                    )}
                    {permissions.ACCOUNT.includes("VIEW_ACCOUNT") && (
                      <NavDropdown.Item as={Link} to="/check-balance">
                        Check Balance
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                )}
                {permissions.hasOwnProperty("TRANSACTION") && (
                  <NavDropdown title="Transaction" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/deposit">
                      Deposit Money
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/withdraw">
                      Withdraw Money
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/transfer">
                      Transfer Money
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                <Nav.Link as={Link} to="/" onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <div></div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
