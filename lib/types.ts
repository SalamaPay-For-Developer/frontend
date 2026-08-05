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
