"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { subDays, isAfter } from "date-fns";

interface ReviewTableProps {
  reviewData: any;
  filters: any;
  approvedReviews: Set<number | string>;
  toggleApproval: (id: number | string) => void;
}

export function ReviewTable({
  reviewData,
  filters,
  approvedReviews,
  toggleApproval,
}: ReviewTableProps) {
  const getFilteredReviews = () => {
    if (!reviewData?.reviews) return [];

    const now = new Date();

    return reviewData.reviews.filter((review: any) => {
      const reviewDate = new Date(review.submittedAt);

      const matchesDateRange =
        filters.dateRange === "all" ||
        (filters.dateRange === "7d" && isAfter(reviewDate, subDays(now, 7))) ||
        (filters.dateRange === "30d" &&
          isAfter(reviewDate, subDays(now, 30))) ||
        (filters.dateRange === "90d" && isAfter(reviewDate, subDays(now, 90)));

      const matchesRating =
        filters.rating === "all" ||
        (filters.rating === "high" && (review.rating || 0) >= 4) ||
        (filters.rating === "medium" &&
          (review.rating || 0) >= 3 &&
          (review.rating || 0) < 4) ||
        (filters.rating === "low" && (review.rating || 0) < 3);
      const matchesProperty =
        filters.property === "all" || review.listingName === filters.property;
      const matchesSearch =
        filters.search === "" ||
        review.review.toLowerCase().includes(filters.search.toLowerCase()) ||
        review.guestName.toLowerCase().includes(filters.search.toLowerCase());

      return (
        matchesRating && matchesProperty && matchesSearch && matchesDateRange
      );
    });
  };

  const filteredReviews = getFilteredReviews();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
        <CardDescription>Manage review approval and visibility</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {!reviewData?.reviews || reviewData.reviews.length === 0
                  ? "No reviews available in the system."
                  : "No reviews match the current filters."}
              </p>
              {reviewData?.reviews && reviewData.reviews.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters to see more reviews.
                </p>
              )}
            </div>
          ) : (
            filteredReviews.map((review: any) => {
              const isApproved = approvedReviews.has(review.id);
              return (
                <div
                  key={review.id}
                  className={`border rounded-lg p-4 space-y-3 transition-colors ${
                    isApproved
                      ? "border-green-200 bg-green-50/50 dark:bg-green-900/20 dark:border-green-800"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{review.guestName}</span>
                        {review.rating && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Star className="h-3 w-3 fill-current" />
                            {review.rating}/5
                          </Badge>
                        )}
                        {isApproved && (
                          <Badge
                            variant="default"
                            className="bg-green-600 hover:bg-green-600"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.listingName}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={isApproved ? "outline" : "default"}
                      onClick={() => toggleApproval(review.id)}
                    >
                      {isApproved ? "Remove Approval" : "Approve"}
                    </Button>
                  </div>
                  <p className="text-sm">{review.review}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </span>
                    {review.categories && (
                      <div className="flex flex-wrap gap-2 sm:gap-4">
                        {review.categories.map((cat: any) => (
                          <span
                            key={cat.category}
                            className="capitalize whitespace-nowrap"
                          >
                            {cat.category.replace(/_/g, " ")}: {cat.rating}/5
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
