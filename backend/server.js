// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env

const app = express();
const PORT = 3000;

app.use(cors());

// Reddit OAuth credentials from .env
const CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const USERNAME = process.env.REDDIT_USERNAME;
const PASSWORD = process.env.REDDIT_PASSWORD;
const USER_AGENT = "web:dev-news-dashboard:v1.0.0 (by /u/Champagne-Shady)"; 

// Helper: get OAuth token
async function getRedditToken() {
  const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: USERNAME,
      password: PASSWORD,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Reddit proxy route
app.get("/reddit/:subreddit", async (req, res) => {
  const { subreddit } = req.params;

  try {
    const token = await getRedditToken();
    let posts = [];
    let after = null;

    while (posts.length < 50) {
      const url = `https://oauth.reddit.com/r/${subreddit}/hot?limit=25${after ? `&after=${after}` : ""}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": USER_AGENT,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Reddit API error ${response.status}: ${text}`);
      }

      const data = await response.json();
      const children = data?.data?.children || [];
      if (!children.length) break;

      posts = posts.concat(children);
      after = data.data.after;
      if (!after) break;
    }

    res.json({ data: { children: posts } });
  } catch (err) {
    console.error("Reddit fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch Reddit", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
