import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import dotenv from "dotenv";

dotenv.config();

export async function testPdfParsing(req, res) {
    try {
        console.log("Testing PDF parsing...");
        
        if (!req.file) {
            return res.status(400).json({ 
                error: "No PDF file provided",
                message: "Please upload a PDF file to test parsing"
            });
        }

        console.log("File received:", req.file.originalname);
        console.log("File size:", req.file.size, "bytes");
        console.log("File mimetype:", req.file.mimetype);

        // Test PDF parsing
        const blob = new Blob([req.file.buffer], { type: "application/pdf" });
        const loader = new PDFLoader(blob);
        
        console.log("Starting PDF parsing...");
        const docs = await loader.load();
        console.log("PDF parsed successfully!");
        
        const extractedText = docs.map(doc => doc.pageContent).join("\n");
        
        console.log("Extracted text length:", extractedText.length, "characters");
        console.log("Number of pages:", docs.length);
        
        // Return parsing results
        res.json({
            success: true,
            message: "PDF parsing successful!",
            results: {
                fileName: req.file.originalname,
                fileSize: req.file.size,
                pages: docs.length,
                textLength: extractedText.length,
                extractedText: extractedText.substring(0, 1000) + (extractedText.length > 1000 ? "..." : ""), // First 1000 chars
                fullTextAvailable: extractedText.length > 1000
            }
        });

    } catch (error) {
        console.error("PDF parsing error:", error);
        res.status(500).json({ 
            error: "PDF parsing failed",
            details: error.message,
            stack: error.stack
        });
    }
}
