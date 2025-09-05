"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewCard } from "@/components/reviews/ReviewCard";

const LOCAL_STORAGE_KEY = "approvedReviewIds";

interface ReviewsSectionProps {
  propertyId: string;
}

export function ReviewsSection({ propertyId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAndFilterReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/reviews/combined?listing=${encodeURIComponent(propertyId)}`
        );
        const result = await response.json();

        if (result.reviews) {
          // Get approved IDs from localStorage
          const storedIds = localStorage.getItem(LOCAL_STORAGE_KEY);
          const approvedIds = storedIds
            ? new Set(JSON.parse(storedIds))
            : new Set();

          // Filter reviews to show only approved ones
          const approvedReviews = result.reviews.filter((review: any) =>
            approvedIds.has(review.id)
          );
          setReviews(approvedReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterReviews();
  }, [propertyId]);

  const getFilteredReviews = () => {
    if (filter === "all") return reviews;
    if (filter === "high") return reviews.filter((r) => (r.rating || 0) >= 4);
    if (filter === "recent")
      return [...reviews]
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
        )
        .slice(0, 10);
    return reviews;
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Guest Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredReviews = getFilteredReviews();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              Guest Reviews
              <Badge variant="secondary">{reviews.length}</Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span>{averageRating} average rating</span>
            </CardDescription>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="high">Highest Rated (4+)</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {reviews.length === 0
                ? "No approved reviews available for this property yet."
                : "No reviews match the current filter."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
