"use client";

import React, { useState, useEffect, Suspense } from "react";
import { 
  Files, Search, Filter, Play, 
  FileText, Image as ImageIcon, Video, 
  Eye, Download, Trash2, Clock
} from "lucide-react";
import dynamic from "next/dynamic";

// Import the skeleton component
import { ContentSkeleton } from "./content-skeleton";
import { format } from 'date-fns';
import { toast, Toaster } from "sonner";

// Shadcn UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- NEW IMPORTS FOR POP-OUT ---
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import AdminHeader from "@/components/admin-dashboard/Header";
import AdminSidebar from "@/components/admin-dashboard/Sidebar";
import AdminNav from "@/components/admin-dashboard/Nav";

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  fileType: 'image' | 'video' | 'pdf';
  createdAt: string;
}

export default function AllContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Updated handleDelete: Removed the 'confirm()' check
  const handleDelete = async (id: string, title: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete content');
      
      setContent(prevContent => prevContent.filter(item => item._id !== id));
      toast.success(`"${title}" has been deleted`);
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error(`Failed to delete "${title}"`);
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error("Failed to sync content library");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "all" || item.fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => format(new Date(dateString), 'MMM dd, yyyy');

  return (
    <div className="flex h-screen overflow-hidden bg-background font-inter">
      <Toaster position="top-center" richColors />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="max-w-7xl mx-auto mb-5">
            {isLoading ? (
              <ContentSkeleton />
            ) : (
              <div>
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
                      Content Library
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                      Managing {content.length} active assets in the cloud
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                      <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full sm:w-64 bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 ring-foreground/20 transition-all font-medium text-sm text-foreground placeholder:text-muted-foreground/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-muted/50 border-border rounded-xl h-[42px] px-4 py-5 focus:ring-2 ring-foreground/20 font-bold text-[10px] uppercase tracking-wider outline-none text-foreground">
                        <div className="flex items-center gap-2">
                          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                          <SelectValue placeholder="All Assets" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border rounded-xl shadow-2xl">
                        <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">All Assets</SelectItem>
                        <SelectItem value="image" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Images</SelectItem>
                        <SelectItem value="video" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Videos</SelectItem>
                        <SelectItem value="pdf" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Content Grid */}
                {filteredContent.length === 0 ? (
                  <div className="bg-card rounded-2xl border-2 border-dashed border-border p-20 text-center">
                    <Files className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">No Matches Found</h3>
                    <p className="text-muted-foreground text-xs mt-1 font-medium">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredContent.map((item) => (
                      <div key={item._id} className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-foreground/40 transition-all duration-300 shadow-sm hover:shadow-xl">
                        
                        {/* Media Preview */}
                        <div className="aspect-video bg-muted relative overflow-hidden border-b border-border">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/80 to-muted/60">
                               {item.fileType === 'video' ? <Video size={48} className="text-muted-foreground/40" /> : <FileText size={48} className="text-muted-foreground/40" />}
                            </div>
                          )}
                          
                          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-xl px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/10 shadow-lg">
                            {item.fileType}
                          </div>

                          <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                            {/* <a href={item.fileUrl} target="_blank" className="p-3 bg-background rounded-full hover:scale-110 active:scale-95 transition-transform text-foreground"><Eye size={20} /></a> */}
                            <a href={item.fileUrl} download className="p-3 bg-background rounded-full hover:scale-110 active:scale-95 transition-transform text-foreground"><Download size={20} /></a>
                          </div>
                        </div>

                        {/* Content Details */}
                        <div className="p-5 space-y-4">
                          <div className="space-y-1.5">
                            <h3 className="font-bold text-[13px] leading-tight truncate text-foreground">{item.title}</h3>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                              <Clock size={10} className="text-muted-foreground/60" />
                              {formatDate(item.createdAt)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-border/40">
                            <div className="flex gap-1.5 overflow-hidden">
                              {item.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-[9px] font-black bg-muted text-foreground/70 px-2 py-0.5 rounded border border-border uppercase tracking-tight">#{tag}</span>
                              ))}
                            </div>

                            {/* --- WRAPPING TRASH ICON WITH ALERT DIALOG --- */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button 
                                  className="text-muted-foreground hover:text-destructive transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                  disabled={isDeleting === item._id}
                                >
                                  <Trash2 size={16} className={isDeleting === item._id ? 'animate-pulse' : ''} />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl border-2 border-border bg-card">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-black uppercase tracking-tighter italic">
                                    Confirm Deletion
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                                    Are you sure you want to delete <span className="text-foreground font-bold">"{item.title}"</span>? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3">
                                  <AlertDialogCancel className="rounded-xl cursor-pointer font-bold text-[10px] uppercase tracking-widest border-2">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(item._id, item.title)}
                                    className="rounded-xl font-bold text-[10px] cursor-pointer uppercase tracking-widest bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete Asset
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            {/* --- END ALERT DIALOG --- */}

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <AdminNav />
      </div>
    </div>
  );
}