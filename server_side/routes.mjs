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
import https from 'https';
import fs from 'fs';



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
  key_id: "rzp_live_bcDeF4tjfyF8sP",
  key_secret: "iNzpbQaxrWj70cljpWDnLmVF",
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
  next();  // Proceed to the next middleware or route handler
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../build")));

app.options('*', cors()); // Enable preflight for all routes


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
      SELECT p.ProductID, p.Name, p.Price, p.BackImageURL, p.ImageURL, ps.ProductSizeID, 
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
      ProductSizeID: item.ProductSizeID,
      size: item.SizeName,
      stock: item.Stock,
    }));

    res.status(200).json({
      Name: product.Name,
      Price: product.Price,
      ImageURL: product.ImageURL,
      BackImageURL: product.BackImageURL,
      Sizes: sizes,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product data" });
  }
});

app.post("/api/cart", async (req, res) => {
  const { ProductSizeID, Quantity, UserID } = req.body;

  if (!ProductSizeID || !Quantity || !UserID) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    
    console.log("Received Data:", { ProductSizeID, Quantity, UserID }); // Debug log
    await queryPromise(
      "INSERT INTO Cart (UserID, ProductSizeID, Quantity) VALUES (?, ?, ?)",
      [UserID, ProductSizeID, Quantity]
    );
    res.status(200).json({ message: "Item added to cart successfully!" });
  } catch (error) {
    console.error("Database error:", error); // Log detailed error
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Fetch cart items
app.get("/api/cart_items", async (req, res) => {
  const { UserID } = req.query;
  console.log("Hello: " + UserID);


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
        ProductSizes ON Cart.ProductSizeID = ProductSizes.ProductSizeID
      INNER JOIN 
        Sizes ON ProductSizes.SizeID = Sizes.SizeID
      INNER JOIN 
        Products ON ProductSizes.ProductID = Products.ProductID
      WHERE 
        Cart.UserID = ?
    `;

    const results = await queryPromise(query, [UserID]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error });
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

app.delete("/api/cart_items", async (req, res) => {
  const { user_id } = req.query;
  
  if (!user_id ) {
    return res.status(400).json({ message: "Invalid UserID" });
  }

  try {
    await queryPromise("DELETE FROM Cart WHERE UserID = ?", [user_id]);
    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart item" });
  }
});

// Update quantity in the cart
app.put("/api/cart_items/:cart_id", async (req, res) => {
  const { cart_id } = req.params; // Get CartID from URL
  const { Quantity } = req.body; // Get the new quantity from request body

  if (!Quantity || isNaN(Quantity) || Quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    // Query to update the quantity in the Cart table
    const updateQuery = "UPDATE Cart SET Quantity = ? WHERE CartID = ?";
    const result = await queryPromise(updateQuery, [Quantity, cart_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Respond with success
    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Error updating cart item" });
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



app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const { userID } = req.query; 


  // Check if NewuserId is passed in the request body
  if (!userID) {
    return res.status(400).json({ message: 'userID is required' });
  }

  try {
    // Check if the email is already registered
    const query = 'SELECT * FROM Users WHERE Email = ?';
    conn.query(query, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error checking email' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      // Hash the password before saving it
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error hashing password' });
        }
        

        // Prepare the SQL query to insert the new user into the database
        const insertQuery = `INSERT INTO Users (UserID, FirstName, LastName, Email, PasswordHash, CreatedAt, UpdatedAt) 
                             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
        
        // Insert the new user into the database
        conn.query(insertQuery, [userID, firstName, lastName, email, hashedPassword], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error signing up' });
          }

          res.status(201).json({ message: 'User signed up successfully!' });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing up' });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email, password are required." });
  }


  try {
    // Check if the user exists with the provided email
    const query = "SELECT * FROM Users WHERE Email = ?";
    conn.query(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error checking email" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      // const token = jwt.sign(user.UserId , JWT_SECRET, { expiresIn: '1d' });

      // // Check if the provided userID matches the user's ID in the database
      // if (user.UserID !== userID) {
      //   return res.status(401).json({ message: "Invalid user ID" });
      // }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      

      // Generate a success response (you could also include a token if necessary)
      res.status(200).json({
        message: "Login successful",
        user: {
          userID: user.UserId,
          email: user.Email,
          firstName: user.FirstName,
          lastName: user.LastName,
          // token: token
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});


app.post('/api/place-order', async (req, res) => {
  const {
    userId, firstName, lastName, email, contact, address, city, state, zipCode, country, totalAmount, paymentMethod, cartItems
  } = req.body;

  if (!userId || !totalAmount || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
    // Insert order into the Orders table
    const orderQuery = 'INSERT INTO Orders (UserID, TotalAmount, PaymentStatus, Status) VALUES (?, ?, ?, ?)';
    conn.query(orderQuery, [userId, totalAmount, paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid', 'Pending'], (err, orderResult) => {
      if (err) {
        console.error('Error inserting into Orders table:', err);
        return res.status(500).json({ success: false, message: 'Failed to place the order' });
      }

      const orderId = orderResult.insertId;

      // Insert each cart item into the OrderDetails table
      const orderDetailsQuery = 'INSERT INTO OrderDetails (OrderID, ProductSizeID, Quantity, Price) VALUES (?, ?, ?, ?)';
      let errorOccurred = false;

      cartItems.forEach((item, index) => {
        conn.query(orderDetailsQuery, [orderId, item.productSizeID, item.quantity, item.price], (err) => {
          if (err) {
            console.error('Error inserting into OrderDetails table:', err);
            errorOccurred = true;
          }

          // When all items are processed
          if (index === cartItems.length - 1) {
            if (errorOccurred) {
              return res.status(500).json({ success: false, message: errorOccurred });
            }

            // Optionally, update user details (like shipping address) in the Users table
            const userQuery = `INSERT INTO Users (UserID, FirstName, LastName, Email, Contact, PasswordHash, Address, City, State, ZipCode, Country) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE UserID = UserID`;
            conn.query(userQuery, [userId, firstName, lastName, email, contact, address, "tmp" , city, state, zipCode, country], (err) => {
              if (err) {
                console.error('Error updating user details:', err);
                return res.status(500).json({ success: false, message: 'Failed to update user details' });
              }
              // Respond with success
             if (paymentMethod === 'Cash on Delivery'){
              res.status(200).json({ success: true, message: 'Order Placed Successfully', orderId: orderId });
             }
             else{
              res.status(200).json({ success: true, message: 'Redirecting to payment gateway, may take a few moments.....', orderId: orderId});
             }
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Unexpected error placing order:', error);
    res.status(500).json({ success: false, message: 'Failed to place the order' });
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
  conn.query("SELECT FirstName, LastName, Email FROM Users WHERE UserId = ?", [userId], (err, results) => {
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

// Read SSL certificate files
const certificate = fs.readFileSync('/etc/letsencrypt/live/crossover.in.net/fullchain.pem', 'utf8');
const privateKey  = fs.readFileSync('/etc/letsencrypt/live/crossover.in.net/privkey.pem', 'utf8');

// Create HTTPS service with the provided certificates
const credentials = { key: privateKey, cert: certificate};

// Create the HTTPS server
// Start the server

const PORT = 8080;
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});


