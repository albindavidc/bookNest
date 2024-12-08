import express from "express";
import {registerUser, loginUser, logoutUser} from "../controllers/libraryController";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get('/', (req: Request, res: Response) => res.render('user/login'));
router.get('/auth/register', (req: Request, res: Response) => res.render('user/register'));
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", ensureAuthenticated, logoutUser);



export default router;