import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Designation from '@/models/Designation'

// GET - List all designations
export async function GET(request) {
  try {
    await connectDB()

    const designations = await Designation.find({ isActive: true })
      .populate('department', 'name')
      .sort({ title: 1 })

    return NextResponse.json({
      success: true,
      data: designations,
    })
  } catch (error) {
    console.error('Get designations error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch designations' },
      { status: 500 }
    )
  }
}

// POST - Create new designation
export async function POST(request) {
  try {
    await connectDB()

    const data = await request.json()

    const designation = await Designation.create(data)

    return NextResponse.json({
      success: true,
      message: 'Designation created successfully',
      data: designation,
    }, { status: 201 })
  } catch (error) {
    console.error('Create designation error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create designation' },
      { status: 500 }
    )
  }
}

