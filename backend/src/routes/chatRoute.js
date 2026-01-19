const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const protect = require("../middlewares/authMiddleware");
const Interview = require("../models/Interview");

const chatRoute = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateInterviewQA(skill) {
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Generate 10 mock interview questions and answers on "${skill}". 
Return ONLY a valid JSON array in this exact format:
[{"question": "string", "answer": "string"}]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON array from AI response");
    }

    const questions = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI response is not a valid array of questions");
    }

    return questions;
  } catch (error) {
    console.error("Gemini API error details:", error);
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

    const trimmedSkill = skill.trim();
    const questions = await generateInterviewQA(trimmedSkill);

    const interview = await Interview.create({
      user: req.user._id,
      QnA_On: trimmedSkill,
      questions,
    });

    return res.status(201).json({
      success: true,
      data: interview
    });

  } catch (err) {
    console.error("Generate interview route error:", err);

    let status = 500;
    let message = err.message;

    if (message.includes("quota") || message.includes("rate limit")) {
      status = 429;
      message = "Rate limit exceeded - please try again later or check your Gemini API quota";
    } else if (message.includes("not found") || message.includes("404")) {
      status = 503;
      message = "Gemini model temporarily unavailable - please contact support";
    }

    return res.status(status).json({
      success: false,
      error: message
    });
  }
});

module.exports = chatRoute;