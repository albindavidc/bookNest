import { Request, Response, RequestHandler, NextFunction } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";

export const registerUser: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return; // Explicitly terminate
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error); // Pass error to the error handler
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // Explicitly terminate
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return; // Explicitly terminate
    }

    (req.session as any).userId = user._id;
    (req.session as any).isAuthenticated = true;

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error); // Use `next()` to propagate errors
  }
};

// Logout user
export const logoutUser: RequestHandler = async (req, res, next) => {
  if (!req.session) {
    res.status(400).json({ message: "No active session to logout" });
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err); // Pass error to the error handler
      return;
    }

    res.status(200).json({ message: "Logout successful" });
  });
};