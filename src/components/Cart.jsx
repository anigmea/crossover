import React, { useState } from "react";
import { useHref } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const CartWrapper = styled.div`
font-family: "Bebas Neue", sans-serif;
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
  const [cartItems, setCartItems] = useState([
    { id: 1, title: "Jersey Pocket T-Shirt", price: 59.5, quantity: 1, image: "https://via.placeholder.com/100" },
    { id: 2, title: "Classic Polo Shirt", price: 89.99, quantity: 2, image: "https://via.placeholder.com/100" },
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <CartWrapper>
      {/* Cart Header */}
      <CartHeader>Shopping Cart</CartHeader>

      {/* Cart Items */}
      <CartItems>
        {cartItems.map((item) => (
          <CartItem key={item.id}>
            <ProductImage src={item.image} alt={item.title} />
            <ProductDetails>
              <ProductTitle>{item.title}</ProductTitle>
              <ProductPrice>${item.price.toFixed(2)}</ProductPrice>

              {/* Quantity Controls */}
              <QuantityControls>
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <input type="text" value={item.quantity} readOnly />
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </QuantityControls>

              {/* Remove Button */}
              <RemoveButton onClick={() => removeItem(item.id)}>Remove</RemoveButton>
            </ProductDetails>
          </CartItem>
        ))}
      </CartItems>

      {/* Cart Summary */}
      <CartSummary>
        <Subtotal>Subtotal ({cartItems.length} items): ${subtotal}</Subtotal>
        <a href = "/#/Checkout"><CheckoutButton>Proceed to Checkout</CheckoutButton></a>
      </CartSummary>
    </CartWrapper>
  );
};

export default CartPage;
 