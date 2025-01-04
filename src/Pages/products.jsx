import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import Product from "../components/product";
import styled from "styled-components";

const PageWrapper = styled.div``;
const ProductPage = () => {
    return(
        <PageWrapper>
        <Navbar/>
        <Product/>
        <Footer/>
        </PageWrapper>
    );
};

export default ProductPage;