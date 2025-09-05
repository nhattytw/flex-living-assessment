import { PropertyPageClient } from "@/components/property/PropertyPageClient";
import { use } from "react";
import propertyData from "@/lib/mock/properties.json";

interface PropertyPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

const propertyMap: Record<string, any> = propertyData;

export default function PropertyPage({ params }: PropertyPageProps) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const property =
    propertyMap[resolvedParams.slug] || propertyMap["shoreditch-heights"];

  return <PropertyPageClient property={property} />;
}
