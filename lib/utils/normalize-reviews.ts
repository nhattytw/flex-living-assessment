interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel?: string; // <-- FIX: Made channel optional as it's not in the source JSON
}

interface NormalizedReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  review: string;
  categories: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  approved?: boolean;
}

// Hostaway provides category ratings on a 10-point scale. We normalize to 5.
const normalizeCategoryRating = (rating: number) => Math.round(rating / 2);

export function normalizeHostawayReview(
  review: HostawayReview
): NormalizedReview {
  return {
    id: review.id,
    type: review.type,
    status: review.status,
    rating: review.rating,
    review: review.publicReview,
    // Normalize category ratings from 10-point scale to 5-point
    categories: review.reviewCategory.map((cat) => ({
      ...cat,
      rating: normalizeCategoryRating(cat.rating),
    })),
    submittedAt: review.submittedAt,
    guestName: review.guestName,
    listingName: review.listingName,
    channel: review.channel || "Hostaway", // Assign a default channel
  };
}

export function calculateReviewSummary(reviews: NormalizedReview[]) {
  // Only calculate summary for reviews that have a rating
  const guestReviews = reviews.filter(
    (r) => r.type === "guest-to-host" && r.rating !== null
  );

  const reviewsByListing = guestReviews.reduce((acc, review) => {
    if (!acc[review.listingName]) {
      acc[review.listingName] = [];
    }
    acc[review.listingName].push(review);
    return acc;
  }, {} as Record<string, NormalizedReview[]>);

  const averageRating =
    guestReviews.length > 0
      ? guestReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
        guestReviews.length
      : 0;

  return {
    totalReviews: guestReviews.length,
    averageRating: Number.parseFloat(averageRating.toFixed(1)),
    reviewsByChannel: guestReviews.reduce((acc, r) => {
      const channel = r.channel || "Unknown";
      acc[channel] = (acc[channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    reviewsByListing: Object.keys(reviewsByListing).map((listing) => {
      const listingReviews = reviewsByListing[listing];
      const listingAverageRating =
        listingReviews.length > 0
          ? listingReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            listingReviews.length
          : 0;
      return {
        listing,
        count: listingReviews.length,
        averageRating: Number.parseFloat(listingAverageRating.toFixed(1)),
      };
    }),
  };
}
