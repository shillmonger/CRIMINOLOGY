import { Skeleton } from "@/components/ui/skeleton";

export function PDFDetailSkeleton() {
  return (
    <div className="flex flex-col space-y-8 p-4 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PDF Viewer Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative w-full bg-muted/20 rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-[70vh] rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 bg-background/80 rounded-xl border border-border shadow-lg w-64">
                <Skeleton className="w-12 h-12 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-6 w-48 mx-auto mb-4" />
                <Skeleton className="h-10 w-32 mx-auto rounded-md" />
              </div>
            </div>
          </div>
          
          {/* PDF Info Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-md" />
            
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
            
            <div className="pt-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 mt-2 rounded-md" />
              <Skeleton className="h-4 w-4/6 mt-2 rounded-md" />
            </div>
          </div>
        </div>
        
        {/* Related PDFs Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-40 rounded-md" />
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-12 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="h-4 w-24 mt-1 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
