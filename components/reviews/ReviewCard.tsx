import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface ReviewCardProps {
  review: any
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b pb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{review.guestName}</span>
          </div>
          <div className="flex items-center gap-2">
            {review.rating && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < review.rating ? "fill-secondary text-secondary" : "text-gray-300"}`}
                  />
                ))}
              </div>
            )}
            <span className="text-xs text-muted-foreground">{new Date(review.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.review}</p>
      {review.categories && (
        <div className="flex flex-wrap gap-2 mt-3">
          {review.categories.map((cat: any) => (
            <Badge key={cat.category} variant="secondary" className="text-xs">
              {cat.category}: {cat.rating}/5
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
