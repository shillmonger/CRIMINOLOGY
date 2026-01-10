"use client";

import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Share2, Download, Heart, Play, Clock, ThumbsUp, MessageSquare, User, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import Sidebar from "@/components/user-dashboard/Sidebar";
import Nav from "@/components/user-dashboard/Nav";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { VideoDetailSkeleton } from "@/components/ui/video-detail-skeleton";

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

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [video, setVideo] = useState<ContentItem | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the specific video using the API endpoint
        const response = await fetch(`/api/content/${params.id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Failed to fetch video: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || data.fileType !== 'video') {
          return notFound();
        }
        
        setVideo(data);
        
        // Fetch related videos (other videos from the database)
        const relatedResponse = await fetch('/api/content');
        if (relatedResponse.ok) {
          const allContent = await relatedResponse.json();
          // Get other videos (excluding the current one)
          const otherVideos = allContent.filter(
            (item: ContentItem) => 
              item.fileType === 'video' && 
              item._id !== params.id
          ).slice(0, 3); // Limit to 3 related videos
          setRelatedVideos(otherVideos);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load video';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
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
              Back to Videos
            </Button>
          </div>
          <VideoDetailSkeleton />
          <Nav />
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

  if (!video) {
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
            Back to Videos
          </Button>
        </div>

        <main className="flex-1 p-4 md:p-10 space-y-8 overflow-y-auto">
          {/* Video Player Section */}
<section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-25 lg:mb-0">
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                <video
                  src={video.fileUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={video.thumbnailUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Video Info */}
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">{video.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{formatViewCount(video.views)} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Uploaded on {formatDate(video.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
                
                {/* Video Description */}
                <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm">{video.description}</p>
                </div>
              </div>
            </div>
            
            {/* Related Videos */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">Up Next</h2>
              <div className="space-y-4">
                {relatedVideos.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ x: 4 }}
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => router.push(`/user-dashboard/video-content/${item._id}`)}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={item.thumbnailUrl || item.fileUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{/* Channel */}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{formatViewCount(item.views)} views</span>
                        <span>•</span>
                        <span>Uploaded on {formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

                                <Nav />
        
      </div>
    </div>
  );
}