import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Star } from "lucide-react"

interface KpiTilesProps {
  reviewData: any
  approvedReviews: Set<number | string>
}

export function KpiTiles({ reviewData, approvedReviews }: KpiTilesProps) {
  const approvalStats = {
    approved: approvedReviews.size,
    pending: (reviewData.summary?.totalReviews || 0) - approvedReviews.size,
    total: reviewData.summary?.totalReviews || 0,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{reviewData.summary?.totalReviews || 0}</div>
          <p className="text-xs text-muted-foreground">Across all properties</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold">{(reviewData.summary?.averageRating || 0).toFixed(1)}</div>
            <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-secondary text-secondary" />
          </div>
          <p className="text-xs text-muted-foreground">Overall satisfaction</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Approved Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{approvalStats.approved}</div>
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <p className="text-xs text-muted-foreground">Ready for display</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{approvalStats.pending}</div>
            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <p className="text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>
    </div>
  )
}
