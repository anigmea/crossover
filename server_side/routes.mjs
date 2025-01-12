import conn from "./db/connection.mjs";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import {dirname} from "path";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import mysql from "mysql2";
import {dirname} from "path";
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const queryPromise = (query, values) => {
  return new Promise((resolve, reject) => {
    conn.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

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
  const { ProductID } = req.query; // Extract `Pid` from query parameters
  console.log(`Received request to /api/data with ProductID: ${ProductID}`);

  if (!ProductID) {
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
  } else if (isNaN(ProductID)) {
    // Validate that Pid is a number
    console.warn(`Invalid ProductID provided: ${ProductID}`);
    res.status(400).json({ message: "Invalid ProductID" });
  } else {
    // Fetch product by Pid
    conn.query("SELECT * FROM Products WHERE ProductID = ?", [ProductID], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ message: "Error fetching data" });
      } else if (results.length === 0) {
        console.warn(`No product found for ProductID: ${ProductID}`);
        res.status(404).json({ message: "Product not found" });
      } else {
        console.log("Data fetched for ProductID:", results[0]);
        res.status(200).json(results[0]);
      }
    });
  }
});

app.get('/api/product', (req, res) => {
  const { ProductID } = req.query;

  // Query to get product data
  const productQuery = `
    SELECT p.ProductID, p.Name, p.Price, p.ImageURL,  ps.ProductSizeID, 
    ps.Stock, s.SizeName 
    FROM Products p
    LEFT JOIN ProductSizes ps ON p.ProductID = ps.ProductID
    LEFT JOIN Sizes s ON ps.SizeID = s.SizeID
    WHERE p.ProductID = ?
  `;

  conn.query(productQuery, [ProductID], (err, result) => {
    if (err) {
      console.error('Error fetching product data:', err);
      return res.status(500).json({ error: 'Failed to fetch product data' });
    }
    
    const product = result[0]; // Assuming only one product is returned
    
    // Group sizes and their stock
    const sizes = result.map(item => ({
      size: item.SizeName,
      stock: item.Stock
    }));

    res.status(200).json({
      Name: product.Name,
      Price: product.Price,
      ImageURL: product.ImageURL,
      Sizes: sizes, // Send the available sizes and their stock
    });
  });
});

app.post("/api/cart", (req, res) => {
  const {  ProductSizeID, Quantity, UserID } = req.body;

  console.log( ProductSizeID, Quantity, UserID);

  const cartQuery = `
      INSERT INTO Cart (UserID, ProductSizeID, Quantity)
      VALUES (?, ?, ?)
    `;

    conn.query(cartQuery, [UserID, ProductSizeID, Quantity], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add item to cart' });
      }
      res.status(200).json({ message: 'Item added to cart successfully!' });
    });

});

app.get("/api/cart_items", (req, res) => {
  const { UserID } = req.query; // Extract `UserID` from query parameters
  console.log(`Received request to /api/cart_items with UserID: ${UserID}`);

  if (!UserID) {
    // If no UserID is provided, return an error
    res.status(400).json({ message: "UserID is required" });
    return;
  }

  if (isNaN(UserID)) {
    // Validate that UserID is a number
    console.warn(`Invalid UserID provided: ${UserID}`);
    res.status(400).json({ message: "Invalid UserID" });
    return;
  }

  // Query to fetch cart items for a specific UserID
  const query = `
    SELECT 
      Cart.CartID AS cart_id,
      Cart.UserID,
      Cart.ProductSizeID,
      Cart.Quantity,
      Products.ProductID,
      Products.Name AS product_name,
      Products.Price AS product_price,
      Products.ImageURL AS product_image,
      Sizes.SizeName AS product_size
    FROM 
      Cart
    INNER JOIN 
      Products ON Cart.ProductSizeID = Products.ProductID
    INNER JOIN 
      ProductSizes ON Cart.ProductSizeID = ProductSizes.ProductSizeID
    INNER JOIN 
      Sizes ON ProductSizes.SizeID = Sizes.SizeID
    WHERE 
      Cart.UserID = ?
  `;

  // Execute the query
  conn.query(query, [UserID], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ message: "Error fetching data" });
    } else if (results.length === 0) {
      console.warn(`No cart items found for UserID: ${UserID}`);
      res.status(404).json({ message: "No cart items found" });
    } else {
      console.log("Cart items fetched for UserID:", results);
      res.status(200).json(results);
    }
  });
});

app.delete("/api/cart_items/:cart_id", (req, res) => {
  const { cart_id } = req.params;

  // Query to delete the cart item based on cart_id
  conn.query("DELETE FROM Cart WHERE CartID = ?", [cart_id], (err, results) => {
    if (err) {
      console.error("Error deleting cart item:", err);
      res.status(500).json({ message: "Error deleting cart item" });
    } else {
      console.log(`Cart item with CartID: ${cart_id} deleted successfully`);
      res.status(200).json({ message: "Cart item removed successfully" });
    }
  });
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

  conn.query(
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

app.post('/api/place-order', async (req, res) => {
  const {
    userId, firstName, lastName, email, contact, address, city, state, zipCode, country, totalAmount, paymentMethod, cartItems
  } = req.body;

  let connection;

  try {
    // Get a connection from the pool


    // Start a transaction to ensure data integrity
    await new Promise((resolve, reject) => {
      conn.beginTransaction((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Insert order into the Orders table
    const orderQuery = 'INSERT INTO Orders (UserID, TotalAmount, PaymentStatus) VALUES (?, ?, ?)';
    const orderResult = await queryPromise(orderQuery, [userId, totalAmount, paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid']);
    const orderId = orderResult.insertId;

    // Insert each cart item into the OrderDetails table
    const orderDetailsQuery = 'INSERT INTO OrderDetails (OrderID, ProductSizeID, Quantity, Price) VALUES (?, ?, ?, ?)';
    for (const item of cartItems) {
      await queryPromise(orderDetailsQuery, [orderId, item.productSizeID, item.quantity, item.price]);
    }

    // Optionally insert or update user details (like shipping address) in the Users table
    const userQuery = 'UPDATE Users SET Address = ?, City = ?, State = ?, ZipCode = ?, Country = ? WHERE UserID = ?';
    await queryPromise(userQuery, [address, city, state, zipCode, country, userId]);

    // Commit the transaction
    await new Promise((resolve, reject) => {
      conn.commit((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error placing order:', error);
    
    // If there's any error, rollback the transaction
    if (connection) {
      await new Promise((resolve, reject) => {
        conn.rollback((err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }

    res.status(500).json({ success: false, error: 'Failed to place the order' });
  } finally {
    if (connection) {
      conn.release(); // Release the connection back to the pool
    }
  }
});

app.post("/api/contact", (req, res) => {
  const { name, reason, email, message } = req.body;

  if (!name || !reason || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Insert the data into the database
  const query = `
    INSERT INTO Contact (Name, Reason, Email, Message)
    VALUES (?, ?, ?, ?)
  `;
  const values = [name, reason, email, message];

  conn.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ success: false, message: "Failed to insert data" });
    }

    res.json({ success: true, message: "Message sent successfully!" });
  });
});


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

app.get("*", (req, res) => {
  res.sendFile('../build/index.html');
})

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
