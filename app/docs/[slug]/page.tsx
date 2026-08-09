import { DocPageWrapper } from "@/components/docs/doc-page-wrapper"
import { CodeBlock } from "@/components/docs/code-block"
import { CodeTabs } from "@/components/docs/code-tabs"
import { Callout } from "@/components/docs/callout"
import { ApiEndpoint, ParamsTable, ResponseExample } from "@/components/docs/api-endpoint"
import { getDocPage } from "@/lib/docs-config"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SentIcon, CreditCardIcon, WebhookIcon,
  ArrowRight01Icon, CodeIcon,
  CheckmarkCircle01Icon, Copy01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getDocPage(slug)
  if (!page) return { title: "Not Found — SalamaPay Docs" }
  return {
    title: `${page.title} — SalamaPay Developer Documentation`,
    description: page.description || page.title,
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const page = getDocPage(slug)
  if (!page) notFound()
  const Content = getContent(slug)
  return (
    <DocPageWrapper slug={slug} title={page.title} description={page.description}>
      <Content />
    </DocPageWrapper>
  )
}

function getContent(slug: string): React.FC {
  const contents: Record<string, React.FC> = {
    "introduction": IntroductionContent,
    "core-concepts": CoreConceptsContent,
    "quickstart": QuickstartContent,
    "auth-overview": AuthOverviewContent,
    "api-keys": ApiKeysContent,
    "api-payments": ApiPaymentsRefContent,
    "api-transactions": ApiTransactionsRefContent,
    "api-sessions": ApiSessionsRefContent,
    "api-disbursements": ApiDisbursementsRefContent,
    "api-webhooks": ApiWebhooksRefContent,
    "sdk-javascript": SdkJavascriptContent,
    "sdk-python": SdkPythonContent,
    "sdk-php": SdkPhpContent,
    "sdk-flutter": SdkFlutterContent,
    "idempotency": IdempotencyContent,
    "error-handling": ErrorHandlingContent,
    "rate-limits": RateLimitsContent,
  }
  return contents[slug] || PlaceholderContent
}

function PlaceholderContent() {
  return (
    <Callout type="info" title="Documentation in progress">
      This page is being written. Check back soon for detailed documentation.
    </Callout>
  )
}

// ===== OVERVIEW =====

function IntroductionContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        SalamaPay is a robust payment orchestration platform built for the Tanzanian market. 
        It provides a <span className="font-semibold text-foreground">unified API layer</span> that 
        abstracts the complexity of integrating with multiple mobile money providers, banks, and card processors.
      </p>

      <h2 className="text-xl font-bold mt-12 mb-4">Core Capabilities</h2>
      <div className="grid gap-4 sm:grid-cols-2 mt-6">
        {[
          { title: "Mobile Money", desc: "M-Pesa, Tigo Pesa, Airtel Money, and HaloPesa.", icon: SentIcon },
          { title: "Card Payments", desc: "Accept Visa and Mastercard with ease.", icon: CreditCardIcon },
          { title: "Hosted Checkout", desc: "Ready-to-use payment pages for your customers.", icon: CodeIcon },
          { title: "Real-time Webhooks", desc: "Get notified instantly when payments complete.", icon: WebhookIcon },
        ].map((item) => (
          <div key={item.title} className="flex gap-4 rounded-lg border border-border/50 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 shadow-sm transition-all hover:border-primary/30">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <HugeiconsIcon icon={item.icon} className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-12 mb-4">Integration Flow</h2>
      <p className="text-muted-foreground mb-8 text-sm">Follow these three simple steps to start accepting payments in your application.</p>
      
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
        <div className="relative flex items-start gap-6 group">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white font-bold text-xs shrink-0 z-10 shadow-lg shadow-primary/20">1</div>
          <div className="flex-1 pt-1.5">
            <h3 className="font-bold text-base mb-2">Generate API Keys</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create an account on the <a href="https://lipasalama.co.tz" className="text-primary underline font-medium">SalamaPay Dashboard</a> and generate your Sandbox API keys to start testing.
            </p>
          </div>
        </div>
        <div className="relative flex items-start gap-6 group">
          <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold text-xs shrink-0 z-10 border border-border">2</div>
          <div className="flex-1 pt-1.5">
            <h3 className="font-bold text-base mb-2">Initiate Payment</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use your secret key to call the <code className="bg-muted px-1.5 rounded font-mono text-xs">/payments/transactions/collect/</code> endpoint. Your customer will receive a USSD prompt to approve.
            </p>
          </div>
        </div>
        <div className="relative flex items-start gap-6 group">
          <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold text-xs shrink-0 z-10 border border-border">3</div>
          <div className="flex-1 pt-1.5">
            <h3 className="font-bold text-base mb-2">Receive Webhook</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SalamaPay will send a POST request to your configured webhook URL with the final transaction status (SUCCESS or FAILED).
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function CoreConceptsContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        SalamaPay has four main resource types. Understanding these will help you pick the right
        integration path for your product.
      </p>

      <div className="rounded-lg border overflow-hidden my-6">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Resource</th>
              <th className="px-4 py-2 text-left font-medium">Purpose</th>
              <th className="px-4 py-2 text-left font-medium">Endpoint prefix</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-semibold">Payments</td>
              <td className="px-4 py-2 text-muted-foreground">Collect money from customers (mobile money)</td>
              <td className="px-4 py-2 font-mono text-xs">/payments/transactions</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Sessions</td>
              <td className="px-4 py-2 text-muted-foreground">Hosted checkout pages — SalamaPay handles the UI for you</td>
              <td className="px-4 py-2 font-mono text-xs">/sessions</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Disbursements</td>
              <td className="px-4 py-2 text-muted-foreground">Send money out to wallets or bank accounts</td>
              <td className="px-4 py-2 font-mono text-xs">/payments/payouts</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Webhooks</td>
              <td className="px-4 py-2 text-muted-foreground">Real-time event notifications for status changes</td>
              <td className="px-4 py-2 text-muted-foreground text-xs">(your URL)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="tip" title="Payments vs Sessions">
        Use the Payments API when you want full control over the UI and build the payment form yourself.
        Use Sessions when you want SalamaPay to host a pre-built, mobile-optimized checkout page or
        generate a shareable payment link.
      </Callout>
    </>
  )
}

function QuickstartContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Start processing payments with SalamaPay in minutes. This guide covers the basics of making your first API request.
      </p>

      <h2 className="text-xl font-bold mt-12 mb-4">1. Environment Setup</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">Set your API base URL and credentials in your environment variables. Never hardcode these in your source code.</p>
      <CodeBlock language="env" title=".env" code={`SALAMAPAY_BASE_URL=https://lipasalama.co.tz/api/v1
SALAMAPAY_SECRET_KEY=sp_sec_test_xxxxxx`} />

      <h2 className="text-xl font-bold mt-12 mb-4">2. Create a Payment</h2>
      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">Send a POST request to initiate a payment collection. This will trigger a PUSH prompt on the customer's phone.</p>
      
      <CodeTabs examples={[
        { language: "curl", label: "cURL", code: `curl -X POST "https://lipasalama.co.tz/api/v1/payments/transactions/collect/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": "5000.00",
    "reference": "ORDER-101",
    "category_code": "RETAIL",
    "channel": "MPESA",
    "payer_msisdn": "255700000000"
  }'` },
        { language: "javascript", label: "JavaScript", code: `const response = await fetch("https://lipasalama.co.tz/api/v1/payments/transactions/collect/", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_SECRET_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    amount: "5000.00",
    reference: "ORDER-101",
    category_code: "RETAIL",
    channel: "MPESA",
    payer_msisdn: "255700000000"
  })
});` }
      ]} />
    </>
  )
}

// ===== AUTHENTICATION =====

function AuthOverviewContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        SalamaPay uses Bearer Token authentication. All API requests must include your 
        secret API key in the <code className="bg-muted px-1.5 rounded font-mono text-xs">Authorization</code> header.
      </p>
      <h2 className="text-xl font-bold mt-12 mb-4">Header Format</h2>
      <CodeBlock language="text" code={`Authorization: Bearer sp_sec_xxxxxxxxxxxxxxxxxxxx`} />
      <Callout type="danger" title="Security Warning" className="mt-12">
        Never expose your Secret Key in client-side code, mobile apps, or public repositories. 
        All API calls should be performed from your backend server.
      </Callout>
    </>
  )
}

function ApiKeysContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Manage your API keys from the SalamaPay Dashboard. You will have separate keys for 
        Sandbox (testing) and Production environments.
      </p>
      <h2 className="text-xl font-bold mt-12 mb-4">Key Types</h2>
      <div className="grid gap-4 mt-6">
        {[
          { title: "Secret Key", prefix: "sp_sec_", desc: "Used for all server-side API requests." },
          { title: "Public Key", prefix: "sp_pub_", desc: "Used for client-side checkout integrations." },
          { title: "Webhook Secret", prefix: "sp_wh_", desc: "Used to verify incoming webhooks." }
        ].map((k) => (
          <div key={k.title} className="p-5 rounded-lg border border-border/50 bg-zinc-50/50 dark:bg-zinc-900/30 shadow-sm">
            <h3 className="font-bold text-sm mb-1">{k.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{k.desc} Starts with <code className="bg-muted px-1 rounded font-mono text-[10px]">{k.prefix}</code>.</p>
          </div>
        ))}
      </div>
    </>
  )
}

// ===== API REFERENCE =====

function ApiPaymentsRefContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        The Payments API collects money from customers via mobile money. Every response is wrapped
        in the standard SalamaPay envelope: <code className="bg-muted px-1.5 rounded font-mono text-xs">{`{ status, code, data }`}</code>.
      </p>

      <ApiEndpoint
        method="POST"
        path="/payments/transactions/collect/"
        description="Initiate a mobile money payment collection. Supports an optional Idempotency-Key header."
      >
        <ParamsTable
          params={[
            { name: "business_id", type: "uuid", required: true, description: "Your active business ID." },
            { name: "amount", type: "string", required: true, description: "Amount to collect. Minimum 500 TZS." },
            { name: "category_code", type: "string", required: true, description: "Payment category code (see /payments/categories/)." },
            { name: "channel", type: "string", required: true, description: "MPESA, TIGOPESA, AIRTEL, HALOPESA, CARD, BANK." },
            { name: "payer_msisdn", type: "string", required: true, description: "Customer phone number in 255XXXXXXXXX format." },
          ]}
        />
        <ResponseExample
          status={201}
          label="Created"
          body={`{
  "status": "success",
  "code": 201,
  "data": {
    "id": "3f9c1a2e-...",
    "reference": "SP-20260125-9F3A1B2C",
    "status": "PROCESSING",
    "amount": "1000.00",
    "currency": "TZS",
    "channel": "MPESA",
    "checkout_url": "https://pay.lipasalama.co.tz/txn/..."
  }
}`}
        />
      </ApiEndpoint>

      <ApiEndpoint
        method="GET"
        path="/payments/transactions/{reference}/status/"
        description="Poll the live status of a payment directly from the mobile money provider."
      />

      <ApiEndpoint
        method="GET"
        path="/payments/transactions/summary/"
        description="Get aggregate income/expense totals for the authenticated business."
        className="mb-0"
      />
    </>
  )
}

function ApiTransactionsRefContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Retrieve transaction history, verify statuses, and manage your financial records.
      </p>
      <ApiEndpoint 
        method="GET" 
        path="/payments/transactions/" 
        description="List all transactions."
      >
        <ParamsTable 
          title="Query Parameters"
          params={[
            { name: "limit", type: "number", description: "Number of results to return (default 20)." },
            { name: "offset", type: "number", description: "Number of results to skip." },
            { name: "status", type: "string", description: "Filter by status: SUCCESS, FAILED, PENDING." },
          ]}
        />
      </ApiEndpoint>

      <ApiEndpoint 
        method="GET" 
        path="/payments/transactions/{reference}/" 
        description="Retrieve a single transaction by reference."
      />
    </>
  )
}

function ApiSessionsRefContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Sessions provide a hosted checkout page so you don't need to build your own payment form.
        SalamaPay handles the UI, method selection, and status polling — and returns a shareable
        payment link alongside the full checkout URL.
      </p>

      <ApiEndpoint
        method="POST"
        path="/sessions/"
        description="Create a checkout session. Supports an optional Idempotency-Key header."
      >
        <ParamsTable
          params={[
            { name: "amount", type: "number", description: "Amount in TZS. Required unless allow_custom_amount is true." },
            { name: "allowed_methods", type: "array", description: "['mobile_money'] — payment methods to show." },
            { name: "customer_name", type: "string", description: "Customer's full name." },
            { name: "customer_phone", type: "string", description: "Customer's phone number." },
            { name: "redirect_url", type: "string", description: "Where to send the customer after payment." },
            { name: "webhook_url", type: "string", description: "HTTPS URL to receive session status events." },
            { name: "expires_in", type: "number", description: "Seconds until the session expires (default 3600)." },
            { name: "metadata", type: "object", description: "Arbitrary key/value data returned on the webhook." },
          ]}
        />
        <ResponseExample
          status={201}
          label="Created"
          body={`{
  "status": "success",
  "code": 201,
  "data": {
    "reference": "sess_ab12cd34ef56",
    "short_code": "Ax7kM2",
    "status": "PENDING",
    "amount": "50000.00",
    "currency": "TZS",
    "checkout_url": "https://pay.lipasalama.co.tz/checkout/sess_ab12cd34ef56",
    "payment_link_url": "https://lipasalama.co.tz/p/Ax7kM2",
    "expires_at": "2026-02-26T11:00:00Z"
  }
}`}
        />
      </ApiEndpoint>

      <ApiEndpoint method="GET" path="/sessions/" description="List all checkout sessions." />
      <ApiEndpoint method="GET" path="/sessions/{reference}/" description="Retrieve a checkout session by reference." />
      <ApiEndpoint method="POST" path="/sessions/{reference}/cancel/" description="Cancel a pending session before it's paid." />

      <Callout type="tip" title="Custom amounts (donations, tips)">
        Set <code className="bg-muted px-1 rounded font-mono text-xs">allow_custom_amount: true</code> with
        <code className="bg-muted px-1 rounded font-mono text-xs">min_amount</code> / <code className="bg-muted px-1 rounded font-mono text-xs">max_amount</code> to let the customer choose the amount to pay.
      </Callout>
    </>
  )
}

function ApiDisbursementsRefContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        The Disbursements API sends money out to mobile money wallets or bank accounts. The total
        amount (payout + fee) is deducted from your business wallet immediately when the request succeeds.
      </p>

      <ApiEndpoint
        method="POST"
        path="/payments/payouts/send/"
        description="Create a payout. Supports an optional Idempotency-Key header. Minimum payout is 5,000 TZS."
      >
        <ParamsTable
          params={[
            { name: "business_id", type: "uuid", required: true, description: "Your active business ID." },
            { name: "amount", type: "string", required: true, description: "Amount to send. Minimum 5000 TZS." },
            { name: "channel", type: "string", required: true, description: "\"mobile\" or \"bank\"." },
            { name: "recipient_phone", type: "string", description: "Required when channel is \"mobile\"." },
            { name: "recipient_bank", type: "string", description: "Bank code, required when channel is \"bank\" (e.g. CRDB, NMB)." },
            { name: "recipient_account", type: "string", description: "Recipient account number, required for bank payouts." },
            { name: "recipient_name", type: "string", required: true, description: "Full name of the recipient." },
            { name: "narration", type: "string", description: "Payout description shown in statements." },
            { name: "webhook_url", type: "string", description: "HTTPS URL to receive payout status events." },
          ]}
        />
        <ResponseExample
          status={201}
          label="Created"
          body={`{
  "status": "success",
  "code": 201,
  "data": {
    "reference": "SP-PO-20260125-4F2A1B9C",
    "status": "PROCESSING",
    "amount": "5000.00",
    "channel": "MPESA",
    "recipient_name": "Recipient Name",
    "fees": { "currency": "TZS", "value": 500 },
    "total": { "currency": "TZS", "value": 5500 }
  }
}`}
        />
      </ApiEndpoint>

      <ApiEndpoint method="GET" path="/payments/payouts/" description="List all payouts." />
      <ApiEndpoint method="GET" path="/payments/payouts/{reference}/" description="Get payout status." />
      <ApiEndpoint
        method="GET"
        path="/payments/payouts/fee/?amount=5000"
        description="Calculate the fee for a payout before creating it."
      >
        <ResponseExample
          status={200}
          label="OK"
          body={`{
  "status": "success",
  "code": 200,
  "data": {
    "amount": 5000,
    "fee_amount": 500,
    "total_amount": 5500,
    "currency": "TZS"
  }
}`}
        />
      </ApiEndpoint>

      <Callout type="warning" title="Always check balance">
        If your business wallet balance is insufficient to cover the payout amount plus fees, the
        request fails with a <code className="bg-muted px-1 rounded font-mono text-xs">500 payment_failed</code> error and no funds are deducted.
      </Callout>
    </>
  )
}

function ApiWebhooksRefContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Webhooks deliver real-time notifications when events occur (payment completed, payout failed,
        etc). SalamaPay sends an HTTP POST to your configured webhook URL and signs every payload with
        HMAC-SHA256.
      </p>

      <ApiEndpoint 
        method="POST" 
        path="/developer/webhooks/" 
        description="Register a new webhook endpoint."
      >
        <ParamsTable 
          params={[
            { name: "url", type: "string", required: true, description: "The HTTPS URL on your server." },
            { name: "events", type: "array", required: true, description: "List of event types: ['payment.completed', 'payment.failed']." },
          ]} 
        />
      </ApiEndpoint>

      <ApiEndpoint method="GET" path="/developer/webhooks/" description="List your registered webhook endpoints." />
      <ApiEndpoint method="GET" path="/developer/webhooks/{id}/deliveries/" description="List delivery attempts for a webhook endpoint." />

      <h2 className="text-xl font-bold mt-12 mb-4">Event Types</h2>
      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="px-4 py-2 text-left font-medium">Event</th><th className="px-4 py-2 text-left font-medium">Description</th></tr></thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-mono text-xs">payment.completed</td><td className="px-4 py-2 text-muted-foreground">Payment was successfully processed</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">payment.failed</td><td className="px-4 py-2 text-muted-foreground">Payment failed (declined, timeout, etc.)</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">payment.expired</td><td className="px-4 py-2 text-muted-foreground">Payment expired before completion</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">payout.completed</td><td className="px-4 py-2 text-muted-foreground">Payout was successfully delivered</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">payout.failed</td><td className="px-4 py-2 text-muted-foreground">Payout failed to process</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">payout.reversed</td><td className="px-4 py-2 text-muted-foreground">Payout was reversed after completion</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mt-12 mb-4">Webhook Headers</h2>
      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="px-4 py-2 text-left font-medium">Header</th><th className="px-4 py-2 text-left font-medium">Description</th></tr></thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-mono text-xs">Content-Type</td><td className="px-4 py-2 text-muted-foreground">application/json</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">User-Agent</td><td className="px-4 py-2 text-muted-foreground">SalamaPay-Webhook/1.0</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">X-Webhook-Event</td><td className="px-4 py-2 text-muted-foreground">Event type (e.g. payment.completed)</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">X-Webhook-Timestamp</td><td className="px-4 py-2 text-muted-foreground">Unix timestamp of the event</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">X-Webhook-Signature</td><td className="px-4 py-2 text-muted-foreground">HMAC-SHA256 signature</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mt-12 mb-4">Payload Envelope</h2>
      <CodeBlock language="json" code={`{
  "id": "evt_a1b2c3d4e5f6g7h8",
  "type": "payment.completed",
  "api_version": "2026-01-25",
  "created_at": "2026-01-24T10:30:00Z",
  "data": {
    "reference": "3f9c1a2e-...",
    "external_reference": "SP-20260124-9F3A1B2C",
    "status": "success",
    "amount": { "value": 50000, "currency": "TZS" },
    "settlement": {
      "gross": { "value": 50000, "currency": "TZS" },
      "fees":  { "value": 1000,  "currency": "TZS" },
      "net":   { "value": 49000, "currency": "TZS" }
    },
    "channel": { "type": "mobile_money", "provider": "mpesa" },
    "metadata": { "order_id": "ORD-12345" },
    "completed_at": "2026-01-24T10:30:00Z"
  }
}`} />

      <h2 className="text-xl font-bold mt-12 mb-4">Signature Verification</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        SalamaPay signs every webhook with HMAC-SHA256 using your webhook endpoint's secret
        (returned once when you create the endpoint).
      </p>
      <CodeBlock language="text" code={`X-Webhook-Signature = hex(HMAC-SHA256(signing_key, "{timestamp}.{raw_body}"))`} />

      <CodeTabs examples={[
        { language: "javascript", label: "Node.js", code: `const crypto = require("crypto");

function verifyWebhook(rawBody, headers, signingKey) {
  const timestamp = headers["x-webhook-timestamp"];
  const signature = headers["x-webhook-signature"];

  // Reject stale events (replay attack protection)
  if (Math.floor(Date.now() / 1000) - parseInt(timestamp, 10) > 300) {
    throw new Error("Webhook timestamp too old");
  }

  const message = \`\${timestamp}.\${rawBody}\`;
  const expected = crypto.createHmac("sha256", signingKey).update(message).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Invalid webhook signature");
  }

  return JSON.parse(rawBody);
}` },
        { language: "python", label: "Python", code: `import hmac, hashlib, time

def verify_webhook(raw_body: bytes, headers: dict, signing_key: str) -> dict:
    timestamp = headers["X-Webhook-Timestamp"]
    signature = headers["X-Webhook-Signature"]

    if time.time() - int(timestamp) > 300:
        raise ValueError("Webhook timestamp too old")

    message = f"{timestamp}.{raw_body.decode()}"
    expected = hmac.new(signing_key.encode(), message.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise ValueError("Invalid webhook signature")

    import json
    return json.loads(raw_body)` },
        { language: "php", label: "PHP", code: `<?php
function verifyWebhook($rawBody, $headers, $signingKey) {
    $timestamp = $headers['X-Webhook-Timestamp'];
    $signature = $headers['X-Webhook-Signature'];

    if (time() - (int)$timestamp > 300) {
        throw new Exception('Webhook timestamp too old');
    }

    $message = "{$timestamp}.{$rawBody}";
    $expected = hash_hmac('sha256', $message, $signingKey);

    if (!hash_equals($expected, $signature)) {
        throw new Exception('Invalid webhook signature');
    }

    return json_decode($rawBody, true);
}` },
      ]} />

      <Callout type="danger" title="Use the raw request body">
        Compute the signature from the raw, unparsed request body. Parsing and re-serializing JSON
        can change key order or whitespace and will break signature verification.
      </Callout>

      <h2 className="text-xl font-bold mt-12 mb-4">Retry Schedule</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        If your endpoint returns a non-2xx response or times out, SalamaPay retries with exponential backoff:
      </p>
      <ul className="flex flex-col gap-2 list-disc pl-6 text-sm text-muted-foreground">
        <li><strong className="text-foreground">Attempt 1</strong> — immediate</li>
        <li><strong className="text-foreground">Attempt 2</strong> — after 3 minutes</li>
        <li><strong className="text-foreground">Attempt 3</strong> — after 6 minutes</li>
        <li><strong className="text-foreground">Attempt 4</strong> — after 12 minutes</li>
        <li><strong className="text-foreground">Attempt 5</strong> — after 24 minutes</li>
      </ul>
      <Callout type="info" title="Respond quickly" className="mt-4">
        Return a 2xx response within 30 seconds and process the event asynchronously to avoid unnecessary retries.
        After 5 failed attempts, the delivery is marked <code className="bg-muted px-1 rounded font-mono text-xs">FAILED</code>.
      </Callout>
    </>
  )
}

