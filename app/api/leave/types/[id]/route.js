import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import LeaveType from '@/models/LeaveType'

// GET - Get single leave type
export async function GET(request, { params }) {
  try {
    await connectDB()

    const leaveType = await LeaveType.findById(params.id)

    if (!leaveType) {
      return NextResponse.json(
        { success: false, message: 'Leave type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: leaveType,
    })
  } catch (error) {
    console.error('Get leave type error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leave type' },
      { status: 500 }
    )
  }
}

// PUT - Update leave type
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const data = await request.json()

    const leaveType = await LeaveType.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    )

    if (!leaveType) {
      return NextResponse.json(
        { success: false, message: 'Leave type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Leave type updated successfully',
      data: leaveType,
    })
  } catch (error) {
    console.error('Update leave type error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update leave type' },
      { status: 500 }
    )
  }
}

// DELETE - Delete leave type
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const leaveType = await LeaveType.findByIdAndDelete(params.id)

    if (!leaveType) {
      return NextResponse.json(
        { success: false, message: 'Leave type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Leave type deleted successfully',
    })
  } catch (error) {
    console.error('Delete leave type error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete leave type' },
      { status: 500 }
    )
  }
}

