"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageIcon, Download, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import Sidebar from "@/components/user-dashboard/Sidebar";
import Nav from "@/components/user-dashboard/Nav";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { ImageDetailSkeleton } from "@/components/ui/image-detail-skeleton";

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  fileType: 'image' | 'video' | 'pdf';
  createdAt: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ImageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [image, setImage] = useState<ContentItem | null>(null);
  const [relatedImages, setRelatedImages] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the specific image using the new API endpoint
        const apiUrl = `/api/content/${params.id}`;
        console.log('Fetching image from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          cache: 'no-store' // Ensure we're not getting a cached response
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', errorData);
          throw new Error(errorData?.error || `Failed to fetch image: ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        const data = responseData;
        
        if (!data || data.fileType !== 'image') {
          return notFound();
        }
        
        setImage(data);
        
        // Fetch related images (other images from the database)
        const relatedResponse = await fetch('/api/content');
        if (relatedResponse.ok) {
          const allContent = await relatedResponse.json();
          // Get other images (excluding the current one)
          const otherImages = allContent.filter(
            (item: ContentItem) => 
              item.fileType === 'image' && 
              item._id !== params.id
          ).slice(0, 3); // Limit to 3 related images
          setRelatedImages(otherImages);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load image';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
                disabled
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Gallery
              </Button>
            </div>
          </div>
          <main className="flex-1 p-4 md:p-10 space-y-12 overflow-y-auto">
            <ImageDetailSkeleton />
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!image) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="gap-2 cursor-pointer"
                onClick={async () => {
                  try {
                    const response = await fetch(image.fileUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = image.title || 'download';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                    toast.success('Download started!');
                  } catch (err) {
                    console.error('Download failed:', err);
                    toast.error('Failed to download image');
                  }
                }}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-10 space-y-12 overflow-y-auto">
          {/* Main Image Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-muted">
                <ImageWithFallback
                  src={image.fileUrl}
                  alt={image.title}
                  fill
                  className="object-cover cursor-pointer"
                  priority
                  fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">{image.title}</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Uploaded on {formatDate(image.createdAt)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full hover:bg-muted"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                  </Button>
                </div>
                
                {image.description && (
                  <p className="text-muted-foreground">{image.description}</p>
                )}
                
                {image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {image.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-3">Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{image.fileType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Added</p>
                    <p className="font-medium">{formatDate(image.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Resolution</p>
                    <p className="font-medium">1920x1080</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Related Images */}
          <section className="space-y-6 mb-25 lg:mb-0">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-4">
              You May Also Like
            </h2>
            {relatedImages.length === 0 ? (
              <div className="bg-card h-[40vh] rounded-2xl border-2 border-dashed border-border p-8 text-center flex flex-col items-center justify-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter">
                  No Related Images Available
                </h3>
                <p className="text-muted-foreground text-xs mt-1 font-medium">
                  This space will display related images
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedImages.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ scale: 1.03 }}
                    className="relative aspect-[4/5] rounded-xl overflow-hidden border border-border group cursor-pointer"
                    onClick={() => router.push(`/user-dashboard/image-content/${item._id}`)}
                  >
                    <ImageWithFallback
                      src={item.fileUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-opacity group-hover:opacity-90"
                      fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                      {item.tags && item.tags.length > 0 && (
                        <p className="text-xs text-muted-foreground">{item.tags[0]}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>

        <Nav />
      </div>
    </div>
  );
}