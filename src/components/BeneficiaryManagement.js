import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/apiConfig";

function BeneficiaryManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [accountNumber, setAccountNumber] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Form states for adding/editing beneficiary
  const [beneficiaryForm, setBeneficiaryForm] = useState({
    accountNumber: "",
    beneficiaryName: "",
    beneficiaryAccountNumber: "",
    beneficiaryIfsc: "",
    beneficiaryBank: "",
    nickName: "",
  });

  const [editingBeneficiary, setEditingBeneficiary] = useState(null);

  useEffect(() => {
    if (accountNumber && activeTab === "list") {
      fetchBeneficiaries();
    }
  }, [accountNumber, showActiveOnly]);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const url = showActiveOnly
        ? `${config.getActiveBeneficiariesUrl}${accountNumber}/active`
        : `${config.getBeneficiariesUrl}${accountNumber}`;

      const response = await axios.get(url);
      if (response.data.success) {
        setBeneficiaries(response.data.data || []);
        setMessage({ text: response.data.message, type: "success" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to fetch beneficiaries",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        config.addBeneficiaryUrl,
        beneficiaryForm
      );

      if (response.data.success) {
        setMessage({
          text: "Beneficiary added successfully!",
          type: "success",
        });
        setBeneficiaryForm({
          accountNumber: "",
          beneficiaryName: "",
          beneficiaryAccountNumber: "",
          beneficiaryIfsc: "",
          beneficiaryBank: "",
          nickName: "",
        });
        setActiveTab("list");
        if (accountNumber) fetchBeneficiaries();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to add beneficiary",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBeneficiary = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${config.updateBeneficiaryUrl}${editingBeneficiary.beneficiaryId}`,
        editingBeneficiary
      );

      if (response.data.success) {
        setMessage({
          text: "Beneficiary updated successfully!",
          type: "success",
        });
        setEditingBeneficiary(null);
        setActiveTab("list");
        fetchBeneficiaries();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to update beneficiary",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBeneficiary = async (beneficiaryId) => {
    if (!window.confirm("Are you sure you want to delete this beneficiary?"))
      return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `${config.deleteBeneficiaryUrl}${beneficiaryId}`
      );

      if (response.data.success) {
        setMessage({
          text: "Beneficiary deleted successfully!",
          type: "success",
        });
        fetchBeneficiaries();
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to delete beneficiary",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (beneficiary) => {
    setEditingBeneficiary({ ...beneficiary });
    setActiveTab("edit");
  };

  const renderMessage = () => {
    if (!message.text) return null;
    return (
      <div className={`alert alert-${message.type}`} role="alert">
        {message.text}
      </div>
    );
  };

  const renderAddForm = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">➕ Add New Beneficiary</h2>
      </div>
      {renderMessage()}
      <form onSubmit={handleAddBeneficiary}>
        <div className="form-group">
          <label className="form-label">Your Account Number</label>
          <input
            type="text"
            className="form-control"
            value={beneficiaryForm.accountNumber}
            onChange={(e) =>
              setBeneficiaryForm({
                ...beneficiaryForm,
                accountNumber: e.target.value,
              })
            }
            required
            placeholder="Enter your account number"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Beneficiary Name</label>
          <input
            type="text"
            className="form-control"
            value={beneficiaryForm.beneficiaryName}
            onChange={(e) =>
              setBeneficiaryForm({
                ...beneficiaryForm,
                beneficiaryName: e.target.value,
              })
            }
            required
            placeholder="Enter beneficiary full name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Beneficiary Account Number</label>
          <input
            type="text"
            className="form-control"
            value={beneficiaryForm.beneficiaryAccountNumber}
            onChange={(e) =>
              setBeneficiaryForm({
                ...beneficiaryForm,
                beneficiaryAccountNumber: e.target.value,
              })
            }
            required
            placeholder="Enter beneficiary account number"
          />
        </div>
        <div className="form-group">
          <label className="form-label">IFSC Code</label>
          <input
            type="text"
            className="form-control"
            value={beneficiaryForm.beneficiaryIfsc}
            onChange={(e) =>
              setBeneficiaryForm({
                ...beneficiaryForm,
                beneficiaryIfsc: e.target.value,
              })
            }
            required
            placeholder="Enter IFSC code"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Bank Name</label>
          <input
            type="text"
            className="form-control"
            value={beneficiaryForm.beneficiaryBank}
            onChange={(e) =>
              setBeneficiaryForm({
                ...beneficiaryForm,
                beneficiaryBank: e.target.value,
              })
            }
            required
            placeholder="Enter bank name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Nick Name (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={beneficiaryForm.nickName}
            onChange={(e) =>
              setBeneficiaryForm({
                ...beneficiaryForm,
                nickName: e.target.value,
              })
            }
            placeholder="Enter a nick name for easy identification"
          />
        </div>
        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Beneficiary"}
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

  const renderEditForm = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">✏️ Edit Beneficiary</h2>
      </div>
      {renderMessage()}
      <form onSubmit={handleUpdateBeneficiary}>
        <div className="form-group">
          <label className="form-label">Beneficiary Name</label>
          <input
            type="text"
            className="form-control"
            value={editingBeneficiary.beneficiaryName}
            onChange={(e) =>
              setEditingBeneficiary({
                ...editingBeneficiary,
                beneficiaryName: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Nick Name</label>
          <input
            type="text"
            className="form-control"
            value={editingBeneficiary.nickName || ""}
            onChange={(e) =>
              setEditingBeneficiary({
                ...editingBeneficiary,
                nickName: e.target.value,
              })
            }
            placeholder="Enter a nick name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={editingBeneficiary.active ? "true" : "false"}
            onChange={(e) =>
              setEditingBeneficiary({
                ...editingBeneficiary,
                active: e.target.value === "true",
              })
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="btn-group">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Updating..." : "Update Beneficiary"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditingBeneficiary(null);
              setActiveTab("list");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderList = () => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">👥 My Beneficiaries</h2>
      </div>
      {renderMessage()}

      <div className="form-group">
        <label className="form-label">Account Number</label>
        <input
          type="text"
          className="form-control"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter your account number to view beneficiaries"
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
          onClick={fetchBeneficiaries}
          disabled={!accountNumber || loading}
        >
          {loading ? "Loading..." : "Fetch Beneficiaries"}
        </button>
        <button className="btn btn-success" onClick={() => setActiveTab("add")}>
          Add New Beneficiary
        </button>
      </div>

      {loading && <div className="spinner"></div>}

      {beneficiaries.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Nick Name</th>
                <th>Account Number</th>
                <th>IFSC</th>
                <th>Bank</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((ben) => (
                <tr key={ben.beneficiaryId}>
                  <td>{ben.beneficiaryId}</td>
                  <td>{ben.beneficiaryName}</td>
                  <td>{ben.nickName || "-"}</td>
                  <td>{ben.beneficiaryAccountNumber}</td>
                  <td>{ben.beneficiaryIfsc}</td>
                  <td>{ben.beneficiaryBank}</td>
                  <td>
                    <span
                      className={`badge ${
                        ben.active ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {ben.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => startEdit(ben)}
                      style={{ marginRight: "8px" }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteBeneficiary(ben.beneficiaryId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        accountNumber && (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">No beneficiaries found</p>
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
          Beneficiaries List
        </button>
        <button
          className={`tab ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Beneficiary
        </button>
      </div>

      {activeTab === "list" && renderList()}
      {activeTab === "add" && renderAddForm()}
      {activeTab === "edit" && editingBeneficiary && renderEditForm()}
    </div>
  );
}

export default BeneficiaryManagement;
