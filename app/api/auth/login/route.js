import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Employee from '@/models/Employee'
import { SignJWT } from 'jose'

export async function POST(request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    console.log('Login attempt for:', email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      )
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password').populate('employeeId')

    console.log('User found:', user ? 'Yes' : 'No')

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Your account has been deactivated' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password)

    console.log('Password match:', isPasswordMatch)

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    // Return user data without password
    const userData = {
      id: user._id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

