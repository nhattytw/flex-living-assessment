import { NextResponse } from "next/server";

// Define a type for the shape of a review for consistency
interface Review {
  id: number | string;
  listingName: string;
  rating: number | null;
  submittedAt: string;
  channel: string;
  // Add other properties as needed
  [key: string]: any;
}

// Define the type for the accumulator in the reduce function
type ListingGroup = {
  listing: string;
  count: number;
  totalRating: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const listingId =
      searchParams.get("listingId") || searchParams.get("listing");

    const hostawayUrl = `${origin}/api/reviews/hostaway${
      listingId ? `?listing=${listingId}` : ""
    }`;
    const googleUrl = `${origin}/api/reviews/google${
      listingId ? `?listing=${listingId}` : ""
    }`;

    const [hostawayResponse, googleResponse] = await Promise.all([
      fetch(hostawayUrl, { cache: "no-store" }),
      fetch(googleUrl, { cache: "no-store" }),
    ]);

    if (!hostawayResponse.ok)
      throw new Error(`Hostaway API failed: ${hostawayResponse.status}`);
    if (!googleResponse.ok)
      throw new Error(`Google API failed: ${googleResponse.status}`);

    const hostawayData = await hostawayResponse.json();
    const googleData = await googleResponse.json();

    const hostawayReviews: Review[] = hostawayData.data?.reviews || [];
    const googleReviews: Review[] = googleData.data?.reviews || [];

    const combinedReviews = [...hostawayReviews, ...googleReviews];

    const filteredReviews = listingId
      ? combinedReviews.filter((review) => review.listingName === listingId)
      : combinedReviews;

    filteredReviews.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    const summary = calculateCombinedSummary(
      filteredReviews,
      hostawayReviews,
      googleReviews
    );

    return NextResponse.json({
      status: "success",
      reviews: filteredReviews,
      summary: summary,
      data: {
        // Maintain this structure for components that expect it
        reviews: filteredReviews,
        summary: summary,
      },
    });
  } catch (error) {
    console.error("Error fetching combined reviews:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch combined reviews",
        reviews: [],
      },
      { status: 500 }
    );
  }
}

function calculateCombinedSummary(
  filteredReviews: Review[],
  hostawayReviews: Review[],
  googleReviews: Review[]
) {
  const totalReviews = filteredReviews.length;
  const ratedReviews = filteredReviews.filter((r) => r.rating !== null);
  const averageRating =
    ratedReviews.length > 0
      ? ratedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
        ratedReviews.length
      : 0;

  const reviewsByChannel = filteredReviews.reduce((acc, r) => {
    const channel = r.channel || "Unknown";
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // FIX: Type the accumulator for the reduce function
  const reviewsByListing = Object.values(
    filteredReviews.reduce(
      (acc, review) => {
        const { listingName, rating } = review;
        if (!acc[listingName]) {
          acc[listingName] = { listing: listingName, count: 0, totalRating: 0 };
        }
        acc[listingName].count++;
        acc[listingName].totalRating += rating || 0;
        return acc;
      },
      {} as Record<string, ListingGroup> // <-- Provide the explicit type here
    )
  ).map((group) => ({
    listing: group.listing,
    count: group.count,
    averageRating:
      group.count > 0
        ? parseFloat((group.totalRating / group.count).toFixed(1))
        : 0,
  }));

  return {
    totalReviews,
    averageRating: parseFloat(averageRating.toFixed(1)),
    reviewsByChannel,
    reviewsByListing,
    reviewsBySource: {
      hostaway: hostawayReviews.length,
      google: googleReviews.length,
    },
  };
}
