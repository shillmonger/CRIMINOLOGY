import { Skeleton } from "@/components/ui/skeleton"

export function ImageDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-25 lg:mb-0">
      <div className="lg:col-span-2">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          <div className="pt-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