// ===== IDEMPOTENCY =====

function IdempotencyContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Always include an <code className="bg-muted px-1.5 rounded font-mono text-xs">Idempotency-Key</code> header
        on POST requests to prevent duplicate transactions on retry.
      </p>
      <CodeBlock language="text" code={`POST /payments/transactions/collect/
Idempotency-Key: order-12345-attempt-1`} />

      <h2 className="text-xl font-bold mt-12 mb-4">Rules</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6 text-sm text-muted-foreground">
        <li>Keys must be <strong className="text-foreground">30 characters or fewer</strong> — longer keys return a <code className="bg-muted px-1 rounded font-mono text-xs">500 PAY_001</code> error.</li>
        <li>Keys are valid for <strong className="text-foreground">24 hours</strong>.</li>
        <li>Same key + same request body → returns the cached response.</li>
        <li>Same key + different body → returns a <code className="bg-muted px-1 rounded font-mono text-xs">422</code> error.</li>
      </ul>

      <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
        Use idempotency keys on <code className="bg-muted px-1 rounded font-mono text-xs">POST /payments/transactions/collect/</code>, <code className="bg-muted px-1 rounded font-mono text-xs">POST /payments/payouts/send/</code>, and <code className="bg-muted px-1 rounded font-mono text-xs">POST /sessions/</code>.
      </p>
    </>
  )
}

// ===== SDKs & DEVELOPMENT =====

