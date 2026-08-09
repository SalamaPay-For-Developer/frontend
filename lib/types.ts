export interface BaseModel {
  id: string
  created_at: string
  updated_at: string
}

export interface User extends BaseModel {
  phone_number: string
  email: string | null
  full_name: string
  role: "CUSTOMER" | "ADMIN"
  is_verified: boolean
  otp_verified: boolean
}

export interface Business extends BaseModel {
  owner: string
  business_name: string
  business_type: BusinessType
  business_category: string | null
  description: string | null
  tin: string | null
  brela_number: string | null
  business_license: string | null
  selcom_vendor_id: string | null
  is_active: boolean
  kyc_status: "PENDING" | "APPROVED" | "REJECTED"
  members?: BusinessMember[]
  module_name?: string | null
}

export type BusinessType =
  | "RESTAURANT"
  | "HOTEL"
  | "SCHOOL"
  | "PHARMACY"
  | "FUEL_STATION"
  | "TRANSPORT"
  | "PROPERTY"
  | "RETAIL_SHOP"
  | "MALL"
  | "TOURISM"
  | "AGRICULTURE"
  | "EVENTS"
  | "GYM"
  | "PARKING"
  | "GENERAL"

export interface BusinessMember extends BaseModel {
  business: string
  user: string
  user_name?: string
  user_phone?: string
  role: BusinessRole
  is_active: boolean
  invited_by: string | null
}

export type BusinessRole =
  | "OWNER"
  | "MANAGER"
  | "CASHIER"
  | "RECEPTIONIST"
  | "WAITER"
  | "KITCHEN"
  | "ADMINISTRATOR"
  | "ACCOUNTANT"
  | "TEACHER"
  | "STAFF"

export interface BusinessKYC extends BaseModel {
  business: string
  owner_national_id: string | null
  owner_address: string | null
  owner_phone: string | null
  selfie_verified: boolean
  bank_name: string | null
  bank_account_number: string | null
  bank_account_name: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  documents?: KYCDocument[]
}

export interface KYCDocument extends BaseModel {
  kyc: string
  document_type: "BUSINESS_LICENSE" | "CERTIFICATE" | "OWNER_ID" | "SELFIE" | "OTHER"
  file: string | null
  file_url: string | null
  is_verified: boolean
}

export interface BusinessModule extends BaseModel {
  code: string
  name: string
  description: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
  features: ModuleFeature[]
}

export interface ModuleFeature extends BaseModel {
  module: string
  code: string
  label: string
  icon: string | null
  route: string | null
  sort_order: number
  is_enabled: boolean
}

export interface BusinessModuleConfig extends BaseModel {
  business: string
  module: string
  enabled_features: string[]
  config: Record<string, unknown>
  module_details?: BusinessModule
}

export interface PaymentCategory extends BaseModel {
  code: string
  name_sw: string
  name_en: string
  is_mandatory_electronic: boolean
}

export interface Transaction extends BaseModel {
  reference: string
  business: string | null
  customer: string | null
  category: string
  type: "COLLECTION" | "PAYOUT"
  amount: string
  currency: string
  channel: "MPESA" | "TIGOPESA" | "AIRTEL" | "HALOPESA" | "CARD" | "BANK"
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "REVERSED" | "EXPIRED"
  selcom_order_id: string | null
  selcom_transid: string | null
  payment_token: string | null
  checkout_url: string | null
  payer_msisdn: string | null
  failure_reason: string | null
  metadata: Record<string, unknown>
  completed_at: string | null
}

export interface TransactionReceipt extends Transaction {
  date_formatted?: string
  amount_formatted?: string
  fee_amount?: string
  fee_formatted?: string
  net_amount?: string
  net_formatted?: string
  type_label?: string
  status_label?: string
  channel_label?: string
}

export interface TransactionSummary {
  total_income: string
  total_expense: string
  total_transactions: number
}

export interface Wallet extends BaseModel {
  wallet_type: "PERSONAL" | "BUSINESS"
  owner: string | null
  business: string | null
  balance: string
  currency: string
  is_active: boolean
}

export interface WalletWithDetails extends Wallet {
  owner_details?: User
  business_details?: Business
}

export interface LedgerEntry extends BaseModel {
  wallet: string
  entry_type: "CREDIT" | "DEBIT"
  amount: string
  balance_after: string
  reference: string
  description: string | null
}

export interface SavingsGoal extends BaseModel {
  title: string
  target_amount: string
  current_amount: string
  color: string | null
  status: "ACTIVE" | "COMPLETED" | "WITHDRAWN"
  owner: string
}

export interface SavingsContribution extends BaseModel {
  goal: string
  amount: string
  contribution_type: "DEPOSIT" | "WITHDRAW"
  note: string | null
}

