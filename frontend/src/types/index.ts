export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'analyst' | 'viewer'
}

export interface UploadRecord {
  id: string
  fileName: string
  fileSize: string
  records: number
  status: 'completed' | 'processing' | 'failed' | 'pending'
  uploadedAt: string
  userId: string
}

export interface ValidationIssue {
  id: string
  row: number
  column: string
  category: ValidationCategory
  message: string
  value: string
  severity: 'critical' | 'major' | 'minor'
  status: 'open' | 'resolved' | 'ignored'
}

export type ValidationCategory =
  | 'exact_duplicate'
  | 'fuzzy_duplicate'
  | 'missing_field'
  | 'invalid_email'
  | 'invalid_phone'
  | 'invalid_date'
  | 'out_of_range'
  | 'referential_inconsistency'
  | 'business_contradiction'

export interface ValidationSummary {
  totalRecords: number
  totalErrors: number
  qualityScore: number
  duplicateRecords: number
  categories: Record<ValidationCategory, number>
}

export interface QualityPoint {
  date: string
  score: number
  records: number
  errors: number
}

export interface ErrorDistribution {
  name: string
  value: number
  color: string
}

export interface DatasetComparison {
  id: string
  name: string
  records: number
  errors: number
  qualityScore: number
  date: string
}

export interface ReportRecord {
  id: string
  name: string
  type: 'executive' | 'detailed' | 'summary'
  format: 'pdf' | 'csv' | 'xlsx'
  createdAt: string
  status: 'completed' | 'generating' | 'failed'
  size: string
}

export interface ColumnMapping {
  source: string
  target: string
  confidence: 'high' | 'medium' | 'low'
  mapped: boolean
}

export interface StandardField {
  name: string
  type: string
  required: boolean
  description: string
}

export interface SourceColumn {
  name: string
  sample: string
  detected: boolean
}

export interface NotificationSettings {
  emailNotifications: boolean
  uploadComplete: boolean
  validationComplete: boolean
  errorThresholdExceeded: boolean
  weeklyReport: boolean
  monthlyReport: boolean
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  sessionTimeout: number
  ipWhitelist: string[]
  lastPasswordChange: string
}

export interface ProfileSettings {
  name: string
  email: string
  company: string
  timezone: string
}

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}
