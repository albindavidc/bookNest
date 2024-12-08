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
  borrowedCount: number;
  totalCountOfBooks: number;
}

const bookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, required: true },
    isReserved: { type: Boolean, required: true },
    borrowedCount: { type: Number, default: 0 },
    totalCountOfBooks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<Book>("Book", bookSchema);
