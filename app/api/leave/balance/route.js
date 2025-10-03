import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import LeaveBalance from '@/models/LeaveBalance'

// GET - Get leave balance for employee
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')

    if (!employeeId) {
      return NextResponse.json(
        { success: false, message: 'Employee ID is required' },
        { status: 400 }
      )
    }

    const leaveBalances = await LeaveBalance.find({ employee: employeeId })
      .populate('leaveType', 'name color')

    return NextResponse.json({
      success: true,
      data: leaveBalances,
    })
  } catch (error) {
    console.error('Get leave balance error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leave balance' },
      { status: 500 }
    )
  }
}

