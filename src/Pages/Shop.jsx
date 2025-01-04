import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import ShopPage from "../components/Shop_items";

const DivWrapper = styled.div``;

const Shop = () => {
    return (
        <DivWrapper className="App">
          <Navbar />
          <ShopPage/>
          <Footer />
        </DivWrapper>
      );

};

export default Shop;