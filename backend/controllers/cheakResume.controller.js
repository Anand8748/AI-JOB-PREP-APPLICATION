import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import dotenv from "dotenv";
import { addMemory } from "../utils/addMemory.js";
import { Blob } from "buffer";

dotenv.config();

const schema = z.object({
  answer: z.boolean()
});

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
}).withStructuredOutput(schema);

async function isResumeText(text) {
  const systemPrompt = `
    You are a document classifier. Your task is to determine if the provided text represents a resume/CV or professional profile.
    
    Resume/CV documents typically contain:
    - Work experience with job titles, companies, dates
    - Education history with degrees and institutions
    - Technical skills and competencies
    - Projects and achievements
    - Contact information
    - Professional summary or objectives
    
    User descriptions about themselves for job interviews are also acceptable. This includes:
    - Job titles or roles (e.g., "Software engineer", "Project manager")
    - Career goals or objectives (e.g., "Looking for developer job")
    - Brief professional summaries
    - Skills or expertise areas
    - Any text that indicates employment, career, or professional work
    
    Be very lenient with short descriptions that contain:
    - Professional terms or job roles
    - Career-related content
    - Skills or technologies
    - Employment-related words (job, work, career, seeking, etc.)
    
    Analyze the text and determine if it represents a resume, CV, or professional profile suitable for job interviews.
    
    TEXT TO ANALYZE:
    ${text.slice(0, 3000)}...
    
    Return true if this is a resume/CV/professional profile or ANY career-related content, false only if it's completely unrelated (like random text, stories, news articles, hobbies, food preferences, etc.).
  `;

  const result = await llm.invoke(systemPrompt);
  return result.answer;
}

export async function checkResume(req, res) {
  try {
    const { userId, description } = req.body;

    if (!req.file && !description) {
      return res.status(400).json({ error: "Please provide your resume (PDF or text)" });
    }

    let resumeContent = "";

    // If file uploaded, read PDF from memory
    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: "application/pdf" });
      const loader = new PDFLoader(blob);
      const docs = await loader.load();
      resumeContent = docs.map(doc => doc.pageContent).join("\n");
    }

    const userDescription = resumeContent || description;
    const isResume = await isResumeText(userDescription);

    if (!isResume) {
      return res.status(400).json({ error: "The provided file/description is not a resume" });
    }

    addMemory(userId, userDescription);

    res.status(200).json({
      success: true,
      message: "Resume is Validated"
    })
  } catch (err) {
    console.error("Resume check error:", err);
    res.status(500).json({ error: "Error while checking resume" });
  }
}