function SdkJavascriptContent() { 
  return (
    <Callout type="info" title="Node.js & Browser">
      JavaScript SDK is coming soon. Use <code className="bg-muted px-1 rounded">axios</code> or <code className="bg-muted px-1 rounded">fetch</code> with our REST API.
    </Callout>
  )
}
function SdkPythonContent() { return <p className="text-sm text-muted-foreground">Python SDK coming soon. Use the <code className="bg-muted px-1 rounded">requests</code> library.</p> }
function SdkPhpContent() { return <p className="text-sm text-muted-foreground">PHP library coming soon. Use <code className="bg-muted px-1 rounded">Guzzle</code> or <code className="bg-muted px-1 rounded">curl</code>.</p> }
function SdkFlutterContent() { return <p className="text-sm text-muted-foreground">Flutter SDK coming soon. Use the <code className="bg-muted px-1 rounded">http</code> package.</p> }

function ErrorHandlingContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Every SalamaPay API response follows the same envelope. Success responses use <code className="bg-muted px-1.5 rounded font-mono text-xs">status: "success"</code>, errors use <code className="bg-muted px-1.5 rounded font-mono text-xs">status: "error"</code>.
      </p>

      <h2 className="text-xl font-bold mt-12 mb-4">Response Format</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <ResponseExample status={200} label="Success" body={`{
  "status": "success",
  "code": 200,
  "data": { }
}`} />
        <ResponseExample status={400} label="Error" body={`{
  "status": "error",
  "code": 400,
  "error_code": "validation_error",
  "message": "amount is required"
}`} />
      </div>

      <h2 className="text-xl font-bold mt-12 mb-4">HTTP Status Codes</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6 text-sm text-muted-foreground">
        <li><strong className="text-foreground">200</strong> — OK</li>
        <li><strong className="text-foreground">201</strong> — Created</li>
        <li><strong className="text-foreground">400</strong> — Bad Request (validation errors, malformed JSON)</li>
        <li><strong className="text-foreground">401</strong> — Unauthorized (auth required or failed)</li>
        <li><strong className="text-foreground">403</strong> — Forbidden (authenticated but insufficient scope)</li>
        <li><strong className="text-foreground">404</strong> — Not Found</li>
        <li><strong className="text-foreground">409</strong> — Conflict</li>
        <li><strong className="text-foreground">422</strong> — Unprocessable Entity (idempotency key mismatch)</li>
        <li><strong className="text-foreground">429</strong> — Too Many Requests (rate limit)</li>
        <li><strong className="text-foreground">500</strong> — Internal Server Error</li>
      </ul>

      <h2 className="text-xl font-bold mt-12 mb-4">Error Codes</h2>
      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="px-4 py-2 text-left font-medium">Code</th><th className="px-4 py-2 text-left font-medium">Description</th></tr></thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-mono text-xs">unauthorized</td><td className="px-4 py-2 text-muted-foreground">Invalid or missing API key</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">insufficient_scope</td><td className="px-4 py-2 text-muted-foreground">API key lacks required permission</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">validation_error</td><td className="px-4 py-2 text-muted-foreground">One or more fields are invalid</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">not_found</td><td className="px-4 py-2 text-muted-foreground">Resource doesn't exist</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">conflict</td><td className="px-4 py-2 text-muted-foreground">Resource state conflict</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">payment_failed</td><td className="px-4 py-2 text-muted-foreground">Payment/payout processing error (e.g. insufficient balance)</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">rate_limit_exceeded</td><td className="px-4 py-2 text-muted-foreground">Too many requests in the rate limit window</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">PAY_001</td><td className="px-4 py-2 text-muted-foreground">Idempotency key too long, or provider temporarily unavailable</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

function RateLimitsContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        API requests are limited to <strong className="text-foreground">60 requests per minute</strong> per API key.
      </p>
      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="px-4 py-2 text-left font-medium">Header</th><th className="px-4 py-2 text-left font-medium">Description</th></tr></thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-mono text-xs">X-Ratelimit-Limit</td><td className="px-4 py-2 text-muted-foreground">Maximum requests per minute</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">X-Ratelimit-Remaining</td><td className="px-4 py-2 text-muted-foreground">Remaining requests in the current window</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">X-Ratelimit-Reset</td><td className="px-4 py-2 text-muted-foreground">Seconds until the limit resets</td></tr>
          </tbody>
        </table>
      </div>
      <Callout type="info" title="429 Too Many Requests">
        If you exceed the limit, implement exponential backoff before retrying. Contact SalamaPay support if you need a higher limit for production workloads.
      </Callout>
    </>
  )
}
