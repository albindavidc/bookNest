import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import { Request, Response, NextFunction } from "express";
import connectToDatabase from "./config/database";
connectToDatabase();
import userRoutes from "./routes/user";
import path from "path";
import expressLayouts from 'express-ejs-layouts';


const app = express();
const MongoDBStoreSession = MongoDBStore(session);

const store = new MongoDBStoreSession({
  uri: "mongodb://localhost:27017/",
  collection: "sessions",
});

store.on("error", (error: Error) => {
  console.error("Session store error: ", error);
});

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "this_is_secret_key",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Error-Handling Middleware 
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ message: "Internal Server Error" });
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", userRoutes);



app.use(expressLayouts);
app.set('layout', 'layouts/user'); // Default layout file




//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