export interface SupportTicket extends BaseModel {
  user: string
  subject: string
  category: "PAYMENT_ISSUE" | "REFUND" | "SETTLEMENT" | "KYC" | "ACCOUNT" | "TECHNICAL" | "OTHER"
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  priority: "LOW" | "MEDIUM" | "HIGH"
  description: string
  transaction_reference: string | null
  messages?: TicketMessage[]
}

export interface TicketMessage extends BaseModel {
  ticket: string
  sender: string
  message: string
  is_staff: boolean
}

export interface Notification extends BaseModel {
  user: string
  title: string
  message: string
  type: "PAYMENT" | "TRANSACTION" | "KYC" | "SETTLEMENT" | "SECURITY" | "SYSTEM"
  is_read: boolean
}

export interface Settlement {
  id: string
  business: string
  amount: string
  fee: string
  net_amount: string
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
  bank_name: string
  bank_account: string
  created_at: string
  completed_at: string | null
}

export interface FeeConfig {
  channel: string
  percentage: string
  fixed_fee: string
  min_fee: string
  max_fee: string | null
}

// ==================== Developer Platform ====================

export interface DeveloperWorkspace extends BaseModel {
  business: string
  business_name: string
  business_type: string
  kyc_status: "PENDING" | "APPROVED" | "REJECTED"
  environment: "SANDBOX" | "PRODUCTION"
  production_enabled: boolean
  production_approved_at: string | null
  selcom_connected: boolean
  webhook_configured: boolean
  test_completed: boolean
  allowed_domains: string[]
  ip_allowlist: string[]
  setup_progress: {
    completed: number
    total: number
    percentage: number
    steps: {
      business: boolean
      kyc: boolean
      selcom: boolean
      webhook: boolean
      test: boolean
      production: boolean
    }
  }
}

export interface SelcomCredential extends BaseModel {
  environment: "SANDBOX" | "PRODUCTION"
  api_key: string
  api_secret: string
  vendor_id: string | null
  is_active: boolean
  last_checked: string | null
  last_check_status: string | null
}

export interface SalamaPayApiKey extends BaseModel {
  key_type: "PUBLIC" | "SECRET" | "WEBHOOK"
  environment: "SANDBOX" | "PRODUCTION"
  key_prefix: string
  is_active: boolean
  last_used: string | null
}

export interface WebhookEndpoint extends BaseModel {
  url: string
  description: string | null
  status: "ACTIVE" | "INACTIVE"
  events: string[]
  secret: string
  total_deliveries: number
  successful_deliveries: number
  failed_deliveries: number
  delivery_rate: number
}

export interface WebhookDelivery extends BaseModel {
  endpoint: string
  event_type: string
  payload: Record<string, unknown>
  response_status: number | null
  response_body: string | null
  status: "PENDING" | "DELIVERED" | "FAILED" | "RETRYING"
  attempt_count: number
  delivered_at: string | null
  error_message: string | null
  transaction_ref: string | null
}

export interface CheckoutSession extends BaseModel {
  order_id: string
  amount: string
  currency: string
  description: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  payment_methods: string[]
  success_url: string | null
  cancel_url: string | null
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "EXPIRED" | "CANCELLED"
  paid_at: string | null
  checkout_url: string
  appearance_config: Record<string, unknown>
}

export interface ApiLog extends BaseModel {
  method: string
  endpoint: string
  request_headers?: Record<string, string>
  request_body?: Record<string, unknown> | null
  response_status: number
  response_body?: Record<string, unknown> | null
  duration_ms: number
  ip_address: string | null
  user_agent: string | null
  transaction_ref: string | null
  is_success: boolean
}

export interface ServiceCapability extends BaseModel {
  service: string
  is_enabled: boolean
  configured_at: string | null
}

export interface DeveloperOverview {
  api_requests_total: number
  api_requests_success: number
  api_requests_failed: number
  transactions_total: string
  transactions_today: string
  webhook_delivery_rate: number
  active_checkouts: number
  setup_progress: DeveloperWorkspace["setup_progress"]
  environment: string
  production_enabled: boolean
  selcom_connected: boolean
}

// ==================== Admin / Organization ====================

export interface Permission extends BaseModel {
  code: string
  name: string
  module: string
  description: string | null
}

export interface Role extends BaseModel {
  name: string
  is_builtin: boolean
  is_active: boolean
  permissions: Permission[]
  staff_count: number
}

export interface Department extends BaseModel {
  name: string
  description: string | null
  is_active: boolean
  staff_count: number
}

export interface Branch extends BaseModel {
  name: string
  address: string | null
  phone: string | null
  is_active: boolean
  staff_count: number
}

export interface StaffProfile extends BaseModel {
  user: string
  user_phone: string
  user_name: string
  user_email: string
  role: string
  role_name: string
  department: string | null
  department_name: string | null
  branch: string | null
  branch_name: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INVITED'
  can_access_all_branches: boolean
  employee_id: string | null
  hired_at: string | null
  effective_permissions: string[]
}

