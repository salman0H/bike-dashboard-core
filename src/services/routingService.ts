// src/services/routingService.ts
export interface RoutingPoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteStep {
  name: string;
  instruction: string;
  distance: { value: number; text: string };
  duration: { value: number; text: string };
  polyline: string;
  start_location: [number, number];
  type: string;
  rotaryName?: string;
  modifier?: string;
  exit?: number;
}

export interface Route {
  overview_polyline: { points: string };
  legs: Array<{
    summary: string;
    distance: { value: number; text: string };
    duration: { value: number; text: string };
    steps: RouteStep[];
  }>;
}

export interface RoutingResponse {
  routes: Route[];
}

// Decode polyline (you'll need to implement or use a library)
// For now, we'll create a simple decoder
export function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

export async function getRoute(
  origin: RoutingPoint,
  destination: RoutingPoint,
  apiKey: string,
  type: "car" | "bike" | "walk" = "bike"
): Promise<RoutingResponse | null> {
  try {
    const url = `https://api.neshan.org/v4/direction?type=${type}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&alternative=false`;
    
    const response = await fetch(url, {
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Routing API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}