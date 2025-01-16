import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Navbar from "./navbar";
import Footer from "./Footer";
import useAuth from "../Pages/useAuth";
import { use } from "react";


// Styled Components

const ChangePage = styled.div`
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #000;
  text-decoration: none;
  margin-bottom: 90px;
  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #000;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fff;
    color: black;
    border: 1px solid #000;
  }
`;

const InputBox = styled.input`
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #000;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #555;
    outline: none;
  }
`;

const Form = styled.form`
  max-width: 400px;
  margin: 20px auto;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    max-width: 90%;
    padding: 15px;
  }
`;

const DivWrapper = styled.div`
  font-family: "Yeezy", sans-serif;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
`;

const Label = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 40px;
  font-weight: bold;

  @media (max-width: 600px) {
    font-size: 30px;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: -10px;
`;

const SignUp = () => {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState(""); // For showing error messages
  const { user, loading, jwtToken } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Password match validation
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Password strength validation
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long and contain a number, uppercase letter, and a special character.");
      return;
    }

    setError(""); // Clear any previous error messages

    try {
      const user_check = user.replace(/^"|"$/g, "");
      const response = await axios.post(`https://crossover.in.net:8080/signup?userID=${user_check}`, formData);


      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error signing up");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Password strength validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  return (
    <DivWrapper>
      <Navbar />
      <Label>Sign Up</Label>
      <Form onSubmit={handleSubmit}>
        <NameWrapper>
          <InputBox
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <InputBox
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
        </NameWrapper>
        <InputBox
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <PasswordWrapper>
          <InputBox
            name="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <EyeIcon onClick={togglePasswordVisibility}>
            {passwordVisible ? "👁️" : "🙈"}
          </EyeIcon>
        </PasswordWrapper>
        <PasswordWrapper>
          <InputBox
            name="confirmPassword"
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
          <EyeIcon onClick={toggleConfirmPasswordVisibility}>
            {confirmPasswordVisible ? "👁️" : "🙈"}
          </EyeIcon>
        </PasswordWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Sign Up</Button>
      </Form>
      <ChangePage>
        <Link to="/login">Already have an account? Log in</Link>
      </ChangePage>
      <Footer />
    </DivWrapper>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://crossover.in.net:8080/login", formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error logging in");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <DivWrapper>
      <Navbar />
      <Label>Login</Label>
      <Form onSubmit={handleSubmit}>
        <InputBox
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <PasswordWrapper>
          <InputBox
            name="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <EyeIcon onClick={togglePasswordVisibility}>
            {passwordVisible ? "👁️" : "🙈"}
          </EyeIcon>
        </PasswordWrapper>
        <Button type="submit">Login</Button>
      </Form>
      <ChangePage>
        <Link to="/signup">Don't have an account? Sign up</Link>
      </ChangePage>
      <Footer />
    </DivWrapper>
  );
};

export { SignUp, Login };
