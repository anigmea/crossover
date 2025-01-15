import mysql2 from "mysql2";

const pool = mysql2.createPool({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    database: "Crossover",
    password: "N3wCrossover@1234",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// CREATE TABLE Users (
//     UserID INT AUTO_INCREMENT PRIMARY KEY,
//     FirstName VARCHAR(100) NOT NULL,
//     LastName VARCHAR(100) NOT NULL,
//     Email VARCHAR(100) UNIQUE NOT NULL,
//     PasswordHash VARCHAR(255) NOT NULL,
//     PhoneNumber VARCHAR(15),
//     Address TEXT,
//     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// CREATE TABLE Products (
//     ProductID INT AUTO_INCREMENT PRIMARY KEY,
//     Name VARCHAR(100) NOT NULL,
//     Description TEXT,
//     Price DECIMAL(10, 2) NOT NULL,
//     ImageURL VARCHAR(255), -- URL for the T-shirt image
//     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// CREATE TABLE Sizes (
//     SizeID INT AUTO_INCREMENT PRIMARY KEY,
//     SizeName VARCHAR(10) NOT NULL UNIQUE -- e.g., 'S', 'M', 'L', 'XL'
// );

// CREATE TABLE ProductSizes (
//     ProductSizeID INT AUTO_INCREMENT PRIMARY KEY,
//     ProductID INT NOT NULL,
//     SizeID INT NOT NULL,
//     Stock INT NOT NULL DEFAULT 0, -- Stock per size
//     FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
//     FOREIGN KEY (SizeID) REFERENCES Sizes(SizeID) ON DELETE CASCADE
// );

// CREATE TABLE Cart (
//     CartID INT AUTO_INCREMENT PRIMARY KEY,
//     UserID INT NOT NULL,
//     ProductSizeID INT NOT NULL, -- Links to specific product and size
//     Quantity INT NOT NULL DEFAULT 1,
//     FOREIGN KEY (ProductSizeID) REFERENCES ProductSizes(ProductSizeID) ON DELETE CASCADE
// );

// CREATE TABLE Orders (
//     OrderID INT AUTO_INCREMENT PRIMARY KEY,
//     UserID INT NOT NULL,
//     TotalAmount DECIMAL(10, 2) NOT NULL,
//     Status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
//     PaymentStatus ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
//     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// CREATE TABLE OrderDetails (
//     OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
//     OrderID INT NOT NULL,
//     ProductSizeID INT NOT NULL, -- Links to specific product and size
//     Quantity INT NOT NULL,
//     Price DECIMAL(10, 2) NOT NULL, -- Price per item at the time of purchase
//     FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
//     FOREIGN KEY (ProductSizeID) REFERENCES ProductSizes(ProductSizeID) ON DELETE CASCADE
// );

// CREATE TABLE Payments (
//     PaymentID INT AUTO_INCREMENT PRIMARY KEY,
//     OrderID INT NOT NULL,
//     PaymentMethod ENUM('Credit Card', 'Net Banking', 'Cash on Delivery') NOT NULL,
//     PaymentAmount DECIMAL(10, 2) NOT NULL,
//     PaymentStatus ENUM('Success', 'Failed') DEFAULT 'Success',
//     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
// );

// CREATE TABLE Contact (
//     Contact_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     Name VARCHAR(100) NOT NULL, 
//     Reason VARCHAR(100) NOT NULL,
//     Email VARCHAR(100) NOT NULL, 
//     Message VARCHAR(200) NOT NULL
//   );

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Database Connected Successfully!");
    connection.release(); // Release the connection back to the pool
});

export default pool;
