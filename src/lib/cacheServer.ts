import cacheManager from "@/lib/cache/manager";
import { fetchApartments } from "@/lib/fetchAppartments";
import type { Apartment } from "@/types/apartment";

export async function getCachedApartments(): Promise<Apartment[]> {
  return cacheManager.getOrSet("apartments:all", async () => {
    const data = await fetchApartments(); 
    return data;
  });
}
