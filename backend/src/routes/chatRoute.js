const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const protect = require("../middlewares/authMiddleware");
const Interview = require("../models/Interview");
const chatRoute = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateInterviewQA(skill) {
  const prompt = `Generate 10 mock interview questions and answers on "${skill}". Return ONLY a valid JSON array. Format: [{"question": "string", "answer": "string"}]`;
  
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
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
    res.status(500).json({ error: err.message });
  }
});

module.exports = chatRoute;