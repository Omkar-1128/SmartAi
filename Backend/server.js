import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8080;
app.listen(PORT, (req, res) => {
  console.log(`Listening on port ${PORT}`);
});

app.post("/chat", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: req.body.message }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      options
    );

    const data = await response.json();
    console.log(data.candidates[0].content.parts[0].text);
    res.send(data.candidates[0].content.parts[0].text);
  } catch (e) {
    console.log("Error Occured: " + e);
  }
});