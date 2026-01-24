import express from "express";
import { textToSpeech, getAvailableVoices } from "../controllers/textToSpeech.controller.js";

const router = express.Router();

router.post("/synthesize", textToSpeech);
router.get("/voices", getAvailableVoices);

export default router;
