import { sub } from "date-fns";
import {
  normalizeHostawayReview,
  calculateReviewSummary,
} from "./normalize-reviews";

interface MockHostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{ category: string; rating: number }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel?: string;
}

describe("Review Normalization Utilities", () => {
  describe("normalizeHostawayReview", () => {
    it("should correctly normalize a review and convert 10-point ratings to 5-point", () => {
      const mockReview: MockHostawayReview = {
        id: 7454,
        type: "guest-to-host",
        status: "published",
        rating: 4,
        publicReview:
          "Great location, but the check-in process was a bit confusing.",
        reviewCategory: [
          { category: "cleanliness", rating: 8 }, // Should become 4
          { category: "communication", rating: 6 }, // Should become 3
          { category: "location", rating: 8 }, // Should become 4
        ],
        submittedAt: "2025-12-04 18:00:00",
        guestName: "Test Guest",
        listingName: "Test Listing",
      };

      const normalized = normalizeHostawayReview(mockReview);

      expect(normalized.id).toBe(7454);
      expect(normalized.rating).toBe(4);
      expect(normalized.channel).toBe("Hostaway");
      expect(normalized.categories).toHaveLength(3);

      expect(
        normalized.categories.find((c) => c.category === "cleanliness")?.rating
      ).toBe(4);
      expect(
        normalized.categories.find((c) => c.category === "communication")
          ?.rating
      ).toBe(3);
      expect(
        normalized.categories.find((c) => c.category === "location")?.rating
      ).toBe(4);
    });
  });

  describe("calculateReviewSummary", () => {
    it("should correctly calculate the summary for a list of reviews and ignore host-to-guest types", () => {
      const reviews: any[] = [
        {
          id: 1,
          type: "guest-to-host",
          listingName: "Property A",
          rating: 5,
          channel: "Hostaway",
          submittedAt: "2025-12-01 12:00:00",
        },
        {
          id: 2,
          type: "guest-to-host",
          listingName: "Property A",
          rating: 3,
          channel: "Hostaway",
          submittedAt: "2025-12-02 15:30:00",
        },
        {
          id: 3,
          type: "guest-to-host",
          listingName: "Property B",
          rating: 4,
          channel: "Google",
          submmittedAt: "2025-12-03 10:20:00",
        },
        {
          id: 4,
          type: "host-to-guest",
          listingName: "Property C",
          rating: 10,
          channel: "Hostaway",
          submittedAt: "2025-12-04 09:00:00",
        }, // Should be ignored
      ];

      const summary = calculateReviewSummary(reviews);

      // Test overall stats
      expect(summary.totalReviews).toBe(3); // Correctly ignores reviews without ratings or the wrong type
      expect(summary.averageRating).toBe(4.0); // (5 + 3 + 4) / 3 = 4

      // Test channel stats
      expect(summary.reviewsByChannel.Hostaway).toBe(2);
      expect(summary.reviewsByChannel.Google).toBe(1);

      // Test per-listing stats
      expect(summary.reviewsByListing).toHaveLength(2);
      const propertyASummary = summary.reviewsByListing?.find(
        (p) => p.listing === "Property A"
      );
      const propertyBSummary = summary.reviewsByListing?.find(
        (p) => p.listing === "Property B"
      );

      expect(propertyASummary?.count).toBe(2);
      expect(propertyASummary?.averageRating).toBe(4.0); // (5 + 3) / 2 = 4

      expect(propertyBSummary?.count).toBe(1);
      expect(propertyBSummary?.averageRating).toBe(4.0);
    });
  });
});
