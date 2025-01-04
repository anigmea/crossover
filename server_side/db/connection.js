import mysql2 from "mysql2";

const conn = mysql2.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    database: "CrossOver",
    password: "12345678"
});

conn.connect(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Database Connected Successfully!");
    }
});
export default conn;