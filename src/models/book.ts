import mongoose, { Schema, Document } from "mongoose";

interface Book extends Document {
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  description: string;
  isAvailable: boolean;
  isReserved: boolean;
  isBorrowed: boolean;
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
      required: true,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
    isReserved: {
      type: Boolean,
      required: true,
    },
    isBorrowed: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bookModel = mongoose.model<Book>("Book", bookSchema);
export default bookModel;