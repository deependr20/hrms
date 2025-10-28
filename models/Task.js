import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: false,
    maxlength: 2000
  },
  summary: {
    type: String,
    maxlength: 300
  },
  // Task Classification
  category: {
    type: String,
    enum: ['project', 'maintenance', 'research', 'meeting', 'training', 'review', 'documentation', 'development', 'testing', 'support', 'other'],
    default: 'other'
  },
  type: {
    type: String,
    enum: ['individual', 'collaborative', 'milestone', 'recurring', 'urgent'],
    default: 'individual'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent', 'critical'],
    default: 'medium'
  },
  // Task Assignment
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  assignedTo: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'collaborator', 'reviewer', 'observer'],
      default: 'owner'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    acceptedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'delegated'],
      default: 'pending'
    },
    rejectionReason: String,
    delegatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  }],
  // Hierarchy and Permissions
  assignmentType: {
    type: String,
    enum: ['self_assigned', 'manager_assigned', 'peer_assigned', 'cross_department', 'escalated'],
    required: true
  },
  canReassign: {
    type: Boolean,
    default: true
  },
  canDelegate: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  // Timeline
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  // Status and Progress
  status: {
    type: String,
    enum: ['draft', 'assigned', 'in_progress', 'on_hold', 'review', 'completed', 'cancelled', 'overdue'],
    default: 'draft'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Subtasks and Dependencies
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  subtasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  dependencies: [{
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    type: {
      type: String,
      enum: ['blocks', 'blocked_by', 'related', 'duplicate']
    }
  }],
  // Project Association
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone'
  },
  // Recurring Tasks
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    interval: Number, // Every X days/weeks/months
    daysOfWeek: [Number], // 0-6 for Sunday-Saturday
    dayOfMonth: Number, // 1-31
    endDate: Date,
    maxOccurrences: Number
  },
  originalTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  // Work Tracking
  timeEntries: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    startTime: Date,
    endTime: Date,
    duration: Number, // Minutes
    description: String,
    billable: {
      type: Boolean,
      default: false
    },
    approved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Comments and Communication
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    type: {
      type: String,
      enum: ['comment', 'status_update', 'question', 'blocker', 'solution'],
      default: 'comment'
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    mentions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }],
    attachments: [{
      name: String,
      filePath: String,
      fileSize: Number,
      mimeType: String
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    editedAt: Date,
    reactions: [{
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
      },
      emoji: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  // Attachments and Resources
  attachments: [{
    name: String,
    originalName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['requirement', 'design', 'reference', 'output', 'other']
    }
  }],
  // Approval Workflow
  approvalWorkflow: [{
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    level: Number,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedAt: Date,
    comments: String
  }],
  // Quality and Review
  reviewers: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    reviewType: {
      type: String,
      enum: ['quality', 'technical', 'business', 'final']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'needs_changes'],
      default: 'pending'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    reviewedAt: Date
  }],
  // Notifications and Reminders
  notifications: {
    assigneeNotified: { type: Boolean, default: false },
    dueDateReminder: { type: Boolean, default: true },
    overdueNotification: { type: Boolean, default: false },
    completionNotification: { type: Boolean, default: false }
  },
  watchers: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    watchType: {
      type: String,
      enum: ['all', 'status_changes', 'comments', 'assignments'],
      default: 'all'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Tags and Labels
  tags: [String],
  labels: [{
    name: String,
    color: String
  }],
  // System Fields
  taskNumber: {
    type: String,
    unique: true
  },
  // Analytics and Metrics
  metrics: {
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }, // Total minutes
    efficiency: Number, // Actual vs estimated time
    qualityScore: Number,
    collaborationScore: Number
  },
  // Completion Details
  completedAt: Date,
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  completionNotes: String,
  deliverables: [{
    name: String,
    description: String,
    filePath: String,
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Audit Trail
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  assignmentHistory: [{
    action: {
      type: String,
      enum: ['assigned', 'reassigned', 'delegated', 'accepted', 'rejected']
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String
  }]
}, {
  timestamps: true
})

// Generate task number
TaskSchema.pre('save', function(next) {
  if (!this.taskNumber) {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    this.taskNumber = `TSK${year}${month}${random}`
  }
  next()
})

// Virtual for overdue status
TaskSchema.virtual('isOverdue').get(function() {
  return this.dueDate < new Date() && this.status !== 'completed' && this.status !== 'cancelled'
})

// Methods
TaskSchema.methods.canAssignTo = function(assignerId, assigneeId) {
  // Self assignment is always allowed
  if (assignerId.toString() === assigneeId.toString()) {
    return { allowed: true, reason: 'self_assignment' }
  }
  
  // Check if assigner is manager of assignee
  // This would need to be implemented based on your Employee hierarchy
  return { allowed: true, reason: 'hierarchy_check_needed' }
}

TaskSchema.methods.addTimeEntry = function(employeeId, startTime, endTime, description) {
  const duration = Math.round((endTime - startTime) / (1000 * 60)) // Minutes
  
  this.timeEntries.push({
    employee: employeeId,
    startTime,
    endTime,
    duration,
    description
  })
  
  // Update total actual hours
  this.actualHours = this.timeEntries.reduce((total, entry) => 
    total + (entry.duration / 60), 0)
  
  // Update metrics
  this.metrics.timeSpent = this.timeEntries.reduce((total, entry) => 
    total + entry.duration, 0)
}

TaskSchema.methods.updateProgress = function(newProgress, updatedBy, notes) {
  const oldProgress = this.progress
  this.progress = Math.max(0, Math.min(100, newProgress))
  
  // Auto-update status based on progress
  if (this.progress === 0 && this.status === 'in_progress') {
    this.status = 'assigned'
  } else if (this.progress > 0 && this.progress < 100 && this.status === 'assigned') {
    this.status = 'in_progress'
  } else if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'review'
  }
  
  // Add status history
  if (oldProgress !== newProgress) {
    this.statusHistory.push({
      status: `Progress updated from ${oldProgress}% to ${newProgress}%`,
      changedBy: updatedBy,
      reason: notes
    })
  }
}

TaskSchema.methods.assignTo = function(assigneeId, assignerId, role = 'owner') {
  // Check if already assigned
  const existingAssignment = this.assignedTo.find(a => 
    a.employee.toString() === assigneeId.toString())
  
  if (existingAssignment) {
    return { success: false, message: 'Already assigned to this employee' }
  }
  
  // Add assignment
  this.assignedTo.push({
    employee: assigneeId,
    role,
    assignedAt: new Date(),
    status: 'pending'
  })
  
  // Add to assignment history
  this.assignmentHistory.push({
    action: 'assigned',
    to: assigneeId,
    performedBy: assignerId,
    timestamp: new Date()
  })
  
  return { success: true, message: 'Task assigned successfully' }
}

TaskSchema.methods.calculateEfficiency = function() {
  if (this.estimatedHours && this.actualHours) {
    this.metrics.efficiency = (this.estimatedHours / this.actualHours) * 100
  }
  return this.metrics.efficiency
}

// Indexes
TaskSchema.index({ taskNumber: 1 })
TaskSchema.index({ 'assignedTo.employee': 1, status: 1 })
TaskSchema.index({ assignedBy: 1, status: 1 })
TaskSchema.index({ dueDate: 1, status: 1 })
TaskSchema.index({ project: 1, status: 1 })
TaskSchema.index({ priority: 1, status: 1 })
TaskSchema.index({ tags: 1 })
TaskSchema.index({ createdAt: -1 })

export default mongoose.models.Task || mongoose.model('Task', TaskSchema)
