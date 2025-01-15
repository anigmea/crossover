import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import ShopPage from "../components/Shop_items";
import useAuth from "./useAuth";

const DivWrapper = styled.div``;

const Shop = () => {
  const { serverData, loading, error, jwtToken, isTokenLoaded } = useAuth(); // Use the custom hook

    return (
        <DivWrapper className="App">
          <Navbar />
          <ShopPage/>

          <Footer />
        </DivWrapper>
      );

};

export default Shop;