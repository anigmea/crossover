import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import styled from "styled-components";

const AccountPage = styled.div`
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;
  
const AccountDetails = styled.div`
margin-bottom: 20px;
`;

const Labelh2 = styled.h2`
    color: #333;
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

  // Fetch user data and transaction history on component load
  useEffect(() => {
    // Fetch user details from backend or cookies
    const fetchUserDetails = async () => {
      try {
        // Assuming user details are stored in cookies
        const userId = Cookies.get("userId");
        if (!userId) {
          alert("No user logged in!");
          return;
        }
        const response = await axios.get(`http://68.183.92.7:8080/user-details/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Fetch transaction history
    const fetchTransactionHistory = async () => {
      try {
        const userId = Cookies.get("userId");
        if (!userId) {
          alert("No user logged in!");
          return;
        }
        const response = await axios.get(`http://68.183.92.7:8080/transactions/${userId}`);
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
      <Labelh2>Account Page</Labelh2>

      <AccountDetails>
        <Labelh3>Personal Details</Labelh3>
        <p><strong>Username:</strong> {userDetails.username}</p>
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
    </AccountPage>
  );
};

export default Account;
