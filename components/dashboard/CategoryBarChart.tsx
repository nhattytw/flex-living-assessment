import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface CategoryBarChartProps {
  reviewData: any
}

export function CategoryBarChart({ reviewData }: CategoryBarChartProps) {
  const categoryData =
    reviewData?.reviews?.reduce((acc: any, review: any) => {
      if (review.categories) {
        review.categories.forEach((cat: any) => {
          if (!acc[cat.category]) {
            acc[cat.category] = { total: 0, count: 0 }
          }
          acc[cat.category].total += cat.rating
          acc[cat.category].count += 1
        })
      }
      return acc
    }, {}) || {}

  const categories = Object.entries(categoryData).map(([category, data]: [string, any]) => ({
    category,
    average: (data.total / data.count / 2).toFixed(1),
    count: data.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Category Performance
        </CardTitle>
        <CardDescription>Average ratings by review category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{cat.category}</span>
                <span className="text-sm text-muted-foreground">
                  {cat.average}/5 ({cat.count} reviews)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(Number.parseFloat(cat.average) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
