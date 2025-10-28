import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DailyGoal from '@/models/DailyGoal'
import Employee from '@/models/Employee'
import { verifyToken } from '@/lib/auth'

// GET - Get daily goals
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const employeeId = searchParams.get('employeeId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = {}
    
    // Role-based access control
    if (decoded.role === 'employee') {
      query.employee = decoded.userId
    } else if (employeeId) {
      query.employee = employeeId
    } else if (decoded.role === 'manager') {
      // Get team members for manager
      const teamMembers = await Employee.find({ 
        reportingManager: decoded.userId,
        status: 'active'
      }).select('_id')
      query.employee = { $in: teamMembers.map(m => m._id) }
    }

    // Date filtering
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
      query.date = { $gte: startOfDay, $lt: endOfDay }
    } else if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      }
    } else {
      // Default to today
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
      query.date = { $gte: startOfDay, $lt: endOfDay }
    }

    const dailyGoals = await DailyGoal.find(query)
      .populate('employee', 'firstName lastName employeeCode department designation')
      .populate('managerReview.reviewedBy', 'firstName lastName')
      .sort({ date: -1 })

    return NextResponse.json({
      success: true,
      data: dailyGoals
    })

  } catch (error) {
    console.error('Get daily goals error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch daily goals' },
      { status: 500 }
    )
  }
}

// POST - Create or update daily goals
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }

    await connectDB()

    const { date, goals, employeeId } = await request.json()
    
    // Determine target employee
    let targetEmployeeId = decoded.userId
    if (employeeId && ['admin', 'hr', 'manager'].includes(decoded.role)) {
      targetEmployeeId = employeeId
    }

    // Parse date or use today
    const targetDate = date ? new Date(date) : new Date()
    const goalDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())

    // Check if it's past cutoff time (6:45 PM)
    const now = new Date()
    const cutoffTime = new Date()
    cutoffTime.setHours(18, 45, 0, 0) // 6:45 PM

    const isToday = goalDate.toDateString() === now.toDateString()
    const isPastCutoff = isToday && now > cutoffTime

    // Find existing daily goal or create new one
    let dailyGoal = await DailyGoal.findOne({
      employee: targetEmployeeId,
      date: goalDate
    })

    if (!dailyGoal) {
      dailyGoal = new DailyGoal({
        employee: targetEmployeeId,
        date: goalDate,
        goals: []
      })
    }

    // Check if goals can be edited
    if (!dailyGoal.canEdit() && decoded.role === 'employee') {
      return NextResponse.json(
        { success: false, message: 'Goals are locked and cannot be edited' },
        { status: 403 }
      )
    }

    // Lock goals if past cutoff time
    if (isPastCutoff && !dailyGoal.submissionStatus.isLocked) {
      dailyGoal.lockGoals()
    }

    // Update goals if provided
    if (goals && Array.isArray(goals)) {
      dailyGoal.goals = goals.map(goal => ({
        ...goal,
        updatedAt: new Date()
      }))
      dailyGoal.calculateSummary()
    }

    await dailyGoal.save()

    // Populate employee data for response
    await dailyGoal.populate('employee', 'firstName lastName employeeCode department')

    return NextResponse.json({
      success: true,
      data: dailyGoal,
      message: isPastCutoff ? 'Goals saved and locked due to cutoff time' : 'Goals saved successfully'
    })

  } catch (error) {
    console.error('Create/update daily goals error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save daily goals' },
      { status: 500 }
    )
  }
}

// PUT - Update specific goal
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }

    await connectDB()

    const { dailyGoalId, goalId, updateData, managerReview } = await request.json()

    const dailyGoal = await DailyGoal.findById(dailyGoalId)
    if (!dailyGoal) {
      return NextResponse.json({ success: false, message: 'Daily goal not found' }, { status: 404 })
    }

    // Check permissions
    const isOwner = dailyGoal.employee.toString() === decoded.userId
    const isManager = ['admin', 'hr', 'manager'].includes(decoded.role)

    if (!isOwner && !isManager) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 })
    }

    // Update specific goal
    if (goalId && updateData) {
      if (!dailyGoal.canEdit() && isOwner) {
        return NextResponse.json(
          { success: false, message: 'Goals are locked and cannot be edited' },
          { status: 403 }
        )
      }

      const updatedGoal = dailyGoal.updateGoal(goalId, updateData)
      if (!updatedGoal) {
        return NextResponse.json({ success: false, message: 'Goal not found' }, { status: 404 })
      }
    }

    // Add manager review
    if (managerReview && isManager) {
      dailyGoal.managerReview = {
        ...managerReview,
        reviewedBy: decoded.userId,
        reviewDate: new Date()
      }
    }

    await dailyGoal.save()

    return NextResponse.json({
      success: true,
      data: dailyGoal,
      message: 'Goal updated successfully'
    })

  } catch (error) {
    console.error('Update goal error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update goal' },
      { status: 500 }
    )
  }
}
