const jwt = require("jsonwebtoken");
const secretKey = "thisIsJustATestToken";

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }


    console.log("Decoded user:", user);


    const tokenUserId = user.userId.toLowerCase();
    const paramAddress = req.params.address?.toLowerCase(); 

    if (paramAddress && tokenUserId !== paramAddress) {
      console.log(
        `Address mismatch: tokenUserId = ${tokenUserId}, paramAddress = ${paramAddress}`
      );
      return res
        .status(401)
        .json({ message: "Unauthorized: Address mismatch" });
    }
    req.userId = tokenUserId;
    next();
  });
};

module.exports = authenticateJWT;
