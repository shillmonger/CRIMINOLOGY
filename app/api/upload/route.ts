import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import cloudinary, { type UploadApiOptions } from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Content, { SourceType } from "@/models/Content";

const PDF_THUMBNAIL_URL = 'https://i.postimg.cc/pTC8whf0/download-(1).jpg';

// Helper function to get video ID and thumbnail from different platforms
const getVideoInfo = (url: string): { videoId: string; thumbnailUrl: string } | null => {
  try {
    const urlObj = new URL(url);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';
      
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      }
      
      if (!videoId) return null;
      
      return {
        videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      };
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      if (!videoId) return null;
      
      return {
        videoId,
        thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`
      };
    }
    
    // Add more platforms as needed
    
    return null;
  } catch (error) {
    console.error('Error parsing video URL:', error);
    return null;
  }
};

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = (formData.get("tags") as string)?.split(',').map(tag => tag.trim());
    const fileType = formData.get("fileType") as 'image' | 'video' | 'pdf';
    const externalUrl = formData.get("externalUrl") as string | null;

    if (!file && !externalUrl) {
      return NextResponse.json({ error: "No file or external URL provided" }, { status: 400 });
    }
    
    // Handle external links (video, image, or PDF)
    if (externalUrl) {
      // For videos, use the existing getVideoInfo function
      if (fileType === 'video') {
        const videoInfo = getVideoInfo(externalUrl);
        if (!videoInfo) {
          return NextResponse.json({ error: "Invalid or unsupported video URL" }, { status: 400 });
        }
        
        const content = new Content({
          title,
          description,
          tags,
          fileUrl: externalUrl,
          thumbnailUrl: videoInfo.thumbnailUrl,
          fileType: 'video',
          sourceType: 'external_link',
          uploadedBy: 'admin',
        });
        
        await content.save();
        
        return NextResponse.json({
          success: true,
          data: {
            id: content._id,
            title: content.title,
            url: content.fileUrl,
            type: content.fileType,
          }
        });
      }
      
      // For images
      if (fileType === 'image') {
        // Validate image URL
        try {
          // Simple URL validation - you might want to enhance this
          new URL(externalUrl);
          if (!externalUrl.match(/\.(jpeg|jpg|gif|png)$/) && !externalUrl.includes('imgur.com')) {
            return NextResponse.json({ error: "Invalid image URL. Only .jpg, .jpeg, .gif, .png or Imgur links are supported" }, { status: 400 });
          }
          
          const content = new Content({
            title,
            description,
            tags,
            fileUrl: externalUrl,
            thumbnailUrl: externalUrl, // Use the same URL for thumbnail
            fileType: 'image',
            sourceType: 'external_link',
            uploadedBy: 'admin',
          });
          
          await content.save();
          
          return NextResponse.json({
            success: true,
            data: {
              id: content._id,
              title: content.title,
              url: content.fileUrl,
              type: content.fileType,
            }
          });
          
        } catch (error) {
          return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }
      }
      
      // For PDFs
      if (fileType === 'pdf') {
        try {
          // Simple URL validation - you might want to enhance this
          new URL(externalUrl);
          if (!externalUrl.match(/\.pdf$/i)) {
            return NextResponse.json({ error: "Invalid PDF URL. Only .pdf links are supported" }, { status: 400 });
          }
          
          const content = new Content({
            title,
            description,
            tags,
            fileUrl: externalUrl,
            thumbnailUrl: PDF_THUMBNAIL_URL, // Use the default PDF thumbnail
            fileType: 'pdf',
            sourceType: 'external_link',
            uploadedBy: 'admin',
          });
          
          await content.save();
          
          return NextResponse.json({
            success: true,
            data: {
              id: content._id,
              title: content.title,
              url: content.fileUrl,
              type: content.fileType,
            }
          });
          
        } catch (error) {
          return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }
      }
      
      return NextResponse.json({ error: "Unsupported file type for external link" }, { status: 400 });
    }
    
    // Handle file upload (original functionality)

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" }, 
        { status: 400 }
      );
    }

    const bytes = await file?.arrayBuffer();
if (!bytes) {
  return NextResponse.json(
    { error: "No file data available" },
    { status: 400 }
  );
}
const buffer = Buffer.from(bytes);

    // Generate a clean filename for the public ID
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Upload the main file to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
     const uploadOptions: UploadApiOptions = {
  folder: "criminology",
  resource_type: fileType === 'pdf' ? 'raw' : fileType as 'image' | 'video',
  public_id: `${cleanTitle}_${Date.now()}`,
  chunk_size: 10485760, // 10MB chunks for large files
};

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          if (!result) {
            reject(new Error('Upload failed: No result from Cloudinary'));
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });

    let thumbnailUrl = result.secure_url; // Default to file URL for images

    // Handle video thumbnail generation
    if (fileType === 'video') {
      try {
        // Generate thumbnail using Cloudinary SDK with proper format and transformations
        thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: "video",
          format: "jpg",
          transformation: [
            { start_offset: "10%" },  // Get frame at 10% of video duration
            { width: 800, height: 450, crop: "fill" }  // Standard 16:9 aspect ratio
          ]
        });
      } catch (error) {
        console.error('Error generating video thumbnail:', error);
        // Fallback to a default thumbnail if generation fails
        thumbnailUrl = 'https://via.placeholder.com/800x450?text=Video+Thumbnail';
      }
    }
    // Set PDF thumbnail to the static image URL
    else if (fileType === 'pdf') {
      thumbnailUrl = PDF_THUMBNAIL_URL;
    }

    // Save to database
    const content = new Content({
      title,
      description,
      tags,
      fileUrl: result.secure_url,
      thumbnailUrl,
      fileType,
      publicId: result.public_id, // Only set publicId for uploaded files
      sourceType: 'upload',
      uploadedBy: 'admin',
    });

    await content.save();

    return NextResponse.json({
      success: true,
      data: {
        id: content._id,
        title: content.title,
        url: content.fileUrl,
        type: content.fileType,
      }
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}
