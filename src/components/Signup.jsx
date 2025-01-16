import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Navbar from "./navbar";
import Footer from "./Footer";


const ChangePage = styled.div`
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #000; /* Use black or a color with good contrast */
  text-decoration: none;
  margin-bottom: 90px;
  a {
    color: inherit; /* Ensures the link inherits the color */
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
  transition: all 0.3s ease; /* Smooth transition for hover effects */

  &:hover {
    background-color: #fff;
    color: black;
    border: 1px solid #000; /* Add border for hover state */
  }
`;

const InputBox = styled.input`
  width: calc(100% - 20px);
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #000;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s ease; /* Smooth transition for focus */

  &:focus {
    border-color: #555; /* Slightly lighter border on focus */
    outline: none;
  }
`;

const Form = styled.form`
  max-width: 400px;
  margin: 20px auto;
  background: #f9f9f9; /* Softer background */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DivWrapper = styled.div`
  font-family: "Yeezy", sans-serif;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4; /* Neutral background color */
`;

const Label = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333; /* Darker text for better contrast */
  font-size: 40px;
  font-weight: bold; /* Slightly bolder font for headings */
`;


const SignUp = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://68.183.92.7:8080/signup", formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error signing up");
    }
  };

  return (
    <DivWrapper>
      <Navbar/>
      <Label>Sign Up</Label>
      <Form onSubmit={handleSubmit}>
        <InputBox name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <InputBox name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <Button type="submit">Sign Up</Button>
      </Form>
      <ChangePage><Link to="/login">Already have an account? Log in</Link></ChangePage>
      <Footer/>
    </DivWrapper>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://68.183.92.7:8080/login", formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error logging in");
    }
  };

  return (
    <DivWrapper>
      <Navbar/>
      <Label>Login</Label>
      <Form onSubmit={handleSubmit}>
        <InputBox name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <InputBox name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <Button type="submit">Login</Button>
      </Form>
      <ChangePage><Link to="/signup">Don't have an account? Sign up</Link></ChangePage>
      <Footer/>
    </DivWrapper>
  );
};

export  {SignUp, Login};
