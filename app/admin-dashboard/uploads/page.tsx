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

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: ""
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
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    
    // Validate file type
    let isValid = true;
    if (selectedType === "image" && !fileType.startsWith("image/")) {
      toast.error("Invalid File: Please select an Image");
      isValid = false;
    } else if (selectedType === "video" && !fileType.startsWith("video/")) {
      toast.error("Invalid File: Please select a Video");
      isValid = false;
    } else if (selectedType === "pdf" && fileType !== "application/pdf") {
      toast.error("Invalid File: Please select a PDF document");
      isValid = false;
    }

    if (!isValid) return;

    // Set file and preview
    setFile(selectedFile);
    setFileName(selectedFile.name);
    
    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    // Simulate upload progress (optional, can be removed if using actual upload progress)
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
    
    // Clean up function
    return () => {
      clearInterval(interval);
      URL.revokeObjectURL(url);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload a file first");
    if (isUploading) return toast.error("Please wait for upload to complete");
    if (!formData.title || !formData.description) {
      return toast.error("Title and description are required");
    }

    setIsUploading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
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
        throw new Error(result.error || 'Failed to upload file');
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
                  {!fileName ? (
                    <>
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                        <Upload size={32} />
                      </div>
                      <h2 className="text-xl font-bold mb-1">Select your {selectedType}</h2>
                      <p className="text-muted-foreground text-sm mb-6">File validation is active for {selectedType} format</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-foreground text-background px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform cursor-pointer"
                      >
                        Browse Files
                      </button>
                    </>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-card rounded-lg shadow-sm border border-border">
                            {selectedType === "image" && <ImageIcon className="text-foreground" size={20} />}
                            {selectedType === "video" && <Video className="text-foreground" size={20} />}
                            {selectedType === "pdf" && <FileText className="text-foreground" size={20} />}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold truncate max-w-[200px]">{fileName}</p>
                            <p className="text-[10px] uppercase font-black text-green-600">Ready to sync</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setFileName(null);
                            setPreviewUrl(null);
                            setUploadProgress(0);
                            setIsUploading(false);
                          }} 
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                            <span>Uploading Asset...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-foreground transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept={selectedType === "image" ? "image/*" : selectedType === "video" ? "video/*" : ".pdf"}
                  />
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
                      disabled={isUploading || !file}
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