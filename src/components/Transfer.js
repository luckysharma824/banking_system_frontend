import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./utils/DataStorage";

function Transfer() {
  const [fromAccountNumber, setFromAccountNumber] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
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
      alert(`Money transfered, txn Id: ${response.data.data}`);
    } catch (error) {
      alert("Error transfering money.");
    }
  };

  return (
    <div>
      <h2>Transfer Money</h2>
      <input
        type="text"
        placeholder="From Account Number"
        value={fromAccountNumber}
        onChange={(e) => setFromAccountNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="To Account Number"
        value={toAccountNumber}
        onChange={(e) => setToAccountNumber(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

export default Transfer;
