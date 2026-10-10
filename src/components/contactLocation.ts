/**
 * Business location used by the Contact page map embed and address block.
 */
export const BUSINESS_LOCATION = {
  name: "ADealForge",
  addressLine1: "UL. TARGOWA 66A / 26",
  addressLine2: "03-734 WARSZAWA",
  city: "Warszawa",
  region: "",
  postalCode: "03-734",
  country: "Poland",
  /** Approximate pin for Ul. Targowa 66A, Praga-Północ, Warsaw. */
  latitude: 52.25165,
  longitude: 21.04085,
} as const;

/** Single-line address for map queries and iframe titles. */
export function formatBusinessAddress(): string {
  const { addressLine1, addressLine2, country } = BUSINESS_LOCATION;
  return [addressLine1, addressLine2, country].filter(Boolean).join(", ");
}

/** Display lines for the Contact page office block. */
export function formatBusinessAddressLines(): string[] {
  return [BUSINESS_LOCATION.addressLine1, BUSINESS_LOCATION.addressLine2].filter(Boolean);
}

export function buildGoogleMapsEmbedUrl(): string {
  const apiKey = (
    import.meta.env as Record<string, string | undefined>
  ).VITE_GOOGLE_MAPS_EMBED_API_KEY?.trim();
  const placeQuery = encodeURIComponent(
    `${BUSINESS_LOCATION.addressLine1}, ${BUSINESS_LOCATION.addressLine2}, ${BUSINESS_LOCATION.country}`
  );
  const { latitude, longitude } = BUSINESS_LOCATION;

  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${placeQuery}&zoom=16&center=${latitude},${longitude}`;
  }

  return `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
}

/** External Google Maps place URL for “Open in Google Maps”. */
export function buildGoogleMapsOpenUrl(): string {
  const placeQuery = encodeURIComponent(
    `${BUSINESS_LOCATION.addressLine1}, ${BUSINESS_LOCATION.addressLine2}, ${BUSINESS_LOCATION.country}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${placeQuery}`;
}
