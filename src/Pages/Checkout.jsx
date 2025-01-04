import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import Checkout from "../components/checkout";
import Footer from "../components/Footer";

const DivWrapper = styled.div``;

const CheckoutPage = () => {
    return (
        <DivWrapper className="App">
          <Navbar />
          <Checkout />
          <Footer />
        </DivWrapper>
      );

};

export default CheckoutPage;