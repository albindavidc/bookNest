import { RequestHandler } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import { LibraryServiceImpl } from "../services/libraryServices";
import { IUser } from "../models/user"; // Import IUser interface

export const registerUser: RequestHandler = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists. Please log in." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next): Promise<void> => {
  const { email, password, role } = req.body;

  try {
    // Find the user by email and populate borrowed books
    const user = await User.findOne({ email }).populate("borrowedBooks.book", "title coverImage author");
    
    if (!user) {
      res.status(404).json({ message: "User not found. Please register." });
      return;
    }

    const typedUser = user as IUser;

    if (typedUser.role !== role) {
      res.status(403).json({ message: `Unauthorized. Expected role: ${typedUser.role}` });
      return;
    }

    const isMatch = await bcrypt.compare(password, typedUser.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials. Please try again." });
      return;
    }

    (req.session as any).userId = typedUser._id;
    (req.session as any).isAuthenticated = true;

    const libraryService = new LibraryServiceImpl();
    const homePageData = await libraryService.getUserBorrowingInfo((typedUser as any)._id.toString());

    // Make sure to include `books` in the data passed to the view
    res.render("user/home", {
      ...homePageData,
      books: homePageData.books || [],  // Ensure books is passed (or empty array if undefined)
    });

  } catch (error) {
    next(error);
  }
};


// Logout user
export const logoutUser: RequestHandler = async (req, res, next) => {
  if (!req.session) {
    res.status(400).json({ message: "No active session to log out from." });
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err); // Pass error to the error handler
      return;
    }

    // Clear cookies and redirect to login
    res.clearCookie("connect.sid"); // Adjust cookie name if needed
    res.status(200).json({ message: "Logout successful. Redirecting to login." });
  });
};
