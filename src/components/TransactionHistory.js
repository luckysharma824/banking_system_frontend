import React, { useState } from "react";
import axios from "axios";
import config from "../config/apiConfig";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [accountNumber, setAccountNumber] = useState("");

  // Filter options
  const [filterType, setFilterType] = useState("all");
  const [transactionType, setTransactionType] = useState("DEPOSIT");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.transactionHistoryUrl}${accountNumber}`
      );

      if (response.data.success) {
        setTransactions(response.data.data || []);
        setMessage({
          text: "Transaction history fetched successfully",
          type: "success",
        });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch transactions",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaginatedTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.transactionHistoryPaginatedUrl}${accountNumber}/paginated?page=${currentPage}&size=${pageSize}`
      );

      if (response.data.success) {
        const data = response.data.data;
        setTransactions(data.content || []);
        setTotalPages(data.totalPages || 0);
        setMessage({
          text: `Showing page ${currentPage + 1} of ${data.totalPages}`,
          type: "info",
        });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch transactions",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchByDateRange = async () => {
    if (!startDate || !endDate) {
      setMessage({
        text: "Please select both start and end dates",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${config.transactionHistoryByDateUrl}${accountNumber}/dateRange?startDate=${startDate}&endDate=${endDate}`
      );

      if (response.data.success) {
        setTransactions(response.data.data || []);
        setMessage({
          text: "Transactions filtered by date range",
          type: "success",
        });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch transactions",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchByType = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.transactionHistoryByTypeUrl}${accountNumber}/type/${transactionType}`
      );

      if (response.data.success) {
        setTransactions(response.data.data || []);
        setMessage({
          text: `${transactionType} transactions fetched`,
          type: "success",
        });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch transactions",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.getRecentTransactionsUrl}${accountNumber}?limit=20`
      );

      if (response.data.success) {
        setTransactions(response.data.data || []);
        setMessage({ text: "Recent transactions fetched", type: "success" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch transactions",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (!accountNumber) {
      setMessage({ text: "Please enter account number", type: "warning" });
      return;
    }

    switch (filterType) {
      case "all":
        fetchAllTransactions();
        break;
      case "paginated":
        fetchPaginatedTransactions();
        break;
      case "dateRange":
        fetchByDateRange();
        break;
      case "type":
        fetchByType();
        break;
      case "recent":
        fetchRecentTransactions();
        break;
      default:
        fetchAllTransactions();
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => fetchPaginatedTransactions(), 100);
  };

  const getTransactionTypeClass = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "badge-success";
      case "WITHDRAWAL":
        return "badge-danger";
      case "TRANSFER":
        return "badge-info";
      default:
        return "badge-primary";
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

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Transaction History</h2>
        </div>

        {renderMessage()}

        <div className="form-group">
          <label className="form-label">Account Number</label>
          <input
            type="text"
            className="form-control"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Filter Type</label>
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="recent">Recent Transactions (Last 20)</option>
            <option value="paginated">Paginated View</option>
            <option value="dateRange">By Date Range</option>
            <option value="type">By Transaction Type</option>
          </select>
        </div>

        {filterType === "paginated" && (
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Page Number</label>
              <input
                type="number"
                className="form-control"
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Page Size</label>
              <input
                type="number"
                className="form-control"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>
          </div>
        )}

        {filterType === "dateRange" && (
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {filterType === "type" && (
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <select
              className="form-select"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
        )}

        <button
          className="btn btn-primary btn-block"
          onClick={handleFetch}
          disabled={!accountNumber || loading}
        >
          {loading ? "Loading..." : "Fetch Transactions"}
        </button>

        {loading && <div className="spinner"></div>}

        {transactions.length > 0 ? (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date & Time</th>
                    <th>From Account</th>
                    <th>To Account</th>
                    <th>Balance</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.txnId}>
                      <td>{txn.txnId}</td>
                      <td>
                        <span
                          className={`badge ${getTransactionTypeClass(
                            txn.txnType
                          )}`}
                        >
                          {txn.txnType}
                        </span>
                      </td>
                      <td
                        style={{
                          color:
                            txn.txnType === "DEPOSIT"
                              ? "#27ae60"
                              : txn.txnType === "WITHDRAWAL"
                              ? "#e74c3c"
                              : "#3498db",
                          fontWeight: "bold",
                        }}
                      >
                        {txn.txnType === "WITHDRAWAL" ? "-" : "+"}₹
                        {txn.amount?.toLocaleString()}
                      </td>
                      <td>{new Date(txn.txnDate).toLocaleString()}</td>
                      <td>{txn.fromAccountNumber || "-"}</td>
                      <td>{txn.toAccountNumber || "-"}</td>
                      <td>₹{txn.balanceAfterTxn?.toLocaleString()}</td>
                      <td>{txn.description || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filterType === "paginated" && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                >
                  First
                </button>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <span style={{ padding: "0 15px", fontWeight: "bold" }}>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </button>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Last
                </button>
              </div>
            )}
          </>
        ) : (
          !loading &&
          accountNumber && (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p className="empty-state-text">No transactions found</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
