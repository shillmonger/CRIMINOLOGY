"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Check, X, Upload, Image as ImageIcon, Video, 
  FileText, Plus, Hash, Type, AlignLeft, Play 
} from "lucide-react";
import { toast, Toaster } from "sonner";

import AdminHeader from "@/components/admin-dashboard/Header";
import AdminSidebar from "@/components/admin-dashboard/Sidebar";
import AdminNav from "@/components/admin-dashboard/Nav";

type UploadType = "image" | "video" | "pdf";

export default function AdminContentUploadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<UploadType>("image");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [externalUrl, setExternalUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill data based on type
  const handleTypeChange = (type: UploadType) => {
    setSelectedType(type);
    setFileName(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);

    if (type === "image") {
      setFormData({
        title: "This is demo image preview",
        description: "This is a demo image preview shown for review purposes only.",
        tags: "demo, image, preview"
      });
    } else if (type === "pdf") {
      setFormData({
        title: "This is demo PDF preview",
        description: "This is a demo PDF preview shown for review purposes only.",
        tags: "demo, pdf, preview"
      });
    } else {
      setFormData({
        title: "This is demo file preview",
        description: "This is a demo file preview shown for review purposes only.",
        tags: "demo, file, preview"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // Create preview URL for images and videos
      if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setExternalUrl(url);
    
    if (!url) {
      setPreviewUrl(null);
      return;
    }
    
    try {
      // Handle video URLs (YouTube/Vimeo)
      if (selectedType === 'video' && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com'))) {
        let videoId = '';
        
        if (url.includes('youtube.com')) {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v') || '';
          if (!videoId && urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.split('/').filter(Boolean)[0] || '';
          }
        } else if (url.includes('youtu.be')) {
          const urlObj = new URL(url);
          videoId = urlObj.pathname.split('/').filter(Boolean)[0] || '';
        } else if (url.includes('vimeo.com')) {
          const urlObj = new URL(url);
          videoId = urlObj.pathname.split('/').filter(Boolean).pop() || '';
        }
        
        if (videoId) {
          const thumbnailUrl = url.includes('vimeo.com')
            ? `https://vumbnail.com/${videoId}.jpg`
            : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          
          setPreviewUrl(thumbnailUrl);
          return;
        }
      }
      // Handle image URLs
      else if (selectedType === 'image' && (url.match(/\.(jpeg|jpg|gif|png)$/) || url.includes('imgur.com'))) {
        // For direct image links, use the URL as preview
        setPreviewUrl(url);
        return;
      }
      // Handle PDF URLs
      else if (selectedType === 'pdf' && url.match(/\.(pdf)$/)) {
        // For PDFs, we'll use a default thumbnail
        setPreviewUrl('https://i.postimg.cc/pTC8whf0/download-(1).jpg');
        return;
      }
    } catch (error) {
      console.error('Error processing URL:', error);
    }
    
    setPreviewUrl(null);
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    
    try {
      // Try to generate preview for YouTube and Vimeo
      if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
        let videoId = '';
        
        if (url.includes('youtube.com')) {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v') || '';
          // Handle youtu.be short URLs
          if (!videoId && urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.split('/').filter(Boolean)[0] || '';
          }
        } else if (url.includes('youtu.be')) {
          const urlObj = new URL(url);
          videoId = urlObj.pathname.split('/').filter(Boolean)[0] || '';
        } else if (url.includes('vimeo.com')) {
          const urlObj = new URL(url);
          videoId = urlObj.pathname.split('/').filter(Boolean).pop() || '';
        }
        
        if (videoId) {
          const thumbnailUrl = url.includes('vimeo.com')
            ? `https://vumbnail.com/${videoId}.jpg`
            : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          
          setPreviewUrl(thumbnailUrl);
          return;
        }
      }
    } catch (error) {
      console.error('Error processing video URL:', error);
    }
    
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadType === 'file' && !file) {
      return toast.error(`Please upload a ${selectedType} file first`);
    }
    
    if (uploadType === 'link') {
      if (!externalUrl) {
        return toast.error(`Please enter a ${selectedType} URL`);
      }
      
      // Additional validation for external URLs
      try {
        new URL(externalUrl);
        if (selectedType === 'pdf' && !externalUrl.match(/\.pdf($|\?)/i)) {
          return toast.error("Please enter a valid PDF URL (must end with .pdf)");
        }
        if (selectedType === 'image' && !externalUrl.match(/\.(jpeg|jpg|gif|png)($|\?)/i) && !externalUrl.includes('imgur.com')) {
          return toast.error("Please enter a valid image URL (.jpg, .jpeg, .gif, .png or Imgur link)");
        }
      } catch (error) {
        return toast.error("Please enter a valid URL");
      }
    }
    
    if (isUploading) return toast.error("Please wait for upload to complete");
    if (!formData.title || !formData.description) {
      return toast.error("Title and description are required");
    }

    setIsUploading(true);
    
    try {
      const formDataToSend = new FormData();
      
      if (uploadType === 'file' && file) {
        formDataToSend.append("file", file);
      } else if (uploadType === 'link') {
        formDataToSend.append("externalUrl", externalUrl);
      }
      
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("fileType", selectedType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to upload ${selectedType}`);
      }

      toast.success("Content uploaded successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        tags: ""
      });
      setFile(null);
      setFileName(null);
      setPreviewUrl(null);
      setExternalUrl("");
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-inter">
      <Toaster position="top-center" richColors />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="max-w-6xl mx-auto mb-5">
            <header className="mb-8">
              <h1 className="text-lg md:text-2xl font-black uppercase tracking-tighter italic leading-none text-foreground mb-1">
                Content Creator Portal
              </h1>
              <p className="text-muted-foreground mt-1">Configure and publish your media assets</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Select Type */}
                <div className="bg-card p-6 rounded-2xl border border-border">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <Plus size={16} /> Step 1: Asset Type
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {(["image", "video", "pdf"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeChange(type)}
                        className={`flex flex-col cursor-pointer items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          selectedType === type 
                            ? "border-foreground bg-muted text-foreground" 
                            : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/50"
                        }`}
                      >
                        {type === "image" && <ImageIcon size={24} />}
                        {type === "video" && <Video size={24} />}
                        {type === "pdf" && <FileText size={24} />}
                        <span className="text-xs font-bold uppercase">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Upload Area */}
                <div className="bg-card p-8 rounded-2xl border border-border flex flex-col items-center justify-center text-center min-h-[250px]">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Type
                      </label>
                      <div className="flex space-x-4 mb-4">
                        <button
                          type="button"
                          onClick={() => setUploadType('file')}
                          className={`px-4 py-2 rounded-md ${
                            uploadType === 'file'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadType('link')}
                          className={`px-4 py-2 rounded-md ${
                            uploadType === 'link'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {selectedType === 'image' ? 'Image Link' : 
                           selectedType === 'video' ? 'Video Link' : 'PDF Link'}
                        </button>
                      </div>
                    </div>

                    {uploadType === 'file' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content Type
                        </label>
                        <div className="flex space-x-4 mb-4">
                          {['image', 'video', 'pdf'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSelectedType(type as 'image' | 'video' | 'pdf')}
                              className={`px-4 py-2 rounded-md ${
                                selectedType === type
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {uploadType === 'file' ? (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Upload {selectedType}
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                  accept={selectedType === 'image' ? 'image/*' : selectedType === 'video' ? 'video/*' : '.pdf'}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {selectedType === 'image'
                                ? 'PNG, JPG, GIF up to 10MB'
                                : selectedType === 'video'
                                ? 'MP4, WebM up to 50MB'
                                : 'PDF up to 20MB'}
                            </p>
                          </div>
                        </div>
                        {fileName && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected file: {fileName}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label htmlFor="external-url" className="block text-sm font-medium text-gray-700">
                          {selectedType === 'image' ? 'Image URL' : 
                           selectedType === 'video' ? 'Video URL' : 'PDF URL'}
                        </label>
                        <input
                          type="url"
                          id="external-url"
                          name="external-url"
                          value={externalUrl}
                          onChange={handleExternalUrlChange}
                          placeholder={
                            selectedType === 'image' 
                              ? 'https://example.com/image.jpg' 
                              : selectedType === 'video'
                              ? 'https://youtube.com/watch?v=... or https://vimeo.com/...'
                              : 'https://example.com/document.pdf'
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                        <p className="text-xs text-gray-500">
                          {selectedType === 'image'
                            ? 'Direct image link (.jpg, .jpeg, .gif, .png) or Imgur'
                            : selectedType === 'video'
                            ? 'Supported platforms: YouTube, Vimeo'
                            : 'Direct PDF link (.pdf)'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Details Form */}
                <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl border border-border space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                      <Type size={12} /> Asset Title
                    </label>
                    <input 
                      className="w-full bg-muted/50 border border-border rounded-xl p-3 focus:ring-2 ring-foreground/20 outline-none font-medium text-foreground"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                      <AlignLeft size={12} /> Detailed Description
                    </label>
                    <textarea 
                      rows={3}
                      className="w-full bg-muted/50 border border-border rounded-xl p-3 focus:ring-2 ring-foreground/20 outline-none font-medium text-sm resize-none text-foreground"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                      <Hash size={12} /> Metadata Tags
                    </label>
                    <input 
                      placeholder="Separate with commas (e.g. FPS, Action)"
                      className="w-full bg-muted/50 border border-border rounded-xl p-3 focus:ring-2 ring-foreground/20 outline-none font-medium text-foreground"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isUploading || (uploadType === 'file' ? !file : !externalUrl)}
                    className="w-full bg-foreground text-background py-4 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      'Submit to Dashboard'
                    )}
                  </button>
                </form>
              </div>

              {/* RIGHT: LIVE PREVIEW */}
              <div className="space-y-6">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    Live Preview
                 </h3>
                 <div className="bg-card rounded-2xl overflow-hidden border border-border group shadow-sm">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {previewUrl ? (
                        selectedType === "image" ? (
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : selectedType === "video" ? (
                          <video 
                            src={previewUrl} 
                            controls 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-destructive/10">
                            <FileText size={64} className="text-destructive/30" />
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          {selectedType === "image" && <ImageIcon size={48} className="text-muted-foreground/20" />}
                          {selectedType === "video" && <Video size={48} className="text-muted-foreground/20" />}
                          {selectedType === "pdf" && <FileText size={48} className="text-muted-foreground/20" />}
                        </div>
                      )}

                      {previewUrl && selectedType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-background/90 p-4 rounded-full shadow-2xl">
                            <Play size={32} className="text-foreground ml-1" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 bg-background/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                        {selectedType}
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                       <h2 className="font-bold text-lg leading-tight text-foreground">
                         {formData.title || "Untitled Asset"}
                       </h2>
                       <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">
                          {formData.description || "No description provided yet..."}
                       </p>
                       <div className="flex flex-wrap gap-2 pt-2">
                          {formData.tags.split(",").map((tag, i) => (
                            tag.trim() && (
                              <span key={i} className="text-[9px] font-black bg-muted text-muted-foreground px-2 py-1 rounded border border-border">
                                #{tag.trim().toUpperCase()}
                              </span>
                            )
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Tips Card */}
                 <div className="bg-muted border border-border p-6 rounded-2xl">
                    <h4 className="font-bold mb-2 flex items-center gap-2 text-sm uppercase text-foreground">
                      <Check size={16}/> Pro Tip
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Make sure your {selectedType} is high quality for better engagement on the user dashboard.
                    </p>
                 </div>
              </div>

            </div>
          </div>
        </main>
        <AdminNav />
      </div>
    </div>
  );
}