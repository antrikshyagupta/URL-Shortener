const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");


connectDB() 


app.listen(3000 , ()=>{
    console.log("Server is running on port 3000");
    
})