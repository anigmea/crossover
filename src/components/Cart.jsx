import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import useAuth from "../Pages/useAuth";

// Styled Components
const CartWrapper = styled.div`
  font-family: "Yeezy", sans-serif;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const CartHeader = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between; /* Fix alignment */
  align-items: center; /* Align items vertically in center */
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProductImage = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;
  margin-right: 10px;
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ProductDetails = styled.div`
  flex: 1;
  text-align: left; /* Default alignment for desktop */
  @media (max-width: 768px) {
    text-align: center;
    margin-top: 10px;
  }
`;

const ProductTitle = styled.h2`
  font-size: 18px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ProductPrice = styled.p`
  font-size: 16px;
  color: #b12704;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ProductSize = styled.p`
font-size: 15px;
color: #003;
@media (max-width: 768px) {
  font-size: 14px;
}
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
    font-size: 13px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    gap: 5px;
    button {
      font-size: 12px;
      padding: 5px;
    }
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
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const CartSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }
`;

const Subtotal = styled.h2`
  font-size: 18px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
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
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 12px 15px;
  }
`;

// Main Component
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user, loading, error, jwtToken } = useAuth(); // Use the custom hook

  useEffect(() => {
    if (user) {
      const user_check = user.replace(/^"|"$/g, "");
      // Fetch cart items for the logged-in user
      axios.get(`https://crossover.in.net:8080/api/cart_items?UserID=${user_check}`)
        .then((response) => {
          setCartItems(response.data || []);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    }
  }, [user]);

  const updateQuantity = (ProductID, delta, cartID) => {
    const updatedCartItems = cartItems.map((item) =>
      item.ProductID === ProductID
        ? { ...item, Quantity: Math.max(1, item.Quantity + delta) }
        : item
    );
    const updatedItem = updatedCartItems.find(
      (item) => item.ProductID === ProductID
    );
  
    setCartItems(updatedCartItems);
  
    axios
      .put(
        `https://crossover.in.net:8080/api/cart_items/${cartID}`,
        { Quantity: updatedItem.Quantity },
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      )
      .then((response) => {
        console.log("Quantity updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
        setCartItems(cartItems);
      });
  };

  const removeItem = (ProductID, cartID) => {
    axios
      .delete(`https://crossover.in.net:8080/api/cart_items/${cartID}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cart_id !== cartID)
        );
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
  };

  const updateSize = (cartID, newSizeID) => {
    axios
      .put(
        `https://crossover.in.net:8080/api/cart_items/${cartID}`,
        { ProductSizeID: newSizeID },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      )
      .then((response) => {
        const updatedCartItems = cartItems.map((item) =>
          item.cart_id === cartID
            ? { ...item, ProductSizeID: newSizeID }
            : item
        );
        setCartItems(updatedCartItems);
        console.log("Size updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating size:", error);
      });
  };

  const subtotal = cartItems
    .reduce(
      (acc, item) => acc + parseFloat(item.product_price) * item.Quantity,
      0
    )
    .toFixed(2);

  return (
    <CartWrapper>
      <CartHeader>Shopping Cart</CartHeader>
      <CartItems>
        {cartItems.map((item) => (
          <CartItem key={item.cart_id}>
            <ProductImage
              src={`/images/${item.product_image}`}
              alt={item.product_name}
            />
            <ProductDetails>
              <ProductTitle>{item.product_name}</ProductTitle>
              <ProductPrice>₹{item.product_price}</ProductPrice>
              {/* <SizeSelector
                value={item.ProductSizeID}
                onChange={(e) => updateSize(item.cart_id, e.target.value)}
              >
                {item.Sizes && item.Sizes.map((size) => (
                  <option key={size.ProductSizeID} value={size.ProductSizeID}>
                    {size.size_name}
                  </option>
                ))}
              </SizeSelector> */}
              <ProductSize>Size: {item.product_size}</ProductSize>
              <QuantityControls>
                <button onClick={() => updateQuantity(item.ProductID, -1, item.cart_id)}>
                  -
                </button>
                <input type="text" value={item.Quantity} readOnly />
                <button onClick={() => updateQuantity(item.ProductID, 1, item.cart_id)}>
                  +
                </button>
              </QuantityControls>
              <RemoveButton
                onClick={() => removeItem(item.ProductID, item.cart_id)}
              >
                Remove
              </RemoveButton>
            </ProductDetails>
          </CartItem>
        ))}
      </CartItems>
      <CartSummary>
        <Subtotal>
          Subtotal ({cartItems.length} items): ₹{subtotal}
        </Subtotal>
        <a href="/#/Checkout">
          <CheckoutButton>Proceed to Checkout</CheckoutButton>
        </a>
      </CartSummary>
    </CartWrapper>
  );
};

export default CartPage;
