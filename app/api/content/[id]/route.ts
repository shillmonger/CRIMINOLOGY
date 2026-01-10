import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Content from "@/models/Content";
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Update the context type to match Next.js 13+ App Router expectations
type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('DELETE request received for content ID:', params.id);
  
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to delete content" },
      { status: 401 }
    );
  }
  
  // Validate ID format
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { error: "Invalid content ID format" },
      { status: 400 }
    );
  }
  
  try {
    await connectDB();
    
    // Delete the content
    const deletedContent = await Content.findByIdAndDelete(params.id);
    
    if (!deletedContent) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    console.log('Successfully deleted content:', params.id);
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