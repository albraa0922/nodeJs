const jwt = require("jsonwebtoken");

const verfiyToken = (req, res, next) => {
  const authorization = req.headers.authorization || req.headers.Authorization;
  if (!authorization) {
    return res.status(401).json("token is required");
  }
  const token = authorization.split(" ")[1];

  try {
    const crrentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.crrentUser = crrentUser;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json("invalid token");
  }
};
module.exports = verfiyToken;
