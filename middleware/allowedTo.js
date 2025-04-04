module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.crrentUser.role)) {
      return res
        .status(403)
        .json({ status: "fail", messag: "this role is not authrized" });
    }
    next();
  };
};
