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
  fileType: "image" | "video" | "pdf";
  createdAt: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
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

        const apiUrl = `/api/content/${params.id}`;
        const response = await fetch(apiUrl, { cache: "no-store" });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Failed to fetch image: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || data.fileType !== "image") {
          return notFound();
        }

        setImage(data);

        // Fetch related images
        const relatedResponse = await fetch("/api/content");
        if (relatedResponse.ok) {
          const allContent = await relatedResponse.json();
          const otherImages = allContent
            .filter(
              (item: ContentItem) =>
                item.fileType === "image" && item._id !== params.id
            )
            .slice(0, 6); // increased to 6 for better masonry feel
          setRelatedImages(otherImages);
        }
      } catch (err) {
        console.error("Error fetching image:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load image";
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

  if (!image) return notFound();

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

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-muted"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>

              <Button
                size="sm"
                className="gap-2"
                onClick={async () => {
                  try {
                    const response = await fetch(image.fileUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = image.title || "image";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                    toast.success("Download started!");
                  } catch (err) {
                    toast.error("Failed to download image");
                  }
                }}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 lg:p-10 space-y-12 overflow-y-auto">
          {/* Main Image + Info */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden bg-muted shadow-xl">
                <ImageWithFallback
                  src={image.fileUrl}
                  alt={image.title}
                  width={1200}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="w-full h-auto object-cover"
                  priority
                  fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic leading-tight">
                      {image.title}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Uploaded on {formatDate(image.createdAt)}
                    </p>
                  </div>
                </div>

                {image.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {image.description}
                  </p>
                )}

                {image.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {image.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted/70 text-muted-foreground border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">
                  Details
                </h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium mt-1 capitalize">{image.fileType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Added</p>
                    <p className="font-medium mt-1">{formatDate(image.createdAt)}</p>
                  </div>
                  {/* You can make resolution dynamic later if you store it */}
                  <div>
                    <p className="text-muted-foreground">Resolution</p>
                    <p className="font-medium mt-1">1920×1080</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Images – Masonry style */}
          <section className="space-y-8 mb-25 lg:mb-0">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none">
              You May Also Like
            </h2>

            {relatedImages.length === 0 ? (
              <div className="bg-card h-64 rounded-2xl border-2 border-dashed border-border p-10 text-center flex flex-col items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter">
                  No Related Images
                </h3>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-5 sm:gap-6">
                {relatedImages.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    className="group cursor-pointer break-inside-avoid mb-5 sm:mb-6"
                    onClick={() => router.push(`/user-dashboard/image-content/${item._id}`)}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-md border border-border/60 bg-muted/30">
                      <ImageWithFallback
                        src={item.fileUrl}
                        alt={item.title}
                        width={600}
                        height={900} // placeholder – Next.js optimizes anyway
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                        <h3 className="text-sm font-semibold text-white drop-shadow-md truncate">
                          {item.title}
                        </h3>
                        {item.tags?.length > 0 && (
                          <p className="text-xs text-white/80 mt-0.5">
                            {item.tags[0]}
                          </p>
                        )}
                      </div>
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