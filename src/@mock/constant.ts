import type { LocationWithRegion } from "src/types/type-user";

export type Region = {
  code: "ap" | "na" | "latam" | "br" | "eu" | "kr";
  label: string;
  servers: string[];
  coordinates: { lat: number; lng: number };
};

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

export const getUserRegionSmart = (): Promise<LocationWithRegion | null> =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        let country = "Detected";
        let countryCode = "XX";

        // Try to get country from coordinates
        try {
          // Try OpenStreetMap first (free, no API key)
          const osmResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`,
          );
          const osmData = await osmResponse.json();

          if (osmData.address?.country) {
            const { country: osmCountry, country_code } = osmData.address;
            country = osmCountry;
            countryCode = country_code?.toUpperCase() || "XX";
          }
        } catch (error) {
          console.log("OSM geocoding failed, trying fallback");

          // Fallback to BigDataCloud
          try {
            const bdcResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            );
            const bdcData = await bdcResponse.json();

            if (bdcData.countryName) {
              country = bdcData.countryName;
              countryCode = bdcData.countryCode || "XX";
            }
          } catch (fallbackError) {
            console.log("All geocoding attempts failed");
          }
        }

        // Find closest region
        let closestRegion = ValorantRegionalServers[0];
        let minDistance = calculateDistance(
          latitude,
          longitude,
          closestRegion.coordinates.lat,
          closestRegion.coordinates.lng,
        );

        ValorantRegionalServers.forEach((region) => {
          const dist = calculateDistance(
            latitude,
            longitude,
            region.coordinates.lat,
            region.coordinates.lng,
          );

          if (dist < minDistance) {
            minDistance = dist;
            closestRegion = region;
          }
        });

        resolve({
          country,
          countryCode,
          region: closestRegion.code,
          regionLabel: closestRegion.label,
        });
      },
      (error) => {
        console.log("Geolocation error:", error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  });
