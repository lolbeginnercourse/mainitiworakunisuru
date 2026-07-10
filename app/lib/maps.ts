export type TravelMode = "walking" | "transit" | "driving";

export function createGoogleMapsRouteUrl(
  origin: string,
  destination: string,
  travelMode: TravelMode,
) {
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: travelMode,
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
