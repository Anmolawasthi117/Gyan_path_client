// /api/views.js
import { createClient } from "redis";

let redis;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL, // Add this in Vercel env vars
    });

    redis.on("error", (err) => console.error("Redis connection error:", err));
    await redis.connect();
  }
  return redis;
}

export default async function handler(req, res) {
  try {
    const client = await getRedisClient();

    // Increment and fetch updated count atomically
    const newCount = await client.incr("gyanpath_global_views");

    res.status(200).json({ count: newCount });
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ error: "Failed to update view count" });
  }
}
