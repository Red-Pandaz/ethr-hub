const jwt = require('jsonwebtoken');
const secretKey = 'thisIsJustATestToken';

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log('Invalid token:', err);
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    // Log the decoded user data to check if it contains the expected userId
    console.log('Decoded user:', user);

    // Normalize the addresses to lowercase to ensure a consistent comparison
    const tokenUserId = user.userId.toLowerCase();
    const paramAddress = req.params.address?.toLowerCase(); // Assuming the address comes from the request params

    // Optionally, check if the token's userId matches the address in the request (if provided)
    if (paramAddress && tokenUserId !== paramAddress) {
      console.log(`Address mismatch: tokenUserId = ${tokenUserId}, paramAddress = ${paramAddress}`);
      return res.status(401).json({ message: 'Unauthorized: Address mismatch' });
    }

    // Assign the normalized userId to the request object
    req.userId = tokenUserId;
    next();
  });
};

module.exports = authenticateJWT;