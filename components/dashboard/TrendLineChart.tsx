import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TrendLineChartProps {
  reviewData: any
}

export function TrendLineChart({ reviewData }: TrendLineChartProps) {
  const generateTrendData = () => {
    if (!reviewData?.reviews || reviewData.reviews.length === 0) {
      return []
    }

    const monthlyData = new Map<string, { reviews: number; totalRating: number; count: number }>()

    reviewData.reviews.forEach((review: any) => {
      const date = new Date(review.submittedAt)
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { reviews: 0, totalRating: 0, count: 0 })
      }

      const data = monthlyData.get(monthKey)!
      data.reviews++
      if (review.rating) {
        data.totalRating += review.rating
        data.count++
      }
    })

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        reviews: data.reviews,
        rating: data.count > 0 ? Math.round((data.totalRating / data.count) * 10) / 10 : 0,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6) // Last 6 months
  }

  const trendData = generateTrendData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Review Trends
        </CardTitle>
        <CardDescription>Monthly review volume and rating trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendData.map((data, index) => (
            <div key={data.month} className="flex items-center justify-between">
              <span className="text-sm font-medium">{data.month}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{data.reviews} reviews</span>
                <span className="text-sm font-medium">{data.rating} avg rating</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
