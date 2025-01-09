import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, // false by default.
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection()
    .then((conn) => {
        console.log("Database Connected Successfully!");
        conn.release();
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err.message);
    });

    
export default pool;
