const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        message: "No authorization header provided",
        success: false 
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        message: "No token provided in authorization header",
        success: false 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token has expired",
        success: false,
        error: "TOKEN_EXPIRED"
      });
    }
    
    return res.status(401).json({ 
      message: "Invalid token",
      success: false,
      error: "INVALID_TOKEN"
    });
  }
};

module.exports = authMiddleware;
