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
    section: "Overview",
    items: [
      { title: "Introduction", slug: "introduction", description: "What SalamaPay is and how to get started" },
      { title: "Core Concepts", slug: "core-concepts", description: "Payments, Sessions, Disbursements, Webhooks" },
      { title: "Getting Started", slug: "quickstart", description: "Make your first API request" },
    ],
  },
  {
    section: "Authentication",
    items: [
      { title: "Overview", slug: "auth-overview", description: "How API authentication works" },
      { title: "API Keys", slug: "api-keys", description: "Public, secret, and webhook keys" },
    ],
  },
  {
    section: "API Reference",
    items: [
      { title: "Payments", slug: "api-payments", description: "Accept mobile money and card payments" },
      { title: "Transactions", slug: "api-transactions", description: "Manage and verify transactions" },
      { title: "Sessions & Payment Links", slug: "api-sessions", description: "Hosted checkout pages and shareable links" },
      { title: "Disbursements", slug: "api-disbursements", description: "Send payouts to wallets and bank accounts" },
      { title: "Webhooks", slug: "api-webhooks", description: "Handle real-time event notifications" },
    ],
  },
  {
    section: "SDKs",
    items: [
      { title: "JavaScript", slug: "sdk-javascript", description: "Node.js and Browser SDK" },
      { title: "Python", slug: "sdk-python", description: "Python library for SalamaPay" },
      { title: "PHP", slug: "sdk-php", description: "PHP library for SalamaPay" },
      { title: "Flutter", slug: "sdk-flutter", description: "Flutter and Dart integration" },
    ],
  },
  {
    section: "Development",
    items: [
      { title: "Idempotency", slug: "idempotency", description: "Prevent duplicate transactions on retry" },
      { title: "Error Handling", slug: "error-handling", description: "Understanding API error codes" },
      { title: "Rate Limits", slug: "rate-limits", description: "API rate limiting policies" },
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
