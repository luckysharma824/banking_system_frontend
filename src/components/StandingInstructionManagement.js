import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/apiConfig";

function StandingInstructionManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [accountNumber, setAccountNumber] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Standing instruction form
  const [siForm, setSiForm] = useState({
    fromAccountNumber: "",
    toAccountNumber: "",
    amount: "",
    frequency: "MONTHLY",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (accountNumber && activeTab === "list") {
      fetchInstructions();
    }
  }, [accountNumber, showActiveOnly]);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const url = showActiveOnly
        ? `${config.getActiveStandingInstructionsUrl}${accountNumber}/active`
        : `${config.getStandingInstructionsUrl}${accountNumber}`;

      const response = await axios.get(url);
      if (response.data.success) {
        setInstructions(response.data.data || []);
        setMessage({
          text: "Standing instructions fetched successfully",
          type: "success",
        });
      }
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          "Failed to fetch standing instructions",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstruction = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        config.createStandingInstructionUrl,
        siForm
      );

      if (response.data.success) {
        setMessage({
          text: "Standing instruction created successfully!",
          type: "success",
        });
        setSiForm({
          fromAccountNumber: "",
          toAccountNumber: "",
          amount: "",
          frequency: "MONTHLY",
          startDate: "",
          endDate: "",
          description: "",
        });
        setActiveTab("list");
      }
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          "Failed to create standing instruction",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePauseInstruction = async (instructionNumber) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${config.pauseStandingInstructionUrl}${instructionNumber}`
      );

      if (response.data.success) {
        setMessage({ text: "Standing instruction paused", type: "warning" });
        fetchInstructions();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to pause instruction",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeInstruction = async (instructionNumber) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${config.resumeStandingInstructionUrl}${instructionNumber}`
      );

      if (response.data.success) {
        setMessage({ text: "Standing instruction resumed", type: "success" });
        fetchInstructions();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to resume instruction",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInstruction = async (instructionNumber) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this standing instruction?"
      )
    )
      return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `${config.cancelStandingInstructionUrl}${instructionNumber}`
      );

      if (response.data.success) {
        setMessage({ text: "Standing instruction cancelled", type: "info" });
        fetchInstructions();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to cancel instruction",
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

  const renderCreateForm = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🔄 Create Standing Instruction</h2>
      </div>
      {renderMessage()}
      <form onSubmit={handleCreateInstruction}>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">From Account Number</label>
            <input
              type="text"
              className="form-control"
              value={siForm.fromAccountNumber}
              onChange={(e) =>
                setSiForm({ ...siForm, fromAccountNumber: e.target.value })
              }
              required
              placeholder="Enter your account number"
            />
          </div>
          <div className="form-group">
            <label className="form-label">To Account Number</label>
            <input
              type="text"
              className="form-control"
              value={siForm.toAccountNumber}
              onChange={(e) =>
                setSiForm({ ...siForm, toAccountNumber: e.target.value })
              }
              required
              placeholder="Enter beneficiary account number"
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={siForm.amount}
              onChange={(e) => setSiForm({ ...siForm, amount: e.target.value })}
              required
              placeholder="Enter amount"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select
              className="form-select"
              value={siForm.frequency}
              onChange={(e) =>
                setSiForm({ ...siForm, frequency: e.target.value })
              }
              required
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={siForm.startDate}
              onChange={(e) =>
                setSiForm({ ...siForm, startDate: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date (Optional)</label>
            <input
              type="date"
              className="form-control"
              value={siForm.endDate}
              onChange={(e) =>
                setSiForm({ ...siForm, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={siForm.description}
            onChange={(e) =>
              setSiForm({ ...siForm, description: e.target.value })
            }
            rows="3"
            placeholder="Enter description for this standing instruction"
          />
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Standing Instruction"}
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

  const renderInstructionList = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🔄 My Standing Instructions</h2>
      </div>
      {renderMessage()}

      <div className="form-group">
        <label className="form-label">Account Number</label>
        <input
          type="text"
          className="form-control"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter your account number"
        />
      </div>

      <div
        className="form-group"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <input
          type="checkbox"
          id="activeOnly"
          checked={showActiveOnly}
          onChange={(e) => setShowActiveOnly(e.target.checked)}
        />
        <label htmlFor="activeOnly" style={{ margin: 0, cursor: "pointer" }}>
          Show Active Only
        </label>
      </div>

      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={fetchInstructions}
          disabled={!accountNumber || loading}
        >
          {loading ? "Loading..." : "Fetch Instructions"}
        </button>
        <button
          className="btn btn-success"
          onClick={() => setActiveTab("create")}
        >
          Create New Instruction
        </button>
      </div>

      {loading && <div className="spinner"></div>}

      {instructions.length > 0 ? (
        <div className="grid grid-2">
          {instructions.map((si) => (
            <div
              key={si.instructionNumber}
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
                <h4 style={{ color: "#2c3e50" }}>SI-{si.instructionNumber}</h4>
                <span
                  className={`badge ${
                    si.status === "ACTIVE"
                      ? "badge-success"
                      : si.status === "PAUSED"
                      ? "badge-warning"
                      : "badge-danger"
                  }`}
                >
                  {si.status}
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <p>
                  <strong>From:</strong> {si.fromAccountNumber}
                </p>
                <p>
                  <strong>To:</strong> {si.toAccountNumber}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{si.amount?.toLocaleString()}
                </p>
                <p>
                  <strong>Frequency:</strong> {si.frequency}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(si.startDate).toLocaleDateString()}
                </p>
                {si.endDate && (
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(si.endDate).toLocaleDateString()}
                  </p>
                )}
                {si.nextExecutionDate && (
                  <p>
                    <strong>Next Execution:</strong>{" "}
                    {new Date(si.nextExecutionDate).toLocaleDateString()}
                  </p>
                )}
                {si.description && (
                  <p>
                    <strong>Description:</strong> {si.description}
                  </p>
                )}
              </div>

              <div className="btn-group">
                {si.status === "ACTIVE" && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handlePauseInstruction(si.instructionNumber)}
                  >
                    Pause
                  </button>
                )}
                {si.status === "PAUSED" && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      handleResumeInstruction(si.instructionNumber)
                    }
                  >
                    Resume
                  </button>
                )}
                {(si.status === "ACTIVE" || si.status === "PAUSED") && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleCancelInstruction(si.instructionNumber)
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        accountNumber && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">No standing instructions found</p>
          </div>
        )
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
          My Instructions
        </button>
        <button
          className={`tab ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create Instruction
        </button>
      </div>

      {activeTab === "list" && renderInstructionList()}
      {activeTab === "create" && renderCreateForm()}
    </div>
  );
}

export default StandingInstructionManagement;
