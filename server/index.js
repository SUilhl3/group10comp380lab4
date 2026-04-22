const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
// const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors({origin: "https://group10comp380lab4.vercel.app/"}));
app.use(express.json());

const client = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

app.post("/api/generate", async (req, res) => {
  try {
    const { destination, days, budget, interests } = req.body;

    const systemPrompt = `
You are a travel itinerary planner.
Your task is to create a clear day-by-day travel itinerary.
Only provide travel planning content.
Include morning, afternoon, and evening suggestions for each day.
Consider the user's budget and interests.
Do not answer unrelated questions.
`;

    const userPrompt = `
Create a ${days}-day travel itinerary for ${destination}.
Budget: ${budget}
Interests: ${interests}
`;

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt
    });

    res.json({
      result: response.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong while generating the itinerary.", details: error.message });
  }
});

const PORT = "https://group10comp380lab4.onrender.com";
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});