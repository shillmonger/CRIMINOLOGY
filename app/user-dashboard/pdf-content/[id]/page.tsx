// app/user-dashboard/pdf-content/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { ArrowLeft, Share2, Download, FileText, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import Sidebar from "@/components/user-dashboard/Sidebar";
import Nav from "@/components/user-dashboard/Nav";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { PDFDetailSkeleton } from "@/components/ui/pdf-detail-skeleton";
import { Suspense } from "react";

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  fileType: 'image' | 'video' | 'pdf';
  createdAt: string;
  views?: number;
}

export default function PDFDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [pdf, setPdf] = useState<ContentItem | null>(null);
  const [relatedPdfs, setRelatedPdfs] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPDF = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the specific PDF using the API endpoint
        const response = await fetch(`/api/content/${params.id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Failed to fetch PDF: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || data.fileType !== 'pdf') {
          return notFound();
        }
        
        setPdf(data);
        
        // Fetch related PDFs (other PDFs from the database)
        const relatedResponse = await fetch('/api/content');
        if (relatedResponse.ok) {
          const allContent = await relatedResponse.json();
          // Get other PDFs (excluding the current one)
          const otherPdfs = allContent.filter(
            (item: ContentItem) => 
              item.fileType === 'pdf' && 
              item._id !== params.id
          ).slice(0, 3); // Limit to 3 related PDFs
          setRelatedPdfs(otherPdfs);
        }
      } catch (error) {
        console.error('Error fetching PDF:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load PDF';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDF();
  }, [params?.id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatViewCount = (count: number = 0) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (isLoading) {
    return <PDFDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
            <p className="font-medium">Error: {error}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!pdf) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to PDFs
          </Button>
        </div>

        <main className="flex-1 p-4 md:p-10 space-y-8 overflow-y-auto">
          <Suspense fallback={<PDFDetailSkeleton />}>
          {/* PDF Viewer Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-25 lg:mb-0">
            <div className="lg:col-span-2 space-y-6">
              {/* PDF Viewer */}
              <div className="relative w-full bg-background rounded-2xl overflow-hidden border border-border shadow-lg">
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(pdf.fileUrl)}&embedded=true`}
                  className="w-full h-[70vh]"
                  title={`PDF Viewer - ${pdf.title}`}
                  allowFullScreen
                >
                  <p>Your browser does not support iframes. <a href={pdf.fileUrl} download className="text-primary hover:underline">Download the PDF</a> instead.</p>
                </iframe>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border shadow-lg pointer-events-auto">
                    <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
                    <p className="text-foreground font-medium mb-4">{pdf.title}</p>
                    <a 
                      href={pdf.fileUrl} 
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                </div>
                <a 
                  href={pdf.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  onClick={(e) => e.stopPropagation()}
                ></a>
              </div>
              
              {/* PDF Info */}
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">{pdf.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Uploaded on {formatDate(pdf.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{pdf.views || 0} views</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard!');
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = pdf.fileUrl;
                      link.download = pdf.title.endsWith('.pdf') ? pdf.title : `${pdf.title}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
                
                {/* PDF Description */}
                <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {pdf.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm">{pdf.description}</p>
                </div>
              </div>
            </div>
            
            {/* Related PDFs */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">Related Documents</h2>
              <div className="space-y-4">
                {relatedPdfs.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ x: 4 }}
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => router.push(`/user-dashboard/pdf-content/${item._id}`)}
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={item.thumbnailUrl || '/pdf-placeholder.png'}
                        alt={item.title}
                        fill
                        className="object-cover"
                        fallbackSrc="/pdf-placeholder.png"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{formatViewCount(item.views || 0)} views</span>
                        <span>•</span>
                        <span>Uploaded on {formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          </Suspense>
        </main>

        <Nav />
      </div>
    </div>
  );
}