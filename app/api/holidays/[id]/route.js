import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Holiday from '@/models/Holiday'

// GET - Get single holiday
export async function GET(request, { params }) {
  try {
    await connectDB()

    const holiday = await Holiday.findById(params.id)

    if (!holiday) {
      return NextResponse.json(
        { success: false, message: 'Holiday not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: holiday,
    })
  } catch (error) {
    console.error('Get holiday error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch holiday' },
      { status: 500 }
    )
  }
}

// PUT - Update holiday
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const data = await request.json()

    const holiday = await Holiday.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    )

    if (!holiday) {
      return NextResponse.json(
        { success: false, message: 'Holiday not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Holiday updated successfully',
      data: holiday,
    })
  } catch (error) {
    console.error('Update holiday error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update holiday' },
      { status: 500 }
    )
  }
}

// DELETE - Delete holiday
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const holiday = await Holiday.findByIdAndDelete(params.id)

    if (!holiday) {
      return NextResponse.json(
        { success: false, message: 'Holiday not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Holiday deleted successfully',
    })
  } catch (error) {
    console.error('Delete holiday error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete holiday' },
      { status: 500 }
    )
  }
}

