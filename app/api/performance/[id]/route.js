import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Performance from '@/models/Performance'

// GET - Get single performance review
export async function GET(request, { params }) {
  try {
    await connectDB()

    const performance = await Performance.findById(params.id)
      .populate('employee', 'firstName lastName employeeCode')
      .populate('reviewedBy', 'firstName lastName')

    if (!performance) {
      return NextResponse.json(
        { success: false, message: 'Performance review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: performance,
    })
  } catch (error) {
    console.error('Get performance error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch performance review' },
      { status: 500 }
    )
  }
}

// PUT - Update performance review
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const data = await request.json()

    const performance = await Performance.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    )
      .populate('employee', 'firstName lastName employeeCode')
      .populate('reviewedBy', 'firstName lastName')

    if (!performance) {
      return NextResponse.json(
        { success: false, message: 'Performance review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Performance review updated successfully',
      data: performance,
    })
  } catch (error) {
    console.error('Update performance error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update performance review' },
      { status: 500 }
    )
  }
}

// DELETE - Delete performance review
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const performance = await Performance.findByIdAndDelete(params.id)

    if (!performance) {
      return NextResponse.json(
        { success: false, message: 'Performance review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Performance review deleted successfully',
    })
  } catch (error) {
    console.error('Delete performance error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete performance review' },
      { status: 500 }
    )
  }
}

