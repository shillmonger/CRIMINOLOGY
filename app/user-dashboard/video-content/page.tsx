"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  FileText,
  Play,
  Video,
  Search,
  Users,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Sidebar from "@/components/user-dashboard/Sidebar";
import Nav from "@/components/user-dashboard/Nav";
import Header from "@/components/user-dashboard/Header";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { VideoGridSkeleton } from "@/components/ui/video-grid-skeleton";

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  fileType: "image" | "video" | "pdf";
  createdAt: string;
  views?: number;
}

export default function VideoContentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) throw new Error("Failed to fetch videos");
        const data = await response.json();
        // Filter to only include videos
        const videoContent = data.filter(
          (item: ContentItem) => item.fileType === "video"
        );
        setVideos(videoContent);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to load videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (id: string) => {
    router.push(`/user-dashboard/video-content/${id}`);
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Format view count
  const formatViewCount = (count: number = 0) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Header onSearch={handleSearch} />

        <main className="flex-1 p-4 md:p-10 space-y-12 overflow-y-auto">
          {/* Top Uploaded Videos */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
                  Top Videos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Popular uploaded gaming videos and highlights.
                </p>
              </div>
            </div>

            {isLoading ? (
              <VideoGridSkeleton />
            ) : filteredVideos.length === 0 ? (
              <div className="bg-card h-[60vh] rounded-2xl border-2 border-dashed border-border p-20 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter">
                  No Video Available
                </h3>
                <p className="text-muted-foreground text-xs mt-1 font-medium">
                  This space will display the Videos once the administrator
                  uploads it.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-25">
                {filteredVideos.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer space-y-3"
                    onClick={() => handleVideoClick(item._id)}
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-border bg-muted">
                      <ImageWithFallback
                        src={item.thumbnailUrl || item.fileUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                      />

                      {/* Video Badge (not LIVE) */}
                      <div className="absolute top-3 left-3 z-20">
                        <div className="bg-primary/90 text-[10px] font-black px-2.5 py-0.5 rounded text-primary-foreground uppercase tracking-tighter shadow-lg flex items-center gap-1">
                          {/* <Video className="w-3 h-3" /> */}
                          VIDEO
                        </div>
                      </div>

                      {/* Centered Play Icon */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 px-1">
                      <div className="flex-1 overflow-hidden">
                        <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Video className="w-3 h-3 text-blue-400" />
                          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                            {item.tags.length > 0 ? item.tags[0] : "Video"}
                          </p>
                        </div>
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
