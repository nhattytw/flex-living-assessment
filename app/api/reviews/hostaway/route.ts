import { NextResponse } from "next/server";
import {
  normalizeHostawayReview,
  calculateReviewSummary,
} from "@/lib/utils/normalize-reviews";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listing = searchParams.get("listing");
    const rating = searchParams.get("rating");
    const channel = searchParams.get("channel");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockData = await import("@/lib/mock/hostaway-reviews.json").then(
      (module) => module.default
    );
    const mockReviews = mockData.result || mockData;

    let normalizedReviews = mockReviews.map(normalizeHostawayReview);

    if (listing) {
      normalizedReviews = normalizedReviews.filter(
        (review) => review.listingName.toLowerCase() === listing.toLowerCase()
      );
    }

    if (rating) {
      const minRating = Number.parseFloat(rating);
      normalizedReviews = normalizedReviews.filter(
        (review) => (review.rating || 0) >= minRating
      );
    }

    if (channel) {
      normalizedReviews = normalizedReviews.filter(
        (review) => review.channel.toLowerCase() === channel.toLowerCase()
      );
    }

    if (dateFrom) {
      normalizedReviews = normalizedReviews.filter(
        (review) => new Date(review.submittedAt) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      normalizedReviews = normalizedReviews.filter(
        (review) => new Date(review.submittedAt) <= new Date(dateTo)
      );
    }

    const summary = calculateReviewSummary(normalizedReviews);

    // Group reviews by listing for easier dashboard consumption
    const reviewsByListing = normalizedReviews.reduce((acc, review) => {
      if (!acc[review.listingName]) {
        acc[review.listingName] = [];
      }
      acc[review.listingName].push(review);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      status: "success",
      data: {
        reviews: normalizedReviews,
        reviewsByListing,
        summary,
      },
    });
  } catch (error) {
    console.error("Error fetching Hostaway reviews:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
