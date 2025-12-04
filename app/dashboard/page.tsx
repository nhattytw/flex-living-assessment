"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, BarChart3 } from "lucide-react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiTiles } from "@/components/dashboard/KpiTiles";
import { ReviewTable } from "@/components/dashboard/ReviewTable";
import { TrendLineChart } from "@/components/dashboard/TrendLineChart";
import { CategoryBarChart } from "@/components/dashboard/CategoryBarChart";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "approvedReviewIds";

interface ReviewCategory {
  category: string;
  rating: number;
}

interface Review {
  id: number | string;
  type: string;
  status: string;
  rating: number | null;
  review: string;
  categories?: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  approved?: boolean;
  googleData?: {
    author_url: string;
    profile_photo_url: string;
    relative_time_description: string;
    place_id: string;
  };
}

interface ReviewListingSummary {
  listing: string;
  count: number;
  averageRating: number;
}

interface ReviewSourceSummary {
  hostaway: number;
  google: number;
}

interface ReviewData {
  reviews: Review[];
  summary: {
    totalReviews: number;
    averageRating: number;
    reviewsByChannel: Record<string, number>;
    reviewsBySource?: ReviewSourceSummary;
    reviewsByListing?: ReviewListingSummary[];
  };
}

export default function ManagerDashboard() {
  const [reviewData, setReviewData] = useState<ReviewData>({
    reviews: [],
    summary: {
      totalReviews: 0,
      averageRating: 0,
      reviewsByChannel: {},
      reviewsByListing: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvedReviews, setApprovedReviews] = useState<Set<number | string>>(
    new Set()
  );
  const [filters, setFilters] = useState({
    rating: "all",
    property: "all",
    dateRange: "all",
    search: "",
  });

  useEffect(() => {
    const storedIds = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedIds) {
      try {
        setApprovedReviews(new Set(JSON.parse(storedIds)));
      } catch (e) {
        console.error("Failed to parse approved reviews from localStorage", e);
      }
    }
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/reviews/combined", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "success") {
        setReviewData(result);
      } else {
        setError(result.message || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(`An error occurred while fetching data.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = (reviewId: number | string) => {
    let isNowApproved = false;
    setApprovedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
        isNowApproved = true;
      }
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(Array.from(newSet))
      );
      return newSet;
    });

    if (isNowApproved) {
      toast.success("Review approved", {
        description: "It is now visible on the public property page.",
      });
    } else {
      toast.info("Review approval removed", {
        description: "It is no longer visible on the public property page.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchReviews} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reviewData?.summary) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor performance, spot trends, and manage review approvals
          </p>
        </div>

        <KpiTiles reviewData={reviewData} approvedReviews={approvedReviews} />

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Review Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Trends</TabsTrigger>
            <TabsTrigger value="performance">Property Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              reviewData={reviewData}
            />
            <ReviewTable
              reviewData={reviewData}
              filters={filters}
              approvedReviews={approvedReviews}
              toggleApproval={toggleApproval}
            />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TrendLineChart reviewData={reviewData} />
              <CategoryBarChart reviewData={reviewData} />
            </div>
          </TabsContent>
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Property Performance Overview
                </CardTitle>
                <CardDescription>
                  Review metrics by property listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviewData.summary?.reviewsByListing
                    ?.sort((a, b) => b.count - a.count)
                    .map((property) => (
                      <div
                        key={property.listing}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{property.listing}</h3>
                          <p className="text-sm text-muted-foreground">
                            {property.count} reviews
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-secondary text-secondary" />
                          <span className="font-medium">
                            {property.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
