import { NextResponse } from "next/server";

const mockGoogleReviews = [
  {
    id: "google_1",
    author_name: "Jennifer Walsh",
    author_url: "...",
    language: "en",
    profile_photo_url: "...",
    rating: 5,
    relative_time_description: "2 weeks ago",
    text: "Absolutely fantastic stay! The property was immaculate and exactly as described...",
    time: 1704067200,
    place_id: "...",
    listing_name: "2B N1 A - 29 Shoreditch Heights",
  },
  {
    id: "google_2",
    author_name: "Marcus Thompson",
    author_url: "...",
    language: "en",
    profile_photo_url: "...",
    rating: 4,
    relative_time_description: "1 month ago",
    text: "Great property in an excellent location. Check-in was smooth...",
    time: 1701388800,
    place_id: "...",
    listing_name: "1B N2 B - Central Soho Flat",
  },
  {
    id: "google_3",
    author_name: "Sophie Chen",
    author_url: "...",
    language: "en",
    profile_photo_url: "...",
    rating: 5,
    relative_time_description: "3 weeks ago",
    text: "Perfect for our London trip! The property is beautifully maintained...",
    time: 1703462400,
    place_id: "...",
    listing_name: "3B N3 C - Hyde Park Apartment",
  },
  {
    id: "google_4",
    author_name: "David Wilson",
    author_url: "...",
    language: "en",
    profile_photo_url: "...",
    rating: 4,
    relative_time_description: "2 months ago",
    text: "Lovely studio apartment with great character...",
    time: 1700000000,
    place_id: "...",
    listing_name: "Studio N4 D - Camden Loft",
  },
];

interface NormalizedGoogleReview {
  id: string;
  type: "google-review";
  status: "published";
  rating: number;
  review: string;
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: "Google"; // This property is required
  approved?: boolean;
  googleData: {
    author_url: string;
    profile_photo_url: string;
    relative_time_description: string;
    place_id: string;
  };
}

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Faster mock response

    const normalizedReviews: NormalizedGoogleReview[] = mockGoogleReviews.map(
      (review) => ({
        id: review.id,
        type: "google-review",
        status: "published",
        rating: review.rating,
        review: review.text,
        submittedAt: new Date(review.time * 1000).toISOString(),
        guestName: review.author_name,
        listingName: review.listing_name,
        channel: "Google", // <-- FIX: Added the missing 'channel' property
        approved: false, // Default approval status
        googleData: {
          author_url: review.author_url,
          profile_photo_url: review.profile_photo_url,
          relative_time_description: review.relative_time_description,
          place_id: review.place_id,
        },
      })
    );

    const summary = {
      totalReviews: normalizedReviews.length,
      averageRating:
        normalizedReviews.reduce((sum, r) => sum + r.rating, 0) /
        normalizedReviews.length,
    };

    return NextResponse.json({
      status: "success",
      data: {
        reviews: normalizedReviews,
        summary: summary,
      },
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch Google reviews" },
      { status: 500 }
    );
  }
}
