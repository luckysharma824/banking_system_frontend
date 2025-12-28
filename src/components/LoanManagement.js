import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/apiConfig";

function LoanManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [customerId, setCustomerId] = useState("");

  // Loan application form
  const [loanForm, setLoanForm] = useState({
    customerId: "",
    accountNumber: "",
    loanType: "PERSONAL",
    loanAmount: "",
    tenureMonths: "",
    interestRate: "",
    purpose: "",
  });

  // Loan payment form
  const [paymentForm, setPaymentForm] = useState({
    loanNumber: "",
    paymentAmount: "",
    paymentMethod: "ONLINE",
  });

  useEffect(() => {
    if (customerId && activeTab === "list") {
      fetchLoans();
    }
  }, [customerId]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.getLoansByCustomerUrl}${customerId}`
      );
      if (response.data.success) {
        setLoans(response.data.data || []);
        setMessage({ text: "Loans fetched successfully", type: "success" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch loans",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanDetails = async (loanNumber) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.getLoanDetailsUrl}${loanNumber}`
      );
      if (response.data.success) {
        setSelectedLoan(response.data.data);
        fetchPaymentHistory(loanNumber);
        setActiveTab("details");
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch loan details",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async (loanNumber) => {
    try {
      const response = await axios.get(
        `${config.getLoanPaymentHistoryUrl}${loanNumber}`
      );
      if (response.data.success) {
        setPaymentHistory(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    }
  };

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(config.applyLoanUrl, loanForm);

      if (response.data.success) {
        setMessage({
          text: "Loan application submitted successfully!",
          type: "success",
        });
        setLoanForm({
          customerId: "",
          accountNumber: "",
          loanType: "PERSONAL",
          loanAmount: "",
          tenureMonths: "",
          interestRate: "",
          purpose: "",
        });
        setActiveTab("list");
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to apply for loan",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${config.makeLoanPaymentUrl}${paymentForm.loanNumber}`,
        {
          paymentAmount: paymentForm.paymentAmount,
          paymentMethod: paymentForm.paymentMethod,
        }
      );

      if (response.data.success) {
        setMessage({ text: "Payment made successfully!", type: "success" });
        setPaymentForm({
          loanNumber: "",
          paymentAmount: "",
          paymentMethod: "ONLINE",
        });
        if (selectedLoan) {
          fetchLoanDetails(selectedLoan.loanNumber);
        }
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to make payment",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLoan = async (loanNumber) => {
    try {
      setLoading(true);
      const response = await axios.put(`${config.approveLoanUrl}${loanNumber}`);

      if (response.data.success) {
        setMessage({ text: "Loan approved successfully!", type: "success" });
        fetchLoans();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to approve loan",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectLoan = async (loanNumber) => {
    if (!window.confirm("Are you sure you want to reject this loan?")) return;

    try {
      setLoading(true);
      const response = await axios.put(`${config.rejectLoanUrl}${loanNumber}`);

      if (response.data.success) {
        setMessage({ text: "Loan rejected", type: "warning" });
        fetchLoans();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to reject loan",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisburseLoan = async (loanNumber) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${config.disburseLoanUrl}${loanNumber}`
      );

      if (response.data.success) {
        setMessage({ text: "Loan disbursed successfully!", type: "success" });
        fetchLoans();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to disburse loan",
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

  const renderLoanApplication = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <span role="img" aria-label="memo">
            📝
          </span>{" "}
          Apply for Loan
        </h2>
      </div>
      {renderMessage()}
      <form onSubmit={handleApplyLoan}>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Customer ID</label>
            <input
              type="text"
              className="form-control"
              value={loanForm.customerId}
              onChange={(e) =>
                setLoanForm({ ...loanForm, customerId: e.target.value })
              }
              required
              placeholder="Enter customer ID"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Account Number</label>
            <input
              type="text"
              className="form-control"
              value={loanForm.accountNumber}
              onChange={(e) =>
                setLoanForm({ ...loanForm, accountNumber: e.target.value })
              }
              required
              placeholder="Enter account number"
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Loan Type</label>
            <select
              className="form-select"
              value={loanForm.loanType}
              onChange={(e) =>
                setLoanForm({ ...loanForm, loanType: e.target.value })
              }
              required
            >
              <option value="PERSONAL">Personal Loan</option>
              <option value="HOME">Home Loan</option>
              <option value="CAR">Car Loan</option>
              <option value="EDUCATION">Education Loan</option>
              <option value="BUSINESS">Business Loan</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Loan Amount</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={loanForm.loanAmount}
              onChange={(e) =>
                setLoanForm({ ...loanForm, loanAmount: e.target.value })
              }
              required
              placeholder="Enter loan amount"
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Tenure (Months)</label>
            <input
              type="number"
              className="form-control"
              value={loanForm.tenureMonths}
              onChange={(e) =>
                setLoanForm({ ...loanForm, tenureMonths: e.target.value })
              }
              required
              placeholder="Enter tenure in months"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={loanForm.interestRate}
              onChange={(e) =>
                setLoanForm({ ...loanForm, interestRate: e.target.value })
              }
              required
              placeholder="Enter interest rate"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Purpose</label>
          <textarea
            className="form-control"
            value={loanForm.purpose}
            onChange={(e) =>
              setLoanForm({ ...loanForm, purpose: e.target.value })
            }
            required
            rows="3"
            placeholder="Enter loan purpose"
          />
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Apply for Loan"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab("list")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderLoanList = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <span role="img" aria-label="money bag">
            💰
          </span>{" "}
          My Loans
        </h2>
      </div>
      {renderMessage()}

      <div className="form-group">
        <label className="form-label">Customer ID</label>
        <input
          type="text"
          className="form-control"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Enter customer ID to view loans"
        />
      </div>

      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={fetchLoans}
          disabled={!customerId || loading}
        >
          {loading ? "Loading..." : "Fetch Loans"}
        </button>
        <button
          className="btn btn-success"
          onClick={() => setActiveTab("apply")}
        >
          Apply for New Loan
        </button>
      </div>

      {loading && <div className="spinner"></div>}

      {loans.length > 0 ? (
        <div className="grid grid-2">
          {loans.map((loan) => (
            <div key={loan.loanNumber} className="stats-card">
              <h3 style={{ color: "#2c3e50", marginBottom: "10px" }}>
                {loan.loanType} Loan
              </h3>
              <p>
                <strong>Loan Number:</strong> {loan.loanNumber}
              </p>
              <p>
                <strong>Amount:</strong> ₹{loan.loanAmount?.toLocaleString()}
              </p>
              <p>
                <strong>Outstanding:</strong> ₹
                {loan.outstandingAmount?.toLocaleString()}
              </p>
              <p>
                <strong>EMI:</strong> ₹{loan.emiAmount?.toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    loan.loanStatus === "APPROVED"
                      ? "badge-success"
                      : loan.loanStatus === "PENDING"
                      ? "badge-warning"
                      : loan.loanStatus === "REJECTED"
                      ? "badge-danger"
                      : "badge-primary"
                  }`}
                >
                  {loan.loanStatus}
                </span>
              </p>
              <div className="btn-group" style={{ marginTop: "15px" }}>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => fetchLoanDetails(loan.loanNumber)}
                >
                  View Details
                </button>
                {loan.loanStatus === "PENDING" && (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApproveLoan(loan.loanNumber)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRejectLoan(loan.loanNumber)}
                    >
                      Reject
                    </button>
                  </>
                )}
                {loan.loanStatus === "APPROVED" && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDisburseLoan(loan.loanNumber)}
                  >
                    Disburse
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        customerId && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <span role="img" aria-label="clipboard">
                📋
              </span>
            </div>
            <p className="empty-state-text">No loans found</p>
          </div>
        )
      )}
    </div>
  );

  const renderLoanDetails = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <span role="img" aria-label="bar chart">
            📊
          </span>{" "}
          Loan Details
        </h2>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveTab("list")}
        >
          Back to List
        </button>
      </div>
      {renderMessage()}

      {selectedLoan && (
        <>
          <div className="grid grid-3">
            <div className="stats-card">
              <div className="stats-label">Loan Amount</div>
              <div className="stats-value">
                ₹{selectedLoan.loanAmount?.toLocaleString()}
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-label">Outstanding</div>
              <div className="stats-value">
                ₹{selectedLoan.outstandingAmount?.toLocaleString()}
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-label">EMI Amount</div>
              <div className="stats-value">
                ₹{selectedLoan.emiAmount?.toLocaleString()}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Loan Information</h3>
            <div className="grid grid-2">
              <p>
                <strong>Loan Number:</strong> {selectedLoan.loanNumber}
              </p>
              <p>
                <strong>Type:</strong> {selectedLoan.loanType}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    selectedLoan.loanStatus === "APPROVED"
                      ? "badge-success"
                      : selectedLoan.loanStatus === "PENDING"
                      ? "badge-warning"
                      : "badge-primary"
                  }`}
                >
                  {selectedLoan.loanStatus}
                </span>
              </p>
              <p>
                <strong>Interest Rate:</strong> {selectedLoan.interestRate}%
              </p>
              <p>
                <strong>Tenure:</strong> {selectedLoan.tenureMonths} months
              </p>
              <p>
                <strong>Application Date:</strong>{" "}
                {new Date(selectedLoan.applicationDate).toLocaleDateString()}
              </p>
            </div>
            <p>
              <strong>Purpose:</strong> {selectedLoan.purpose}
            </p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "15px" }}>Make Payment</h3>
            <form
              onSubmit={handleMakePayment}
              style={{
                padding: "20px",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
              }}
            >
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Loan Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentForm.loanNumber || selectedLoan.loanNumber}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        loanNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={paymentForm.paymentAmount}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentAmount: e.target.value,
                      })
                    }
                    required
                    placeholder={`EMI Amount: ₹${selectedLoan.emiAmount}`}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMethod: e.target.value,
                    })
                  }
                >
                  <option value="ONLINE">Online</option>
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Processing..." : "Make Payment"}
              </button>
            </form>
          </div>

          {paymentHistory.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ marginBottom: "15px" }}>Payment History</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment) => (
                      <tr key={payment.paymentId}>
                        <td>{payment.paymentId}</td>
                        <td>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td>₹{payment.paymentAmount?.toLocaleString()}</td>
                        <td>{payment.paymentMethod}</td>
                        <td>
                          <span className="badge badge-success">
                            {payment.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          My Loans
        </button>
        <button
          className={`tab ${activeTab === "apply" ? "active" : ""}`}
          onClick={() => setActiveTab("apply")}
        >
          Apply for Loan
        </button>
        {activeTab === "details" && (
          <button className="tab active">Loan Details</button>
        )}
      </div>

      {activeTab === "list" && renderLoanList()}
      {activeTab === "apply" && renderLoanApplication()}
      {activeTab === "details" && renderLoanDetails()}
    </div>
  );
}

export default LoanManagement;
