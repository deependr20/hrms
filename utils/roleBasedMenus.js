import {
  FaTachometerAlt, FaUsers, FaClock, FaCalendarAlt, FaMoneyBillWave,
  FaChartLine, FaBriefcase, FaUserPlus, FaSignOutAlt, FaFileAlt,
  FaBox, FaReceipt, FaPlane, FaHeadset, FaBook, FaGraduationCap,
  FaBullhorn, FaCog, FaUser, FaTrophy, FaBullseye, FaStar, FaAward,
  FaTasks, FaProjectDiagram, FaClipboardList
} from 'react-icons/fa'

// Define menu items for each role
export const roleBasedMenus = {
  // ADMIN - Full access to everything
  admin: [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { 
      name: 'Employees', 
      icon: FaUsers, 
      path: '/dashboard/employees',
      submenu: [
        { name: 'All Employees', path: '/dashboard/employees' },
        { name: 'Add Employee', path: '/dashboard/employees/add' },
        { name: 'Departments', path: '/dashboard/departments' },
        { name: 'Designations', path: '/dashboard/designations' },
      ]
    },
    {
      name: 'Attendance',
      icon: FaClock,
      path: '/dashboard/attendance',
      submenu: [
        { name: 'Attendance Report', path: '/dashboard/attendance/report' },
        { name: 'Employee Check-ins', path: '/dashboard/attendance/checkins' },
      ]
    },
    {
      name: 'Leave',
      icon: FaCalendarAlt,
      path: '/dashboard/leave',
      submenu: [
        { name: 'Leave Requests', path: '/dashboard/leave/requests' },
        { name: 'Leave Approvals', path: '/dashboard/leave/approvals' },
        { name: 'Leave Types', path: '/dashboard/leave-types' },
        { name: 'Leave Allocations', path: '/dashboard/leave/allocations' },
      ]
    },
    { 
      name: 'Payroll', 
      icon: FaMoneyBillWave, 
      path: '/dashboard/payroll',
      submenu: [
        { name: 'Process Payroll', path: '/dashboard/payroll' },
        { name: 'Generate Payroll', path: '/dashboard/payroll/generate' },
        { name: 'Payslips', path: '/dashboard/payroll/payslips' },
        { name: 'Salary Structure', path: '/dashboard/payroll/structure' },
      ]
    },
    {
      name: 'Performance',
      icon: FaTrophy,
      path: '/dashboard/performance',
      submenu: [
        { name: 'Performance Reviews', path: '/dashboard/performance/reviews' },
        { name: 'Goals & Objectives', path: '/dashboard/performance/goals' },
        { name: 'Performance Reports', path: '/dashboard/performance/reports' },
        { name: 'Employee Ratings', path: '/dashboard/performance/ratings' },
      ]
    },
    {
      name: 'Task Management',
      icon: FaTasks,
      path: '/dashboard/tasks',
      submenu: [
        { name: 'Task Dashboard', path: '/dashboard/tasks' },
        { name: 'All Tasks', path: '/dashboard/tasks/all' },
        { name: 'Create Task', path: '/dashboard/tasks/create' },
        { name: 'My Tasks', path: '/dashboard/tasks/my-tasks' },
        { name: 'Team Tasks', path: '/dashboard/tasks/team-tasks' },
        { name: 'Projects', path: '/dashboard/tasks/projects' },
        { name: 'Task Analytics', path: '/dashboard/tasks/analytics' },
      ]
    },
    { 
      name: 'Recruitment', 
      icon: FaBriefcase, 
      path: '/dashboard/recruitment',
      submenu: [
        { name: 'Job Openings', path: '/dashboard/recruitment/jobs' },
        { name: 'Candidates', path: '/dashboard/recruitment/candidates' },
        { name: 'Interviews', path: '/dashboard/recruitment/interviews' },
      ]
    },
    { name: 'Onboarding', icon: FaUserPlus, path: '/dashboard/onboarding' },
    { name: 'Offboarding', icon: FaSignOutAlt, path: '/dashboard/offboarding' },
    { name: 'Documents', icon: FaFileAlt, path: '/dashboard/documents' },
    { name: 'Assets', icon: FaBox, path: '/dashboard/assets' },
    { name: 'Expenses', icon: FaReceipt, path: '/dashboard/expenses' },
    { name: 'Travel', icon: FaPlane, path: '/dashboard/travel' },
    { name: 'Helpdesk', icon: FaHeadset, path: '/dashboard/helpdesk' },
    { name: 'Policies', icon: FaBook, path: '/dashboard/policies' },
    { 
      name: 'Learning (LMS)', 
      icon: FaGraduationCap, 
      path: '/dashboard/learning',
      submenu: [
        { name: 'Courses', path: '/dashboard/learning/courses' },
        { name: 'My Trainings', path: '/dashboard/learning/trainings' },
        { name: 'Certificates', path: '/dashboard/learning/certificates' },
      ]
    },
    {
      name: 'Announcements',
      icon: FaBullhorn,
      path: '/dashboard/announcements',
      submenu: [
        { name: 'All Announcements', path: '/dashboard/announcements' },
        { name: 'Create Announcement', path: '/dashboard/announcements/create' },
      ]
    },
    { name: 'Holidays', icon: FaCalendarAlt, path: '/dashboard/holidays' },
    { name: 'Users Management', icon: FaUser, path: '/dashboard/users' },
    {
      name: 'Settings',
      icon: FaCog,
      path: '/dashboard/settings',
      submenu: [
        { name: 'Company Settings', path: '/dashboard/settings/company' },
        { name: 'Preferences', path: '/dashboard/settings/preferences' },
        { name: 'Locations', path: '/dashboard/settings/locations' },
      ]
    },
  ],

  // HR - HR management focused
  hr: [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { 
      name: 'Employees', 
      icon: FaUsers, 
      path: '/dashboard/employees',
      submenu: [
        { name: 'All Employees', path: '/dashboard/employees' },
        { name: 'Add Employee', path: '/dashboard/employees/add' },
        { name: 'Departments', path: '/dashboard/departments' },
        { name: 'Designations', path: '/dashboard/designations' },
      ]
    },
    { 
      name: 'Attendance', 
      icon: FaClock, 
      path: '/dashboard/attendance',
      submenu: [
        { name: 'Attendance Report', path: '/dashboard/attendance/report' },
      ]
    },
    {
      name: 'Leave',
      icon: FaCalendarAlt,
      path: '/dashboard/leave',
      submenu: [
        { name: 'Leave Requests', path: '/dashboard/leave/requests' },
        { name: 'Leave Approvals', path: '/dashboard/leave/approvals' },
        { name: 'Leave Types', path: '/dashboard/leave-types' },
        { name: 'Leave Allocations', path: '/dashboard/leave/allocations' },
      ]
    },
    { 
      name: 'Payroll', 
      icon: FaMoneyBillWave, 
      path: '/dashboard/payroll',
      submenu: [
        { name: 'Generate Payroll', path: '/dashboard/payroll/generate' },
        { name: 'Payslips', path: '/dashboard/payroll/payslips' },
        { name: 'Salary Structure', path: '/dashboard/payroll/structure' },
      ]
    },
    {
      name: 'Performance',
      icon: FaTrophy,
      path: '/dashboard/performance',
      submenu: [
        { name: 'Performance Reviews', path: '/dashboard/performance/reviews' },
        { name: 'Goals & Objectives', path: '/dashboard/performance/goals' },
        { name: 'Performance Reports', path: '/dashboard/performance/reports' },
      ]
    },
    {
      name: 'Task Management',
      icon: FaTasks,
      path: '/dashboard/tasks',
      submenu: [
        { name: 'Task Dashboard', path: '/dashboard/tasks' },
        { name: 'All Tasks', path: '/dashboard/tasks/all' },
        { name: 'Create Task', path: '/dashboard/tasks/create' },
        { name: 'My Tasks', path: '/dashboard/tasks/my-tasks' },
        { name: 'Department Tasks', path: '/dashboard/tasks/department-tasks' },
        { name: 'Projects', path: '/dashboard/tasks/projects' },
      ]
    },
    { 
      name: 'Recruitment', 
      icon: FaBriefcase, 
      path: '/dashboard/recruitment',
      submenu: [
        { name: 'Job Openings', path: '/dashboard/recruitment/jobs' },
        { name: 'Candidates', path: '/dashboard/recruitment/candidates' },
        { name: 'Interviews', path: '/dashboard/recruitment/interviews' },
      ]
    },
    { name: 'Onboarding', icon: FaUserPlus, path: '/dashboard/onboarding' },
    { name: 'Offboarding', icon: FaSignOutAlt, path: '/dashboard/offboarding' },
    { name: 'Documents', icon: FaFileAlt, path: '/dashboard/documents' },
    { name: 'Policies', icon: FaBook, path: '/dashboard/policies' },
    { name: 'Announcements', icon: FaBullhorn, path: '/dashboard/announcements' },
    { name: 'Holidays', icon: FaCalendarAlt, path: '/dashboard/holidays' },
  ],

  // MANAGER - Team management focused
  manager: [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { 
      name: 'My Team', 
      icon: FaUsers, 
      path: '/dashboard/employees',
      submenu: [
        { name: 'Team Members', path: '/dashboard/employees' },
        { name: 'Departments', path: '/dashboard/departments' },
      ]
    },
    { 
      name: 'Attendance', 
      icon: FaClock, 
      path: '/dashboard/attendance',
      submenu: [
        { name: 'Mark Attendance', path: '/dashboard/attendance' },
        { name: 'Team Attendance', path: '/dashboard/attendance/report' },
      ]
    },
    { 
      name: 'Leave', 
      icon: FaCalendarAlt, 
      path: '/dashboard/leave',
      submenu: [
        { name: 'Apply Leave', path: '/dashboard/leave/apply' },
        { name: 'Team Leave Requests', path: '/dashboard/leave/requests' },
        { name: 'Leave Approvals', path: '/dashboard/leave/approvals' },
        { name: 'My Leave Balance', path: '/dashboard/leave/balance' },
      ]
    },
    {
      name: 'Performance',
      icon: FaTrophy,
      path: '/dashboard/performance',
      submenu: [
        { name: 'Team Reviews', path: '/dashboard/performance/reviews' },
        { name: 'Team Goals', path: '/dashboard/performance/goals' },
        { name: 'Performance Reports', path: '/dashboard/performance/reports' },
      ]
    },
    {
      name: 'Task Management',
      icon: FaTasks,
      path: '/dashboard/tasks',
      submenu: [
        { name: 'Task Dashboard', path: '/dashboard/tasks' },
        { name: 'Create Task', path: '/dashboard/tasks/create' },
        { name: 'My Tasks', path: '/dashboard/tasks/my-tasks' },
        { name: 'Team Tasks', path: '/dashboard/tasks/team-tasks' },
        { name: 'Assign Tasks', path: '/dashboard/tasks/assign' },
      ]
    },
    { name: 'My Profile', icon: FaUser, path: '/dashboard/profile' },
    { name: 'Documents', icon: FaFileAlt, path: '/dashboard/documents' },
    { name: 'Expenses', icon: FaReceipt, path: '/dashboard/expenses' },
    { name: 'Travel', icon: FaPlane, path: '/dashboard/travel' },
    { 
      name: 'Learning', 
      icon: FaGraduationCap, 
      path: '/dashboard/learning',
      submenu: [
        { name: 'My Trainings', path: '/dashboard/learning/trainings' },
        { name: 'Certificates', path: '/dashboard/learning/certificates' },
      ]
    },
    { name: 'Announcements', icon: FaBullhorn, path: '/dashboard/announcements' },
  ],

  // EMPLOYEE - Personal focused
  employee: [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { name: 'My Profile', icon: FaUser, path: '/dashboard/profile' },
    { 
      name: 'Attendance', 
      icon: FaClock, 
      path: '/dashboard/attendance',
      submenu: [
        { name: 'Mark Attendance', path: '/dashboard/attendance' },
        { name: 'My Attendance', path: '/dashboard/attendance/report' },
      ]
    },
    { 
      name: 'Leave', 
      icon: FaCalendarAlt, 
      path: '/dashboard/leave',
      submenu: [
        { name: 'Apply Leave', path: '/dashboard/leave/apply' },
        { name: 'My Leave Requests', path: '/dashboard/leave/requests' },
        { name: 'Leave Balance', path: '/dashboard/leave/balance' },
      ]
    },
    {
      name: 'Payroll',
      icon: FaMoneyBillWave,
      path: '/dashboard/payroll',
      submenu: [
        { name: 'My Payslips', path: '/dashboard/payroll/payslips' },
      ]
    },
    {
      name: 'Task Management',
      icon: FaTasks,
      path: '/dashboard/tasks',
      submenu: [
        { name: 'My Tasks', path: '/dashboard/tasks/my-tasks' },
        { name: 'Create Task', path: '/dashboard/tasks/create' },
        { name: 'Assign to Colleague', path: '/dashboard/tasks/assign' },
        { name: 'Task Dashboard', path: '/dashboard/tasks' },
      ]
    },
    { name: 'Documents', icon: FaFileAlt, path: '/dashboard/documents' },
    { name: 'Expenses', icon: FaReceipt, path: '/dashboard/expenses' },
    { name: 'Travel', icon: FaPlane, path: '/dashboard/travel' },
    { 
      name: 'Learning', 
      icon: FaGraduationCap, 
      path: '/dashboard/learning',
      submenu: [
        { name: 'My Trainings', path: '/dashboard/learning/trainings' },
        { name: 'Certificates', path: '/dashboard/learning/certificates' },
      ]
    },
    { name: 'Announcements', icon: FaBullhorn, path: '/dashboard/announcements' },
    { name: 'Helpdesk', icon: FaHeadset, path: '/dashboard/helpdesk' },
  ],
}

// Helper function to get menu items based on user role
export const getMenuItemsForRole = (role) => {
  return roleBasedMenus[role] || roleBasedMenus.employee
}
