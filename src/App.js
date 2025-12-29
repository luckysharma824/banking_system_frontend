import React from "react";
import "./App.css";
import CreateCustomer from "./components/CreateCustomer";
import CreateAccount from "./components/CreateAccount";
import CheckBalance from "./components/CheckBalance";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import Transfer from "./components/Transfer";
import NavigationBar from "./components/NavigationBar";
import Home from "./components/Home";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CustomerSearch from "./components/CustomerSearch";
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

function App() {
  return (
    <div>
      <ContextProvider>
        <BrowserRouter>
          <NavigationBar />
          <div className="App">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/create-customer" element={<CreateCustomer />} />
              <Route path="/customer/search" element={<CustomerSearch />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/account-search" element={<AccountSearch />} />
              <Route path="/check-balance" element={<CheckBalance />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/transfer" element={<Transfer />} />
              {/* User Profile */}
              <Route path="/profile" element={<UserProfile />} />
              {/* New Enhanced Routes */}
              <Route
                path="/account-management"
                element={<AccountManagement />}
              />
              <Route
                path="/beneficiaries"
                element={<BeneficiaryManagement />}
              />
              <Route path="/loans" element={<LoanManagement />} />
              <Route
                path="/standing-instructions"
                element={<StandingInstructionManagement />}
              />
              <Route
                path="/transaction-history"
                element={<TransactionHistory />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </ContextProvider>
    </div>
  );
}

export default App;
