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
    const message =
      (errorData.detail as string) ||
      (errorData.detail as string[])?.join(", ") ||
      `Request failed with status ${res.status}`
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

  register: (data: { phone_number: string; full_name: string; password: string; email?: string }) =>
    apiFetch<{ id: string; phone_number: string; full_name: string }>(
      "/accounts/register/",
      { method: "POST", body: JSON.stringify(data) }
    ),

  me: () => apiFetch<import("@/lib/types").User>("/accounts/users/me/"),
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
  collect: (data: { business_id: string; amount: string; category_code: string; channel: string; payer_msisdn: string }) =>
    apiFetch<import("@/lib/types").Transaction>("/payments/transactions/collect/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  transactionStatus: (reference: string) =>
    apiFetch<Record<string, unknown>>(`/payments/transactions/${reference}/status/`),
}

export { API_BASE_URL }
