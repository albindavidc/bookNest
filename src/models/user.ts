import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date;
  borrowedBooks: string[];
}

const userSchema: Schema = new Schema(
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
    borrowedBooks: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User>("User", userSchema);
