import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Content from "@/models/Content";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  console.log("GET request received for content ID:", id);

  try {
    await connectDB();
    console.log("Connected to database");

    const content = await Content.findById(id);
    console.log("Content found:", content ? "Yes" : "No");

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  console.log("DELETE request received for content ID:", id);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to delete content" },
      { status: 401 }
    );
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid content ID format" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const deletedContent = await Content.findByIdAndDelete(id);

    if (!deletedContent) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    console.log("Successfully deleted content:", id);
    return NextResponse.json(
      { message: "Content deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
