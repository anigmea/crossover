import React, { useState, useEffect } from "react";
import styled from "styled-components";
import video1 from "../assets/videos/REEL 01 REPLACE.mp4";
import video2 from "../assets/videos/REEL 02.mp4";
import video3 from "../assets/videos/REEL 03.mp4";

const ReelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  background-color: white;
  overflow: hidden; /* Prevents scrolling */
  padding: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const Video = styled.video`
  width: 50%; /* Adjust the width of the video */
  height: 90%;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 90%; /* Make video smaller on mobile */
    height: auto; /* Auto height for mobile */
    margin-bottom: 20px; /* Add space between video and description on mobile */
  }
`;

const Description = styled.div`
  font-family: "Yeezy", sans-serif;
  color: #333;
  font-size: 20px;
  text-align: justify; /* Change text alignment to justify */
  margin-left: 30px; /* Space between description and video */
  padding-right: 10px;
  max-width: 40%; /* Adjust width of the description */
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;

  @media (max-width: 768px) {
    max-width: 90%; /* Make description take more width on mobile */
    margin-left: 0; /* Remove margin on mobile */
    padding: 10px;
  }
`;

const ReelVideoWrapper = () => {
  const videos = [video1, video2, video3]; // Array of video sources
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // State to track the currently playing video

  useEffect(() => {
    const videoElement = document.getElementById("video-player");

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex < videos.length - 1 ? prevIndex + 1 : 0
      );
    };

    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [videos.length]);

  return (
    <ReelWrapper>
      <Description>
        Crossover is a premium streetwear brand that stands out for its unwavering commitment to quality. Known for its meticulous craftsmanship and use of high-grade materials, the brand blends urban aesthetics with durability, offering timeless pieces that prioritize comfort and longevity. Each design embodies a perfect balance of functionality and style, appealing to those who value authenticity and superior construction in their everyday wear.
      </Description>
      <Video
        id="video-player"
        src={videos[currentVideoIndex]}
        autoPlay
        muted
        playsInline
      />
    </ReelWrapper>
  );
};

export default ReelVideoWrapper;
