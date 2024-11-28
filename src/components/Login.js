import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !otp) {
      setErrorMessage("Please enter both username and OTP");
      return;
    }

    try {
      // API request to login
      const response = await axios.post(
        "https://assignment.stage.crafto.app/login",
        {
          username,
          otp,
        }
      );

      // Check if login is successful and a token is received
      if (response.data && response.data.token) {
        // Store the token in localStorage
        localStorage.setItem("token", response.data.token);

        // Navigate to the Quote list page
        navigate("/quote-list");
      } else {
        setErrorMessage("Login failed: Invalid username or OTP");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label htmlFor="otp">OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
