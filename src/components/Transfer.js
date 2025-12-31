import React, { useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { getToken } from "./utils/DataStorage";
import { Card, Button, Alert } from "../shared/components";

function Transfer() {
  const [fromAccountNumber, setFromAccountNumber] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleTransfer = async () => {
    if (!fromAccountNumber.trim() || !toAccountNumber.trim() || !amount) {
      setMessage({ text: "Please fill in all fields", type: "warning" });
      return;
    }

    if (fromAccountNumber === toAccountNumber) {
      setMessage({
        text: "From and To account numbers cannot be the same",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/banking/transactions/transfer?fromAccount=" +
          fromAccountNumber +
          "&toAccount=" +
          toAccountNumber +
          "&amount=" +
          parseFloat(amount),
        null,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      setMessage({
        text: `Transfer successful! Transaction ID: ${response.data.data}`,
        type: "success",
      });
      // Reset form
      setFromAccountNumber("");
      setToAccountNumber("");
      setAmount("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error transferring money.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Card variant="elevated">
        <Card.Header>
          <h2>🔄 Transfer Money</h2>
        </Card.Header>
        <Card.Body>
          {message.text && (
            <Alert
              variant={message.type}
              dismissible
              onClose={() => setMessage({ text: "", type: "" })}
            >
              {message.text}
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>From Account Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Source Account Number"
                value={fromAccountNumber}
                onChange={(e) => setFromAccountNumber(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>To Account Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Destination Account Number"
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                min="0"
                step="0.01"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleTransfer}
                loading={loading}
                disabled={
                  loading ||
                  !fromAccountNumber.trim() ||
                  !toAccountNumber.trim() ||
                  !amount
                }
              >
                Transfer
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setFromAccountNumber("");
                  setToAccountNumber("");
                  setAmount("");
                  setMessage({ text: "", type: "" });
                }}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Transfer;
