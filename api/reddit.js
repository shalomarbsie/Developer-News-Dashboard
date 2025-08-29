// api/reddit.js (Vercel serverless version of server.js)
export default async function handler(req, res) {
  const { subreddit } = req.query;
  if (!subreddit) return res.status(400).json({ error: "Missing subreddit" });

  let posts = [];
  let after = null;

  try {
    while (posts.length < 50) {
      const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=25${after ? `&after=${after}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Reddit API error: ${response.status}`);
      const data = await response.json();

      const children = data?.data?.children || [];
      if (!children.length) break;

      posts = posts.concat(children);
      after = data.data.after;
      if (!after) break;
    }

    res.status(200).json({ data: { children: posts } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Reddit" });
  }
}
