import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom"; // Optional for redirecting after confirmation
import Navbar from "../components/navbar";

// Styled Components
const ConfirmationWrapper = styled.div`
  font-family: "Yeezy", sans-serif;
  text-align: center;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const ConfirmationMessage = styled.h1`
  font-size: 28px;
  color: #4caf50;
  margin-bottom: 20px;
`;

const OrderDetails = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: #555;
`;

const OrderID = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
`;

const BackToShopButton = styled.button`
  background-color: #000;
  color: #fff;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 30px;

  &:hover {
    background-color: #d48806;
  }
`;

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Optional for navigation
  const orderId = location.state?.orderId || "1234567890";
  const handleBackToShop = () => {
    navigate("/"); // Redirect to home or shop page
  };

  return (
    <ConfirmationWrapper>
        <Navbar/>
      <ConfirmationMessage>Order Placed Successfully!</ConfirmationMessage>
      <OrderDetails>
        Thank you for your purchase. Your order has been placed successfully. <br />
        <OrderID>Order ID: {orderId}</OrderID>
        You will receive a confirmation email shortly.
      </OrderDetails>
      <BackToShopButton onClick={handleBackToShop}>
        Back to Shop
      </BackToShopButton>
    </ConfirmationWrapper>
  );
};

export default ConfirmationPage;
