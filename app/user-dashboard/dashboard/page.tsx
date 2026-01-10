"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileText,
  Video,
  Search,
  Image as ImageIcon,
  Filter,
  Clock,
  Eye,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import Sidebar from "@/components/user-dashboard/Sidebar";
import { ThreeDCarousel } from "@/components/user-dashboard/ThreeDCarousel";
import Header from "@/components/user-dashboard/Header";
import Nav from "@/components/user-dashboard/Nav";
import { format } from "date-fns";
import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  fileType: "image" | "video" | "pdf";
  createdAt: string;
}

export default function DashboardPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };
  const [filterType, setFilterType] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) throw new Error("Failed to fetch content");
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error fetching content:", error);
        toast.error("Failed to load content library");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags &&
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesFilter = filterType === "all" || item.fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM dd, yyyy");

  const MediaIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const TypeBadge = ({ type }: { type: string }) => {
    const typeStyles = {
      video: "bg-red-100 text-red-800",
      image: "bg-blue-100 text-blue-800",
      pdf: "bg-amber-100 text-amber-800",
    };

    return (
      <span
        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          typeStyles[type as keyof typeof typeStyles] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-inter">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <Header onSearch={handleSearch} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-24">
          {!isLoading && (
            <div className="mb-12">
              <ThreeDCarousel
                items={[
                  {
                    id: 1,
                    src: "https://i.postimg.cc/4dYGvpFQ/Arcane-wallpaper.jpg",
                    title: "Anime Collection",
                    description: "Explore high-quality animations and cinematic Japanese art styles",
                    tag: "Anime",
                  },
                  {
                    id: 2,
                    src: "https://i.postimg.cc/0j7LZnGM/Food.jpg",
                    title: "Culinary Arts",
                    description: "Gourmet food photography and professional kitchen workflows",
                    tag: "Food",
                  },
                  {
                    id: 3,
                    src: "https://i.postimg.cc/YSjZTMft/download.jpg",
                    title: "Sporting Excellence",
                    description: "Dynamic action shots and high-performance athletic content",
                    tag: "Sports",
                  },
                  {
                    id: 4,
                    src: "https://i.postimg.cc/Qxf9ZMd7/Screenshot-2026-01-07-125412.jpg",
                    title: "Crime Scene Analysis",
                    description: "Advanced techniques in forensic investigation",
                    tag: "New",
                  },
                  {
                    id: 5,
                    src: "https://i.postimg.cc/GmzZjZzr/download-(7).jpg",
                    title: "Digital Research Workspace",
                    description: "A modern laboratory and data analysis environment showcasing investigative workflows",
                    tag: "Popular",
                  },
                  {
                    id: 6,
                    src: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                    title: "Forensic Science",
                    description: "Latest tools and methodologies",
                    tag: "Trending",
                  },
                ]}
                className="mb-12"
              />
            </div>
          )}

          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
                    Library Content
                  </h1>
                  <p className="text-muted-foreground text-sm font-medium">
                    {content.length} resources available
                  </p>
                </div>

                {/* Filter Dropdown */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 w-full sm:w-44 bg-muted/50 border border-border rounded-xl px-4 py-2.5 outline-none hover:bg-muted transition-all font-bold text-xs uppercase tracking-widest text-foreground cursor-pointer group">
                        <Filter className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="flex-1 text-left">
                          {filterType === "all"
                            ? "All Types"
                            : filterType === "image"
                            ? "Images"
                            : filterType === "video"
                            ? "Videos"
                            : "Documents"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-44 bg-background border-border rounded-xl p-1 shadow-2xl"
                    >
                      {[
                        { id: "all", label: "All Types" },
                        { id: "image", label: "Images" },
                        { id: "video", label: "Videos" },
                        { id: "pdf", label: "Documents" },
                      ].map((type) => (
                        <DropdownMenuItem
                          key={type.id}
                          onClick={() => setFilterType(type.id)}
                          className={`cursor-pointer rounded-lg text-xs font-bold uppercase tracking-widest py-2.5 mb-1 last:mb-0 transition-colors ${
                            filterType === type.id
                              ? "bg-foreground text-background"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {type.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content Grid */}
              {filteredContent.length === 0 ? (
                <div className="bg-card h-[60vh] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
                  <h3 className="text-lg font-black uppercase italic tracking-tighter">
                    No Resources Found
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1 font-medium">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredContent.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-foreground/40 transition-all duration-300 shadow-sm hover:shadow-xl"
                    >
                      {/* Media Preview Area */}
                      <div className="aspect-video bg-muted relative overflow-hidden border-b border-border">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/80">
                            <MediaIcon type={item.fileType} />
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <TypeBadge type={item.fileType} />
                        </div>

                        <div
                          className="absolute inset-0 bg-foreground/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] cursor-pointer"
                          onClick={() => {
                            const route = `/user-dashboard/${item.fileType}-content/${item._id}`;
                            router.push(route);
                          }}
                        >
                          <div className="p-3 bg-background rounded-full hover:scale-110 active:scale-95 transition-transform text-foreground">
                            <Eye className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-sm line-clamp-1">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-medium">
                            {item.fileType.toUpperCase()}
                          </span>
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
        <Nav />
      </div>
    </div>
  );
}