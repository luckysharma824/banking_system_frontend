import React, { useContext, useEffect } from "react";
import Login from "./Login";
import { MyContext } from "./utils/ContextProvider";
import { Link } from "react-router-dom";

function Home() {
  const { isAuthenticated, userInfo } = useContext(MyContext);

  useEffect(() => {
    console.log("Home - isAuthenticated:", isAuthenticated);
    console.log("Home - userInfo:", userInfo);
  }, [isAuthenticated, userInfo]);

  return (
    <div className="background-home">
      <h1>Banking System</h1>
      {!isAuthenticated ? (
        <Login />
      ) : (
        <div className="container" style={{ marginTop: "50px" }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                Welcome, {userInfo?.fullName || userInfo?.username || "User"}!
              </h2>
            </div>
            <div style={{ padding: "30px" }}>
              <p style={{ fontSize: "18px", marginBottom: "30px" }}>
                You are successfully logged in to the Banking System.
              </p>

              {userInfo?.roles && userInfo.roles.length > 0 && (
                <div style={{ marginBottom: "30px" }}>
                  <h4>Your Roles:</h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {userInfo.roles.map((role, index) => (
                      <span
                        key={index}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "20px",
                          background: "#0d6efd",
                          color: "white",
                          fontWeight: "500",
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="btn-group">
                <Link to="/profile" className="btn btn-primary">
                  View My Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
