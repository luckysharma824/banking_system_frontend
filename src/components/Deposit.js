import React, { useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { getToken } from "./utils/DataStorage";
import { Card, Button, Alert } from "../shared/components";

function Deposit() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleDeposit = async () => {
    if (!accountNumber.trim() || !amount) {
      setMessage({
        text: "Please enter account number and amount",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/banking/transactions/deposit?accountNumber=" +
          accountNumber +
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
        text: `Successfully deposited ₹${response.data.data.amount}`,
        type: "success",
      });
      // Reset form
      setAccountNumber("");
      setAmount("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error depositing money.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Card variant="elevated">
        <Card.Header>
          <h2>💰 Deposit Money</h2>
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
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
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
                variant="success"
                onClick={handleDeposit}
                loading={loading}
                disabled={loading || !accountNumber.trim() || !amount}
              >
                Deposit
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setAccountNumber("");
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

export default Deposit;
