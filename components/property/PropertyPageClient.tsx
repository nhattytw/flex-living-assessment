"use client";

import { ReviewsSection } from "@/components/property/ReviewsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wifi,
  Users,
  Bed,
  Bath,
  Home,
  Calendar,
  Star,
  Clock,
  Shield,
  MapPin,
  Ban,
} from "lucide-react";
import { useState, useEffect } from "react";
import { iconMap } from "./iconMap";

interface PropertyPageClientProps {
  property: any;
}

export function PropertyPageClient({ property }: PropertyPageClientProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    reviewCount: 0,
  });

  useEffect(() => {
    async function fetchReviewStats() {
      try {
        const response = await fetch(
          `/api/reviews/combined?listing=${encodeURIComponent(
            property.listingName
          )}`
        );

        if (!response.ok) {
          console.log(`API response not ok: ${response.status}`);
          return;
        }

        const data = await response.json();
        const reviews = data.reviews || [];

        if (reviews.length === 0) {
          return;
        }

        const totalRating = reviews.reduce(
          (sum: number, review: any) => sum + (review.rating || 0),
          0
        );
        const averageRating =
          Math.round((totalRating / reviews.length) * 10) / 10;
        setReviewStats({ averageRating, reviewCount: reviews.length });
      } catch (error) {
        console.error("Error fetching review stats:", error);
      }
    }

    fetchReviewStats();
  }, [property.listingName]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>

          {/* Property Icons */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span className="text-sm">{property.bedrooms || 2}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span className="text-sm">{property.bathrooms || 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">{property.guests || 4}</span>
            </div>
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="text-sm">Apartment</span>
            </div>
            {reviewStats.reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm">
                  {reviewStats.averageRating} ({reviewStats.reviewCount}{" "}
                  reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="relative mb-8">
          <div className="grid grid-cols-4 gap-2 h-164">
            <div className="col-span-2 row-span-2">
              <img
                src={property.images[0] || "/placeholder.svg"}
                alt={property.name}
                className="w-full h-full object-cover rounded-l-lg cursor-pointer"
                onClick={() => setSelectedImageIndex(0)}
              />
            </div>
            <div className="grid grid-rows-2 gap-2">
              <img
                src={property.images[1] || "/placeholder.svg"}
                alt="Bedroom"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImageIndex(1)}
              />
              <img
                src={property.images[2] || "/placeholder.svg"}
                alt="Bathroom"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImageIndex(2)}
              />
            </div>
            <div className="grid grid-rows-2 gap-2">
              <img
                src={property.images[3] || "/placeholder.svg"}
                alt="Kitchen"
                className="w-full h-full object-cover rounded-tr-lg cursor-pointer"
                onClick={() => setSelectedImageIndex(3)}
              />
              <div className="relative">
                <img
                  src={property.images[4] || "/placeholder.svg"}
                  alt="View"
                  className="w-full h-full object-cover rounded-br-lg cursor-pointer"
                  onClick={() => setSelectedImageIndex(4)}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-3 right-3 text-xs bg-teal-600 hover:bg-teal-700 text-white border-0 shadow-lg font-medium"
                    >
                      View all photos
                    </Button>
                  </DialogTrigger>
                  <DialogTitle className="text-lg font-medium mb-4"></DialogTitle>
                  <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <div className="relative">
                      <img
                        src={
                          property.images[selectedImageIndex] ||
                          "/placeholder.svg"
                        }
                        alt={`Property image ${selectedImageIndex + 1}`}
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                      <div className="p-4">
                        <div className="grid grid-cols-6 gap-2 mt-4">
                          {property.images.map(
                            (image: string, index: number) => (
                              <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-full h-16 object-cover rounded cursor-pointer border-2 ${
                                  selectedImageIndex === index
                                    ? "border-primary"
                                    : "border-transparent"
                                }`}
                                onClick={() => setSelectedImageIndex(index)}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About this property */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                About this property
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {showFullDescription
                  ? property.fullDescription || property.description
                  : property.description}
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Read less" : "Read more"}
              </Button>
            </div>

            {/* Amenities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Amenities</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-primary">
                      View all amenities →
                    </Button>
                  </DialogTrigger>

                  <DialogTitle className="text-lg font-medium mb-4"></DialogTitle>

                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-xl font-semibold">All amenities</h2>
                      </div>

                      {Object.keys(property.allAmenities || {}).map(
                        (category) => {
                          const items = property.allAmenities[
                            category
                          ] as any[];

                          if (!Array.isArray(items)) return null; // Safety check

                          return (
                            <div key={category} className="space-y-3">
                              <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                {category}
                              </h3>
                              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {items.map((item: any) => {
                                  const IconComponent = iconMap[item.icon];

                                  return (
                                    <div
                                      key={item.name}
                                      className="flex items-center gap-3 text-sm py-1"
                                    >
                                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                      <span className="text-gray-700 flex items-center gap-2">
                                        {IconComponent && (
                                          <IconComponent className="h-5 w-5 text-gray-600" />
                                        )}
                                        {item.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.slice(0, 6).map((amenity: string) => {
                  let IconComponent: any = null;

                  switch (amenity) {
                    case "Cable TV":
                      IconComponent = iconMap.Tv;
                      break;
                    case "Internet":
                    case "Wireless":
                    case "High-speed WiFi":
                      IconComponent = iconMap.Wifi;
                      break;
                    case "Air Conditioning":
                      IconComponent = iconMap.Snowflake;
                      break;
                    case "Hair Dryer":
                      IconComponent = iconMap.Wind;
                      break;
                    case "Heating":
                      IconComponent = iconMap.Zap;
                      break;
                    case "Washing Machine":
                      IconComponent = iconMap.Shirt;
                      break;
                    case "Smoke Detector":
                      IconComponent = iconMap.AlertOctagon;
                      break;
                    case "Smart TV":
                      IconComponent = iconMap.Tv;
                      break;
                    case "Dedicated Workspace":
                      IconComponent = iconMap.Monitor;
                      break;
                    case "Kitchen":
                      IconComponent = iconMap.ChefHat;
                      break;
                    default:
                      IconComponent = null;
                  }

                  return (
                    <div key={amenity} className="flex items-center gap-3">
                      {IconComponent && (
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Stay Policies section */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Stay Policies</h2>

              {/* Check-in & Check-out */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Check-in & Check-out</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Check-in time
                    </p>
                    <p className="font-medium">3:00 PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Check-out time
                    </p>
                    <p className="font-medium">10:00 AM</p>
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">House Rules</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-gray-500" />
                    <span>No smoking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-gray-500" />
                    <span>No pets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-gray-500" />
                    <span>No parties or events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span>Security deposit required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Cancellation Policy
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    For stays less than 28 days
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Full refund up to 14 days before check-in</li>
                    <li>
                      • No refund for bookings less than 14 days before check-in
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">
                    For stays of 28 days or more
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Full refund up to 30 days before check-in</li>
                    <li>
                      • 50% refund for bookings 14-30 days before check-in
                    </li>
                    <li>
                      • No refund for bookings less than 14 days before check-in
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Location section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Interactive map would be displayed here</p>
                  <p className="text-sm">Showing location of {property.name}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Browse more{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary text-sm"
                >
                  nearby apartment rentals in London
                </Button>
              </p>
            </div>

            {/* Reviews Section */}
            <ReviewsSection propertyId={property.listingName} />
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card className="overflow-hidden">
              <div className="bg-teal-700 text-white p-4">
                <h3 className="text-lg font-semibold">Book your stay</h3>
                <p className="text-sm text-teal-100">
                  Select dates to see the total price
                </p>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start text-muted-foreground bg-gray-50 border-gray-200"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Select dates
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-muted-foreground bg-gray-50 border-gray-200"
                  >
                    <Users className="h-4 w-4 mr-2" />1
                  </Button>
                </div>

                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  Check availability
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 bg-transparent"
                >
                  Send Inquiry
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Instant confirmation
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
