const express = require("express");
// Updated package: The latest SDK often uses @google/genai
const { GoogleGenAI } = require("@google/genai"); 
const protect = require("../middlewares/authMiddleware");
const Interview = require("../models/Interview");
const chatRoute = express.Router();

// Initialize the client with the new SDK structure
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateInterviewQA(skill) {
  // Use the latest stable 2026 model: gemini-3-flash
  // Note: Models like gemini-2.0-flash are retired in March 2026
  const response = await ai.models.generateContent({
    model: "gemini-3-flash", 
    contents: `Generate 10 mock interview questions and answers on "${skill}". 
               Return ONLY a valid JSON array. 
               Format: [{"question": "string", "answer": "string"}]`,
    // Setting thinking level to 'low' for faster, chat-like responses
    config: {
      thinkingConfig: { thinkingLevel: "low" }
    }
  });

  const text = response.text;
  
  // Robust JSON extraction remains a good practice
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Invalid JSON response");
  
  return JSON.parse(jsonMatch[0]);
}

chatRoute.post("/generate", protect, async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) return res.status(400).json({ error: "Skill is required" });

    const questions = await generateInterviewQA(skill);
    const interview = await Interview.create({
      user: req.user._id,
      QnA_On: skill,
      questions,
    });

    res.status(201).json({ success: true, data: interview });
  } catch (err) {
    // Check for specific 2026 error codes like 429 for quota
    res.status(500).json({ error: err.message });
  }
});

module.exports = chatRoute;