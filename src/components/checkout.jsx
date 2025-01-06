import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components

const PageWrapper = styled.div`
  font-family: "Yeezy", sans-serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
`;

const FormField = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 0px;
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
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  font-size: 18px;

  input {
    margin-right: 10px;
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
`;

const CardType = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;
`;

// Helper function to identify card type
const identifyCardType = (cardNumber) => {
  const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
  const masterCardRegex = /^5[1-5][0-9]{14}$/;

  if (visaRegex.test(cardNumber)) return 'Visa';
  if (masterCardRegex.test(cardNumber)) return 'MasterCard';
  return 'Unknown';
};

// Main Component
const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [baseTotal, setBaseTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardType, setCardType] = useState('');
  const CODCharge = 50;

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
    // Fetch data from the backend API
    axios.get('http://localhost:8080/api/cart_items?Customer_id=1')
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

      const calculatedTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
      setBaseTotal(calculatedTotal);
      setTotal(calculatedTotal);
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'cardNumber') {
      setCardType(identifyCardType(value));
    }
  };

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);

    if (selectedMethod === 'Cash on Delivery') {
      setTotal(baseTotal + CODCharge);
      // setCartItems([...cartItems, { id: 4, name: 'COD Charge', price: CODCharge }]);
    } else {
      setTotal(baseTotal); // Reset to base total for other methods
    }
  };

  const handleRazorpayPayment = async () => {
    try {

      const response = await fetch('http://localhost:8080/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'amount': total }), // Amount in paisa
      });

      const { orderId } = await response.json();

      const razorpayScript = document.createElement('script');
      razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
      razorpayScript.async = true;
      razorpayScript.onload = () => {
        const options = {
          key: 'rzp_test_585ABTEGO5I2VY', // Replace with your Razorpay key
          amount: total * 100, // Amount in paisa
          currency: 'INR',
          name: 'Your Company Name',
          description: 'Purchase Description',
          order_id: orderId,
          handler: (response) => {
            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
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

  const handlePlaceOrder = () => {
    if (paymentMethod !== 'Cash on Delivery') {
      handleRazorpayPayment();
    } else {
      alert('Order placed successfully!');
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
            <span>{item.Name}</span>
            <span>${item.price.toFixed(2)}</span>
          </SummaryItem>
        ))}
         {paymentMethod === 'Cash on Delivery' && (
    <SummaryItem>
      <span>Cash on Delivery Charge</span>
      <span>${CODCharge.toFixed(2)}</span>
    </SummaryItem>
  )}
        <SummaryItem>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
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
            style={{ gridArea: 'firstName' }}
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
            style={{ gridArea: 'lastName' }}
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
            style={{ gridArea: 'email' }}
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
            style={{ gridArea: 'contact' }}
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
            style={{ gridArea: 'address' }}
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
            style={{ gridArea: 'city' }}
          />
        </FormField>
        <FormField>
          <Input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="State"
            style={{ gridArea: 'state' }}
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
            Cash on Delivery (+${CODCharge.toFixed(2)})
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
