import React from "react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getToken } from "./utils/DataStorage";
import axios from "axios";

function CreateUser() {
  const [message, setMessage] = useState("");
  const [userRoles, setUserRoles] = useState([]);

  const user = {
    username: "",
    password: "",
    roles: [],
  };

  const [userData, setUserData] = useState(user);

  const onUserChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    console.log("onchange: ", userData);
  };

  const onRoleChange = (e) => {
    // const { name, value } = e.target;
    // const updateRole = [...userData.roles];
    // updateRole[index] = {
    //   ...updateRole[index],
    //   [name]: value,
    // };
    console.log(e);
    const selected = Array.from(e.target.selectedOptions, (option) => ({
      name: option.value,
    }));

    setUserData({
      ...userData,
      roles: selected,
    });
    console.log(userData);
  };

  // const handleRoles = (e) => {
  //   roles[0] = e.target.value;
  // };

  const fetchRoleData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/banking/users/roles`,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      setUserRoles(response.data.data);
    } catch (error) {
      setMessage("Failed to fetch states list");
    }
  };

  useEffect(() => {
    try {
      fetchRoleData();
    } catch (error) {}
  }, []);

  const handleUserChange = async () => {
    try {
      console.log("data:", userData);
      const response = await axios.post(
        "http://localhost:8080/api/banking/users/create",
        userData,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(`User ${response.data.data.username} created `);
    } catch (error) {
      setMessage("Error creating account.");
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <Form className="container mt-5">
        <Form.Group className="mb-3" controlId="username">
          <Form.Control
            type="text"
            placeholder="Enter User Name"
            name="username"
            value={userData.username}
            onChange={onUserChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Control
            type="password"
            placeholder="Enter Password"
            name="password"
            value={userData.password}
            onChange={onUserChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="user-role">
          <Form.Select
            multiple
            placeholder="Select User Roles"
            name="roles"
            onChange={onRoleChange}
          >
            {userRoles.map((e, index) => (
              <option key={index} value={e}>
                {e}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="button" onClick={handleUserChange}>
          Create User
        </Button>
      </Form>
      <p>{message}</p>
    </div>
  );
}

export default CreateUser;
