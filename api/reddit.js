async function getRedditToken() {
  const basicAuth = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token fetch failed: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}

export default async function handler(req, res) {
  const { subreddit } = req.query;
  if (!subreddit) {
    return res.status(400).json({ error: "Missing subreddit" });
  }

  try {
    const token = await getRedditToken();
    let posts = [];
    let after = null;

    // Fetch up to 50 top posts
    while (posts.length < 50) {
      const url = `https://oauth.reddit.com/r/${subreddit}/top?limit=25${after ? `&after=${after}` : ""}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": "DevNewsDashboard/1.0 (by u/yourusername)",
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

    return res.status(200).json({ data: { children: posts } });
  } catch (error) {
    console.error("Reddit API fetch failed:", error);
    return res.status(500).json({ error: "Failed to fetch Reddit" });
  }
}
