import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { getToken } from "./utils/DataStorage";

function CreateCustomer() {
  const [message, setMessage] = useState("");
  const [states, setStates] = useState([]);
  const customer = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    father: "",
    mother: "",
    addresses: [
      {
        line1: "",
        line2: "",
        line3: "",
        state: null,
        postalCode: "",
        addressType: "CORRESPONDENCE_ADDRESS",
      },
      {
        line1: "",
        line2: "",
        line3: "",
        state: null,
        postalCode: "",
        addressType: "REGISTERED_ADDRESS",
      },
    ],
    identities: [{ identityType: "AADHAAR_CARD", identityNumber: "" }],
  };
  const [customerPayload, setCustomerPayload] = useState(customer);

  useEffect(() => {
    fetchStateData();
  }, []);

  const fetchStateData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/banking/addresses/states`,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      setStates(response.data.data);
    } catch (error) {
      setMessage("Failed to fetch states list");
    }
  };

  const clearPayload = () => {
    setCustomerPayload(customer);
  };

  const onCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerPayload({
      ...customerPayload,
      [name]: value,
    });
  };

  // Handle changes in address fields
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...customerPayload.addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [name]: value,
    };
    setCustomerPayload({
      ...customerPayload,
      addresses: updatedAddresses,
    });
  };

  // Handle changes in address fields
  const handleIdentityChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIdentities = [...customerPayload.identities];
    updatedIdentities[index] = {
      ...updatedIdentities[index],
      [name]: value,
    };
    setCustomerPayload({
      ...customerPayload,
      identities: updatedIdentities,
    });
  };

  // const addIdentity = () => {
  //   setCustomerPayload((prevCustomerPayload) => ({
  //     ...prevCustomerPayload,
  //     identities: [
  //       ...prevCustomerPayload.identities,
  //       { identityType: "", identityNumber: "" },
  //     ],
  //   }));
  // };

  const handleCreateCustomer = async () => {
    console.log("customer payload", customerPayload);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/banking/customers/create",
        customerPayload,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setMessage(
        `Customer created: ${response.data.data.firstName} ${response.data.data.lastName}`
      );
    } catch (error) {
      setMessage("Error creating customer.");
    }
  };

  return (
    <div>
      <h2>Create Customer</h2>
      <Form className="container mt-5">
        <Row>
          <Form.Label className="fw-bold">Customer Name</Form.Label>
          <Col>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                name="firstName"
                value={customerPayload.firstName}
                onChange={onCustomerChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3" controlId="middleName">
              <Form.Control
                type="text"
                placeholder="Enter Middle Name"
                name="middleName"
                value={customerPayload.middleName}
                onChange={onCustomerChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                name="lastName"
                value={customerPayload.lastName}
                onChange={onCustomerChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Form.Label className="fw-bold">Parents</Form.Label>
          <Col>
            <Form.Group className="mb-3" controlId="Father Name">
              <Form.Control
                type="text"
                placeholder="Enter Father's Name"
                name="father"
                value={customerPayload.father}
                onChange={onCustomerChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3" controlId="Mother Name">
              <Form.Control
                type="text"
                placeholder="Enter Mother's Name"
                name="mother"
                value={customerPayload.mother}
                onChange={onCustomerChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Form.Label className="fw-bold">Contact Details</Form.Label>
          <Col>
            <Form.Group className="mb-3" controlId="emailAddress">
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={customerPayload.email}
                onChange={onCustomerChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="Phone Number">
              <Form.Control
                type="text"
                placeholder="Enter Phone"
                name="phone"
                value={customerPayload.phone}
                onChange={onCustomerChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Label className="fw-bold">Address Details</Form.Label>
        {customerPayload.addresses.map((address, index) => (
          <div>
            <Form.Text className="fw-bold" style={{ fontStyle: "italic" }}>
              Address {index + 1}
            </Form.Text>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="Address Line1">
                  <Form.Control
                    type="text"
                    placeholder="Address Line1"
                    name="line1"
                    value={address.line1}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="Address Line2">
                  <Form.Control
                    type="text"
                    placeholder="Address Line2"
                    name="line2"
                    value={address.line2}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="Address Line3">
                  <Form.Control
                    type="text"
                    placeholder="Address Line3"
                    name="line3"
                    value={address.line3}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="Postal Code">
                  <Form.Control
                    type="text"
                    placeholder="Postal Code"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="State">
                  <Form.Select
                    placeholder="State"
                    name="state"
                    value={address.state}
                    onChange={(e) => handleAddressChange(index, e)}
                  >
                    <option value={null}>--Select State--</option>
                    {states.map((e, index) => (
                      <option key={index} value={e}>
                        {e}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="Address Type">
                  <Form.Control
                    type="text"
                    placeholder="Address Type"
                    name="addressType"
                    value={address.addressType}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        ))}
        <div>
          <Form.Label className="fw-bold">Identity Details</Form.Label>
          {customerPayload.identities.map((identity, index) => (
            <div>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="Identity Type">
                    <Form.Select
                      placeholder="Identity Type"
                      name="identityType"
                      value={identity.identityType}
                      onChange={(e) => handleIdentityChange(index, e)}
                    >
                      <option value="AADHAAR_CARD">AADHAAR_CARD</option>
                      <option value="PAN_CARD">PAN_CARD</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="Identity Number">
                    <Form.Control
                      type="text"
                      placeholder="Identity Number"
                      name="identityNumber"
                      value={identity.identityNumber}
                      onChange={(e) => handleIdentityChange(index, e)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          ))}
          {/* <button type="button" onClick={addIdentity}>
            Add Identity
          </button> */}
        </div>
        <Button variant="primary" onClick={handleCreateCustomer} type="button">
          Submit
        </Button>
        <Button variant="primary" onClick={clearPayload} type="button">
          Clear
        </Button>
      </Form>

      {/* <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleCreateCustomer}>Create Customer</button> */}
      <p>{message}</p>
    </div>
  );
}

export default CreateCustomer;
