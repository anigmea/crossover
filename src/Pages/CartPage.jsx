import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import CartPage from "../components/Cart";
import styled from "styled-components";

const PageWrapper = styled.div``;

const Cart = () => {
    return(
        <PageWrapper>
            <Navbar/>
            <CartPage/>
            <Footer/>
        </PageWrapper>
    );
};

export default Cart;