import { React, useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";
import useAuth from "../Pages/useAuth";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination } from 'swiper/modules';

// Styled Components
const PageWrapper = styled.div`
  font-family: "Yeezy", sans-serif;  
  padding: 20px;
  font-size: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 16px;
  }
`;

const Breadcrumbs = styled.div`
  font-size: 15px;
  margin-bottom: 20px;
  color: #555;
  a {
    text-decoration: none;
    color: #0073e6;
    &:hover {
      text-decoration: underline;
    }
  }
  padding-top: 10px;
`;

const ProductSection = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProductImage = styled.img`
  width: 30%;
  border-radius: 8px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 20%;
    margin-bottom: 20px;
    height: 20%;
  }
`;

const ProductDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const ProductTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ProductPrice = styled.p`
  font-size: 22px;
  color: #b12704;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const SizeSelector = styled.select`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 14px;
  width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    font-size: 16px;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  input {
    width: 50px;
    text-align: center;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const AddToCartButton = styled.button`
  background-color: #0046be;
  color: white;
  font-size: 16px;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 200px;
  
  &:hover {
    background-color: #003593;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 18px;
    padding: 12px 15px;
  }
`;

const Accordion = styled.div`
  margin-top: 30px;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const AccordionHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;

  &:hover{
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const AccordionContent = styled.div`
  padding: 10px;
  display: ${(props) => (props.open ? "block" : "none")};
  font-size: 14px;
  color: #555;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// Main Component
const Product = () => {
  const { user} = useAuth(); // Use the custom hook
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const value = queryParams.get('ProductID'); // Retrieve the value of a specific query parameter
  const [selectedSize, setSelectedSize] = useState(""); // Storing ProductSizeID
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState([]);
  const [accordionOpen, setAccordionOpen] = useState({ "details": false, care: false });
  const [hoveredImage, setHoveredImage] = useState(""); // New state for hovered image


  useEffect(() => {
    // Fetch data from the backend API
    axios.get(`https://crossover.in.net:8080/api/product?ProductID=${value}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, [value]);

  const addItemtoCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    
    // Now use selectedSize (ProductSizeID) to add to cart
    axios.post('https://crossover.in.net:8080/api/cart', {
      ProductSizeID: selectedSize, // Use the selected ProductSizeID
      Quantity: quantity,
      UserID: user // Assuming UserID is 1 for testing, modify as needed
    })
    .then(response => {
      console.log('Item added to cart:', response);
      alert("Item Added to the Cart");
    })
    .catch(error => {
      console.error('Error adding item to cart:', error);
    });
  };

  const handleImageHover = () => {
    setHoveredImage(data.BackImageURL); // Change the hovered image to BackImageURL
  };

  const handleImageLeave = () => {
    setHoveredImage(data.ImageURL); // Revert to the first image
  };

  return (
    <PageWrapper>
      <Breadcrumbs>
        {/* Add breadcrumb navigation here */}
      </Breadcrumbs>

      <ProductSection>
      <Swiper
        autoHeight={true}
        modules={[Pagination]}
        // autoplay={{
        //     delay: 2500, // Delay between transitions (in milliseconds)
        //     disableOnInteraction: false, // Keep autoplaying even after user interaction
        // }}
        spaceBetween={0}
        slidesPerView={1}
      >
        <SwiperSlide><ProductImage 
          src={`/images/${data.ImageURL}`} // Show hovered image or first image
          alt="Product Image"
          // onMouseEnter={handleImageHover} // Change image on hover
          // onMouseLeave={handleImageLeave} // Revert back when hover leaves
        /></SwiperSlide>
        <SwiperSlide><ProductImage 
          src={`/images/${data.BackImageURL}`} // Show hovered image or first image
          alt="Product Image"
          // onMouseEnter={handleImageHover} // Change image on hover
          // onMouseLeave={handleImageLeave} // Revert back when hover leaves
        /></SwiperSlide>
        {/* <SwiperSlide><IMAGE src={Carousel4}></IMAGE></SwiperSlide> */}
        ...
      </Swiper>
      
        <ProductDetails>
          <ProductTitle>{data.Name}</ProductTitle>
          <ProductPrice>₹{data.Price}</ProductPrice>

          {/* Size Selector */}
          <SizeSelector 
            onChange={(e) => {
              setSelectedSize(e.target.value); // Set the ProductSizeID here
            }} 
            defaultValue=""
          >
            <option value="" disabled>Select Size</option>
            {data.Sizes && data.Sizes.map((size, index) => (
              <option key={index} value={size.ProductSizeID}>
                {size.size} {/* Display the size name, but the value is the ProductSizeID */}
              </option>
            ))}
          </SizeSelector>

          {/* Quantity Selector */}
          <QuantitySelector>
            <span>Quantity:</span>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input type="number" value={quantity} readOnly />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </QuantitySelector>

          {/* Add to Cart */}
          <AddToCartButton onClick={addItemtoCart}>Add to Cart</AddToCartButton>

          <Accordion>
            <AccordionHeader onClick={() => setAccordionOpen((prev) => ({ ...prev, details: !prev.details }))}>
              Product Details
            </AccordionHeader>
            <AccordionContent open={accordionOpen.details}>
              Made from breathable jersey fabric, this T-shirt offers both comfort and style.
            </AccordionContent>

            <AccordionHeader onClick={() => setAccordionOpen((prev) => ({ ...prev, care: !prev.care }))}>
              Care Instructions
            </AccordionHeader>
            <AccordionContent open={accordionOpen.care}>
              Machine wash cold. Tumble dry low.
            </AccordionContent>
          </Accordion>
        </ProductDetails>
      </ProductSection>
    </PageWrapper>
  );
};

export default Product;
