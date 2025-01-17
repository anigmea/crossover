import React from "react";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Contact from "./Pages/contact";
import ProductPage from "./Pages/products"
import Cart from "./Pages/CartPage";
import CheckoutPage from "./Pages/Checkout";
import {SignUp, Login} from "./components/Signup";
import Account from "./components/Account";
import ConfirmationPage from "./Pages/confirmation";
import PrivacyPolicy from "./Pages/Privacy";
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Shop" element={<Shop/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/products" element={<ProductPage/>}/>
        <Route path="/Cart" element={<Cart/>}/>
        <Route path="/Checkout" element={<CheckoutPage/>}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Account" element={<Account/>}/>
        <Route path="/Confirmation" element={<ConfirmationPage/>}/>
        <Route path="/Privacy" element={<PrivacyPolicy/>}/>
      </Routes>
    </Router>
  );
};