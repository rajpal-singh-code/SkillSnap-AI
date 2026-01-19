const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const protect = require("../middlewares/authMiddleware");
const Interview = require("../models/Interview");
const chatRoute = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateInterviewQA(skill) {
  // Explicitly set the API version to v1 to avoid the 404 on v1beta
  const model = genAI.getGenerativeModel(
    { model: "gemini-2.0-flash" }, // Use gemini-2.0-flash as the stable standard
    { apiVersion: "v1" } 
  );

  const prompt = `Generate 10 mock interview questions and answers on "${skill}". Return ONLY a valid JSON array. Format: [{"question": "string", "answer": "string"}]`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
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
    res.status(500).json({ error: err.message });
  }
});

module.exports = chatRoute;