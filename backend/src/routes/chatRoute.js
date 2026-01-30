const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Interview = require("../models/Interview");
const protect = require("../middlewares/authMiddleware");
const dotenv = require("dotenv");

dotenv.config();

const chatRoute = express.Router();

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

/**
 * Generate interview Q&A using Gemini
 */
async function generateInterviewQA(skill) {
  const prompt = `
Return ONLY a valid JSON array.
No markdown, no explanation, no extra text.

Generate 10 mock interview questions and answers on "${skill}".
Each answer must be a 2–3 line paragraph.

Format:
[
  { "question": "string", "answer": "string" }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON safely
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      return { QnA_On: skill, questions: [] };
    }

    const questionsArray = JSON.parse(match[0]);

    return {
      QnA_On: skill,
      questions: questionsArray,
    };
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return { QnA_On: skill, questions: [] };
  }
}

/**
 * @route   POST /api/chat/generate
 * @desc    Generate interview questions
 * @access  Private
 */
chatRoute.post("/generate", protect, async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required",
      });
    }

    const qaList = await generateInterviewQA(skill);

    if (!qaList.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Questions not generated. Please try again.",
      });
    }

    const interview = new Interview({
      user: req.user._id,
      QnA_On: qaList.QnA_On,
      questions: qaList.questions,
      status: "pending",
    });

    await interview.save();

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/chat/history
 * @desc    Get user's interview history
 * @access  Private
 */
chatRoute.get("/history", protect, async (req, res) => {
  try {
    const history = await Interview.find({ user: req.user._id })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = chatRoute;
