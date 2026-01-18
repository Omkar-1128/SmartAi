import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import axios from "axios";
import "./style.css";

function Signup() {
  const API_URL = import.meta.env.VITE_THREAD_API_URL;
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = inputValue;

  useEffect(() => {
    const checkAuth = async () => {
      if (cookies.token) {
        try {
          const { data } = await axios.post(
            `${API_URL}/`,
            {},
            { withCredentials: true },
          );
          if (data.status) {
            navigate("/Home");
          }
        } catch (error) {
          console.log("Auth check failed:", error);
        }
      }
    };
    checkAuth();
  }, [cookies, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_URL}/signup`,
        {
          ...inputValue,
          createdAt: new Date(),
        },
        { withCredentials: true },
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/Home");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
      handleError("Signup failed. Please try again.");
    }
    setInputValue({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="auth-container">
      <div className="form_container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            Already have an account? <Link to="/">Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
