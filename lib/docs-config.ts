export interface DocNavItem {
  title: string
  slug: string
  description?: string
}

export interface DocNavSection {
  section: string
  items: DocNavItem[]
}

export const DOC_NAV: DocNavSection[] = [
  {
    section: "Getting Started",
    items: [
      { title: "Introduction", slug: "introduction", description: "Overview of SalamaPay and its capabilities" },
      { title: "Quickstart", slug: "quickstart", description: "Make your first API request in minutes" },
      { title: "How SalamaPay Works", slug: "how-it-works", description: "Architecture and payment flow" },
      { title: "Account Setup", slug: "account-setup", description: "Create your SalamaPay account" },
      { title: "Business Verification", slug: "business-verification", description: "Complete KYC to unlock features" },
      { title: "Environments", slug: "environments", description: "Sandbox vs Production" },
      { title: "Going Live", slug: "going-live", description: "Move from sandbox to production" },
    ],
  },
  {
    section: "Authentication",
    items: [
      { title: "Overview", slug: "auth-overview", description: "How API authentication works" },
      { title: "API Keys", slug: "api-keys", description: "Public, secret, and webhook keys" },
      { title: "Request Signing", slug: "request-signing", description: "How requests are signed and verified" },
      { title: "Headers", slug: "headers", description: "Required and optional headers" },
      { title: "Idempotency", slug: "idempotency", description: "Prevent duplicate operations" },
      { title: "Security Best Practices", slug: "auth-security", description: "Keep your integration secure" },
    ],
  },
  {
    section: "Payments",
    items: [
      { title: "Overview", slug: "payments-overview", description: "Accept payments via SalamaPay" },
      { title: "Create Payment", slug: "create-payment", description: "Initiate a payment request" },
      { title: "Payment Status", slug: "payment-status", description: "Transaction lifecycle and states" },
      { title: "Mobile Money", slug: "mobile-money", description: "Collect via M-Pesa, Tigo, Airtel" },
      { title: "Cards", slug: "cards", description: "Accept card payments" },
      { title: "Bank Payments", slug: "bank-payments", description: "Bank transfer payments" },
      { title: "QR Payments", slug: "qr-payments", description: "QR code-based payments" },
      { title: "Payment Links", slug: "payment-links", description: "Shareable payment links" },
    ],
  },
  {
    section: "Checkout",
    items: [
      { title: "Overview", slug: "checkout-overview", description: "Hosted checkout sessions" },
      { title: "Create Checkout", slug: "create-checkout", description: "Create a checkout session" },
      { title: "Checkout Session", slug: "checkout-session", description: "Manage checkout sessions" },
      { title: "Payment Methods", slug: "checkout-methods", description: "Configure available methods" },
      { title: "Success & Cancel URLs", slug: "checkout-urls", description: "Redirect configuration" },
      { title: "Checkout Webhooks", slug: "checkout-webhooks", description: "Webhooks for checkout events" },
      { title: "Checkout Status", slug: "checkout-status", description: "Check checkout status" },
    ],
  },
  {
    section: "Transactions",
    items: [
      { title: "Overview", slug: "transactions-overview", description: "Manage all transactions" },
      { title: "Retrieve Transaction", slug: "retrieve-transaction", description: "Get transaction details" },
      { title: "List Transactions", slug: "list-transactions", description: "Paginated transaction list" },
      { title: "Refunds", slug: "refunds", description: "Process refunds" },
      { title: "Reconciliation", slug: "reconciliation", description: "Reconcile your accounts" },
    ],
  },
  {
    section: "Webhooks",
    items: [
      { title: "Overview", slug: "webhooks-overview", description: "Real-time event notifications" },
      { title: "Webhook Setup", slug: "webhook-setup", description: "Configure webhook endpoints" },
      { title: "Events", slug: "webhook-events", description: "All webhook event types" },
      { title: "Signature Verification", slug: "webhook-signatures", description: "Verify webhook authenticity" },
      { title: "Retries", slug: "webhook-retries", description: "How failed deliveries are retried" },
      { title: "Webhook Security", slug: "webhook-security", description: "Secure your webhook endpoints" },
    ],
  },
  {
    section: "Utility Payments",
    items: [
      { title: "Overview", slug: "utility-overview", description: "Pay utility bills" },
      { title: "Bill Lookup", slug: "utility-lookup", description: "Look up utility account" },
      { title: "Create Payment", slug: "utility-payment", description: "Process utility payment" },
      { title: "Payment Status", slug: "utility-status", description: "Check utility payment status" },
    ],
  },
  {
    section: "Government Payments",
    items: [
      { title: "Overview", slug: "government-overview", description: "Pay government bills" },
      { title: "Control Numbers", slug: "control-numbers", description: "GePG control number payments" },
      { title: "Lookup", slug: "government-lookup", description: "Verify control number" },
      { title: "Payment", slug: "government-payment", description: "Process government payment" },
    ],
  },
  {
    section: "Development",
    items: [
      { title: "Sandbox", slug: "sandbox", description: "Test environment" },
      { title: "Test Credentials", slug: "test-credentials", description: "Sandbox test keys" },
      { title: "Error Handling", slug: "error-handling", description: "Handle API errors" },
      { title: "Rate Limits", slug: "rate-limits", description: "API rate limiting" },
    ],
  },
  {
    section: "API Reference",
    items: [
      { title: "Authentication", slug: "api-auth", description: "Auth endpoints" },
      { title: "Payments", slug: "api-payments", description: "Payment endpoints" },
      { title: "Checkout", slug: "api-checkout", description: "Checkout endpoints" },
      { title: "Transactions", slug: "api-transactions", description: "Transaction endpoints" },
      { title: "Refunds", slug: "api-refunds", description: "Refund endpoints" },
      { title: "Webhooks", slug: "api-webhooks", description: "Webhook endpoints" },
      { title: "Utilities", slug: "api-utilities", description: "Utility payment endpoints" },
      { title: "Government", slug: "api-government", description: "Government payment endpoints" },
    ],
  },
  {
    section: "SDKs",
    items: [
      { title: "JavaScript", slug: "sdk-javascript", description: "Node.js SDK" },
      { title: "Python", slug: "sdk-python", description: "Python SDK" },
      { title: "PHP", slug: "sdk-php", description: "PHP SDK" },
      { title: "Flutter", slug: "sdk-flutter", description: "Flutter SDK" },
    ],
  },
  {
    section: "Production",
    items: [
      { title: "Production Checklist", slug: "production-checklist", description: "Before going live" },
      { title: "Security Checklist", slug: "security-checklist", description: "Security requirements" },
      { title: "Monitoring", slug: "monitoring", description: "Monitor your integration" },
      { title: "Troubleshooting", slug: "troubleshooting", description: "Common issues and solutions" },
    ],
  },
  {
    section: "Resources",
    items: [
      { title: "Fees", slug: "fees", description: "Pricing and fees" },
      { title: "Changelog", slug: "changelog", description: "API version history" },
      { title: "API Status", slug: "api-status", description: "Service status" },
      { title: "Support", slug: "support", description: "Get help" },
      { title: "FAQ", slug: "faq", description: "Frequently asked questions" },
    ],
  },
]

export const ALL_DOC_PAGES = DOC_NAV.flatMap((s) => s.items)

export function getDocPage(slug: string) {
  return ALL_DOC_PAGES.find((p) => p.slug === slug)
}

export function getAdjacentPages(slug: string) {
  const flat = ALL_DOC_PAGES
  const idx = flat.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  }
}
