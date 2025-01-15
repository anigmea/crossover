// Home.js
import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import Carousel from "../components/carousel";
import Footer from "../components/Footer";
import POSTER from "../components/poster";
import useAuth from "./useAuth"; // Import the custom hook for authentication and data fetching

const DivWrapper = styled.div``;

const Home = () => {
  const { serverData, loading, error, jwtToken, isTokenLoaded } = useAuth(); // Use the custom hook

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message if there's an issue
  }

  return (
    <DivWrapper className="App">
      <Navbar style={{ position: "absolute", color: "white" }} />
      <Carousel />
      <POSTER />
      <Footer />
    </DivWrapper>
  );
};

export default Home;
