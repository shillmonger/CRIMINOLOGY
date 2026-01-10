import { Skeleton } from "@/components/ui/skeleton";

export function ContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-1 bg-foreground/10" />
        <Skeleton className="h-10 w-[180px] bg-foreground/10" />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden group">
            <Skeleton className="h-40 w-full bg-foreground/10 rounded-none" />
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-foreground/10" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 bg-foreground/10 rounded-full" />
                  <Skeleton className="h-3 w-24 bg-foreground/10" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-10 bg-foreground/10 rounded-full" />
                  <Skeleton className="h-5 w-8 bg-foreground/10 rounded-full" />
                </div>
                <Skeleton className="h-8 w-8 bg-foreground/10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
