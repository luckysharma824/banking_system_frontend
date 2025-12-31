import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./utils/DataStorage";
import config from "../config/apiConfig";
import "./styles/CheckBalance.css";

function CheckBalance() {
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCheckBalance = async () => {
    if (!accountNumber.trim()) {
      setError("Please enter an account number");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setBalance(null);
    setAccountDetails(null);

    try {
      const response = await axios.get(
        `${config.balanceCheckUrl}${accountNumber}`,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        }
      );

      const balanceData = response.data.data;
      setBalance(balanceData);
      setAccountDetails({
        accountNumber: accountNumber,
        lastChecked: new Date().toLocaleString(),
      });
      setSuccessMessage("Balance retrieved successfully!");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Error fetching balance. Please verify the account number.";
      setError(errorMsg);
      setBalance(null);
      setAccountDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCheckBalance();
    }
  };

  const handleReset = () => {
    setAccountNumber("");
    setBalance(null);
    setAccountDetails(null);
    setError("");
    setSuccessMessage("");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="container">
      <div className="card check-balance-card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-icon">💰</span>
            Check Account Balance
          </h2>
        </div>

        <div className="check-balance-content">
          <div className="form-section">
            <div className="form-group">
              <label className="form-label" htmlFor="accountNumber">
                Account Number
              </label>
              <input
                id="accountNumber"
                type="text"
                className="form-control"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="off"
              />
              <small className="form-text">
                Enter the account number to check balance
              </small>
            </div>

            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={handleCheckBalance}
                disabled={loading || !accountNumber.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Checking...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Check Balance
                  </>
                )}
              </button>
              {(balance !== null || error) && (
                <button
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <span>🔄</span>
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger">
              <span className="alert-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Balance Display */}
          {balance !== null && accountDetails && (
            <div className="balance-result">
              <div className="balance-card">
                <div className="balance-header">
                  <span className="balance-icon">🏦</span>
                  <h3>Account Balance</h3>
                </div>

                <div className="balance-amount">{formatCurrency(balance)}</div>

                <div className="account-info">
                  <div className="info-item">
                    <span className="info-label">Account Number:</span>
                    <span className="info-value">
                      {accountDetails.accountNumber}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Checked:</span>
                    <span className="info-value">
                      {accountDetails.lastChecked}
                    </span>
                  </div>
                </div>

                <div className="balance-footer">
                  <div className="balance-note">
                    <span className="note-icon">ℹ️</span>
                    <span>Balance is updated in real-time</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckBalance;
