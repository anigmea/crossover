import conn from "./db/connection.mjs";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queryPromise = (query, values = []) => {
  return new Promise((resolve, reject) => {
    conn.query(query, values, (error, results) => {
      if (error) {
        console.error("Database Error:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_585ABTEGO5I2VY",
  key_secret: "B6a7MBIysMwXi25mMnztuYaS",
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../build")));

// JWT Secret
const JWT_SECRET = "052ab6fa69d8d9a7bc1e629ab30884c3b4701d6d8afbf2d20ade7ed7ba5ce9fc"; // Replace with a more secure secret

app.post("/verify-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    const { NewuserId } = decoded;

    if (!NewuserId) {
      return res.status(400).json({ message: "User ID is missing in the token" });
    }

    // If you just need the user_id from the token
    res.status(200).json({ NewuserId });

  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});


// Route to initialize user and return JWT
app.get("/initialize", (req, res) => {
  const NewuserId = uuidv4(); // Generate a new unique user_id

  // Create JWT token with payload (user data) and expiration
  const token = jwt.sign({ NewuserId }, JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({ message: "New user created", user_id: NewuserId, token: token });
});


// Endpoint to fetch product data
app.get("/api/data", async (req, res) => {
  const { ProductID } = req.query;

  try {
    let results;
    if (!ProductID) {
      results = await queryPromise("SELECT * FROM Products");
    } else if (isNaN(ProductID)) {
      return res.status(400).json({ message: "Invalid ProductID" });
    } else {
      results = await queryPromise("SELECT * FROM Products WHERE ProductID = ?", [ProductID]);
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});


// Fetch product with size and stock details
app.get("/api/product", async (req, res) => {
  const { ProductID } = req.query;

  if (!ProductID || isNaN(ProductID)) {
    return res.status(400).json({ message: "Invalid ProductID" });
  }

  try {
    const productQuery = `
      SELECT p.ProductID, p.Name, p.Price, p.ImageURL, ps.ProductSizeID, 
      ps.Stock, s.SizeName 
      FROM Products p
      LEFT JOIN ProductSizes ps ON p.ProductID = ps.ProductID
      LEFT JOIN Sizes s ON ps.SizeID = s.SizeID
      WHERE p.ProductID = ?
    `;
    const results = await queryPromise(productQuery, [ProductID]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = results[0];
    const sizes = results.map(item => ({
      size: item.SizeName,
      stock: item.Stock,
    }));

    res.status(200).json({
      Name: product.Name,
      Price: product.Price,
      ImageURL: product.ImageURL,
      Sizes: sizes,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product data" });
  }
});

app.post("/api/cart", async (req, res) => {
  const { ProductSizeID, Quantity} = req.body;
  if (!ProductSizeID || !Quantity) {
    return res.status(400).json({ message: "Invalid input" });
  }
  try {
    console.log("hello")
    await queryPromise(
      "INSERT INTO Cart (UserID, ProductSizeID, Quantity) VALUES (?, ?, ?)",
      [jwtToken, ProductSizeID, Quantity]
    );
    res.status(200).json({ message: "Item added to cart successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Fetch cart items
app.get("/api/cart_items", async (req, res) => {
  const { UserID } = req.query;

  if (!UserID || isNaN(UserID)) {
    return res.status(400).json({ message: "Invalid UserID" });
  }

  try {
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

    const results = await queryPromise(query, [UserID]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

// Delete cart item
app.delete("/api/cart_items/:cart_id", async (req, res) => {
  const { cart_id } = req.params;

  if (!cart_id || isNaN(cart_id)) {
    return res.status(400).json({ message: "Invalid CartID" });
  }

  try {
    await queryPromise("DELETE FROM Cart WHERE CartID = ?", [cart_id]);
    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart item" });
  }
});


// Endpoint to create a Razorpay order
app.post("/api/create-order", async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paisa
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
    });
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});


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
  res.sendFile(path.join('../build/index.html'));
})

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
