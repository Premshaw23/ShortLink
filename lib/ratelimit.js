// lib/ratelimit.js
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Redis connection
const redis = Redis.fromEnv();

// Create a rate limiter allowing 5 requests every 10 seconds per IP
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"), // e.g., 5 reqs per 10 sec
  analytics: true,
});
