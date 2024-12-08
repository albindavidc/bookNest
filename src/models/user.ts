// models/user.ts
import mongoose, { Schema, Document, model } from "mongoose";
import { Book } from '../models/book'; // Import both the value and the type

// Define the User interface type
interface BorrowedBook {
  book: Book | Schema.Types.ObjectId;  // Allow either the book document or the ObjectId
  dueDate: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date;
  borrowedBooksCount: number;
  booksDueCount: number;  
  overdueFines: number;
  borrowedBooks: BorrowedBook[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
    },
    isBlocked: {
      type: Boolean,
    },
    updatedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
    },
    deletedAt: {
      type: Date,
    },
    borrowedBooks: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" }, // Reference to the Book model
        dueDate: { type: Date, default: null }, // Additional field for due date
      },
    ],

    borrowedBooksCount: {
      type: Number,
    },

    booksDueCount: {
      type: Number,
    },
    overdueFines: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>('User', userSchema);
export default User;