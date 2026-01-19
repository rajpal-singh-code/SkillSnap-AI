const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const protect = require("../middlewares/authMiddleware");
const Interview = require("../models/Interview");

const chatRoute = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateInterviewQA(skill) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Generate 10 mock interview questions and answers on "${skill}". 
Return ONLY a valid JSON array in this exact format:
[{"question": "string", "answer": "string"}]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON array - handles code blocks, extra text, etc.
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON array from AI response");
    }

    const questions = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(questions)) {
      throw new Error("AI response is not an array");
    }

    return questions;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

chatRoute.post("/generate", protect, async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill || typeof skill !== "string" || skill.trim() === "") {
      return res.status(400).json({ 
        success: false,
        error: "Valid skill name is required" 
      });
    }

    const questions = await generateInterviewQA(skill.trim());

    const interview = await Interview.create({
      user: req.user._id,
      QnA_On: skill.trim(),
      questions,
    });

    return res.status(201).json({
      success: true,
      data: interview
    });

  } catch (err) {
    console.error("Generate interview error:", err);

    const status = err.message.includes("quota") || err.message.includes("rate limit") 
      ? 429 
      : 500;

    return res.status(status).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = chatRoute;