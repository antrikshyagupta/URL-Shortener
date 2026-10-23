const express = require("express");
const urlRouter = require("./routes/url.routes");
const app = express();

app.get("/" , (req , res)=>{
    res.send("URL Shortener API");
})
app.use(express.json());
app.use("/api/urls", urlRouter);
module.exports = app;
