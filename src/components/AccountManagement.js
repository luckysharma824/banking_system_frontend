import React, { useState } from "react";
import axios from "axios";
import config from "../config/apiConfig";

function AccountManagement() {
  const [activeTab, setActiveTab] = useState("status");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [accounts, setAccounts] = useState([]);
  const [customerId, setCustomerId] = useState("");

  // Account status management
  const [accountNumber, setAccountNumber] = useState("");
  const [accountStatus, setAccountStatus] = useState("ACTIVE");

  const fetchAccounts = async () => {
    if (!customerId) {
      setMessage({ text: "Please enter customer ID", type: "warning" });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${config.getAccountsByCustomerUrl}${customerId}`
      );

      if (response.data.success) {
        setAccounts(response.data.data || []);
        setMessage({ text: "Accounts fetched successfully", type: "success" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch accounts",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.put(
        `${config.changeAccountStatusUrl}${accountNumber}/${accountStatus}`
      );

      if (response.data.success) {
        setMessage({
          text: `Account status changed to ${accountStatus} successfully!`,
          type: "success",
        });
        setAccountNumber("");
      }
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Failed to change account status",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = () => {
    if (!message.text) return null;
    return (
      <div className={`alert alert-${message.type}`} role="alert">
        {message.text}
      </div>
    );
  };

  const renderAccountsList = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">👤 Customer Accounts</h2>
      </div>

      {renderMessage()}

      <div className="form-group">
        <label className="form-label">Customer ID</label>
        <input
          type="text"
          className="form-control"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Enter customer ID"
        />
      </div>

      <button
        className="btn btn-primary btn-block"
        onClick={fetchAccounts}
        disabled={!customerId || loading}
      >
        {loading ? "Loading..." : "Fetch Accounts"}
      </button>

      {loading && <div className="spinner"></div>}

      {accounts.length > 0 ? (
        <div className="grid grid-2">
          {accounts.map((account) => (
            <div
              key={account.accountNumber}
              className="card"
              style={{ margin: "10px 0", padding: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <h4 style={{ color: "#2c3e50" }}>
                  {account.accountType} Account
                </h4>
                <span
                  className={`badge ${
                    account.accountStatus === "ACTIVE"
                      ? "badge-success"
                      : account.accountStatus === "FROZEN"
                      ? "badge-warning"
                      : "badge-danger"
                  }`}
                >
                  {account.accountStatus}
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <p>
                  <strong>Account Number:</strong> {account.accountNumber}
                </p>
                <p>
                  <strong>Balance:</strong> ₹{account.balance?.toLocaleString()}
                </p>
                <p>
                  <strong>Branch:</strong> {account.branchName}
                </p>
                <p>
                  <strong>IFSC:</strong> {account.ifscCode}
                </p>
                <p>
                  <strong>Opened On:</strong>{" "}
                  {new Date(account.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="btn-group">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => {
                    setAccountNumber(account.accountNumber);
                    setActiveTab("status");
                  }}
                >
                  Manage Status
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        customerId && (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">No accounts found</p>
          </div>
        )
      )}
    </div>
  );

  const renderStatusManagement = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🔧 Account Status Management</h2>
      </div>

      {renderMessage()}

      <div className="alert alert-info">
        <strong>Note:</strong> You can activate, freeze, or close an account
        using this form.
        <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
          <li>
            <strong>ACTIVE:</strong> Account is operational
          </li>
          <li>
            <strong>FROZEN:</strong> Temporarily suspend all transactions
          </li>
          <li>
            <strong>CLOSED:</strong> Permanently close the account
          </li>
        </ul>
      </div>

      <form onSubmit={handleChangeStatus}>
        <div className="form-group">
          <label className="form-label">Account Number</label>
          <input
            type="text"
            className="form-control"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            placeholder="Enter account number"
          />
        </div>

        <div className="form-group">
          <label className="form-label">New Status</label>
          <select
            className="form-select"
            value={accountStatus}
            onChange={(e) => setAccountStatus(e.target.value)}
            required
          >
            <option value="ACTIVE">Active</option>
            <option value="FROZEN">Frozen</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Changing Status..." : "Change Account Status"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setAccountNumber("");
              setAccountStatus("ACTIVE");
            }}
          >
            Clear
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ marginBottom: "15px" }}>Quick Actions</h4>
        <div className="grid grid-3">
          <div className="stats-card">
            <div className="stats-label">Activate Account</div>
            <button
              className="btn btn-success"
              style={{ marginTop: "10px" }}
              onClick={() => {
                if (accountNumber) {
                  setAccountStatus("ACTIVE");
                }
              }}
            >
              Set Active
            </button>
          </div>
          <div className="stats-card">
            <div className="stats-label">Freeze Account</div>
            <button
              className="btn btn-warning"
              style={{ marginTop: "10px" }}
              onClick={() => {
                if (accountNumber) {
                  setAccountStatus("FROZEN");
                }
              }}
            >
              Set Frozen
            </button>
          </div>
          <div className="stats-card">
            <div className="stats-label">Close Account</div>
            <button
              className="btn btn-danger"
              style={{ marginTop: "10px" }}
              onClick={() => {
                if (accountNumber) {
                  if (
                    window.confirm(
                      "Are you sure you want to close this account? This action cannot be undone."
                    )
                  ) {
                    setAccountStatus("CLOSED");
                  }
                }
              }}
            >
              Set Closed
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          My Accounts
        </button>
        <button
          className={`tab ${activeTab === "status" ? "active" : ""}`}
          onClick={() => setActiveTab("status")}
        >
          Manage Status
        </button>
      </div>

      {activeTab === "list" && renderAccountsList()}
      {activeTab === "status" && renderStatusManagement()}
    </div>
  );
}

export default AccountManagement;
