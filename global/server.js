const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  const { who, what } = req.body;

  const messages = [
    {
      role: "system",
      content: process.env.PROMPT,
    },
    { role: "user", content: `${who}가 ${what} 잘못을 했습니다.` },
  ];

  const data = {
    model: "gpt-4o",
    messages: messages,
    temperature: 0.5,
    n: 1,
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
