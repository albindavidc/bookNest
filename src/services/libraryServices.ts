import { LibraryService } from "../models/libraryServices"; // Interface for service
import bookModel, { Book } from "../models/book"; // Book model and type
import userModel from "../models/user"; // User model and type

interface HomePageData {
  name: string;
  borrowedBooksCount: number;
  booksDueCount: number;
  overdueFines: number;
  borrowedBooks: {
    title: string;
    author: string;
    dueDate: Date | null;
  }[];
  books:
    | Array<{
        title: string;
        author: string;
      }>
    | []; // Ensure `books` is always an array
}

export class LibraryServiceImpl implements LibraryService {
  // Fetch all books
  async getAllBooks() {
    return await bookModel.find().sort({ createdAt: -1 });
  }

  // Fetch book details by ID
  async getBookById(id: string) {
    return await bookModel.findById(id);
  }

  // Create a new book
  async createBook(data: any) {
    const newBook = new bookModel(data);
    return await newBook.save();
  }

  // Update book details by ID
  async updateBook(id: string, data: any) {
    return await bookModel.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete a book by ID
  async deleteBook(id: string) {
    return await bookModel.findByIdAndDelete(id);
  }

  // Get user borrowing information by user ID
  async getUserBorrowingInfo(userId: string): Promise<HomePageData> {
    const user = await userModel.findById(userId).populate({
      path: "borrowedBooks.book",
      select: "title author coverImage",
    });

    if (!user) {
      throw new Error("User not found");
    }

    const borrowedBooksCount = user.borrowedBooks.length;
    const booksDueCount = user.borrowedBooks.filter((b) => b.dueDate && new Date(b.dueDate) > new Date()).length;

    const overdueBooks = user.borrowedBooks.filter((b) => b.dueDate && new Date(b.dueDate) < new Date());

    const overdueFines = overdueBooks.length * 5; // Example fine logic

    // Example logic to get recommended books
    const recommendedBooks = await bookModel.find({}).limit(5); // Get recommended books (you may change the logic)

    return {
      name: user.name,
      borrowedBooksCount,
      booksDueCount,
      overdueFines,
      borrowedBooks: user.borrowedBooks.map((b) => ({
        title: (b.book as Book).title,
        author: (b.book as Book).author,
        dueDate: b.dueDate,
      })),
      books:
        recommendedBooks.map((book) => ({
          title: book.title,
          author: book.author,
        })) || [],
    };
  }

  async searchBooks(query: string) {
    try {
      // Use regex to search for books matching the query in title, author, or category
      const searchResults = await bookModel
        .find({
          $or: [{ title: { $regex: query, $options: "i" } }, { author: { $regex: query, $options: "i" } }, { category: { $regex: query, $options: "i" } }],
        })
        .select("title author coverImage"); // Adjust fields as necessary

      return searchResults;
    } catch (error) {
      throw new Error("Error fetching search results");
    }
  }
}
