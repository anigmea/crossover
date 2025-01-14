import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components (unchanged)
const CartWrapper = styled.div`
  font-family: "Yeezy", sans-serif;
  padding: 20px;
`;

const CartHeader = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  color: #b12704;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;

  input {
    width: 50px;
    text-align: center;
  }

  button {
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #0073e6;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const CartSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
`;

const Subtotal = styled.h2`
  font-size: 18px;
`;

const CheckoutButton = styled.button`
  background-color: #000;
  color: #fff;
  font-size: 16px;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d48806;
  }
`;

// Main Component
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);  // Initialize with an empty array

  useEffect(() => {
    // Fetch data from the backend API
    axios.get('http://68.183.92.7:8080/api/cart_items?UserID=1')
      .then((response) => {
        console.log(response.data);  // Log the response to check the data structure
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else if (typeof response.data === 'object') {
          // If it's an object, wrap it in an array
          setCartItems([response.data]);
        } else {
          console.error('Unexpected response format:', response.data);
          setCartItems([]);  // Set empty array in case of unexpected data format
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        setCartItems([]);  // Set empty array in case of error
      });
  }, []);

  const updateQuantity = (ProductID, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.ProductID === ProductID ? { ...item, Quantity: Math.max(1, item.Quantity + delta) } : item
      )
    );
  };

  const removeItem = (ProductID, cartID) => {
    // Send DELETE request to remove the item from the database
    axios.delete(`http://68.183.92.7:8080/api/cart_items/${cartID}`)
      .then((response) => {
        console.log('Item removed from cart:', response.data);
        // After removing from the database, update the UI by removing the item from the state
        setCartItems((prevItems) => prevItems.filter((item) => item.cart_id !== cartID));
      })
      .catch((error) => {
        console.error('There was an error removing the item!', error);
      });
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.product_price) * item.Quantity, 0).toFixed(2);

  return (
    <CartWrapper>
      {/* Cart Header */}
      <CartHeader>Shopping Cart</CartHeader>

      {/* Cart Items */}
      <CartItems>
        {cartItems.map((item) => (
          <CartItem key={item.cart_id}>
            <ProductImage src={`/images/${item.product_image}`} alt={item.product_name} />
            <ProductDetails>
              <ProductTitle>{item.product_name}</ProductTitle>
              <ProductPrice>₹{item.product_price}</ProductPrice>

              {/* Quantity Controls */}
              <QuantityControls>
                <button onClick={() => updateQuantity(item.ProductID, -1)}>-</button>
                <input type="text" value={item.Quantity} readOnly />
                <button onClick={() => updateQuantity(item.ProductID, 1)}>+</button>
              </QuantityControls>

              {/* Remove Button */}
              <RemoveButton onClick={() => removeItem(item.ProductID, item.cart_id)}>Remove</RemoveButton>
            </ProductDetails>
          </CartItem>
        ))}
      </CartItems>

      {/* Cart Summary */}
      <CartSummary>
        <Subtotal>Subtotal ({cartItems.length} items): ₹{subtotal}</Subtotal>
        <a href="/#/Checkout">
          <CheckoutButton>Proceed to Checkout</CheckoutButton>
        </a>
      </CartSummary>
    </CartWrapper>
  );
};

export default CartPage;
