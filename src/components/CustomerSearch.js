import axios from "axios";
import React from "react";
import { useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { getToken } from "./utils/DataStorage";

function CustomerSearch() {
  const [clause, setClause] = useState("value%");
  const [query, setQuery] = useState("name");
  const [value, setValue] = useState("");
  const [customerList, setCustomerList] = useState([]);

  const handleCustomerSearch = async () => {
    try {
      const updatedValue = clause.replace("value", value);
      console.log(updatedValue);
      console.log("search payload: ", query + " : " + value);
      console.log("search payload: ", clause);
      const response = await axios.get(
        `http://localhost:8080/api/banking/customers/search?query=` +
          query +
          `&value=` +
          encodeURIComponent(updatedValue),
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log(response.data);
      setCustomerList(response.data.data);
    } catch (error) {
      //setBalance("Error fetching balance.");
    }
  };

  return (
    <div>
      <h2>Customer Search</h2>
      <Form className="container mt-5">
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="query">
              <Form.Select
                placeholder="Select Field"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="clause">
              <Form.Select
                placeholder="Select Search Type"
                onChange={(e) => setClause(e.target.value)}
              >
                <option value={`value%`}>Start With</option>
                <option value={`%value`}>Ends With</option>
                <option value={`%value%`}>Contains</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="value">
              <Form.Control
                type="text"
                placeholder="Enter the text"
                name="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="button" onClick={handleCustomerSearch}>
          Search
        </Button>
      </Form>
      <div className="container mt-5">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Customer Id</th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((customer, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {customer.firstName} {customer.middleName} {customer.lastName}
                </td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.customerId}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CustomerSearch;
