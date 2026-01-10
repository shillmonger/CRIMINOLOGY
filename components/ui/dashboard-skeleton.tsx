import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Library Content Header Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-64 bg-muted rounded-md" />
          <Skeleton className="h-4 w-48 bg-muted rounded-md" />
        </div>
        
        {/* Search and Filter Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1 bg-muted rounded-md" />
          <Skeleton className="h-10 w-32 bg-muted rounded-md" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full bg-muted rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4 bg-muted rounded-md" />
              <Skeleton className="h-4 w-1/2 bg-muted rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 bg-muted rounded-full" />
                <Skeleton className="h-5 w-16 bg-muted rounded-full" />
              </div>
              <Skeleton className="h-4 w-24 bg-muted rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
