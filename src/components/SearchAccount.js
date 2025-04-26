import axios from "axios";
import React from "react";
import { useState } from "react";
import { Button, Form, Row, Table } from "react-bootstrap";
import { getToken } from "./utils/DataStorage";

function AccountSearch() {
  const [customerId, setCustomerId] = useState("");
  const [accountList, setAccountList] = useState([]);

  const handleAccountSearch = async () => {
    try {
      console.log(customerId);
      const response = await axios.get(
        `http://localhost:8080/api/banking/accounts/${customerId}`,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log(response.data);
      setAccountList(response.data.data);
    } catch (error) {
      //setBalance("Error fetching balance.");
    }
  };

  return (
    <div>
      <h2>Search Account</h2>
      <Form className="container mt-5">
        <Row>
          <Form.Group className="mb-3" controlId="customerId">
            <Form.Control
              type="text"
              placeholder="Enter the customer id"
              name="customerId"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Button variant="primary" type="button" onClick={handleAccountSearch}>
          Search
        </Button>
      </Form>
      <div className="container mt-5">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Account Number</th>
              <th>Account Type</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {accountList.map((account, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{account.accountNumber}</td>
                <td>{account.accountType}</td>
                <td>{account.accountStatus}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default AccountSearch;
