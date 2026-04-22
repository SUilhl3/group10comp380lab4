const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    res.json({
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong while generating the itinerary." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});