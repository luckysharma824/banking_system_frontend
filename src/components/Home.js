import React, { useContext } from "react";
import Login from "./Login";
import { MyContext } from "./utils/ContextProvider";

function Home() {
  const { isAuthenticated } = useContext(MyContext);

  return (
    <div className="background-home">
      <h1>Banking System</h1>
      {console.log(isAuthenticated)}
      {!isAuthenticated && <Login />}
    </div>
  );
}

export default Home;
