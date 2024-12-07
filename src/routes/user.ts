import express from "express",
import {registerUser, loginUser, logoutUser} from "../controllers/libraryController";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", ensureAuthenticated, logoutUser);



export default router;