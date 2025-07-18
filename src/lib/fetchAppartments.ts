import { Redis } from "@upstash/redis";
import { adminDb } from "./firebase/admin";

const redis = Redis.fromEnv();

export async function fetchApartments() {
  const cached = await redis.get("apartments:all");
  if (cached) return JSON.parse(cached as string);

  const snapshot = await adminDb.collection("apartments").get();
  const kvartiry = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  await redis.set("apartments:all", JSON.stringify(kvartiry), { ex: 86400 });
  return kvartiry;
}

