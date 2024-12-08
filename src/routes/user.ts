import express from "express";
import {registerUser, loginUser, logoutUser} from "../controllers/libraryController";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { Request, Response, NextFunction } from "express";
import { getAdminDashboard, addBook, assignBook } from "../controllers/adminController";

const router = express.Router();

router.get('/', (req: Request, res: Response) => res.render('user/login'));
router.get('/auth/register', (req: Request, res: Response) => res.render('user/register'));
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", ensureAuthenticated, logoutUser);

router.get('/dashboard', getAdminDashboard);
router.post('/admin/add-book', ensureAuthenticated, addBook);
router.post('/admin/assign-book', ensureAuthenticated, assignBook);

export default router;