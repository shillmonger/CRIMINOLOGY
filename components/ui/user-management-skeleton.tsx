import { Skeleton } from "@/components/ui/skeleton";

export function UserManagementSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-lg border">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Search and Filter Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b">
          {['User', 'Status', 'Role', 'Joined', ''].map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
        
        {/* Table Rows */}
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-4 flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="col-span-2">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="col-span-2 flex justify-end">
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <Skeleton className="h-4 w-24" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
