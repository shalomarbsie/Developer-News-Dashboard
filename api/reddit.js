export default async function handler(req, res) {
  const { subreddit } = req.query;
  if (!subreddit) return res.status(400).json({ error: "Missing subreddit" });

  try {
    const token = await getRedditToken();
    let posts = [];
    let after = null;

    while (posts.length < 50) {
      const url = `https://oauth.reddit.com/r/${subreddit}/top?limit=25${after ? `&after=${after}` : ""}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": "DevNewsDashboard/1.0 by u/yourusername",
        },
      });

      if (!response.ok) throw new Error(`Reddit API error ${response.status}`);
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
    return res.status(500).json({ error: "Failed to fetch Reddit" });
  }
}
