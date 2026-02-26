import express from "express";
import { interviewSummary, listInterviewSummaries, getInterviewSummary } from "../controllers/interviewSummary.controller.js";

const router = express.Router();

router.post("/summary", interviewSummary);
router.get("/summaries", listInterviewSummaries);
router.get("/summary/:interviewId", getInterviewSummary);

export default router;
