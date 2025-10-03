import mongoose from 'mongoose';

const PayrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  earnings: {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    conveyance: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    incentives: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  deductions: {
    pf: { type: Number, default: 0 },
    esi: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },
    loanRepayment: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
    lateDeduction: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  grossSalary: {
    type: Number,
    required: true,
  },
  totalDeductions: {
    type: Number,
    required: true,
  },
  netSalary: {
    type: Number,
    required: true,
  },
  workingDays: {
    type: Number,
    required: true,
  },
  presentDays: {
    type: Number,
    required: true,
  },
  absentDays: {
    type: Number,
    default: 0,
  },
  leaveDays: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'processed', 'paid', 'on-hold'],
    default: 'draft',
  },
  paymentDate: {
    type: Date,
  },
  paymentMode: {
    type: String,
    enum: ['bank-transfer', 'cash', 'cheque'],
    default: 'bank-transfer',
  },
  transactionId: {
    type: String,
  },
  remarks: {
    type: String,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  processedDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound index
PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Payroll || mongoose.model('Payroll', PayrollSchema);

