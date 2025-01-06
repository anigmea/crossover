import mysql2 from "mysql2";

const conn = mysql2.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    database: "CrossOver",
    password: "12345678"
});

// create Table Contact(Contact_id Integer Not Null Primary Key,
//     Name Varchar(100) Not Null, 
//     Reason Varchar(100) Not Null,
//     Email Varchar(100) Not Null, 
//     Message Varchar(200) Not Null);

// Create Table Cart(Cart_id Integer Not Null, 
//     Product_id Varchar(100) Not Null, 
//     Customer_id Varchar(100) Not Null,
//      Qty Integer Not Null);


// Create Table Customer(Customer_id Varchar(100) Not NUll PRimary Key,
// First_Name varchar(100) Not Null,
// Last_Name varchar(100) Not Null,
// Email varchar(100) Not Null, 
// Contact_No varchar(100) Not Null,
// address varchar(100) Not Null,
// City varchar(100) Not Null, 
// State varchar(100) Not Null, 
// Zipcode Integer Not Null,
// Country varchar(100) Not Null);

conn.connect(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Database Connected Successfully!");
    }
});
export default conn;