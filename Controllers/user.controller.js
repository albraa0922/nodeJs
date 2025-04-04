const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = async (req, res) => {
  const users = await User.find({}, { __v: false, password: false });
  return res.json({ status: "success", data: { users } });
};

const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res
      .status(400)
      .json({ status: "fail", message: "user alredy exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();

  return res.status(201).json({ status: "success", data: { newUser } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ massge: "email and password are requird" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ massge: "Invalid email or password" });
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (user && matchedPassword) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return res.status(200).json({ status: "success", data: { token } });
  } else {
    return res.status(400).json({ massge: "something wrong" });
  }
};

module.exports = {
  getAllUsers,
  register,
  login,
};
