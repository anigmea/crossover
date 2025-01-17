import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 5%;
  color: #000;
  font-family: "Yeezy", sans-serif;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 5%;
  }
`;

const SubscriptionWrapper = styled.div`
  flex: 1;
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 20px;
    text-align: center;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 20px;
  color: #555;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  font-size: 14px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #000;

  &::placeholder {
    color: #aaa;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 12px;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #000;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 12px;
  }
`;

const LinksWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-top: 20px;
  }
`;

const FooterLink = styled.a`
  font-size: 14px;
  color: #000;
  text-decoration: none;
  margin-left: 15px;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    margin-left: 10px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <SubscriptionWrapper>
        <Title>Subscribe to Our Newsletter</Title>
        <Subtitle>Be the first to know about new collections, releases, and exclusive offers.</Subtitle>
        <Form>
          <Input type="email" placeholder="Enter your email" required />
          <SubmitButton type="submit">Subscribe</SubmitButton>
        </Form>
      </SubscriptionWrapper>
      <LinksWrapper>
        <FooterLink href="#">India (INR ₹)</FooterLink>
        <FooterLink href="/#/Contact">Contact</FooterLink>
        <FooterLink href="https://merchant.razorpay.com/policy/PdhY2MxHzBpiTy/terms">Terms and Conditions</FooterLink>
        <FooterLink href="https://merchant.razorpay.com/policy/PdhY2MxHzBpiTy/refund">Cancellation Policy</FooterLink>
        <FooterLink href="https://merchant.razorpay.com/policy/PdhY2MxHzBpiTy/shipping">Shipping</FooterLink>
        <FooterLink href="#/Privacy">Privacy Policy</FooterLink>

        <FooterLink href="#">Social</FooterLink>
      </LinksWrapper>
    </FooterContainer>
  );
};

export default Footer;
