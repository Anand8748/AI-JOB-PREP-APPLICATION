import express from "express";
import multer from "multer";
import { testPdfParsing } from "../controllers/testPdf.controller.js";

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Test PDF parsing endpoint
router.post("/parse", upload.single("pdf"), testPdfParsing);

export default router;
