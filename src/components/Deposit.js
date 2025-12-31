import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./utils/DataStorage";

function Deposit() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
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
      alert(`Deposited: ${response.data.data.amount}`);
    } catch (error) {
      console.log();
      const message = error.response.data.message
        ? error.response.data.message
        : "Error depositing money.";
      alert(message);
    }
  };

  return (
    <div>
      <h2>Deposit Money</h2>
      <input
        type="text"
        placeholder="Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
}

export default Deposit;
