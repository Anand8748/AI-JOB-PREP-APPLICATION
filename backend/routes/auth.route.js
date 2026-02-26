import express from "express";
import { signup, login, verifyToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verifyToken);

export default router;
