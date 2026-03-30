import type { LocationWithRegion } from "src/types/type-user";

interface Region {
  code: string;
  label: string;
  servers: string[];
  coordinates: { lat: number; lng: number };
}

export const ValorantRegionalServers: Region[] = [
  {
    code: "na",
    label: "North America (NA)",
    servers: [
      "Georgia",
      "Illinois",
      "Texas",
      "N. Virginia",
      "Oregon",
      "N. California",
      "Any",
    ],
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  {
    code: "latam",
    label: "Latin America (LATAM)",
    servers: ["Bogotá", "Chicago", "Mexico City", "Miami", "Santiago", "Any"],
    coordinates: { lat: 4.7111, lng: -74.0721 },
  },
  {
    code: "br",
    label: "Brazil (BR)",
    servers: ["São Paulo", "Any"],
    coordinates: { lat: -23.5505, lng: -46.6333 },
  },
  {
    code: "eu",
    label: "Europe (EU)",
    servers: [
      "Bahrain",
      "Cape Town",
      "Dubai",
      "Frankfurt",
      "Istanbul",
      "London",
      "Madrid",
      "Paris",
      "Stockholm",
      "Tokyo",
      "Warsaw",
      "Any",
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  {
    code: "ap",
    label: "Asia Pacific (AP)",
    servers: [
      "Hong Kong",
      "Manila",
      "Mumbai",
      "Tokyo",
      "Singapore",
      "Sydney",
      "Any",
    ],
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    code: "kr",
    label: "Korea (KR)",
    servers: ["Seoul", "Any"],
    coordinates: { lat: 37.5665, lng: 126.978 },
  },
];

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getUserRegionSmart(): Promise<LocationWithRegion> {
  try {
    const res = await fetch("http://ip-api.com/json/");
    const data = await res.json();

    const { country, countryCode, lat, lon } = data;

    // fallback
    if (!lat || !lon) {
      return {
        country,
        countryCode,
        region: "ap",
        regionLabel: "Asia Pacific (AP)",
      };
    }

    let closestRegion = ValorantRegionalServers[0];
    let minDistance = calculateDistance(
      lat,
      lon,
      closestRegion.coordinates.lat,
      closestRegion.coordinates.lng,
    );

    ValorantRegionalServers.forEach((region) => {
      const dist = calculateDistance(
        lat,
        lon,
        region.coordinates.lat,
        region.coordinates.lng,
      );

      if (dist < minDistance) {
        minDistance = dist;
        closestRegion = region;
      }
    });

    return {
      country,
      countryCode,
      region: closestRegion.code,
      regionLabel: closestRegion.label,
    };
  } catch (error) {
    console.log("Detection failed:", error);
    return {
      country: "Unknown",
      countryCode: "XX",
      region: "ap",
      regionLabel: "Asia Pacific (AP)",
    };
  }
}
