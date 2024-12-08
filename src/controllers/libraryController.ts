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

    res.redirect('/');
      
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

    const adminSideData = await libraryService.getAllBooks();

    if (role === "administrator") {
      res.redirect("/dashboard");
      return;
    }else{
      res.redirect("/home");
    }

  } catch (error) {
    next(error);
  }
};



export const getUserHomePage: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req.session as any).userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized. Please log in." });
      return;
    }

    const libraryService = new LibraryServiceImpl();
    const homePageData = await libraryService.getUserBorrowingInfo(userId.toString());

    // Render the home page with data and default empty search results
    res.render("user/home", {
      ...homePageData,
      books: homePageData.books || [], // Ensures `books` is always passed
      searchResults: [],              // Default empty search results
    });
  } catch (error) {
    next(error);
  }
};

export const searchBooks: RequestHandler = async (req, res, next) => {
  try {
    const { query } = req.query;

    const libraryService = new LibraryServiceImpl();
    const searchResults = await libraryService.searchBooks(query as string);

    const userId = (req.session as any).userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized. Please log in." });
      return;
    }

    res.render("user/search", { searchResults, query });

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
