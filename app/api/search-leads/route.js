import axios from "axios";
import { classifyWebsite } from "@/lib/digitalStatus";
import { categoryFromTypes, parseEgyptPhone } from "@/lib/formatters";

const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,places.types,nextPageToken";

function roundRating(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  const clamped = Math.min(5, Math.max(1, n));
  return Math.round(clamped * 2) / 2;
}

function mapPlace(place) {
  const phoneInfo = parseEgyptPhone(
    place.nationalPhoneNumber,
    place.internationalPhoneNumber,
  );

  return {
    placeId: place.id,
    name: place.displayName?.text || "بدون اسم",
    category: categoryFromTypes(place.types || []),
    types: place.types || [],
    rating: place.rating ?? null,
    reviews: place.userRatingCount ?? 0,
    address: place.formattedAddress || "",
    phone: phoneInfo.local || place.nationalPhoneNumber || place.internationalPhoneNumber || "",
    phoneInfo,
    websiteUri: place.websiteUri || null,
    digitalStatus: classifyWebsite(place.websiteUri),
    mapsUri: place.googleMapsUri || null,
  };
}

export async function POST(request) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "GOOGLE_PLACES_API_KEY is missing. Copy .env.local.example to .env.local and add your Places API (New) key.",
      },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = String(body.query || "").trim();
  if (!query) {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  const minReviews = Number(body.minReviews) || 0;
  const minRating = roundRating(body.minRating);
  const pageToken = body.pageToken || undefined;

  const payload = {
    textQuery: query,
    languageCode: "ar",
    regionCode: "EG",
    pageSize: 20,
  };

  if (minRating) payload.minRating = minRating;
  if (pageToken) payload.pageToken = pageToken;

  try {
    const { data } = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        timeout: 20000,
      },
    );

    const rawPlaces = data.places || [];
    const mapped = rawPlaces.map(mapPlace);
    const leads = mapped.filter((lead) => (lead.reviews || 0) >= minReviews);

    return Response.json({
      leads,
      nextPageToken: data.nextPageToken || null,
      rawCount: rawPlaces.length,
      filteredCount: leads.length,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const googleMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.error?.status ||
      error.message;

    return Response.json(
      {
        error: googleMessage,
        details: error.response?.data || null,
      },
      { status },
    );
  }
}