export interface AuditLog extends BaseModel {
  actor: string | null
  actor_name: string
  action: string
  module: string
  target_type: string | null
  target_id: string | null
  description: string
  old_values: Record<string, unknown>
  new_values: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
}

export interface AdminUser extends BaseModel {
  phone_number: string
  email: string | null
  full_name: string
  role: string
  is_verified: boolean
  otp_verified: boolean
  is_active: boolean
  has_staff_profile: boolean
  businesses_count: number
  transactions_count: number
  staff_profile?: StaffProfile
}

export interface AdminBusiness extends BaseModel {
  business_name: string
  business_type: string
  owner_name: string
  owner_phone: string
  kyc_status: string
  kyc_status_display: string
  is_active: boolean
  selcom_vendor_id: string | null
  tin: string | null
  brela_number: string | null
  business_license: string | null
  description: string | null
  transactions_count: number
  kyc?: Record<string, unknown> | null
}

export interface BusinessTypeConfig extends BaseModel {
  name: string
  code: string
  is_active: boolean
  icon: string | null
  requires_tin: boolean
  requires_brela: boolean
  requires_license: boolean
  requires_national_id: boolean
  requires_bank_account: boolean
  requires_selfie: boolean
  required_documents: string[]
  default_fee_percentage: string
}

export interface FeeTier extends BaseModel {
  fee_config: string
  min_amount: string
  max_amount: string | null
  percentage: string
  fixed_fee: string
}

export interface FeeConfig extends BaseModel {
  name: string
  channel: string
  fee_type: string
  percentage: string
  fixed_fee: string
  min_fee: string
  max_fee: string | null
  business_type: string | null
  business_type_name: string | null
  is_active: boolean
  tiers: FeeTier[]
}

export interface SettlementFee extends BaseModel {
  name: string
  fee_type: string
  fixed_fee: string
  percentage: string
  is_active: boolean
}

export interface CommissionRule extends BaseModel {
  name: string
  commission_type: string
  calculation_type: string
  percentage: string
  fixed_amount: string
  is_active: boolean
}

export interface Biller extends BaseModel {
  name: string
  code: string
  category: string
  utility_code: string | null
  is_active: boolean
  description: string | null
  logo_url: string | null
}

export interface PaymentService extends BaseModel {
  name: string
  code: string
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RESTRICTED'
  description: string | null
  icon: string | null
}

export interface SalesLead extends BaseModel {
  business_name: string
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  business_type: string | null
  stage: string
  priority: string
  assigned_to: string | null
  assigned_to_name: string | null
  branch: string | null
  branch_name: string | null
  notes: string | null
  follow_up_date: string | null
  converted_business: string | null
}

export interface AdminTicketComment extends BaseModel {
  ticket: string
  author: string | null
  author_name: string
  comment: string
  is_internal: boolean
}

export interface AdminSupportTicket extends BaseModel {
  ticket_number: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  user: string | null
  user_name: string | null
  business: string | null
  business_name: string | null
  transaction: string | null
  assigned_to: string | null
  assigned_to_name: string | null
  department: string | null
  department_name: string | null
  branch: string | null
  resolved_at: string | null
  resolution_notes: string | null
  comments: AdminTicketComment[]
}

export interface Refund extends BaseModel {
  transaction: string
  transaction_ref: string
  transaction_amount: string
  amount: string
  reason: string
  status: 'REQUESTED' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
  requested_by: string | null
  requested_by_name: string | null
  approved_by: string | null
  approved_by_name: string | null
  requested_at: string
  approved_at: string | null
  completed_at: string | null
  rejection_reason: string | null
  business_name: string | null
}

export interface SystemNotification extends BaseModel {
  title: string
  message: string
  channel: string
  target_type: string
  sent_by: string | null
  sent_by_name: string | null
  sent_at: string | null
}

export interface SystemSetting extends BaseModel {
  key: string
  value: Record<string, unknown>
  description: string | null
  is_public: boolean
}

export interface AdminTransaction extends BaseModel {
  reference: string
  business: string | null
  business_name: string | null
  customer_name: string | null
  customer_phone: string | null
  type: string
  amount: string
  currency: string
  channel: string
  channel_display: string
  status: string
  status_display: string
  selcom_transid: string | null
  payer_msisdn: string | null
  failure_reason: string | null
  completed_at: string | null
}

export interface AdminOverview {
  total_users: number
  active_users: number
  new_registrations: number
  total_businesses: number
  pending_kyc: number
  verified_businesses: number
  suspended_businesses: number
  total_transactions: number
  successful_transactions: number
  failed_transactions: number
  pending_transactions: number
  total_payment_volume: string
  total_fees: string
  total_settlements: number
  today_revenue: string
  monthly_revenue: string
  active_developers: number
  api_requests: number
  failed_api_requests: number
  open_tickets: number
}
