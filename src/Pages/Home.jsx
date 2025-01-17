import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import Carousel from "../components/carousel";
import Footer from "../components/Footer";
import POSTER from "../components/poster";
import useAuth from "./useAuth"; // Import the custom hook for authentication
import ReelVideoWrapper from "../components/Reel"
const DivWrapper = styled.div``;

const Home = () => {
  const { user, loading, error, jwtToken } = useAuth(); // Use the custom hook

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message if there's an issue
  }

  return (
    <DivWrapper className="App">
      <Navbar style={{ position: "absolute", color: "white" }} />
      <Carousel />
      <POSTER />
      <ReelVideoWrapper/>
      {/* Example of displaying fetched user data
      {user && (
        <div>
          <h2>Welcome, User ID: {user}</h2>
        </div>
      )}

      {jwtToken && <p>JWT Token: {jwtToken}</p>} */}

      <Footer />
    </DivWrapper>
  );
};

export default Home;
