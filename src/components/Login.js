import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { savePermissions, saveToken } from "./utils/DataStorage";
import { MyContext } from "./utils/ContextProvider";
import properties from "../properties.json";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { setAuthenticated, setPermissions } = useContext(MyContext);

  const handleLogin = async () => {
    try {
      if (username === "" || password === "") {
        const error = {
          message: "Please enter username and password",
        };
        throw error;
      }
      const response = await axios.post(properties.userLoginUrl, {
        username,
        password,
      });

      console.log(response.data);
      saveToken(response.data.data.token);
      savePermissions(response.data.data.permissions);
      setAuthenticated(true);
      setPermissions(response.data.data.permissions);
      setMessage("Logged-In Now");
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }
  };

  return (
    <div>
      <Form className="container mt-5">
        <Form.Group className="mb-3" controlId="username">
          <Form.Control
            type="text"
            placeholder="Enter User Name"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Control
            type="password"
            placeholder="Enter Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="button" onClick={handleLogin}>
          Create Account
        </Button>
        <p>{message}</p>
      </Form>
    </div>
  );
};

export default Login;
