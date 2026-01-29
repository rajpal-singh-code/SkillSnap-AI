const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const protect = require("../middlewares/authMiddleware");
const Interview = require("../models/Interview");
const dotenv = require("dotenv");

const chatRoute = express.Router();

dotenv.config();
const interviewRoute = express.Router();

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model selection
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Function to generate interview Q&A
async function generateInterviewQA(skill) {
  const prompt = `
Return only valid JSON array. No markdown, no text outside JSON.

Generate 10 mock interview questions and answers on "${skill}".
Each answer must be a 2-3 line paragraph.

Format:
[
  {"question": "string", "answer": "string"}
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // console.log("Gemini output:", text);

    const match = text.match(/\[([\s\S]*)\]/);
    const questionsArray = match ? JSON.parse(match[0]) : [];

    return { QnA_On: skill, questions: questionsArray };
  } catch (error) {
    console.error("Error generating:", error);
    return { QnA_On: skill, questions: [] };
  }
}

// POST route to trigger AI interview generation
chatRoute.post("/generate", async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ error: "Skill is required." });
    }

    // Generate interview Q&A
    const qaList = await generateInterviewQA(skill);

    // Save properly structured document
    const newData = new Interview({
      user: req.user._id,
      userFullName: req.user.fullName,
      QnA_On: qaList.QnA_On,
      questions: qaList.questions,
    });

    // console.log(qaList.questions);

    if (!qaList.questions || qaList.questions.length === 0) {
      return res.status(400).json({
        success: true,
        message: "Questions not generated. Try again later!!",
      });
    }

    // Only save if questions exist
    await newData.save();
    res.status(200).json({
      success: true,
      data: {
        status: "pending",
        QnA_On: qaList.QnA_On,
        questions: qaList.questions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

chatRoute.get("/history", protect, async (req, res) => {
  try {
    const history = await Interview.find({});

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
