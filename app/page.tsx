import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Star, FileText, Building } from "lucide-react";

// Import the data and normalization logic directly
import { normalizeHostawayReview } from "@/lib/utils/normalize-reviews";
import mockData from "@/lib/mock/hostaway-reviews.json";

async function getSystemStats() {
  try {
    // Directly use the imported mock data instead of fetching
    const mockReviews = mockData.result || [];
    const reviews = mockReviews.map(normalizeHostawayReview);

    if (reviews.length > 0) {
      const guestReviews = reviews.filter(
        (review) => review.type === "guest-to-host"
      );
      const totalRating = guestReviews.reduce(
        (sum: number, review: any) => sum + (review.rating || 0),
        0
      );
      const avgRating =
        totalRating > 0
          ? Math.round((totalRating / guestReviews.length) * 10) / 10
          : 0;

      const uniqueProperties = new Set(
        reviews.map((review: any) => review.listingName)
      );

      return {
        totalReviews: guestReviews.length,
        averageRating: avgRating,
        properties: uniqueProperties.size,
      };
    }

    return { totalReviews: 0, averageRating: 0, properties: 0 };
  } catch (error) {
    console.error("Error processing system stats:", error);
    return { totalReviews: 0, averageRating: 0, properties: 0 };
  }
}

export default async function HomePage() {
  const stats = await getSystemStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Flex Living Reviews Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive review management system for property managers and
            guests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Manager Dashboard
              </CardTitle>
              <CardDescription>
                Monitor performance, approve reviews, and spot trends across all
                properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Property Reviews
              </CardTitle>
              <CardDescription>
                View guest reviews for specific properties in a rental-style
                layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Public Reviews
              </CardTitle>
              <CardDescription>
                Public-facing review display page for approved guest reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/reviews">View Reviews</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentation
              </CardTitle>
              <CardDescription>
                Technical documentation, API details, and implementation notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/docs">Read Docs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Key features and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">
                    API
                  </Badge>
                  <div>
                    <h4 className="font-medium">Hostaway Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Normalized review data from Hostaway with fallback rating
                      calculations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">
                    UI
                  </Badge>
                  <div>
                    <h4 className="font-medium">Manager Dashboard</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive filtering, search, approval management, and
                      analytics
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">
                    Display
                  </Badge>
                  <div>
                    <h4 className="font-medium">Property Pages</h4>
                    <p className="text-sm text-muted-foreground">
                      Rental-style property details with integrated review
                      sections
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">
                    Research
                  </Badge>
                  <div>
                    <h4 className="font-medium">Google Reviews Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Feasibility study with production requirements and
                      alternatives
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Properties</span>
                  <Badge variant="outline">{stats.properties}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg Rating</span>
                  <Badge variant="outline">{stats.averageRating}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Reviews</span>
                  <Badge variant="outline">{stats.totalReviews}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
