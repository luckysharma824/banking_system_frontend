import React from "react";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Home from "./components/Home";
import Login from "./components/Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./components/utils/ContextProvider";
import { ProtectedRoute } from "./core/components/ProtectedRoute";
import { MODULES } from "./core/constants/permissions.constants";

// Import feature modules
import { CreateUser, UserManagement, UserProfile } from "./features/user";
import { CreateCustomer, CustomerSearch } from "./features/customer";
import {
  CreateAccount,
  SearchAccount,
  CheckBalance,
  AccountManagement,
} from "./features/account";
import {
  Deposit,
  Withdraw,
  Transfer,
  TransactionHistory,
} from "./features/transaction";
import {
  BeneficiaryManagement,
  LoanManagement,
  StandingInstructionManagement,
} from "./features/services";

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
              <Route path="/login" element={<Login />} />

              {/* User Management Routes */}
              <Route
                path="/create-user"
                element={
                  <ProtectedRoute
                    module={MODULES.USER}
                    permission="CREATE_USER"
                  >
                    <CreateUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management"
                element={
                  <ProtectedRoute module={MODULES.USER} permission="VIEW_USER">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Customer Management Routes */}
              <Route
                path="/create-customer"
                element={
                  <ProtectedRoute
                    module={MODULES.CUSTOMER}
                    permission="CREATE_CUSTOMER"
                  >
                    <CreateCustomer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/search"
                element={
                  <ProtectedRoute
                    module={MODULES.CUSTOMER}
                    permission="VIEW_CUSTOMER"
                  >
                    <CustomerSearch />
                  </ProtectedRoute>
                }
              />

              {/* Account Management Routes */}
              <Route
                path="/create-account"
                element={
                  <ProtectedRoute
                    module={MODULES.ACCOUNT}
                    permission="CREATE_ACCOUNT"
                  >
                    <CreateAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account-search"
                element={
                  <ProtectedRoute
                    module={MODULES.ACCOUNT}
                    permission="VIEW_ACCOUNT"
                  >
                    <SearchAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/check-balance"
                element={
                  <ProtectedRoute
                    module={MODULES.ACCOUNT}
                    permission="VIEW_ACCOUNT"
                  >
                    <CheckBalance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account-management"
                element={
                  <ProtectedRoute
                    module={MODULES.ACCOUNT}
                    permission="UPDATE_ACCOUNT"
                  >
                    <AccountManagement />
                  </ProtectedRoute>
                }
              />

              {/* Transaction Routes */}
              <Route
                path="/deposit"
                element={
                  <ProtectedRoute
                    module={MODULES.TRANSACTION}
                    permission="DEPOSIT"
                  >
                    <Deposit />
                  </ProtectedRoute>
                }
              />
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
              <Route
                path="/transaction-history"
                element={
                  <ProtectedRoute
                    module={MODULES.TRANSACTION}
                    permission="VIEW_TRANSACTION"
                  >
                    <TransactionHistory />
                  </ProtectedRoute>
                }
              />

              {/* Banking Services Routes */}
              <Route
                path="/beneficiaries"
                element={
                  <ProtectedRoute>
                    <BeneficiaryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loans"
                element={
                  <ProtectedRoute>
                    <LoanManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/standing-instructions"
                element={
                  <ProtectedRoute>
                    <StandingInstructionManagement />
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
