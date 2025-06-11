import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AnalyticsLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="border border-gray-200">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border border-gray-200">
            <CardHeader>
              <Skeleton className="h-5 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>

          <Card className="col-span-3 border border-gray-200">
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
