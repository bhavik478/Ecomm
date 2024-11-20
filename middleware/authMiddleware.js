const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Token Verify
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

//Roles and permission
const restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
      // next()
    } else {
      next();
    }
  };
};

//multiple role permission
// const restrict = (...role) => {
//   return (req, res, next) => {
//     if (!role.includes(req.user.role)) {
//       res
//         .status(403)
//         .json({ error: "You do not have permission to perform this action" });
//
//     } else {
//       next();
//     }
//   };
// };

module.exports = { protect, restrict };
