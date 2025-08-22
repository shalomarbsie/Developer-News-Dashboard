import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

// allow requests from your frontend
app.use(cors());

// Reddit proxy route
app.get("/reddit/:subreddit", async (req, res) => {
  const { subreddit } = req.params;
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/top.json?limit=10`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Reddit" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});