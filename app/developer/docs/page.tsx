"use client"

import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Book02Icon,
  Key01Icon,
  CreditCardIcon,
  WebhookIcon,
  Cancel01Icon,
  ShieldKeyIcon,
  CodeIcon,
} from "@hugeicons/core-free-icons"
import { useState } from "react"

const DOC_SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book02Icon,
    content: `Welcome to SalamaPay for Developers. SalamaPay wraps Selcom's payment infrastructure behind a clean, developer-friendly API.

## Quick Start

1. Create a Business Profile
2. Complete KYC Verification
3. Connect your Selcom account
4. Generate API Keys
5. Create your first Checkout
6. Configure Webhooks
7. Test in Sandbox
8. Go to Production

## Base URLs

- Sandbox: https://api.salamapay.co/test/v1
- Production: https://api.salamapay.co/live/v1`,
  },
  {
    id: "authentication",
    title: "Authentication",
    icon: Key01Icon,
    content: `SalamaPay uses API keys for authentication. Include your key in the Authorization header.

## API Keys

- Public Key (sp_test_pk_ / sp_live_pk_): Safe for frontend/client-side use
- Secret Key (sp_test_sk_ / sp_live_sk_): Server-side only. Never expose in frontend code.
- Webhook Secret (whsec_): Used to verify webhook signatures.

## Example

\`\`\`bash
curl -X POST https://api.salamapay.co/test/v1/checkout/create \\
  -H "Authorization: Bearer sp_test_sk_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": "50000", "currency": "TZS"}'
\`\`\`

## Important

- Selcom credentials (API Key/Secret) are stored encrypted on the backend
- Never use Secret Keys in mobile apps or browser code
- Use Public Keys for client-side integrations`,
  },
  {
    id: "checkout",
    title: "Checkout",
    icon: CreditCardIcon,
    content: `Create a checkout session to accept payments from your customers.

## Create Checkout

\`\`\`bash
POST /v1/checkout/create
\`\`\`

Request:
\`\`\`json
{
  "amount": "50000",
  "currency": "TZS",
  "description": "Hotel Booking",
  "customer_name": "John Doe",
  "customer_phone": "255712345678",
  "payment_methods": ["MOBILE_MONEY", "CARD", "BANK"],
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel"
}
\`\`\`

Response:
\`\`\`json
{
  "order_id": "SP-8XK29A",
  "checkout_url": "https://pay.salamapay.co/checkout/8XK29A",
  "status": "PENDING"
}
\`\`\`

Redirect your customer to the checkout_url to complete payment.

## Checkout Status

\`\`\`bash
GET /v1/checkout/{order_id}/status
\`\`\``,
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: WebhookIcon,
    content: `Webhooks notify your server about payment events in real-time.

## Events

- payment.success — Payment completed successfully
- payment.failed — Payment failed
- payment.pending — Payment is pending
- payment.reversed — Payment was reversed
- payment.refunded — Payment was refunded
- settlement.completed — Settlement completed

## Signature Verification

Each webhook includes a signature in the X-SalamaPay-Signature header. Verify using your webhook secret:

\`\`\`python
import hmac, hashlib

def verify_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
\`\`\`

## Retry Logic

Failed deliveries are retried up to 3 times with exponential backoff. You can also manually retry from the dashboard.`,
  },
  {
    id: "errors",
    title: "Errors",
    icon: Cancel01Icon,
    content: `SalamaPay uses conventional HTTP status codes.

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Rate Limited
- 500: Server Error

## Error Format

\`\`\`json
{
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "Amount must be greater than zero",
    "field": "amount"
  }
}
\`\`\``,
  },
  {
    id: "security",
    title: "Security",
    icon: ShieldKeyIcon,
    content: `## Best Practices

1. Never expose Secret Keys in client-side code
2. Use environment variables for API keys
3. Configure Allowed Domains for public key usage
4. Set up IP Allowlist for server-to-server calls
5. Always verify webhook signatures
6. Use HTTPS for all endpoints
7. Rotate keys periodically
8. Monitor API logs for suspicious activity

## Mobile Apps

For mobile apps (Flutter, React Native, etc.):
- Use Public Key only
- Route all sensitive operations through your backend
- Never embed Selcom credentials in mobile apps`,
  },
  {
    id: "sdks",
    title: "SDKs",
    icon: CodeIcon,
    content: `## Official SDKs

### JavaScript / Node.js
\`\`\`bash
npm install @salamapay/sdk
\`\`\`

\`\`\`javascript
import SalamaPay from '@salamapay/sdk';

const client = new SalamaPay('sp_test_sk_xxxxx');

const checkout = await client.checkout.create({
  amount: '50000',
  currency: 'TZS',
});
\`\`\`

### Python
\`\`\`bash
pip install salamapay
\`\`\`

\`\`\`python
from salamapay import SalamaPay

client = SalamaPay('sp_test_sk_xxxxx')

checkout = client.checkout.create(
  amount='50000',
  currency='TZS',
)
\`\`\`

### Flutter
\`\`\`yaml
dependencies:
  salamapay_flutter: ^1.0.0
\`\`\`

\`\`\`dart
import 'package:salamapay_flutter/salamapay_flutter.dart';

final client = SalamaPay(publicKey: 'sp_test_pk_xxxxx');
final checkout = await client.checkout.create(
  amount: '50000',
  currency: 'TZS',
);
\`\`\``,
  },
]

const CODE_LANGS = ["cURL", "JavaScript", "Python", "PHP", "Flutter"]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState(DOC_SECTIONS[0].id)
  const [activeLang, setActiveLang] = useState("cURL")

  const currentDoc = DOC_SECTIONS.find((d) => d.id === activeSection)

  return (
    <DeveloperShell breadcrumb="Documentation">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">Everything you need to integrate SalamaPay.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {/* Sidebar */}
        <div className="flex flex-col gap-1">
          {DOC_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                activeSection === section.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
              }`}
            >
              <HugeiconsIcon icon={section.icon} className="size-4" />
              {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={currentDoc?.icon || Book02Icon} className="size-5" />
                {currentDoc?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                  {currentDoc?.content}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Code Language Selector */}
          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Code Examples</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                {CODE_LANGS.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      activeLang === lang ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Badge variant="outline">{activeLang}</Badge>
                <span className="text-sm text-muted-foreground">Code examples coming soon</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DeveloperShell>
  )
}
