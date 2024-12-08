// models/book.ts
import mongoose, { Schema, Document } from "mongoose";

export interface Book extends Document {
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  description: string;
  isAvailable: boolean;
  isReserved: boolean;
  isBorrowed: boolean;
  borrowedCount: number;
  totalCountOfBooks: number;
}

const bookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
    },
    publicationYear: {
      type: Number,
    },
    description: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
    },
    isBorrowed: {
      type: Boolean,
    },
    isReserved: {
      type: Boolean,
    },
    borrowedCount: {
      type: Number,
      default: 0,
    },
    totalCountOfBooks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Book>("Book", bookSchema);
