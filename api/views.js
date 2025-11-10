// /api/views.js
import { createClient } from "redis";

let redis;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({ url: process.env.REDIS_URL });
    redis.on("error", (err) => console.error("Redis connection error:", err));
    await redis.connect();
  }
  return redis;
}

export default async function handler(req, res) {
  try {
    const client = await getRedisClient();
    const { searchParams } = new URL(req.url, "http://localhost");
    const noIncrement = searchParams.get("noIncrement");

    let newCount;

    if (noIncrement) {
      const currentCount = await client.get("gyanpath_global_views");
      newCount = currentCount || 0;
    } else {
      newCount = await client.incr("gyanpath_global_views");
    }

    res.status(200).json({ count: Number(newCount) });
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ error: "Failed to update view count" });
  }
}
