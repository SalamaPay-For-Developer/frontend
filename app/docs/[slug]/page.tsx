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
    "quickstart": QuickstartContent,
    "auth-overview": AuthOverviewContent,
    "api-keys": ApiKeysContent,
    "api-payments": ApiPaymentsRefContent,
    "api-transactions": ApiTransactionsRefContent,
    "api-webhooks": ApiWebhooksRefContent,
    "sdk-javascript": SdkJavascriptContent,
    "sdk-python": SdkPythonContent,
    "sdk-php": SdkPhpContent,
    "sdk-flutter": SdkFlutterContent,
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
        The Payments API is the core of SalamaPay. Use it to initiate collection requests from mobile money wallets, cards, and bank accounts.
      </p>

      <ApiEndpoint 
        method="POST" 
        path="/payments/transactions/collect/" 
        description="Initiate a payment collection."
      >
        <ParamsTable 
          params={[
            { name: "amount", type: "string", required: true, description: "Amount to collect. Format as a string (e.g., '1000.00')." },
            { name: "reference", type: "string", required: true, description: "Unique transaction reference from your system." },
            { name: "category_code", type: "string", required: true, description: "Category code for the payment." },
            { name: "channel", type: "string", required: true, description: "MPESA, TIGOPESA, AIRTEL, HALOPESA, CARD, BANK." },
            { name: "payer_msisdn", type: "string", required: true, description: "Customer phone number in 255XXXXXXXXX format." },
          ]} 
        />
        <ResponseExample 
          status={201} 
          label="Created" 
          body={`{
  "id": "txn_01J5K...",
  "status": "PENDING",
  "amount": "1000.00",
  "currency": "TZS",
  "channel": "MPESA",
  "checkout_url": "https://pay.lipasalama.co.tz/txn/..."
}`} 
        />
      </ApiEndpoint>
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

function ApiWebhooksRefContent() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Set up webhooks to receive real-time notifications about payment events directly on your server.
      </p>
      <ApiEndpoint 
        method="POST" 
        path="/developer/webhooks/" 
        description="Register a new webhook endpoint."
      >
        <ParamsTable 
          params={[
            { name: "url", type: "string", required: true, description: "The HTTPS URL on your server." },
            { name: "events", type: "array", required: true, description: "List of event types: ['payment.success', 'payment.failed']." },
          ]} 
        />
      </ApiEndpoint>
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
function ErrorHandlingContent() { return <p className="text-sm text-muted-foreground">Detailed error code mapping coming soon.</p> }
function RateLimitsContent() { return <p className="text-sm text-muted-foreground">Standard rate limiting applies. Contact support for high-volume needs.</p> }
