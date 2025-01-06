import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import Carousel from "../components/carousel";
import Footer from "../components/Footer";
import POSTER from "../components/poster";

const DivWrapper = styled.div``;

const Home = () => {
    return (
        <DivWrapper className="App">
          <Navbar style={{"position": "absolute", "color": "white"}} />
          <Carousel />
          <POSTER />
          <Footer />
        </DivWrapper>
      );

};

export default Home;