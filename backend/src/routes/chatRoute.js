const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const protect = require("../middlewares/authMiddleware");
const Interview = require("../models/Interview");

const chatRoute = express.Router();
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateInterviewQA(skill) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Generate exactly 10 mock interview questions with detailed answers for "${skill}".
Return ONLY clean valid JSON array. No markdown, no code blocks, no extra text.
Format:
[
  {"question": "Question text", "answer": "Full detailed answer"},
  ...
]`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.output_text.trim();
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```$/g, "").trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");
    let jsonStr = jsonMatch[0];
    jsonStr = jsonStr.replace(/'/g, '"');
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");
    const questions = JSON.parse(jsonStr);
    if (!Array.isArray(questions) || questions.length !== 10) throw new Error("Invalid questions array (expected 10 items)");
    const isValid = questions.every(
      (q) =>
        q &&
        typeof q.question === "string" &&
        q.question.trim() !== "" &&
        typeof q.answer === "string" &&
        q.answer.trim() !== ""
    );
    if (!isValid) throw new Error("Some question or answer is empty/invalid");
    return questions;
  } catch (error) {
    console.error("Gemini error:", error.message);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

chatRoute.post("/generate", protect, async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill || typeof skill !== "string" || skill.trim() === "") {
      return res.status(400).json({ success: false, error: "Valid skill name is required" });
    }
    const trimmedSkill = skill.trim();
    const questions = await generateInterviewQA(trimmedSkill);
    const interview = await Interview.create({
      user: req.user._id,
      QnA_On: trimmedSkill,
      questions,
    });
    return res.status(201).json({ success: true, data: interview });
  } catch (err) {
    console.error("Route error:", err);
    let status = 500;
    let message = err.message;
    if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate limit")) {
      status = 429;
      message = "Rate limit exceeded - try again later";
    }
    return res.status(status).json({ success: false, error: message });
  }
});

module.exports = chatRoute;
