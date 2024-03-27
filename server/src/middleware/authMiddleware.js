const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== role) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
};
