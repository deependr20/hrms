import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Employee from '@/models/Employee'
import Department from '@/models/Department'
import Designation from '@/models/Designation'

// GET - List all employees with filters
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department')
    const status = searchParams.get('status')

    // Build query
    const query = {}
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } },
      ]
    }

    if (department) {
      query.department = department
    }

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const employees = await Employee.find(query)
      .populate('department', 'name')
      .populate('designation', 'title')
      .populate('reportingManager', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Employee.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get employees error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

// POST - Create new employee
export async function POST(request) {
  try {
    await connectDB()

    const data = await request.json()

    // Check if employee code already exists
    const existingEmployee = await Employee.findOne({ employeeCode: data.employeeCode })
    if (existingEmployee) {
      return NextResponse.json(
        { success: false, message: 'Employee code already exists' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await Employee.findOne({ email: data.email })
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      )
    }

    const employee = await Employee.create(data)

    const populatedEmployee = await Employee.findById(employee._id)
      .populate('department', 'name')
      .populate('designation', 'title')
      .populate('reportingManager', 'firstName lastName')

    return NextResponse.json({
      success: true,
      message: 'Employee created successfully',
      data: populatedEmployee,
    }, { status: 201 })
  } catch (error) {
    console.error('Create employee error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create employee' },
      { status: 500 }
    )
  }
}

