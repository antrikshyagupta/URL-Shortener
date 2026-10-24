const jwt = require("jsonwebtoken"); 


 function authenticateToken(req,res,next){
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }
    try{
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user ={id:decoded.id};
        next();
    }catch(err){
        console.error(err);
     return res.status(401).json({
    message: "Invalid or expired token"
});
    }
}
module.exports = authenticateToken;