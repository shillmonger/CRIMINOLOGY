"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  Plus,
  Maximize2,
  Search,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageGallerySkeleton } from "@/components/ui/image-gallery-skeleton";

import Sidebar from "@/components/user-dashboard/Sidebar";
import Nav from "@/components/user-dashboard/Nav";
import Header from "@/components/user-dashboard/Header";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  fileType: "image" | "video" | "pdf";
  createdAt: string;
}

export default function ImageContentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [images, setImages] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        // Filter to only include images
        const imageContent = data.filter(
          (item: ContentItem) => item.fileType === "image"
        );
        setImages(imageContent);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (id: string) => {
    router.push(`/user-dashboard/image-content/${id}`);
  };

  // Filter images based on search query
  const filteredImages = images.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <Header onSearch={handleSearch} />
          <main className="flex-1 p-4 md:p-10 space-y-12 overflow-y-auto">
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
                    Image Gallery
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Loading images...
                  </p>
                </div>
              </div>
              <ImageGallerySkeleton />
            </section>
          </main>
          <Nav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Header onSearch={handleSearch} />

        <main className="flex-1 p-4 md:p-10 space-y-12 overflow-y-auto">
          {/* Image Gallery */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
                  Image Gallery
                </h2>
                <p className="text-sm text-muted-foreground">
                  {`Showing ${filteredImages.length} images`}
                </p>
              </div>
            </div>

            {filteredImages.length === 0 ? (
              <div className="bg-card h-[60vh] rounded-2xl border-2 border-dashed border-border p-20 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter">
                  No Image Available
                </h3>
                <p className="text-muted-foreground text-xs mt-1 font-medium">
                  This space will display the image once the administrator
                  uploads it.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-25">
                {filteredImages.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer space-y-3"
                    onClick={() => handleImageClick(item._id)}
                  >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-border bg-muted">
                      <ImageWithFallback
                        src={item.fileUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                      />

                      {/* Plus Button */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="bg-primary p-2 rounded-xl shadow-xl">
                          <Plus className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                          <Maximize2 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="px-1">
                      <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <ImageIcon className="w-3 h-3 text-blue-400" />
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                          {item.tags.length > 0 ? item.tags[0] : "Image"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Recent views removed - using database content only */}
        </main>

        <Nav />
      </div>
    </div>
  );
}
