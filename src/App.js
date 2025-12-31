import React from "react";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Home from "./components/Home";
import Login from "./components/Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./components/utils/ContextProvider";
import CreateUser from "./components/CreateUser";
import UserManagement from "./components/UserManagement";
import AccountSearch from "./components/SearchAccount";
// Import new components
import BeneficiaryManagement from "./components/BeneficiaryManagement";
import LoanManagement from "./components/LoanManagement";
import StandingInstructionManagement from "./components/StandingInstructionManagement";
import TransactionHistory from "./components/TransactionHistory";
import AccountManagement from "./components/AccountManagement";
import UserProfile from "./components/UserProfile";
// Import module screens
import UserModule from "./components/UserModule";
import CustomerModule from "./components/CustomerModule";
import AccountModule from "./components/AccountModule";
import TransactionModule from "./components/TransactionModule";
import ServicesModule from "./components/ServicesModule";

function App() {
  return (
    <div>
      <ContextProvider>
        <BrowserRouter>
          <NavigationBar />
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route exact path="/" element={<Home />} />

              {/* Module Screens */}
              <Route path="/user-module" element={<UserModule />} />
              <Route path="/customer-module" element={<CustomerModule />} />
              <Route path="/account-module" element={<AccountModule />} />
              <Route
                path="/transaction-module"
                element={<TransactionModule />}
              />
              <Route path="/services-module" element={<ServicesModule />} />

              {/* User Routes */}
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/user-management" element={<UserManagement />} />

              {/* Customer Routes */}
              <Route path="/create-customer" element={<CreateCustomer />} />
              <Route path="/customer/search" element={<CustomerSearch />} />

              {/* Account Routes */}
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/account-search" element={<AccountSearch />} />
              <Route path="/check-balance" element={<CheckBalance />} />
              <Route
                path="/account-management"
                element={<AccountManagement />}
              />

              {/* Transaction Routes */}
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route
                path="/transaction-history"
                element={<TransactionHistory />}
              />

              {/* User Profile */}
              <Route path="/profile" element={<UserProfile />} />

              {/* Services Routes */}
              <Route
                path="/withdraw"
                element={
                  <ProtectedRoute
                    module={MODULES.TRANSACTION}
                    permission="WITHDRAW"
                  >
                    <Withdraw />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transfer"
                element={
                  <ProtectedRoute
                    module={MODULES.TRANSACTION}
                    permission="TRANSFER"
                  >
                    <Transfer />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </ContextProvider>
    </div>
  );
}

export default App;
