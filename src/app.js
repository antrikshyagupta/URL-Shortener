const express = require("express");
const urlRouter = require("./routes/url.routes");
const authRoutes = require("./routes/auth.routes");
const app = express();

app.get("/" , (req , res)=>{
    res.send("URL Shortener API");
})
app.use(express.json());
app.use("/api/urls", urlRouter);
app.use("/api/auth", authRoutes);

module.exports = app;
