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

// Function to detect user's location and return closest region
export async function detectUserRegion(): Promise<string> {
  return new Promise((resolve) => {
    // Default to AP if location detection fails or user denies
    const defaultRegion = "ap";

    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      resolve(defaultRegion);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find closest region based on distance
        let closestRegion = ValorantRegionalServers[0];
        let minDistance = calculateDistance(
          latitude,
          longitude,
          closestRegion.coordinates.lat,
          closestRegion.coordinates.lng,
        );

        ValorantRegionalServers.forEach((region) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            region.coordinates.lat,
            region.coordinates.lng,
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestRegion = region;
          }
        });

        console.log(
          `Detected region: ${closestRegion.label} (${Math.round(minDistance)} km away)`,
        );
        resolve(closestRegion.code);
      },
      (error) => {
        console.log("Geolocation error:", error.message);
        resolve(defaultRegion);
      },
      { timeout: 5000 },
    );
  });
}

// Function to detect region from IP (alternative method)
export async function detectRegionFromIP(): Promise<string> {
  try {
    // Using ipapi.co for free IP geolocation
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();
    const countryCode = data.country_code;

    // Map country codes to regions
    const countryToRegion: Record<string, string> = {
      // North America
      US: "na",
      CA: "na",
      MX: "latam",
      // Latin America
      BR: "br",
      AR: "latam",
      CO: "latam",
      CL: "latam",
      PE: "latam",
      // Europe
      GB: "eu",
      DE: "eu",
      FR: "eu",
      ES: "eu",
      IT: "eu",
      NL: "eu",
      SE: "eu",
      PL: "eu",
      TR: "eu",
      AE: "eu",
      ZA: "eu",
      // Asia Pacific
      SG: "ap",
      MY: "ap",
      ID: "ap",
      PH: "ap",
      TH: "ap",
      VN: "ap",
      IN: "ap",
      HK: "ap",
      AU: "ap",
      NZ: "ap",
      JP: "ap",
      // Korea
      KR: "kr",
    };

    return countryToRegion[countryCode] || "ap";
  } catch (error) {
    console.log("IP detection failed:", error);
    return "ap";
  }
}
