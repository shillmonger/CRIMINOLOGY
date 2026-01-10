import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Content from "@/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  console.log('GET request received at:', new Date().toISOString());
  console.log('Request URL:', request.url);
  
  try {
    await connectDB();
    console.log('Successfully connected to database');
    
    // Check if we're looking for a specific content item
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    console.log('Extracted ID:', id);
    
    if (id && id !== 'content') {
      console.log('Fetching content with ID:', id);
      // Fetch single content item by ID
      const content = await Content.findById(id);
      console.log('Content found:', content ? 'Yes' : 'No');
      
      if (!content) {
        console.log('Content not found for ID:', id);
        return NextResponse.json(
          { error: "Content not found" },
          { status: 404 }
        );
      }
      
      console.log('Returning content:', {
        id: content._id,
        title: content.title,
        fileType: content.fileType
      });
      
      return NextResponse.json(content);
    }
    
    // Fetch all content (original behavior)
    const content = await Content.find({}).sort({ createdAt: -1 });
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

