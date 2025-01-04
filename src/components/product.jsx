import {React, useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";




// Styled Components
const PageWrapper = styled.div`
font-family: "Bebas Neue", sans-serif;  
  padding: 20px;
  font-size: 20px;
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
`;

const ProductImage = styled.img`
  width: 50%;
  border-radius: 8px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
`;

const ProductPrice = styled.p`
  font-size: 22px;
  color: #b12704;
  margin-bottom: 20px;
`;

const SwatchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Swatch = styled.button`
  width: 30px;
  height: 30px;
  border: 2px solid ${(props) => (props.active ? "#000" : "#ccc")};
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: pointer;
`;

const SizeSelector = styled.select`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 14px;
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
`;

const Accordion = styled.div`
  margin-top: 30px;
`;

const AccordionHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const AccordionContent = styled.div`
  padding: 10px;
  display: ${(props) => (props.open ? "block" : "none")};
  font-size: 14px;
  color: #555;
`;

const AddToCartButton = styled.button`
  background-color: #0046be;
  color: white;
  font-size: 16px;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #003593;
  }
`;


// Main Component
const Product = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const value = queryParams.get('Pid'); // Retrieve the value of a specific query parameter
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedSize, setSelectedSize] = useState("Large");
  console.log(selectedSize);
  const [quantity, setQuantity] = useState(1);
  const [accordionOpen, setAccordionOpen] = useState({ details: false, care: false });

  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    axios.get(`http://localhost:8080/api/data?Pid=${value}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <PageWrapper>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs>
        <a href="/men">Men</a> > <a href="/men-clothing">Clothing</a> >{data.Name}
      </Breadcrumbs>

      {/* Product Section */}
      <ProductSection>
        {/* Product Image */}
        <ProductImage src={data.image} alt={data.Name} />
        {/* Product Details */}
        <ProductDetails>
          <ProductTitle>{data.Name}</ProductTitle>
          <ProductPrice>₹{data.Price}</ProductPrice>

          {/* Color Swatches */}
          <SwatchContainer>
            {/* {console.log(Arr)} */}
            {["White"].map((color) => (
              <Swatch
                key={color}
                color={color.toLowerCase()}
                active={selectedColor === color}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </SwatchContainer>

          {/* Size Selector */}
          <SizeSelector onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="" disabled selected>
              Select Size
            </option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </SizeSelector>

          {/* Quantity Selector */}
          <QuantitySelector>
            <span>Quantity:</span>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input type="number" value={quantity} style={{}}readOnly />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </QuantitySelector>

          {/* Add to Cart */}
          <AddToCartButton>Add to Cart</AddToCartButton>

          {/* Accordion */}
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
