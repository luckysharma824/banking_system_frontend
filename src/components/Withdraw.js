import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./utils/DataStorage";

function Withdraw() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
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
      alert(`Withdrawn: ${response.data.data.amount}`);
    } catch (error) {
      alert("Error withdrawing money.");
    }
  };

  return (
    <div>
      <h2>Withdraw Money</h2>
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
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
}

export default Withdraw;
