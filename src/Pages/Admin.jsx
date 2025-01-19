import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled components
const Wrapper = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const AdminWrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  // Read the password from the environment variable
  const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD;

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password! Please try again.");
    }
  };

  useEffect(() => {
    // Fetch orders when the user is authenticated
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders"); // Fetching orders for all users
        const data = await response.json();
        setCurrentOrders(data.currentOrders);  // Set current orders
        setPastOrders(data.pastOrders);  // Set past orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (isAuthenticated) {
      fetchOrders();  // Call fetchOrders only when authenticated
    }
  }, [isAuthenticated]);

  const handleUpdateOrderStatus = async (orderId, currentStatus) => {
    // Define the order statuses
    const statuses = ['Pending', 'Processing', 'Shipped', 'Completed'];
    
    // Get the next status in the cycle
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]; // Cycles through the statuses

    try {
      const response = await fetch(`/api/orders/${orderId}/update-order-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: nextStatus }), // Send the next status
      });

      if (response.ok) {
        alert(`Order status updated to ${nextStatus}`);
        fetchOrders(); // Refresh the orders after the update
      } else {
        alert("Error updating order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Wrapper>
      {isAuthenticated ? (
        <AdminWrapper>
          <Title>Admin Dashboard</Title>
          <h2>Current Orders</h2>
          <Table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Email</th>
                <th>Product Name</th>
                <th>Product Size</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Update Order Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.FirstName} {order.LastName}</td>
                  <td>{order.Address}</td>
                  <td>{order.Email}</td>
                  <td>{order.product_name}</td>
                  <td>{order.product_size}</td>
                  <td>{order.Quantity}</td>
                  <td>{order.product_price}</td>
                  <td>{order.TotalAmount}</td>
                  <td>{order.PaymentStatus}</td>
                  <td>{order.order_status}</td>
                  <td>
                    <Button onClick={() => handleUpdateOrderStatus(order.order_id, order.order_status)}>
                      Update Order Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h2>Past Orders</h2>
          <Table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Product Name</th>
                <th>Product Size</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Update Order Status</th>
              </tr>
            </thead>
            <tbody>
              {pastOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.FirstName} {order.LastName}</td>
                  <td>{order.Address}</td>
                  <td>{order.Email}</td>
                  <td>{order.Contact}</td>
                  <td>{order.product_name}</td>
                  <td>{order.product_size}</td>
                  <td>{order.Quantity}</td>
                  <td>{order.product_price}</td>
                  <td>{order.TotalAmount}</td>
                  <td>{order.PaymentStatus}</td>
                  <td>{order.order_status}</td>
                  <td>
                    <Button onClick={() => handleUpdateOrderStatus(order.order_id, order.order_status)}>
                      Update Order Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AdminWrapper>
      ) : (
        <div>
          <h2>Admin Login</h2>
          <Input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button onClick={handleLogin}>Login</Button>
        </div>
      )}
    </Wrapper>
  );
};

export default Admin;
