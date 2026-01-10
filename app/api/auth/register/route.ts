import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
// import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    // Basic validation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with default 'user' role
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user' // Explicitly set the role
    });

    await user.save();

    // Return success response without sensitive data
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    // The client will handle the sign-in after successful registration
    return NextResponse.json(
      { 
        message: 'User registered successfully', 
        user: userWithoutPassword,
        success: true
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
