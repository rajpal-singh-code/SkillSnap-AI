const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const protect = require("../middlewares/authMiddleware");
const Interview = require("../models/Interview");
const chatRoute = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateInterviewQA(skill) {
  // Use gemini-3-flash with stable v1 API version to avoid 404
  const model = genAI.getGenerativeModel(
    { model: "gemini-3-flash" }, 
    { apiVersion: "v1" }
  );

  const prompt = `Generate 10 mock interview questions and answers on "${skill}". Return ONLY a valid JSON array. Format: [{"question": "string", "answer": "string"}]`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Robustly extract JSON from potential markdown backticks
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("AI failed to provide a valid JSON array");
  
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
    // If you see "429 Too Many Requests", your free quota is exhausted
    res.status(500).json({ error: err.message });
  }
});

module.exports = chatRoute;