import { NextResponse } from "next/server";
import cacheManager from "@/lib/cache/manager";
import { adminDb } from "@/lib/firebase/admin";
import { generateSteps } from "@/lib/steps";
import { Apartment } from "@/types/apartment";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const optionsCacheKey = "chatbot:options_v4"; // Updated cache key
    const apartmentsCacheKey = "apartments:all";

    // Try to get cached options first
    const cachedData = await cacheManager.get(optionsCacheKey);
    if (cachedData) {
      return NextResponse.json({ from: "cache", data: cachedData });
    }

    let apartments: Apartment[] = [];
    const cachedApartments = await cacheManager.get(apartmentsCacheKey);

    if (Array.isArray(cachedApartments) && cachedApartments.length > 0) {
      apartments = cachedApartments as Apartment[];
    } else {
      const snapshot = await adminDb.collection("apartments").get();
      apartments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Apartment[];

      if (apartments.length > 0) {
        // Cache apartments for future use
        await cacheManager.set(apartmentsCacheKey, apartments, 60 * 60 * 24);
      }
    }
    
    // Generate steps (which include general options like goal, budget, rooms)
    const steps = generateSteps(apartments);

    const optionsMap: Record<string, string[] | null> = {};
    steps.forEach(step => {
      optionsMap[step.id] = step.options;
    });

    // Remove 'city' from optionsMap as it will be dynamic
    if (optionsMap.city) {
      optionsMap.city = null; // Or [] if you prefer an empty array
    }

    // Generate region-city map
    const regionCityMap: Record<string, string[]> = {};
    apartments.forEach(apartment => {
      if (apartment.region && apartment.settlement) {
        if (!regionCityMap[apartment.region]) {
          regionCityMap[apartment.region] = [];
        }
        if (!regionCityMap[apartment.region].includes(apartment.settlement)) {
          regionCityMap[apartment.region].push(apartment.settlement);
        }
      }
    });

    // Sort cities within each region alphabetically
    for (const region in regionCityMap) {
      regionCityMap[region].sort((a, b) => a.localeCompare(b));
    }

    const dataToCache = { optionsMap, regionCityMap };

    // Cache the generated data
    await cacheManager.set(optionsCacheKey, dataToCache, 60 * 60 * 24);

    return NextResponse.json({ from: "generated", data: dataToCache });
  } catch (error) {
    console.error("API Options: Error generating/caching options:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
