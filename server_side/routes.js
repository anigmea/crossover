import conn from "./db/connection.js";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";

const app = express();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_585ABTEGO5I2VY',
  key_secret: 'B6a7MBIysMwXi25mMnztuYaS',
});

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON payloads

// Endpoint to fetch product data
app.get("/api/data", (req, res) => {
  const { Pid } = req.query; // Extract `Pid` from query parameters
  console.log(`Received request to /api/data with Pid: ${Pid}`);

  if (!Pid) {
    // If no Pid is provided, fetch all products
    conn.query("SELECT * FROM Products", (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ message: "Error fetching data" });
      } else {
        console.log("All data fetched:", results);
        res.status(200).json(results);
      }
    });
  } else if (isNaN(Pid)) {
    // Validate that Pid is a number
    console.warn(`Invalid Pid provided: ${Pid}`);
    res.status(400).json({ message: "Invalid Pid" });
  } else {
    // Fetch product by Pid
    conn.query("SELECT * FROM Products WHERE Pid = ?", [Pid], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ message: "Error fetching data" });
      } else if (results.length === 0) {
        console.warn(`No product found for Pid: ${Pid}`);
        res.status(404).json({ message: "Product not found" });
      } else {
        console.log("Data fetched for Pid:", results[0]);
        res.status(200).json(results[0]);
      }
    });
  }
});

// Endpoint to create a Razorpay order
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body; // Extract amount from request body
  console.log(`Received request to create order with amount: ${amount}`);

  if (!amount || isNaN(amount)) {
    // Validate amount
    console.error("Invalid amount provided");
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    // Create an order using Razorpay
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paisa (smallest currency unit)
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`, // Unique receipt ID
    });

    console.log("Order created successfully:", order);
    res.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
