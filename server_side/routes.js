import conn from "./db/connection.js";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import mysql from "mysql2";


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

app.get("/api/cart_items", (req, res) => {
  const { Customer_id } = req.query; // Extract `Pid` from query parameters
  console.log(`Received request to /api/cart_items with Customer_id: ${Customer_id}`);

  if (!Customer_id) {
    // If no Pid is provided, fetch all products
    conn.query("SELECT Cart.cart_id AS cart_id,Cart.Customer_id,Cart.Product_id, Cart.qty, Products.Pid, Products.Name, Products.price, Products.image FROM Cart INNER JOIN Products ON Cart.Product_id = Products.Pid", (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ message: "Error fetching data" });
      } else {
        console.log("All data fetched:", results);
        res.status(200).json(results);

        
      }
    });
  } else if (isNaN(Customer_id)) {
    // Validate that Pid is a number
    console.warn(`Invalid Pid provided: ${Customer_id}`);
    res.status(400).json({ message: "Invalid Customer_id" });
  } else {
    // Fetch product by Pid
    conn.query("SELECT Cart.cart_id AS cart_id,Cart.Customer_id,Cart.Product_id, Cart.qty, Products.Pid, Products.Name, Products.price, Products.image FROM Cart INNER JOIN Products ON Cart.Product_id = Products.Pid WHERE Cart.Customer_id = ?", [Customer_id], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ message: "Error fetching data" });
      } else if (results.length === 0) {
        console.warn(`No product found for Pid: ${Customer_id}`);
        res.status(404).json({ message: "Product not found" });
      } else {
        console.log("Data fetched for Pid:", results);
        res.status(200).json(results);
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
      amount: amount * 100, // Amount in paisa (smallest currency unit)
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

// Secret for JWT
// const JWT_SECRET = "your_secret_key";

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating user" });
      }
      res.status(201).json({ message: "User created successfully" });
    }
  );
});

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
//     if (err) throw err;

//     if (results.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = results[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

//     res.status(200).json({ message: "Login successful"});
//   });
// });

app.get("/user-details/:userId", (req, res) => {
  const { userId } = req.params;
  conn.query("SELECT username, email FROM Users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user details:", err);
      res.status(500).json({ error: "Failed to fetch user details" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(results[0]);
    }
  });
});

app.get("/transactions/:userId", (req, res) => {
  const { userId } = req.params;
  conn.query("SELECT * FROM Transactions WHERE userId = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).json({ error: "Failed to fetch transactions" });
    } else {
      res.json(results);
    }
  });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
