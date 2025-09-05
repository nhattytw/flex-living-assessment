"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Review {
  id: number;
  rating: number | null;
  review: string;
  submittedAt: string;
  guestName: string;
  listingName: string;
  approved?: boolean;
}

interface ReviewData {
  reviews: Review[];
  summary: {
    totalReviews: number;
    averageRating: number;
    reviewsByListing: Array<{
      listing: string;
      count: number;
      averageRating: number;
    }>;
  };
}

export default function ReviewsPage() {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterProperty, setFilterProperty] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reviews/combined");
      const result = await response.json();

      console.log("Reviews API response:", result);

      if (result.status === "success" && result.reviews) {
        setReviewData({
          reviews: result.reviews,
          summary: result.summary,
        });
      } else {
        console.error("Unexpected API response format:", result);
        setReviewData({
          reviews: [],
          summary: {
            totalReviews: 0,
            averageRating: 0,
            reviewsByListing: [],
          },
        });
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviewData({
        reviews: [],
        summary: {
          totalReviews: 0,
          averageRating: 0,
          reviewsByListing: [],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReviews = () => {
    if (!reviewData) return [];

    return reviewData.reviews.filter((review) => {
      const matchesProperty =
        filterProperty === "all" || review.listingName === filterProperty;
      const matchesRating =
        filterRating === "all" ||
        (filterRating === "high" && (review.rating || 0) >= 4) ||
        (filterRating === "medium" &&
          (review.rating || 0) >= 3 &&
          (review.rating || 0) < 4) ||
        (filterRating === "low" && (review.rating || 0) < 3);

      return matchesProperty && matchesRating;
    });
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    const roundedRating = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= roundedRating
                ? "fill-secondary text-secondary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reviewData) return null;

  const filteredReviews = getFilteredReviews();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4">
            What Our Guests Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Discover why thousands of guests choose Flex Living for their
            perfect stay. Read authentic reviews from our community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {reviewData.summary.totalReviews}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Reviews
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {reviewData.summary.averageRating.toFixed(1)}
                </span>
                <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-secondary text-secondary" />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {reviewData.summary.reviewsByListing?.length || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Properties
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 sm:py-6 md:py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              Browse Reviews ({filteredReviews.length})
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {(reviewData.summary.reviewsByListing || []).map(
                    (property) => (
                      <SelectItem
                        key={property.listing}
                        value={property.listing}
                      >
                        {property.listing} ({property.count} reviews)
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="high">5-4 Stars</SelectItem>
                  <SelectItem value="medium">3-4 Stars</SelectItem>
                  <SelectItem value="low">1-3 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredReviews.map((review) => (
              <Card
                key={review.id}
                className="h-full hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-semibold text-primary text-sm sm:text-base truncate">
                        {review.guestName}
                      </h4>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2 flex-shrink-0">
                      <Calendar className="h-3 w-3" />
                      <span className="hidden sm:inline">
                        {new Date(review.submittedAt).toLocaleDateString()}
                      </span>
                      <span className="sm:hidden">
                        {new Date(review.submittedAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-foreground mb-3 sm:mb-4 flex-1 leading-relaxed">
                    "{review.review}"
                  </blockquote>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto pt-3 sm:pt-4 border-t border-border">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate text-xs">
                      {review.listingName}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                No reviews found
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Try adjusting your filters to see more reviews.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Experience Flex Living?
          </h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Join thousands of satisfied guests who have made Flex Living their
            home away from home.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3"
          >
            <Link href="/properties" className="flex items-center">
              Browse Properties
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
