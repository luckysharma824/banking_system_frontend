import React, { useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { getToken } from "./utils/DataStorage";
import properties from "../properties.json";

function CreateAccount() {
  const [customerId, setcustomerId] = useState("");
  const [message, setMessage] = useState("");

  const account = {
    balance: 0,
    accountType: "SAVINGS",
    accountStatus: "ACTIVE",
  };

  const [accountPayload, setAccountPayload] = useState(account);

  const onAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountPayload({ ...accountPayload, [name]: value });
  };

  const handleCreateAccount = async () => {
    try {
      console.log("account Payload: ", accountPayload);
      const response = await axios.post(
        properties.createAccountUrl + customerId,
        accountPayload,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(
        `Account created with number: ${response.data.data.accountNumber}`
      );
    } catch (error) {
      setMessage("Error creating account.");
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <Form className="container mt-5">
        <Form.Group className="mb-3" controlId="customerId">
          <Form.Control
            type="text"
            placeholder="Enter Customer Id"
            name="customerId"
            value={customerId}
            onChange={(e) => setcustomerId(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="accountType">
          <Form.Select
            placeholder="Select Account Type"
            name="accountType"
            value={accountPayload.accountType}
            onChange={onAccountChange}
          >
            <option>SAVINGS</option>
            <option>CURRENT</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="accountStatus">
          <Form.Select
            placeholder="Select Account Status"
            name="accountStatus"
            value={accountPayload.accountStatus}
            onChange={onAccountChange}
          >
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="initialBalance">
          <Form.Control
            type="text"
            placeholder="Enter Balance"
            name="balance"
            value={accountPayload.balance}
            onChange={onAccountChange}
          />
        </Form.Group>

        <Button type="button" onClick={handleCreateAccount}>
          Create Account
        </Button>
      </Form>
      <p>{message}</p>
    </div>
  );
}

export default CreateAccount;
