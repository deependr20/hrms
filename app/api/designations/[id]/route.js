import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Designation from '@/models/Designation'

// GET - Get single designation
export async function GET(request, { params }) {
  try {
    await connectDB()

    const designation = await Designation.findById(params.id)
      .populate('department', 'name')

    if (!designation) {
      return NextResponse.json(
        { success: false, message: 'Designation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: designation,
    })
  } catch (error) {
    console.error('Get designation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch designation' },
      { status: 500 }
    )
  }
}

// PUT - Update designation
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const data = await request.json()

    const designation = await Designation.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('department', 'name')

    if (!designation) {
      return NextResponse.json(
        { success: false, message: 'Designation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Designation updated successfully',
      data: designation,
    })
  } catch (error) {
    console.error('Update designation error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update designation' },
      { status: 500 }
    )
  }
}

// DELETE - Delete designation
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const designation = await Designation.findByIdAndDelete(params.id)

    if (!designation) {
      return NextResponse.json(
        { success: false, message: 'Designation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Designation deleted successfully',
    })
  } catch (error) {
    console.error('Delete designation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete designation' },
      { status: 500 }
    )
  }
}

