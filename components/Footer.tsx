"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-4 gap-6 sm:gap-4 lg:gap-8">
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h4 className="font-semibold text-foreground text-base sm:text-lg">
              Flex Living
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Premium short-term rentals across the city's best neighborhoods.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h5 className="font-medium text-foreground text-sm sm:text-base">
              Properties
            </h5>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <Link href={`/property/shoreditch-heights`} className="block">
                Shoreditch Heights
              </Link>
              <Link href={`/property/camden-lock-studios`} className="block">
                Camden Lock Studios
              </Link>
              <Link href={`/property/hyde-park-apartment`} className="block">
                Hyde Park Apartment
              </Link>
              <Link href={`/property/brick-lane-lofts`} className="block">
                Brick Lane Lofts
              </Link>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h5 className="font-medium text-foreground text-sm sm:text-base">
              Support
            </h5>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <Link href={`#`} className="block">
                Help Center
              </Link>
              <Link href={`#`} className="block">
                Contact Us
              </Link>
              <Link href={`#`} className="block">
                Booking Policy
              </Link>
              <Link href={`#`} className="block">
                Cancellation
              </Link>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h5 className="font-medium text-foreground text-sm sm:text-base">
              Company
            </h5>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <Link href={`#`} className="block">
                About Us
              </Link>
              <Link href={`#`} className="block">
                Careers
              </Link>
              <Link href={`#`} className="block">
                Press
              </Link>
              <Link href={`#`} className="block">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} - Flex Living. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
