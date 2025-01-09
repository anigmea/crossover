import {React, useState, useEffect} from "react";
import styled from "styled-components";
import axios from "axios";

// Sample image placeholders (Replace with actual image imports or URLs)
// import img2 from "../assets/images/img2.jpeg";
// import Carousel3 from "../assets/images/Carousel3.jpeg";


const PageWrapper = styled.div`
    font-family: "Yeezy", sans-serif;
    display: flex;
`;


const MainContent = styled.div`
    width: 100%;
    padding: 20px;
`;

const Banner = styled.div`
    width: 100%;
    height: 300px;
    background-color: #000; // Replace with actual banner image
    background-size: cover;
    background-position: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: bold;
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
    padding-top: 20px;
`;

const ProductCard = styled.div`
    background-color: #f4f4f4;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: "Yeezy", sans-serif;
`;

const ProductImage = styled.img`
    width: 100%;
    height: 500px;
    object-fit: cover;
`;

const ProductInfo = styled.div`
    padding: 10px;
`;

const ProductName = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
`;

const ProductPrice = styled.div`
    font-size: 14px;
    color: #666;
`;

const ProductLink = styled.a`
text-decoration: None;
`;

const ShopPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      // Fetch data from the backend API
      axios.get('https://crossover.in.net/api/data')
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error('There was an error fetching the data!', error);
        });
    }, []);


    return (
        <PageWrapper>
            <MainContent>
                <Banner>Shop Page</Banner>

                <ProductGrid>
                    {data.map((item) => (
                        <ProductLink href={`#/products?ProductID=${item.ProductID}`}>
                        <ProductCard key={item.ProductID}>
                        <ProductImage src={`/images/${item.ImageURL}`} alt={item.Name} />
                            <ProductInfo>
                                <ProductName>{item.Name}</ProductName>
                                <ProductPrice>₹{item.Price}</ProductPrice>
                            </ProductInfo>
                        </ProductCard>
                        </ProductLink>
                    ))}
                </ProductGrid>
            </MainContent>
        </PageWrapper>
    );
};

export default ShopPage;
