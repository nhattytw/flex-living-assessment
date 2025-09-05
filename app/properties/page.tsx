"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Users,
  Wifi,
  Car,
  Coffee,
  Bath,
  Bed,
  ArrowRight,
} from "lucide-react";
import propertyData from "@/lib/mock/properties.json";

interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  description: string;
}

const amenityIcons = {
  WiFi: Wifi,
  Kitchen: Coffee,
  Parking: Car,
  "Coffee Machine": Coffee,
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    avgRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch all reviews to calculate ratings
        const response = await fetch("/api/reviews/combined");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewAPIData = await response.json();
        const allReviews = reviewAPIData.reviews || [];

        // Step 2: Process reviews into a lookup map for easy access
        const reviewStatsMap = allReviews.reduce((acc: any, review: any) => {
          if (!review.listingName) return acc;
          if (!acc[review.listingName]) {
            acc[review.listingName] = { totalRating: 0, count: 0 };
          }
          if (review.rating !== null) {
            acc[review.listingName].totalRating += review.rating;
            acc[review.listingName].count++;
          }
          return acc;
        }, {});

        // Step 3: Use your properties.json as the source of truth
        const allProperties = Object.values(propertyData);

        // Step 4: Enrich property data with review stats
        const enrichedProperties = allProperties.map((prop: any) => {
          const stats = reviewStatsMap[prop.listingName];
          const rating =
            stats && stats.count > 0
              ? parseFloat((stats.totalRating / stats.count).toFixed(1))
              : 0;
          const reviewCount = stats ? stats.count : 0;

          return {
            ...prop,
            slug: prop.id, // Use the id from the JSON as the slug
            rating,
            reviewCount,
          };
        });

        setProperties(enrichedProperties);

        // Step 5: Calculate overall stats based on enriched data
        const totalReviews = allReviews.length;
        const ratedProperties = enrichedProperties.filter(
          (p) => p.reviewCount > 0
        );
        const avgRating =
          ratedProperties.length > 0
            ? parseFloat(
                (
                  ratedProperties.reduce((sum, p) => sum + p.rating, 0) /
                  ratedProperties.length
                ).toFixed(1)
              )
            : 0;

        setStats({
          totalProperties: enrichedProperties.length,
          avgRating,
          totalReviews,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderStars = (rating: number) => {
    const roundedRating = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= roundedRating
                ? "fill-primary text-primary"
                : "fill-muted text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Properties
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover premium short-term rentals across London's most desirable
              neighborhoods
            </p>
          </div>
          <div className="flex items-center justify-center gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">
                {stats.totalProperties}
              </div>
              <div className="text-sm text-muted-foreground">Properties</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">
                {stats.avgRating}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">
                {stats.totalReviews}
              </div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <div className="relative">
                  <Link href={`/property/${property.slug}`}>
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                    £{property.price}/night
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{property.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </div>
                    </div>
                    <div className="text-right space-y-1 flex-shrink-0 ml-2">
                      {renderStars(property.rating)}
                      <div className="text-xs text-muted-foreground">
                        {property.reviewCount} reviews
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                    {property.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" /> {property.bedrooms} bed
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" /> {property.bathrooms} bath
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {property.guests} guests
                    </div>
                  </div>
                  <Button asChild className="w-full mt-auto">
                    <Link href={`/property/${property.slug}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
