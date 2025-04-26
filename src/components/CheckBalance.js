import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./utils/DataStorage";
import properties from "../properties.json";

function CheckBalance() {
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState(null);

  const handleCheckBalance = async () => {
    try {
      const response = await axios.get(
        `${properties.balanceCheckUrl}/${accountNumber}`,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        }
      );
      setBalance(response.data.data);
    } catch (error) {
      setBalance("Error fetching balance.");
    }
  };

  return (
    <div>
      <h2>Check Balance</h2>
      <input
        type="text"
        placeholder="Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />
      <button onClick={handleCheckBalance}>Check Balance</button>
      {balance !== null && <p>Balance: {balance}</p>}
    </div>
  );
}

export default CheckBalance;
