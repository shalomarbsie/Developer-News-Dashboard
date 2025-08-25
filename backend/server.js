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
  let posts = [];
  let after = null;

  try {
    while (posts.length < 50) {
      const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=25${after ? `&after=${after}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();

      const children = data.data.children;
      if (!children.length) break;

      posts = posts.concat(children);
      after = data.data.after;
      if (!after) break; // no more pages
    }

    console.log(`Fetched ${posts.length} posts from Reddit`);
    res.json({ data: { children: posts } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Reddit" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});