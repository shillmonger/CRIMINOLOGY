"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Maximize2,
  FileText,
  Image as ImageIcon,
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

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header onSearch={handleSearch} />
          <main className="flex-1 p-4 md:p-10 overflow-y-auto">
            <ImageGallerySkeleton />
          </main>
          <Nav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* FIXED SIDEBAR (Handled inside Sidebar component usually, but parent is h-screen) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* FIXED HEADER */}
        <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md">
          <Header onSearch={handleSearch} />
        </div>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-32">
          <section className="max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-1 mb-8 px-2">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none">
                Image Gallery
              </h2>
              <p className="text-sm text-muted-foreground">
                {`Showing ${filteredImages.length} images`}
              </p>
            </div>

            {filteredImages.length === 0 ? (
              <div className="bg-card h-[50vh] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter">No Image Available</h3>
              </div>
            ) : (
              /* GRID LOGIC: columns-2 on mobile, scales up to 5 on large screens */
              <div className="columns-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                {filteredImages.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -4 }}
                    className="break-inside-avoid group cursor-pointer"
                    onClick={() => handleImageClick(item._id)}
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-sm border border-border bg-muted">
                      <ImageWithFallback
                        src={item.fileUrl}
                        alt={item.title}
                        width={400}
                        height={500}
                        className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105"
                        fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                      />

                      {/* Overlays */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="bg-primary p-1 rounded-md shadow-xl">
                          <Plus className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="mt-2 px-1">
                      <h3 className="text-[11px] sm:text-xs font-bold truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <ImageIcon className="w-2.5 h-2.5 text-blue-400" />
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                          {item.tags?.[0] || "Image"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* FIXED NAV */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:relative md:z-auto">
          <Nav />
        </div>
      </div>
    </div>
  );
}