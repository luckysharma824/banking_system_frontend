import React, { useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { getToken } from "./utils/DataStorage";
import { Card, Button, Alert } from "../shared/components";

function Withdraw() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleWithdraw = async () => {
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
        "http://localhost:8080/api/banking/transactions/withdraw?accountNumber=" +
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
        text: `Successfully withdrawn ₹${response.data.data.amount}`,
        type: "success",
      });
      // Reset form
      setAccountNumber("");
      setAmount("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error withdrawing money.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Card variant="elevated">
        <Card.Header>
          <h2>💸 Withdraw Money</h2>
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
                variant="warning"
                onClick={handleWithdraw}
                loading={loading}
                disabled={loading || !accountNumber.trim() || !amount}
              >
                Withdraw
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

export default Withdraw;
