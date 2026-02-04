const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middlewares/authMiddleware");
const Interviews = require("../models/Interview");

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
interviewRoute.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ error: "Skill is required." });
    }

    // Generate interview Q&A
    const qaList = await generateInterviewQA(skill);

    // Save properly structured document
    const newData = new Interviews({
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
      status: "pending",
      QnA_On: qaList.QnA_On,
      questions: qaList.questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

interviewRoute.patch("/update/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Interviews.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status: "completed" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Interview not found or not authorized to update.",
      });
    }

    res.status(200).json({
      message: "STATUS Updated successfully",
      updated,
    });
  } catch (err) {
    res.status(400).json({ message: "Something wend wrong" });
  }
});

//single detailed interview
interviewRoute.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    // const loggedIUserID = req.user._id;

    const singleInterview = await Interviews.findOne({
      _id: id,
      // user: loggedIUserID,
    });

    if (!singleInterview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found OR unauthorized!",
      });
    }

    res.status(200).json({
      message: "Signle interview fetched successfully",
      data: singleInterview,
    });
  } catch (err) {
    res.status(400).json({ message: "Something wend wrong" });
  }
});

module.exports = interviewRoute;