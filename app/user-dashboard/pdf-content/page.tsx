// app/user-dashboard/pdf-content/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";
import { PDFContentSkeleton } from "@/components/ui/pdf-content-skeleton";

import Sidebar from "@/components/user-dashboard/Sidebar";
import Header from "@/components/user-dashboard/Header";
import Nav from "@/components/user-dashboard/Nav";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

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

export default function PDFContentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pdfs, setPdfs] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) throw new Error("Failed to fetch PDFs");
        const data = await response.json();
        // Filter to only include PDFs
        const pdfContent = data.filter(
          (item: ContentItem) => item.fileType === "pdf"
        );
        setPdfs(pdfContent);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        toast.error("Failed to load PDFs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDFs();
  }, []);

  const handlePDFClick = (id: string) => {
    router.push(`/user-dashboard/pdf-content/${id}`);
  };

  const filteredPDFs = pdfs.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
          {/* Top Library Picks - PDFs */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
                  Top PDF Documents
                </h2>
                <p className="text-sm text-muted-foreground">
                  Detailed guides, manuals, and documents.
                </p>
              </div>
            </div>

            {isLoading ? (
              <PDFContentSkeleton />
            ) : filteredPDFs.length === 0 ? (
              <div className="bg-card h-[60vh] rounded-2xl border-2 border-dashed border-border p-20 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter">
                  No PDF Available
                </h3>
                <p className="text-muted-foreground text-xs mt-1 font-medium">
                  This space will display the PDFs once the administrator
                  uploads them.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-25">
                {filteredPDFs.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer space-y-3"
                    onClick={() => handlePDFClick(item._id)}
                  >
                    <div className="relative aspect-[3/4.5] rounded-xl overflow-hidden shadow-lg border border-border bg-muted">
                      <div className="w-full h-full">
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(
                            item.fileUrl
                          )}&embedded=true`}
                          className="w-full h-full"
                          title={`PDF Preview - ${item.title}`}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="bg-orange-600 p-4 rounded-2xl shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-[10px] font-black bg-white text-black px-2 py-1 rounded">
                            VIEW PDF
                          </span>
                        </div>
                      </div>

                      {/* Top Action Buttons */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          className="bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border hover:bg-primary hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.fileUrl, "_blank");
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="px-1">
                      <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <FileText className="w-3 h-3 text-orange-400" />
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                          {item.tags.length > 0 ? item.tags[0] : "PDF"}
                        </p>
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
