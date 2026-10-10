import {
  getBusinessLocation,
  hasPublishedBusinessLocation,
  type StudioBusinessLocation,
} from "../lib/studioBranding";

/**
 * Published business location, or `null` while leadership approval is TBC.
 * Do not fall back to the previous product address.
 */
export const BUSINESS_LOCATION: StudioBusinessLocation | null = getBusinessLocation();

export function hasBusinessLocation(): boolean {
  return hasPublishedBusinessLocation() && BUSINESS_LOCATION !== null;
}

/** Single-line address for map queries and iframe titles. */
export function formatBusinessAddress(): string | null {
  if (!BUSINESS_LOCATION) {
    return null;
  }
  const { addressLine1, addressLine2, country } = BUSINESS_LOCATION;
  return [addressLine1, addressLine2, country].filter(Boolean).join(", ");
}

/** Display lines for the Contact page office block. */
export function formatBusinessAddressLines(): string[] {
  if (!BUSINESS_LOCATION) {
    return [];
  }
  return [BUSINESS_LOCATION.addressLine1, BUSINESS_LOCATION.addressLine2].filter(Boolean);
}

export function buildGoogleMapsEmbedUrl(): string | null {
  if (!BUSINESS_LOCATION) {
    return null;
  }

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

  // Fallback embed that does not require an API key (still unpublished when location is TBC).
  return `https://maps.google.com/maps?q=${placeQuery}&z=16&output=embed`;
}

export function buildGoogleMapsOpenUrl(): string | null {
  if (!BUSINESS_LOCATION) {
    return null;
  }
  const query = encodeURIComponent(
    `${BUSINESS_LOCATION.addressLine1}, ${BUSINESS_LOCATION.addressLine2}, ${BUSINESS_LOCATION.country}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
