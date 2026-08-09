const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export class ApiError extends Error {
  status: number
  data: Record<string, unknown>

  constructor(message: string, status: number, data: Record<string, unknown> = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export function getTokens() {
  if (typeof window === "undefined") return null
  const access = localStorage.getItem("access_token")
  const refresh = localStorage.getItem("refresh_token")
  if (!access) return null
  return { access, refresh }
}

export function setTokens(access: string, refresh: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("access_token", access)
  localStorage.setItem("refresh_token", refresh)
}

export function clearTokens() {
  if (typeof window === "undefined") return
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  const refresh = localStorage.getItem("refresh_token")
  if (!refresh) return null

  try {
    const res = await fetch(`${API_BASE_URL}/accounts/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) {
      clearTokens()
      return null
    }
    const data = await res.json()
    localStorage.setItem("access_token", data.access)
    return data.access
  } catch {
    clearTokens()
    return null
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const tokens = getTokens()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  }

  if (tokens?.access) {
    headers["Authorization"] = `Bearer ${tokens.access}`
  }

  let res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

  // Try refresh on 401
  if (res.status === 401 && retry && tokens?.refresh) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      headers["Authorization"] = `Bearer ${newAccess}`
      res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
    }
  }

  if (!res.ok) {
    let errorData: Record<string, unknown> = {}
    try {
      errorData = await res.json()
    } catch {
      // non-JSON error
    }
    let message = ""
    if (typeof errorData.detail === "string") {
      message = errorData.detail
    } else if (Array.isArray(errorData.detail)) {
      message = errorData.detail.join(", ")
    } else {
      const fieldErrors = Object.values(errorData).flat()
      message = fieldErrors.join(", ") || `Request failed with status ${res.status}`
    }
    throw new ApiError(message, res.status, errorData)
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// Auth API
export const authApi = {
  login: (phone_number: string, password: string) =>
    apiFetch<{ access: string; refresh: string }>("/accounts/login/", {
      method: "POST",
      body: JSON.stringify({ phone_number, password }),
    }),

  register: (data: { phone_number: string; full_name: string; password: string; email: string }) =>
    apiFetch<{ id: string; phone_number: string; full_name: string }>(
      "/accounts/register/",
      { method: "POST", body: JSON.stringify(data) }
    ),

  me: () => apiFetch<import("@/lib/types").User>("/accounts/users/me/"),

  verifyOtp: (phone_number: string, otp_code: string) =>
    apiFetch<{ detail: string; verified: boolean }>("/accounts/verify-otp/", {
      method: "POST",
      body: JSON.stringify({ phone_number, otp_code }),
    }),

  resendOtp: (phone_number: string) =>
    apiFetch<{ detail: string }>("/accounts/resend-otp/", {
      method: "POST",
      body: JSON.stringify({ phone_number }),
    }),

  forgotPassword: (phone_number: string) =>
    apiFetch<{ detail: string }>("/accounts/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ phone_number }),
    }),

  resetPassword: (phone_number: string, new_password: string) =>
    apiFetch<{ detail: string }>("/accounts/reset-password/", {
      method: "POST",
      body: JSON.stringify({ phone_number, new_password }),
    }),
}

// Business API
export const businessApi = {
  list: () => apiFetch<import("@/lib/types").Business[]>("/accounts/businesses/"),
  retrieve: (id: string) => apiFetch<import("@/lib/types").Business>(`/accounts/businesses/${id}/`),
  create: (data: Partial<import("@/lib/types").Business>) =>
    apiFetch<import("@/lib/types").Business>("/accounts/businesses/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<import("@/lib/types").Business>) =>
    apiFetch<import("@/lib/types").Business>(`/accounts/businesses/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  submitKyc: (id: string, data: Record<string, unknown>) =>
    apiFetch<import("@/lib/types").BusinessKYC>(`/accounts/businesses/${id}/kyc/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  members: (id: string) =>
    apiFetch<import("@/lib/types").BusinessMember[]>(`/accounts/businesses/${id}/members/`),
  addMember: (id: string, data: { user_phone: string; role: string }) =>
    apiFetch<import("@/lib/types").BusinessMember>(`/accounts/businesses/${id}/members/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  switch: (id: string) =>
    apiFetch<{ active_business: import("@/lib/types").Business }>(
      `/accounts/businesses/${id}/switch/`,
      { method: "POST" }
    ),
  myBusinesses: () =>
    apiFetch<import("@/lib/types").Business[]>("/accounts/users/my_businesses/"),
}

// Modules API
export const modulesApi = {
  list: () => apiFetch<import("@/lib/types").BusinessModule[]>("/modules/available/"),
  configs: () => apiFetch<import("@/lib/types").BusinessModuleConfig[]>("/modules/configs/"),
  setConfig: (data: { business: string; module: string; enabled_features?: string[]; config?: Record<string, unknown> }) =>
    apiFetch<import("@/lib/types").BusinessModuleConfig>("/modules/configs/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Payments API
export const paymentsApi = {
  categories: () => apiFetch<import("@/lib/types").PaymentCategory[]>("/payments/categories/"),
  transactions: () => apiFetch<import("@/lib/types").Transaction[]>("/payments/transactions/"),
  transaction: (reference: string) =>
    apiFetch<import("@/lib/types").Transaction>(`/payments/transactions/${reference}/`),
  collect: (data: { business_id: string; amount: string; category_code: string; channel: string; payer_msisdn: string }) =>
    apiFetch<import("@/lib/types").Transaction>("/payments/transactions/collect/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  transactionStatus: (reference: string) =>
    apiFetch<Record<string, unknown>>(`/payments/transactions/${reference}/status/`),
  receipt: (reference: string) =>
    apiFetch<import("@/lib/types").TransactionReceipt>(`/payments/transactions/${reference}/receipt/`),
  fee: (amount: string) =>
    apiFetch<{ amount: number; fee_amount: number; net_amount: number; fee_rate: string; currency: string }>(`/payments/transactions/fee/?amount=${amount}`),
  summary: () =>
    apiFetch<import("@/lib/types").TransactionSummary>("/payments/transactions/summary/"),
}

// Wallets API
export const walletsApi = {
  list: () => apiFetch<import("@/lib/types").Wallet[]>("/wallets/wallets/"),
  retrieve: (id: string) => apiFetch<import("@/lib/types").Wallet>(`/wallets/wallets/${id}/`),
  ledger: (id: string) =>
    apiFetch<import("@/lib/types").LedgerEntry[]>(`/wallets/wallets/${id}/ledger/`),
}

// Savings API
export const savingsApi = {
  list: () => apiFetch<import("@/lib/types").SavingsGoal[]>("/wallets/savings/"),
  create: (data: { title: string; target_amount: string; color?: string }) =>
    apiFetch<import("@/lib/types").SavingsGoal>("/wallets/savings/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deposit: (id: string, amount: string) =>
    apiFetch<import("@/lib/types").SavingsGoal>(`/wallets/savings/${id}/deposit/`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  withdraw: (id: string, amount: string) =>
    apiFetch<import("@/lib/types").SavingsGoal>(`/wallets/savings/${id}/withdraw/`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  contributions: (id: string) =>
    apiFetch<import("@/lib/types").SavingsContribution[]>(`/wallets/savings/${id}/contributions/`),
  summary: () =>
    apiFetch<Record<string, unknown>>("/wallets/savings/summary/"),
}

// Selcom IMT API
export const imtApi = {
  utilityPayment: (data: { utilitycode: string; utilityref: string; amount: string; pin: string; transid: string }) =>
    apiFetch<Record<string, unknown>>("/imt/utility-payment/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  walletCashin: (data: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/imt/wallet-cashin/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  walletNameLookup: (msisdn: string) =>
    apiFetch<Record<string, unknown>>(`/imt/wallet-name-lookup/?msisdn=${msisdn}`),
  sendMoney: (data: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/imt/qwiksend/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  agentCashout: (data: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/imt/agent-cashout/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  floatBalance: () =>
    apiFetch<Record<string, unknown>>("/imt/float-balance/"),
}

export { API_BASE_URL }

// ==================== Developer Platform ====================

export const developerApi = {
  workspace: () =>
    apiFetch<import("@/lib/types").DeveloperWorkspace>("/developer/workspace/"),
  updateWorkspace: (data: Partial<import("@/lib/types").DeveloperWorkspace>) =>
    apiFetch<import("@/lib/types").DeveloperWorkspace>("/developer/workspace/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  overview: () =>
    apiFetch<import("@/lib/types").DeveloperOverview>("/developer/overview/"),
  connectSelcom: (data: {
    environment: string
    api_key: string
    api_secret: string
    vendor_id?: string
    pin?: string
  }) =>
    apiFetch<{ detail: string; credential: import("@/lib/types").SelcomCredential }>(
      "/developer/connect-selcom/",
      { method: "POST", body: JSON.stringify(data) }
    ),
  selcomConnection: () =>
    apiFetch<{ connected: boolean; credentials: import("@/lib/types").SelcomCredential[] }>(
      "/developer/selcom/"
    ),
  disconnectSelcom: () =>
    apiFetch<{ detail: string }>("/developer/selcom/", { method: "DELETE" }),
  testSelcom: () =>
    apiFetch<{ detail: string; status: string }>("/developer/selcom/test/", { method: "POST" }),
  apiKeys: () =>
    apiFetch<import("@/lib/types").SalamaPayApiKey[]>("/developer/api-keys/"),
  createApiKey: (data: { key_type: string; environment: string }) =>
    apiFetch<{ key: string; api_key: import("@/lib/types").SalamaPayApiKey; detail: string }>(
      "/developer/api-keys/",
      { method: "POST", body: JSON.stringify(data) }
    ),
  rotateApiKey: (id: string) =>
    apiFetch<{ key: string; api_key: import("@/lib/types").SalamaPayApiKey; detail: string }>(
      `/developer/api-keys/${id}/rotate/`,
      { method: "POST" }
    ),
  deleteApiKey: (id: string) =>
    apiFetch<void>(`/developer/api-keys/${id}/`, { method: "DELETE" }),
  webhooks: () =>
    apiFetch<import("@/lib/types").WebhookEndpoint[]>("/developer/webhooks/"),
  createWebhook: (data: { url: string; description?: string; events: string[] }) =>
    apiFetch<import("@/lib/types").WebhookEndpoint>("/developer/webhooks/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateWebhook: (id: string, data: Partial<import("@/lib/types").WebhookEndpoint>) =>
    apiFetch<import("@/lib/types").WebhookEndpoint>(`/developer/webhooks/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteWebhook: (id: string) =>
    apiFetch<void>(`/developer/webhooks/${id}/`, { method: "DELETE" }),
  webhookDeliveries: (id: string) =>
    apiFetch<import("@/lib/types").WebhookDelivery[]>(`/developer/webhooks/${id}/deliveries/`),
  retryDelivery: (webhookId: string, deliveryId: string) =>
    apiFetch<{ detail: string }>(
      `/developer/webhooks/${webhookId}/deliveries/${deliveryId}/retry/`,
      { method: "POST" }
    ),
  checkouts: () =>
    apiFetch<import("@/lib/types").CheckoutSession[]>("/developer/checkouts/"),
  createCheckout: (data: {
    amount: string
    currency?: string
    description?: string
    customer_name?: string
    customer_phone?: string
    customer_email?: string
    payment_methods?: string[]
    success_url?: string
    cancel_url?: string
    appearance_config?: Record<string, unknown>
  }) =>
    apiFetch<import("@/lib/types").CheckoutSession>("/developer/checkouts/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  checkoutStatus: (id: string) =>
    apiFetch<{ status: string; order_id: string }>(`/developer/checkouts/${id}/status/`),
  publicCheckout: (code: string) =>
    fetch(`${API_BASE_URL}/developer/checkout/${code}/`).then((r) => r.json()),
  logs: () =>
    apiFetch<import("@/lib/types").ApiLog[]>("/developer/logs/"),
  logDetail: (id: string) =>
    apiFetch<import("@/lib/types").ApiLog>(`/developer/logs/${id}/`),
  services: () =>
    apiFetch<import("@/lib/types").ServiceCapability[]>("/developer/services/"),
  updateService: (id: string, data: { is_enabled: boolean }) =>
    apiFetch<import("@/lib/types").ServiceCapability>(`/developer/services/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
}

// ==================== Admin / Organization ====================

export const adminApi = {
  overview: () =>
    apiFetch<import("@/lib/types").AdminOverview>("/admin-panel/overview/"),

  // Users
  users: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : ""
    return apiFetch<import("@/lib/types").AdminUser[]>(`/admin-panel/users/${qs}`)
  },
  user: (id: string) =>
    apiFetch<import("@/lib/types").AdminUser>(`/admin-panel/users/${id}/`),
  suspendUser: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/users/${id}/suspend/`, { method: "POST" }),
  activateUser: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/users/${id}/activate/`, { method: "POST" }),
  verifyUserPhone: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/users/${id}/verify_phone/`, { method: "POST" }),
  userTransactions: (id: string) =>
    apiFetch<import("@/lib/types").AdminTransaction[]>(`/admin-panel/users/${id}/transactions/`),
  userBusinesses: (id: string) =>
    apiFetch<import("@/lib/types").AdminBusiness[]>(`/admin-panel/users/${id}/businesses/`),

  // Businesses
  businesses: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : ""
    return apiFetch<import("@/lib/types").AdminBusiness[]>(`/admin-panel/businesses/${qs}`)
  },
  business: (id: string) =>
    apiFetch<import("@/lib/types").AdminBusiness>(`/admin-panel/businesses/${id}/`),
  approveKyc: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/businesses/${id}/approve_kyc/`, { method: "POST" }),
  rejectKyc: (id: string, reason: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/businesses/${id}/reject_kyc/`, {
      method: "POST", body: JSON.stringify({ reason })
    }),
  suspendBusiness: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/businesses/${id}/suspend/`, { method: "POST" }),
  reactivateBusiness: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/businesses/${id}/reactivate/`, { method: "POST" }),
  businessTransactions: (id: string) =>
    apiFetch<import("@/lib/types").AdminTransaction[]>(`/admin-panel/businesses/${id}/transactions/`),

  // RBAC
  permissions: () =>
    apiFetch<import("@/lib/types").Permission[]>("/admin-panel/permissions/"),
  roles: () =>
    apiFetch<import("@/lib/types").Role[]>("/admin-panel/roles/"),
  createRole: (data: { name: string; permission_codes: string[] }) =>
    apiFetch<import("@/lib/types").Role>("/admin-panel/roles/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateRole: (id: string, data: Partial<{ name: string; is_active: boolean; permission_codes: string[] }>) =>
    apiFetch<import("@/lib/types").Role>(`/admin-panel/roles/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),
  departments: () =>
    apiFetch<import("@/lib/types").Department[]>("/admin-panel/departments/"),
  createDepartment: (data: { name: string; description?: string }) =>
    apiFetch<import("@/lib/types").Department>("/admin-panel/departments/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateDepartment: (id: string, data: Partial<import("@/lib/types").Department>) =>
    apiFetch<import("@/lib/types").Department>(`/admin-panel/departments/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),
  branches: () =>
    apiFetch<import("@/lib/types").Branch[]>("/admin-panel/branches/"),
  createBranch: (data: { name: string; address?: string; phone?: string }) =>
    apiFetch<import("@/lib/types").Branch>("/admin-panel/branches/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateBranch: (id: string, data: Partial<import("@/lib/types").Branch>) =>
    apiFetch<import("@/lib/types").Branch>(`/admin-panel/branches/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),

  // Staff
  staff: () =>
    apiFetch<import("@/lib/types").StaffProfile[]>("/admin-panel/staff/"),
  createStaff: (data: {
    phone_number: string; full_name: string; email?: string;
    role: string; department?: string; branch?: string;
    can_access_all_branches?: boolean; employee_id?: string
  }) =>
    apiFetch<import("@/lib/types").StaffProfile>("/admin-panel/staff/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateStaff: (id: string, data: Partial<import("@/lib/types").StaffProfile>) =>
    apiFetch<import("@/lib/types").StaffProfile>(`/admin-panel/staff/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),
  suspendStaff: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/staff/${id}/suspend/`, { method: "POST" }),
  activateStaff: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/staff/${id}/activate/`, { method: "POST" }),

  // Audit Logs
  auditLogs: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : ""
    return apiFetch<import("@/lib/types").AuditLog[]>(`/admin-panel/audit-logs/${qs}`)
  },

  // Business Types
  businessTypes: () =>
    apiFetch<import("@/lib/types").BusinessTypeConfig[]>("/admin-panel/business-types/"),
  createBusinessType: (data: Partial<import("@/lib/types").BusinessTypeConfig>) =>
    apiFetch<import("@/lib/types").BusinessTypeConfig>("/admin-panel/business-types/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateBusinessType: (id: string, data: Partial<import("@/lib/types").BusinessTypeConfig>) =>
    apiFetch<import("@/lib/types").BusinessTypeConfig>(`/admin-panel/business-types/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),

  // Fees
  fees: () =>
    apiFetch<import("@/lib/types").FeeConfig[]>("/admin-panel/fees/"),
  createFee: (data: Partial<import("@/lib/types").FeeConfig>) =>
    apiFetch<import("@/lib/types").FeeConfig>("/admin-panel/fees/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateFee: (id: string, data: Partial<import("@/lib/types").FeeConfig>) =>
    apiFetch<import("@/lib/types").FeeConfig>(`/admin-panel/fees/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),
  settlementFees: () =>
    apiFetch<import("@/lib/types").SettlementFee[]>("/admin-panel/settlement-fees/"),
  createSettlementFee: (data: Partial<import("@/lib/types").SettlementFee>) =>
    apiFetch<import("@/lib/types").SettlementFee>("/admin-panel/settlement-fees/", {
      method: "POST", body: JSON.stringify(data)
    }),

  // Commissions
  commissions: () =>
    apiFetch<import("@/lib/types").CommissionRule[]>("/admin-panel/commissions/"),
  createCommission: (data: Partial<import("@/lib/types").CommissionRule>) =>
    apiFetch<import("@/lib/types").CommissionRule>("/admin-panel/commissions/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateCommission: (id: string, data: Partial<import("@/lib/types").CommissionRule>) =>
    apiFetch<import("@/lib/types").CommissionRule>(`/admin-panel/commissions/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),

  // Billers
  billers: () =>
    apiFetch<import("@/lib/types").Biller[]>("/admin-panel/billers/"),
  createBiller: (data: Partial<import("@/lib/types").Biller>) =>
    apiFetch<import("@/lib/types").Biller>("/admin-panel/billers/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateBiller: (id: string, data: Partial<import("@/lib/types").Biller>) =>
    apiFetch<import("@/lib/types").Biller>(`/admin-panel/billers/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),

  // Payment Services
  paymentServices: () =>
    apiFetch<import("@/lib/types").PaymentService[]>("/admin-panel/payment-services/"),
  updatePaymentService: (id: string, data: Partial<import("@/lib/types").PaymentService>) =>
    apiFetch<import("@/lib/types").PaymentService>(`/admin-panel/payment-services/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),

  // Transactions
  transactions: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : ""
    return apiFetch<import("@/lib/types").AdminTransaction[]>(`/admin-panel/transactions/${qs}`)
  },
  exportTransactions: () =>
    `${API_BASE_URL}/admin-panel/transactions/export/`,

  // Refunds
  refunds: () =>
    apiFetch<import("@/lib/types").Refund[]>("/admin-panel/refunds/"),
  createRefund: (data: { transaction: string; amount: string; reason: string }) =>
    apiFetch<import("@/lib/types").Refund>("/admin-panel/refunds/", {
      method: "POST", body: JSON.stringify(data)
    }),
  approveRefund: (id: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/refunds/${id}/approve/`, { method: "POST" }),
  rejectRefund: (id: string, reason: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/refunds/${id}/reject/`, {
      method: "POST", body: JSON.stringify({ reason })
    }),

  // Sales CRM
  leads: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : ""
    return apiFetch<import("@/lib/types").SalesLead[]>(`/admin-panel/leads/${qs}`)
  },
  createLead: (data: Partial<import("@/lib/types").SalesLead>) =>
    apiFetch<import("@/lib/types").SalesLead>("/admin-panel/leads/", {
      method: "POST", body: JSON.stringify(data)
    }),
  updateLead: (id: string, data: Partial<import("@/lib/types").SalesLead>) =>
    apiFetch<import("@/lib/types").SalesLead>(`/admin-panel/leads/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),

  // Tickets
  tickets: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : ""
    return apiFetch<import("@/lib/types").AdminSupportTicket[]>(`/admin-panel/tickets/${qs}`)
  },
  ticket: (id: string) =>
    apiFetch<import("@/lib/types").AdminSupportTicket>(`/admin-panel/tickets/${id}/`),
  assignTicket: (id: string, assignedTo: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/tickets/${id}/assign/`, {
      method: "POST", body: JSON.stringify({ assigned_to: assignedTo })
    }),
  resolveTicket: (id: string, notes: string) =>
    apiFetch<{ detail: string }>(`/admin-panel/tickets/${id}/resolve/`, {
      method: "POST", body: JSON.stringify({ notes })
    }),
  commentTicket: (id: string, comment: string, isInternal?: boolean) =>
    apiFetch<import("@/lib/types").AdminTicketComment>(`/admin-panel/tickets/${id}/comment/`, {
      method: "POST", body: JSON.stringify({ comment, is_internal: isInternal })
    }),

  // Notifications
  notifications: () =>
    apiFetch<import("@/lib/types").SystemNotification[]>("/admin-panel/notifications/"),
  sendNotification: (data: { title: string; message: string; channel: string; target_type: string }) =>
    apiFetch<import("@/lib/types").SystemNotification>("/admin-panel/notifications/", {
      method: "POST", body: JSON.stringify(data)
    }),

  // Settings
  settings: () =>
    apiFetch<import("@/lib/types").SystemSetting[]>("/admin-panel/settings/"),
  updateSetting: (id: string, data: Partial<import("@/lib/types").SystemSetting>) =>
    apiFetch<import("@/lib/types").SystemSetting>(`/admin-panel/settings/${id}/`, {
      method: "PATCH", body: JSON.stringify(data)
    }),
}
