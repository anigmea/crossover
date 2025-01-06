import React from 'react';
import styled from "styled-components";
import men_collection from "../assets/images/Men_collection.JPG";
import woman_collection from "../assets/images/Women_collection.JPG";
import collection3 from "../assets/images/Collection3.JPG";

const PosterWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 2%;
    padding: 0% 1%;
    height: 100vh;
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const ImageLink = styled.a`
    text-decoration: none;
    color: white;
`;

const TextOverlay = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "Yeezy", sans-serif;
    color: white;
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    border-radius: 5px;
    padding-top: 175%;
    background-color: rgba(0, 0, 0, 0.4); /* Black background with 70% opacity */
`;

const Poster = () => {
    return (
        <PosterWrapper>
            <ImageLink href="#/Shop">
                <ImageContainer>
                    <Image src={men_collection} alt="Poster Image 1" />
                    <TextOverlay>SHOP</TextOverlay>
                </ImageContainer>
            </ImageLink>
            <ImageLink href="#/Shop">
                <ImageContainer>
                    <Image src={woman_collection} alt="Poster Image 2" />
                    <TextOverlay>CROSSOVER</TextOverlay>
                </ImageContainer>
            </ImageLink>
            <ImageLink href="#/Shop">
                <ImageContainer>
                    <Image src={collection3} alt="Poster Image 3" />
                    <TextOverlay>NOW</TextOverlay>
                </ImageContainer>
            </ImageLink>
        </PosterWrapper>
    );
};

export default Poster;
