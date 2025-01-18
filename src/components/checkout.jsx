import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import useAuth from "../Pages/useAuth";
import { useNavigate } from "react-router-dom";

// Styled Components

const PageWrapper = styled.div`
  font-family: "Yeezy", sans-serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;

  @media (max-width: 600px) {
    max-width: 100%;
    padding: 15px;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const FormField = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;

  @media (max-width: 600px) {
    padding: 8px;
    font-size: 12px;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
    font-weight: bold;
    font-size: 16px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  font-size: 18px;

  input {
    margin-right: 10px;
  }

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #444;
  }

  @media (max-width: 600px) {
    padding: 12px;
    font-size: 14px;
  }
`;

const ShippingInformation = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "firstName lastName"
    "email contact"
    "address address"
    "city state";
  column-gap: 50px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "firstName"
      "lastName"
      "email"
      "contact"
      "address"
      "city"
      "state";
    column-gap: 0;
  }
`;

const CardType = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;
`;

// Main Component
const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [baseTotal, setBaseTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const CODCharge = 50;
  const { user, loading, error, jwtToken } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    email: '',
    contact: '',
  });

  useEffect(() => {
    if (user) {
      const user_check = user.replace(/^"|"$/g, "");
      axios.get(`https://crossover.in.net:8080/api/cart_items?UserID=${user_check}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setCartItems(response.data);
          } else if (typeof response.data === 'object') {
            setCartItems([response.data]);
          } else {
            console.error('Unexpected response format:', response.data);
            setCartItems([]);
          }
        })
        .catch((error) => {
          console.error('There was an error fetching the data!', error);
          setCartItems([]);
        });
    }
  }, [user]);

  useEffect(() => {
    const calculatedTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.product_price * item.Quantity) || 0), 0);
    setBaseTotal(calculatedTotal);
    setTotal(calculatedTotal);
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);

    if (selectedMethod === 'Cash on Delivery') {
      setTotal(baseTotal + CODCharge);
    } else {
      setTotal(baseTotal);
    }
  };

  const handleRazorpayPayment = async () => {
  
    try {
      const response = await fetch('https://crossover.in.net:8080/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'amount': total }),
      });
  
      const { orderId } = await response.json();
  
      const razorpayScript = document.createElement('script');
      razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
      razorpayScript.async = true;
      razorpayScript.onload = () => {
        const options = {
          key: 'rzp_live_bcDeF4tjfyF8sP', 
          amount: total * 100, 
          currency: 'INR',
          name: 'Crossover',
          description: 'Crossover Tshirts',
          order_id: orderId,
          handler: (paymentResponse) => {
            // Use Razorpay payment response data to handle success
            console.log('Payment Response:', paymentResponse);
            if (paymentResponse.razorpay_order_id){
              const user_check = user.replace(/^"|"$/g, "");
              axios.delete(`https://crossover.in.net:8080/api/cart_items?user_id=${user_check}`);
              navigate("/confirmation", { state: { orderId: orderId } });
              // alert(`Payment Successful! Payment ID: ${paymentResponse.razorpay_payment_id}`);
            }
            // Navigate to confirmation page after successful payments
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.contact,
          },
          theme: {
            color: '#000',
          },
        };
  
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };
      document.body.appendChild(razorpayScript);
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.contact || !formData.address) {
      alert('Please fill in all the required fields!');
      return;
    }

    const orderData = {
      userId: user, 
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contact: formData.contact,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      totalAmount: total,
      paymentMethod: paymentMethod,
      cartItems: cartItems.map((item) => ({
        productSizeID: item.ProductSizeID,
        quantity: item.Quantity,
        price: item.product_price,
      })),
    };

 

    try {
      if (paymentMethod !== 'Cash on Delivery') {
        await handleRazorpayPayment();
      }

      const response = await axios.post('https://crossover.in.net:8080/api/place-order', orderData);

      if (response.data.success) {
        // alert(response.data.message)
        
        if (paymentMethod === 'Cash on Delivery') {
          navigate("/confirmation", { state: { orderId: response.data.orderId } });
          const user_check = user.replace(/^"|"$/g, "");
          await axios.delete(`https://crossover.in.net:8080/api/cart_items?user_id=${user_check}`);
        }
        
        
      } else {
        alert('Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing the order:', error);
      alert(error);
      // alert('There was an error placing your order. Please try again later.');
    }    
  };

  return (
    <PageWrapper>
      <h1>Checkout</h1>

      {/* Order Summary Section */}
      <Section>
        <SectionTitle>Order Summary</SectionTitle>
        {cartItems.map((item) => (
          <SummaryItem key={item.id}>
            <span>{item.product_name}</span>
            <span>Qty:{item.Quantity}</span>
            <span>{(parseFloat(item.product_price * item.Quantity) || 0).toFixed(2)}</span>
          </SummaryItem>
        ))}
        {paymentMethod === 'Cash on Delivery' && (
          <SummaryItem>
            <span>Cash on Delivery Charge</span>
            <span>₹{CODCharge.toFixed(2)}</span>
          </SummaryItem>
        )}
        <SummaryItem>
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </SummaryItem>
      </Section>

      {/* Shipping Information Section */}
      <SectionTitle>Contact Information</SectionTitle>
      <ShippingInformation>
        <FormField>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            required
          />
        </FormField>
        <FormField>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
        </FormField>
        <FormField>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
        </FormField>
        <FormField>
          <Input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Contact No."
            required
          />
        </FormField>
        <FormField>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Street Address"
            required
          />
        </FormField>
        <FormField>
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
          />
        </FormField>
        <FormField>
          <Input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="State"
          />
        </FormField>
        <FormField>
          <Input
            type="number"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            placeholder="Zip Code"
          />
        </FormField>
        <FormField>
          <Input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Country"
          />
        </FormField>
      </ShippingInformation>

      {/* Payment Information Section */}
      <Section>
        <SectionTitle>Payment Information</SectionTitle>
        <PaymentMethods>
          <PaymentOption>
            <input
              type="radio"
              name="paymentMethod"
              value="Credit Card"
              checked={paymentMethod === 'Credit Card'}
              onChange={handlePaymentMethodChange}
            />
            Card
          </PaymentOption>
          <PaymentOption>
            <input
              type="radio"
              name="paymentMethod"
              value="NetBanking"
              checked={paymentMethod === 'NetBanking'}
              onChange={handlePaymentMethodChange}
            />
            NetBanking
          </PaymentOption>
          <PaymentOption>
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={handlePaymentMethodChange}
            />
            Cash on Delivery (+₹{CODCharge.toFixed(2)})
          </PaymentOption>
        </PaymentMethods>
      </Section>

      {/* Place Order Button */}
      <PlaceOrderButton onClick={handlePlaceOrder}>
        Review and Place Order
      </PlaceOrderButton>
    </PageWrapper>
  );
};

export default Checkout;
