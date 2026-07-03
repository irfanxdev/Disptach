import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @route  POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
};
