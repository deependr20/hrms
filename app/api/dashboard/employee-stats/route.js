import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Attendance from '@/models/Attendance'
import LeaveBalance from '@/models/LeaveBalance'
import Payroll from '@/models/Payroll'
import Employee from '@/models/Employee'
import Performance from '@/models/Performance'
import { verifyToken } from '@/lib/auth'

// GET - Get employee dashboard statistics
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

    // Find the employee
    const employee = await Employee.findOne({ _id: decoded.userId })
    if (!employee) {
      return NextResponse.json({ success: false, message: 'Employee not found' }, { status: 404 })
    }

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

    // Get current month attendance
    const currentMonthStart = new Date(currentYear, currentMonth - 1, 1)
    const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999)
    
    const currentMonthAttendance = await Attendance.find({
      employee: employee._id,
      date: { $gte: currentMonthStart, $lte: currentMonthEnd }
    })

    // Calculate total hours this month
    const totalHours = currentMonthAttendance.reduce((sum, record) => {
      return sum + (record.workHours || 0)
    }, 0)

    // Get last month attendance for comparison
    const lastMonthStart = new Date(lastMonthYear, lastMonth - 1, 1)
    const lastMonthEnd = new Date(lastMonthYear, lastMonth, 0, 23, 59, 59, 999)
    
    const lastMonthAttendance = await Attendance.find({
      employee: employee._id,
      date: { $gte: lastMonthStart, $lte: lastMonthEnd }
    })

    const lastMonthHours = lastMonthAttendance.reduce((sum, record) => {
      return sum + (record.workHours || 0)
    }, 0)

    // Get leave balance
    const leaveBalances = await LeaveBalance.find({
      employee: employee._id,
      year: currentYear
    }).populate('leaveType', 'name')

    const totalLeaveBalance = leaveBalances.reduce((sum, balance) => {
      return sum + (balance.balance || 0)
    }, 0)

    // Get current month salary
    const currentSalary = await Payroll.findOne({
      employee: employee._id,
      month: currentMonth,
      year: currentYear
    })

    // Get last month salary for comparison
    const lastMonthSalary = await Payroll.findOne({
      employee: employee._id,
      month: lastMonth,
      year: lastMonthYear
    })

    // Get performance score
    const latestPerformance = await Performance.findOne({
      employee: employee._id
    }).sort({ createdAt: -1 })

    // Get last 7 days attendance for chart
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      const attendance = await Attendance.findOne({
        employee: employee._id,
        date: { $gte: date, $lt: nextDay }
      })
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hours: attendance ? (attendance.workHours || 0) : 0
      })
    }

    // Get last 6 months leave data for chart
    const leaveData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      
      const monthlyLeaveBalances = await LeaveBalance.find({
        employee: employee._id,
        year: year
      }).populate('leaveType', 'name')
      
      const totalBalance = monthlyLeaveBalances.reduce((sum, balance) => sum + (balance.balance || 0), 0)
      const totalAllocated = monthlyLeaveBalances.reduce((sum, balance) => sum + (balance.allocated || 0), 0)
      const used = totalAllocated - totalBalance
      
      leaveData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        used: used > 0 ? used : 0,
        available: totalBalance
      })
    }

    // Calculate statistics
    const stats = {
      hoursThisMonth: {
        value: Math.round(totalHours),
        change: totalHours - lastMonthHours,
        trend: totalHours >= lastMonthHours ? 'up' : 'down'
      },
      leaveBalance: {
        value: totalLeaveBalance,
        change: 0, // Could calculate based on last month if needed
        trend: 'neutral'
      },
      thisMonthSalary: {
        value: currentSalary ? currentSalary.netSalary : (employee.salary || 0),
        change: currentSalary && lastMonthSalary ? 
          currentSalary.netSalary - lastMonthSalary.netSalary : 0,
        trend: currentSalary && lastMonthSalary ? 
          (currentSalary.netSalary >= lastMonthSalary.netSalary ? 'up' : 'down') : 'neutral'
      },
      pendingTasks: {
        value: Math.floor(Math.random() * 10), // Placeholder - implement task system
        change: -2,
        trend: 'down'
      },
      completedCourses: {
        value: Math.floor(Math.random() * 5), // Placeholder - implement learning system
        change: 1,
        trend: 'up'
      },
      performanceScore: {
        value: latestPerformance ? latestPerformance.overallRating * 20 : 92, // Convert 5-point to percentage
        change: 5,
        trend: 'up'
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        stats,
        attendanceData: last7Days,
        leaveData: leaveData,
        employee: {
          name: `${employee.firstName} ${employee.lastName}`,
          employeeCode: employee.employeeCode,
          department: employee.department,
          designation: employee.designation
        }
      }
    })

  } catch (error) {
    console.error('Employee stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch employee statistics' },
      { status: 500 }
    )
  }
}
