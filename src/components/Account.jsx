import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import styled from "styled-components";
import useAuth from "../Pages/useAuth";
import Navbar from "./navbar";
import Footer from "./Footer";

const AccountPage = styled.div`
display: block;
text-align: center;
margin-top: 10px;
color: #000;
text-decoration: none;
margin-bottom: 90px;
a {
  color: inherit;
  text-decoration: none;
}
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

  @media (max-width: 768px) {
      height:  200px;
    }
`;
  
const AccountDetails = styled.div`
margin-bottom: 20px;
`;


const Labelh3 = styled.h3`
color: #333;
`;
  
const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    border: 1px solid #ddd;
  `;
  
const Td = styled.td `
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  `;
  
const Th = styled.th`
    background-color: #007BFF;
    color: white;
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  `;
  
const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  `;
  

const Account = () => {
  const [userDetails, setUserDetails] = useState({});
  const [transactionHistory, setTransactionHistory] = useState([]);
  const { user, loading, jwtToken } = useAuth();
  alert(user);

  // Fetch user data and transaction history on component load
  useEffect(() => {
    // Fetch user details from backend or cookies
    
    const fetchUserDetails = async () => {
      try {
        alert("hello" + user);
        // Assuming user details are stored in cookies
        if (!user) {
          alert("No user logged in!");
          return;
        }
        const response = await axios.get(`https://crossover.in.net:8080/user-details/${user}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Fetch transaction history
    const fetchTransactionHistory = async () => {
      try {
        if (!user) {
          alert("No user logged in!");
          return;
        }
        const response = await axios.get(`https://crossover.in.net:8080/transactions/${user}`);
        setTransactionHistory(response.data);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchUserDetails();
    fetchTransactionHistory();
  }, []);

  return (
    <AccountPage>
      <Navbar/>
      <Banner>Account Page</Banner>

      <AccountDetails>
        <Labelh3>Personal Details</Labelh3>
        <p><strong>name:</strong> {userDetails.FirstName}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
      </AccountDetails>

      <div className="cookies-details">
        <h3>Cookies</h3>
        <ul>
          {Object.entries(Cookies.get() || {}).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>

      <div className="transaction-history">
        <h3>Transaction History</h3>
        {transactionHistory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transaction history available.</p>
        )}
      </div>
      <Footer/>
    </AccountPage>
  );
};

export default Account;
