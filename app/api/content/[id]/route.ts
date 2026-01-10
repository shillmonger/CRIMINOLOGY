import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Content from "@/models/Content";
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('GET request received for content ID:', params.id);
  
  try {
    await connectDB();
    console.log('Connected to database');
    
    const content = await Content.findById(params.id);
    console.log('Content found:', content ? 'Yes' : 'No');
    
    if (!content) {
      console.log('Content not found for ID:', params.id);
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
    
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('DELETE request received for content ID:', params.id);
  
  try {
    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid content ID format" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find and delete the content
    const deletedContent = await Content.findByIdAndDelete(params.id);
    
    if (!deletedContent) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }
    
    console.log('Content deleted successfully:', deletedContent._id);
    return NextResponse.json(
      { message: "Content deleted successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
