import { RequestHandler } from "express";
import Book from "../models/book";
import User from "../models/user";

export const getAdminDashboard: RequestHandler = async (req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments();
    const borrowedBooks = await Book.countDocuments({ isBorrowed: true });
    const availableBooks = totalBooks - borrowedBooks;
    const books = await Book.find();
    const students = await User.find({ role: "student" });

    res.render("admin/dashboard", {
      books,
      students,
      totalBooks,
      borrowedBooks,
      availableBooks,
    });
  } catch (error) {
    next(error);
  }
};

//Add a New Book
export const addBook: RequestHandler = async (req, res, next) => {
  try {
    const { title, author, category, quantity } = req.body;
    const newBook = new Book({ title, author, category, quantity });
    await newBook.save();
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

//Assign a Borrowed Book
export const assignBook: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { studentId, bookId, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.isBorrowed) {
      res.status(400).json({ message: "Book is not available for borrowing" });
      return;
    }
    book.isBorrowed = true;
    await book.save();

    const student = await User.findById(studentId);
    if (!student) {
      res.status(400).json({ message: "Student not found" });
      return;
    }

    student.borrowedBooks.push({ book: bookId, dueDate });
    await student.save();

    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};
