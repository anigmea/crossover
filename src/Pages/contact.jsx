import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import axios from "axios"; // Make sure axios is installed

const ContactWrapper = styled.div``;

const ContactText = styled.div`
  margin: 5% 25%;
  display: grid;
  grid-template-rows: 1fr;
  font-family: "yeezy", sans-serif;
  font-size: 18px;
`;

const CONTACTFORM = styled.form`  /* Use form tag here */
  display: grid;
  grid-gap: 20px;
`;

const CONTACTFORMLINK = styled.input`
  margin: 1% 2%;
  height: 80%;
  width: 100%;
  border-radius: 0px;
  font-family: "Yeezy", sans-serif;
  padding: 6px;
  border: 0.5px solid grey;
  outline-style: solid;
  outline-color: black;
  outline-width: 0.5px;
`;

const CONTACTFORMtextArea = styled.textarea`
  margin: 1% 2%;
  height: 100px;
  width: 100%;
  border-radius: 0px;
  font-family: "Yeezy", sans-serif;
  padding: 6px;
  border: 0.5px solid grey;
  outline-style: solid;
  outline-color: black;
  outline-width: 0.5px;
`;

const CONTACTFORMBUTTON = styled.button`
  margin: 1% 2%;
  height: 80%;
  width: 100%;
  border-radius: 0px;
  font-family: "Yeezy", sans-serif;
  border: 0.5px solid grey;
  outline-style: solid;
  outline-color: black;
  outline-width: 0.5px;
  padding: 6px;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    reason: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    console.log("Form Data:", formData); // Log form data to make sure it's being captured
  
    try {
      const response = await axios.post("https://localhost:8080/api/contact", formData);
      console.log("API Response:", response); // Log response from backend
      if (response.data.success) {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <ContactWrapper>
      <Navbar />
      <ContactText>
        <p>CONTACT</p>
        <p>SEND US A MESSAGE</p>
        {/* Use onSubmit on the form */}
        <CONTACTFORM onSubmit={handleSubmit}>
          <CONTACTFORMLINK
            type="text"
            name="name"
            placeholder="NAME"
            value={formData.name}
            onChange={handleChange}
          />
          <CONTACTFORMLINK
            type="text"
            name="reason"
            placeholder="REASON"
            value={formData.reason}
            onChange={handleChange}
          />
          <CONTACTFORMLINK
            type="text"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
            onChange={handleChange}
          />
          <CONTACTFORMtextArea
            name="message"
            placeholder="MESSAGE"
            value={formData.message}
            onChange={handleChange}
          />
          <CONTACTFORMBUTTON type="submit">SUBMIT</CONTACTFORMBUTTON>
        </CONTACTFORM>
      </ContactText>
      <Footer />
    </ContactWrapper>
  );
};

export default Contact;
