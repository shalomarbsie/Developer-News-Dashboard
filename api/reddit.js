import fetch from 'node-fetch';

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const REDDIT_USERNAME = process.env.REDDIT_USERNAME;
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD;

// Helper to get OAuth token
async function getRedditToken() {
  const creds = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'web:dev-news-dashboard:v1.0.0 (by /u/YOUR_USERNAME)',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: REDDIT_USERNAME,
      password: REDDIT_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`Token fetch failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  try {
    const { subreddit = 'programming' } = req.query;

    const token = await getRedditToken();

    const redditRes = await fetch(
      `https://oauth.reddit.com/r/${subreddit}/hot?limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'web:dev-news-dashboard:v1.0.0 (by /u/YOUR_USERNAME)', // 👈 Required
        },
      }
    );

    if (!redditRes.ok) {
      const text = await redditRes.text();
      throw new Error(`Reddit API error ${redditRes.status}: ${text}`);
    }

    const posts = await redditRes.json();
    res.status(200).json(posts);
  } catch (err) {
    console.error('Reddit API fetch failed:', err);
    res.status(500).json({ error: err.message });
  }
}
