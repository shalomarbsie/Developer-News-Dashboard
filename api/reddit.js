// api/reddit.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { subreddit } = req.query;
  if (!subreddit) return res.status(400).json({ error: "Missing subreddit" });

  let posts = [];
  let after = null;

  try {
    while (posts.length < 50) {
      const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=25${
        after ? `&after=${after}` : ""
      }`;

      console.log(`Fetching: ${url}`);

      const response = await fetch(url, {
        headers: {
          "User-Agent": "DevNewsDashboard/1.0 (https://vercel.app/)",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Reddit API error ${response.status}: ${text || "No details"}`
        );
      }

      const data = await response.json();
      const children = data?.data?.children || [];

      if (!children.length) break;

      posts = posts.concat(children);
      after = data.data.after;
      if (!after) break;
    }

    return res.status(200).json({ data: { children: posts } });
  } catch (err) {
    console.error("Reddit API fetch failed:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch Reddit", details: err.message });
  }
}
