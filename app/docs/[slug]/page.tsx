import { DocPageWrapper } from "@/components/docs/doc-page-wrapper"
import { CodeBlock } from "@/components/docs/code-block"
import { CodeTabs } from "@/components/docs/code-tabs"
import { Callout } from "@/components/docs/callout"
import { ApiEndpoint, ParamsTable, ResponseExample } from "@/components/docs/api-endpoint"
import { getDocPage } from "@/lib/docs-config"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

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
    // ===== GETTING STARTED =====
    "introduction": IntroductionContent,
    "quickstart": QuickstartContent,
    "how-it-works": HowItWorksContent,
    "account-setup": AccountSetupContent,
    "business-verification": BusinessVerificationContent,
    "environments": EnvironmentsContent,
    "going-live": GoingLiveContent,

    // ===== AUTHENTICATION =====
    "auth-overview": AuthOverviewContent,
    "api-keys": ApiKeysContent,
    "request-signing": RequestSigningContent,
    "headers": HeadersContent,
    "idempotency": IdempotencyContent,
    "auth-security": AuthSecurityContent,

    // ===== PAYMENTS =====
    "payments-overview": PaymentsOverviewContent,
    "create-payment": CreatePaymentContent,
    "payment-status": PaymentStatusContent,
    "mobile-money": MobileMoneyContent,
    "cards": CardsContent,
    "bank-payments": BankPaymentsContent,
    "qr-payments": QrPaymentsContent,
    "payment-links": PaymentLinksContent,

    // ===== CHECKOUT =====
    "checkout-overview": CheckoutOverviewContent,
    "create-checkout": CreateCheckoutContent,
    "checkout-session": CheckoutSessionContent,
    "checkout-methods": CheckoutMethodsContent,
    "checkout-urls": CheckoutUrlsContent,
    "checkout-webhooks": CheckoutWebhooksContent,
    "checkout-status": CheckoutStatusContent,

    // ===== TRANSACTIONS =====
    "transactions-overview": TransactionsOverviewContent,
    "retrieve-transaction": RetrieveTransactionContent,
    "list-transactions": ListTransactionsContent,
    "refunds": RefundsContent,
    "reconciliation": ReconciliationContent,

    // ===== WEBHOOKS =====
    "webhooks-overview": WebhooksOverviewContent,
    "webhook-setup": WebhookSetupContent,
    "webhook-events": WebhookEventsContent,
    "webhook-signatures": WebhookSignaturesContent,
    "webhook-retries": WebhookRetriesContent,
    "webhook-security": WebhookSecurityContent,

    // ===== UTILITY PAYMENTS =====
    "utility-overview": UtilityOverviewContent,
    "utility-lookup": UtilityLookupContent,
    "utility-payment": UtilityPaymentContent,
    "utility-status": UtilityStatusContent,

    // ===== GOVERNMENT PAYMENTS =====
    "government-overview": GovernmentOverviewContent,
    "control-numbers": ControlNumbersContent,
    "government-lookup": GovernmentLookupContent,
    "government-payment": GovernmentPaymentContent,

    // ===== DEVELOPMENT =====
    "sandbox": SandboxContent,
    "test-credentials": TestCredentialsContent,
    "error-handling": ErrorHandlingContent,
    "rate-limits": RateLimitsContent,

    // ===== API REFERENCE =====
    "api-auth": ApiAuthRefContent,
    "api-payments": ApiPaymentsRefContent,
    "api-checkout": ApiCheckoutRefContent,
    "api-transactions": ApiTransactionsRefContent,
    "api-refunds": ApiRefundsRefContent,
    "api-webhooks": ApiWebhooksRefContent,
    "api-utilities": ApiUtilitiesRefContent,
    "api-government": ApiGovernmentRefContent,

    // ===== SDKs =====
    "sdk-javascript": SdkJavascriptContent,
    "sdk-python": SdkPythonContent,
    "sdk-php": SdkPhpContent,
    "sdk-flutter": SdkFlutterContent,

    // ===== PRODUCTION =====
    "production-checklist": ProductionChecklistContent,
    "security-checklist": SecurityChecklistContent,
    "monitoring": MonitoringContent,
    "troubleshooting": TroubleshootingContent,

    // ===== RESOURCES =====
    "fees": FeesContent,
    "changelog": ChangelogContent,
    "api-status": ApiStatusContent,
    "support": SupportContent,
    "faq": FaqContent,
  }

  return contents[slug] || PlaceholderContent
}

// ===== Placeholder for unmapped pages =====
function PlaceholderContent() {
  return (
    <Callout type="info" title="Documentation in progress">
      This page is being written. Check back soon for detailed documentation.
    </Callout>
  )
}

// ===== GETTING STARTED =====

function IntroductionContent() {
  return (
    <>
      <p>
        SalamaPay is a payment platform that enables businesses in Tanzania to accept payments,
        process utility bills, handle government payments, and manage transactions through a
        single, unified API.
      </p>

      <h2 className="text-xl font-semibold mt-8">What can you do with SalamaPay?</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><strong>Accept payments</strong> — Mobile money (M-Pesa, Tigo, Airtel, Halopesa), cards, bank transfers, and QR codes</li>
        <li><strong>Hosted checkout</strong> — Create checkout sessions that redirect customers to a SalamaPay-hosted payment page</li>
        <li><strong>Utility payments</strong> — Pay electricity, water, TV, internet, and telecom bills</li>
        <li><strong>Government payments</strong> — Pay government bills using GePG control numbers</li>
        <li><strong>Webhooks</strong> — Receive real-time notifications for payment events</li>
        <li><strong>Refunds</strong> — Process full and partial refunds</li>
        <li><strong>Developer tools</strong> — API keys, sandbox environment, logs, and test console</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Who is SalamaPay for?</h2>
      <p>
        SalamaPay is designed for developers building payment integrations for websites, mobile
        applications, e-commerce platforms, schools, hotels, restaurants, transport systems,
        government-related payment workflows, SaaS applications, and enterprise systems.
      </p>

      <h2 className="text-xl font-semibold mt-8">Architecture Overview</h2>
      <p>
        SalamaPay acts as an abstraction layer between your application and payment providers
        such as Selcom. You integrate with SalamaPay APIs, and SalamaPay handles the complexity
        of provider communication, transaction tracking, and settlement.
      </p>

      <CodeBlock language="text" title="Architecture" code={`Your Application
      ↓
SalamaPay API
      ↓
Payment Provider (Selcom)
      ↓
Mobile Money / Bank / Card`} />

      <Callout type="tip" title="Developer-first approach">
        You only need to integrate with SalamaPay APIs. You do not need to know internal
        provider implementation details unless explicitly documented.
      </Callout>

      <h2 className="text-xl font-semibold mt-8">Next Steps</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Read the <a href="/docs/quickstart" className="text-primary underline">Quickstart</a> to make your first API request</li>
        <li>Learn <a href="/docs/how-it-works" className="text-primary underline">How SalamaPay Works</a></li>
        <li>Set up <a href="/docs/auth-overview" className="text-primary underline">Authentication</a></li>
        <li>Explore the <a href="/docs/api-payments" className="text-primary underline">API Reference</a></li>
      </ul>
    </>
  )
}

function QuickstartContent() {
  return (
    <>
      <p>
        This guide will help you make your first SalamaPay API request in minutes. Follow
        these steps to get up and running.
      </p>

      <h2 className="text-xl font-semibold mt-8">Prerequisites</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>A SalamaPay account (sign up at salamapay.co.tz)</li>
        <li>A verified business (complete KYC)</li>
        <li>API credentials (public key, secret key, webhook secret)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Step 1: Create a SalamaPay Account</h2>
      <p>
        Sign up for a SalamaPay account at <code className="text-sm bg-muted px-1.5 py-0.5 rounded">salamapay.co.tz/auth/register</code>.
        You'll need a valid phone number to receive an OTP for verification.
      </p>

      <h2 className="text-xl font-semibold mt-8">Step 2: Verify Your Business</h2>
      <p>
        Complete the business verification (KYC) process by providing your business name, TIN,
        business license, and other required documents. See <a href="/docs/business-verification" className="text-primary underline">Business Verification</a> for details.
      </p>

      <h2 className="text-xl font-semibold mt-8">Step 3: Create API Credentials</h2>
      <p>
        Navigate to the Developer section in your SalamaPay dashboard and generate API keys.
        You'll receive:
      </p>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><strong>Public Key</strong> — Safe for frontend use (checkout)</li>
        <li><strong>Secret Key</strong> — Server-side only, never expose</li>
        <li><strong>Webhook Secret</strong> — For verifying webhook signatures</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Step 4: Choose Sandbox</h2>
      <p>
        Start in the sandbox environment to test your integration without processing real
        payments.
      </p>

      <CodeBlock language="env" title="Environment" code={`# Sandbox
SALAMAPAY_BASE_URL=https://sandbox-api.salamapay.co.tz
SALAMAPAY_PUBLIC_KEY=your_test_public_key
SALAMAPAY_SECRET_KEY=your_test_secret_key
SALAMAPAY_WEBHOOK_SECRET=your_test_webhook_secret`} />

      <h2 className="text-xl font-semibold mt-8">Step 5: Make Your First API Request</h2>
      <p>
        Create a payment request using the SalamaPay API:
      </p>

      <CodeTabs examples={[
        { language: "curl", label: "cURL", code: `curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: ORDER-10001" \\
  -d '{
    "amount": 50000,
    "currency": "TZS",
    "reference": "ORDER-10001",
    "description": "Test payment",
    "channel": "MOBILE_MONEY",
    "payer_msisdn": "255712345678"
  }'` },
        { language: "javascript", label: "JavaScript", code: `const response = await fetch(
  "https://sandbox-api.salamapay.co.tz/api/v1/payments/",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_SECRET_KEY",
      "Content-Type": "application/json",
      "Idempotency-Key": "ORDER-10001",
    },
    body: JSON.stringify({
      amount: 50000,
      currency: "TZS",
      reference: "ORDER-10001",
      description: "Test payment",
      channel: "MOBILE_MONEY",
      payer_msisdn: "255712345678",
    }),
  }
);

const data = await response.json();
console.log(data);` },
        { language: "python", label: "Python", code: `import requests

response = requests.post(
    "https://sandbox-api.salamapay.co.tz/api/v1/payments/",
    headers={
        "Authorization": "Bearer YOUR_SECRET_KEY",
        "Content-Type": "application/json",
        "Idempotency-Key": "ORDER-10001",
    },
    json={
        "amount": 50000,
        "currency": "TZS",
        "reference": "ORDER-10001",
        "description": "Test payment",
        "channel": "MOBILE_MONEY",
        "payer_msisdn": "255712345678",
    },
)

print(response.json())` },
        { language: "php", label: "PHP", code: `<?php
$ch = curl_init("https://sandbox-api.salamapay.co.tz/api/v1/payments/");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer YOUR_SECRET_KEY",
    "Content-Type: application/json",
    "Idempotency-Key: ORDER-10001",
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "amount" => 50000,
    "currency" => "TZS",
    "reference" => "ORDER-10001",
    "description" => "Test payment",
    "channel" => "MOBILE_MONEY",
    "payer_msisdn" => "255712345678",
]));

$response = curl_exec($ch);
echo $response;` },
        { language: "dart", label: "Dart", code: `import 'package:http/http.dart' as http;
import 'dart:convert';

final response = await http.post(
  Uri.parse('https://sandbox-api.salamapay.co.tz/api/v1/payments/'),
  headers: {
    'Authorization': 'Bearer YOUR_SECRET_KEY',
    'Content-Type': 'application/json',
    'Idempotency-Key': 'ORDER-10001',
  },
  body: jsonEncode({
    'amount': 50000,
    'currency': 'TZS',
    'reference': 'ORDER-10001',
    'description': 'Test payment',
    'channel': 'MOBILE_MONEY',
    'payer_msisdn': '255712345678',
  }),
);

print(jsonDecode(response.body));` },
      ]} />

      <h2 className="text-xl font-semibold mt-8">Expected Response</h2>
      <ResponseExample status={201} label="Created" body={`{
  "success": true,
  "data": {
    "id": "txn_01JXXXXXXXX",
    "reference": "ORDER-10001",
    "amount": "50000.00",
    "currency": "TZS",
    "status": "PENDING",
    "channel": "MOBILE_MONEY",
    "checkout_url": "https://sandbox-api.salamapay.co.tz/checkout/txn_01JXXXXXXXX",
    "created_at": "2026-08-09T10:20:30Z"
  }
}`} />

      <Callout type="success" title="You're ready!">
        You've made your first SalamaPay API request. Next, learn about <a href="/docs/webhooks-overview" className="underline">webhooks</a> to receive real-time payment notifications.
      </Callout>
    </>
  )
}

function HowItWorksContent() {
  return (
    <>
      <p>
        SalamaPay is a payment orchestration platform that sits between your application and
        payment providers. This guide explains the architecture and payment flow.
      </p>

      <h2 className="text-xl font-semibold mt-8">System Architecture</h2>
      <CodeBlock language="text" title="Architecture" code={`┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Your App       │     │  SalamaPay API   │     │ Payment Provider │
│                  │     │                  │     │ (Selcom)         │
│  - Website       │────▶│  - Auth          │────▶│  - Mobile Money  │
│  - Mobile App    │     │  - Payments      │     │  - Cards         │
│  - Backend       │◀────│  - Webhooks      │◀────│  - Bank          │
│                  │     │  - Settlements   │     │  - Utilities     │
└──────────────────┘     └──────────────────┘     └──────────────────┘`} />

      <h2 className="text-xl font-semibold mt-8">Payment Flow</h2>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li><strong>Customer initiates payment</strong> — Your application sends a payment request to SalamaPay</li>
        <li><strong>SalamaPay creates transaction</strong> — A transaction record is created with status <code className="text-sm bg-muted px-1.5 py-0.5 rounded">PENDING</code></li>
        <li><strong>Provider is contacted</strong> — SalamaPay sends the request to the payment provider (e.g., Selcom)</li>
        <li><strong>Customer completes payment</strong> — The customer approves the payment on their device (e.g., mobile money USSD prompt)</li>
        <li><strong>Provider confirms</strong> — The provider sends a callback to SalamaPay</li>
        <li><strong>SalamaPay updates status</strong> — Transaction status changes to <code className="text-sm bg-muted px-1.5 py-0.5 rounded">SUCCESS</code> or <code className="text-sm bg-muted px-1.5 py-0.5 rounded">FAILED</code></li>
        <li><strong>Webhook sent</strong> — SalamaPay sends a webhook to your application with the final status</li>
        <li><strong>You verify</strong> — Your application verifies the transaction via the API</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8">Key Concepts</h2>
      <h3 className="text-lg font-semibold mt-4">Transactions</h3>
      <p>
        Every payment creates a transaction. Each transaction has a unique ID, reference,
        amount, currency, channel, and status. You can retrieve transactions at any time
        via the API.
      </p>

      <h3 className="text-lg font-semibold mt-4">Channels</h3>
      <p>
        SalamaPay supports multiple payment channels:
      </p>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><code className="text-sm bg-muted px-1.5 py-0.5 rounded">MOBILE_MONEY</code> — M-Pesa, Tigo Pesa, Airtel Money, Halopesa</li>
        <li><code className="text-sm bg-muted px-1.5 py-0.5 rounded">CARD</code> — Visa, Mastercard</li>
        <li><code className="text-sm bg-muted px-1.5 py-0.5 rounded">BANK</code> — Bank transfers</li>
        <li><code className="text-sm bg-muted px-1.5 py-0.5 rounded">QR</code> — QR code payments</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4">Webhooks</h3>
      <p>
        Webhooks are HTTP callbacks sent to your server when events occur (e.g., payment
        success, payment failure). Always verify webhook signatures and never trust
        unverified payloads.
      </p>

      <h3 className="text-lg font-semibold mt-4">Idempotency</h3>
      <p>
        Idempotency keys prevent duplicate operations. If you retry a request (e.g., due to
        a network timeout), the same <code className="text-sm bg-muted px-1.5 py-0.5 rounded">Idempotency-Key</code> ensures
        SalamaPay does not create a duplicate payment.
      </p>

      <Callout type="info" title="Abstraction layer">
        You integrate only with SalamaPay APIs. SalamaPay handles provider communication,
        error handling, retries, and settlement. You do not need Selcom credentials or
        direct provider integration.
      </Callout>
    </>
  )
}

function AccountSetupContent() {
  return (
    <>
      <p>
        This guide walks you through creating a SalamaPay account and getting ready to
        integrate payments.
      </p>

      <h2 className="text-xl font-semibold mt-8">1. Register</h2>
      <p>
        Go to <code className="text-sm bg-muted px-1.5 py-0.5 rounded">salamapay.co.tz/auth/register</code> and sign up
        with your phone number. You'll receive an OTP via SMS for verification.
      </p>

      <h2 className="text-xl font-semibold mt-8">2. Verify Your Phone</h2>
      <p>
        Enter the OTP sent to your phone to complete registration. Your phone number is
        your primary identifier on SalamaPay.
      </p>

      <h2 className="text-xl font-semibold mt-8">3. Complete Your Profile</h2>
      <p>
        Add your full name and email address. This information is used for account
        recovery and notifications.
      </p>

      <h2 className="text-xl font-semibold mt-8">4. Create a Business</h2>
      <p>
        To start accepting payments, you need to create a business profile. Provide:
      </p>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Business name</li>
        <li>Business type (e.g., Restaurant, Retail, School, Hotel)</li>
        <li>TIN (Tax Identification Number)</li>
        <li>Business license number</li>
        <li>BRELA registration number (if applicable)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">5. Complete KYC</h2>
      <p>
        Submit required documents for business verification. See <a href="/docs/business-verification" className="text-primary underline">Business Verification</a> for the complete list.
      </p>

      <h2 className="text-xl font-semibold mt-8">6. Access Developer Tools</h2>
      <p>
        Once your business is verified, navigate to the Developer section to:
      </p>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Generate API keys</li>
        <li>Configure webhooks</li>
        <li>Access the sandbox</li>
        <li>View API logs</li>
        <li>Test in the API console</li>
      </ul>

      <Callout type="warning" title="Phone number is your identity">
        Your phone number is your account identifier. Ensure you have access to the phone
        number used during registration.
      </Callout>
    </>
  )
}

function BusinessVerificationContent() {
  return (
    <>
      <p>
        Business verification (KYC) is required to unlock all SalamaPay features, including
        accepting real payments and accessing production credentials.
      </p>

      <h2 className="text-xl font-semibold mt-8">Why Verification?</h2>
      <p>
        SalamaPay is a regulated payment platform. Business verification ensures:
      </p>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Compliance with Tanzanian financial regulations</li>
        <li>Protection against fraud and money laundering</li>
        <li>Trust between merchants and customers</li>
        <li>Access to higher transaction limits</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Required Documents</h2>
      <p>
        Required documents vary by business type. Common requirements include:
      </p>

      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Document</th>
              <th className="px-4 py-2 text-left font-medium">Required</th>
              <th className="px-4 py-2 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2">TIN Certificate</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2 text-muted-foreground">Tax Identification Number</td></tr>
            <tr><td className="px-4 py-2">Business License</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2 text-muted-foreground">Valid local government license</td></tr>
            <tr><td className="px-4 py-2">BRELA Registration</td><td className="px-4 py-2">For companies</td><td className="px-4 py-2 text-muted-foreground">Business Registration and Licensing Agency</td></tr>
            <tr><td className="px-4 py-2">National ID</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2 text-muted-foreground">Owner's NIDA ID</td></tr>
            <tr><td className="px-4 py-2">Bank Account Details</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2 text-muted-foreground">For settlements</td></tr>
            <tr><td className="px-4 py-2">Selfie Verification</td><td className="px-4 py-2">Some types</td><td className="px-4 py-2 text-muted-foreground">Owner identity verification</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-8">Verification Process</h2>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li><strong>Submit documents</strong> — Upload all required documents through the SalamaPay dashboard</li>
        <li><strong>Review</strong> — SalamaPay team reviews your submission (usually 1-2 business days)</li>
        <li><strong>Approval or rejection</strong> — You'll be notified via SMS and email</li>
        <li><strong>Re-submit if rejected</strong> — Address the rejection reason and re-submit</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8">KYC Statuses</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><strong>Draft</strong> — KYC not yet submitted</li>
        <li><strong>Pending</strong> — Submitted, awaiting review</li>
        <li><strong>Under Review</strong> — Being reviewed by the team</li>
        <li><strong>Approved</strong> — Verification complete, all features unlocked</li>
        <li><strong>Rejected</strong> — Verification failed, re-submit with corrections</li>
      </ul>

      <Callout type="tip" title="Speed up verification">
        Ensure all documents are clear, legible, and up-to-date. Incomplete submissions
        are the most common cause of delays.
      </Callout>
    </>
  )
}

function EnvironmentsContent() {
  return (
    <>
      <p>
        SalamaPay provides two environments: <strong>Sandbox</strong> for testing and
        <strong> Production</strong> for live payments.
      </p>

      <h2 className="text-xl font-semibold mt-8">Environment URLs</h2>
      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Environment</th>
              <th className="px-4 py-2 text-left font-medium">Base URL</th>
              <th className="px-4 py-2 text-left font-medium">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-medium">Sandbox</td>
              <td className="px-4 py-2 font-mono text-xs">https://sandbox-api.salamapay.co.tz</td>
              <td className="px-4 py-2 text-muted-foreground">Testing & development</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Production</td>
              <td className="px-4 py-2 font-mono text-xs">https://api.salamapay.co.tz</td>
              <td className="px-4 py-2 text-muted-foreground">Live payments</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warning" title="URL configuration">
        These URLs are examples. Confirm the actual base URLs from your SalamaPay dashboard
        or system settings before integration.
      </Callout>

      <h2 className="text-xl font-semibold mt-8">Sandbox Environment</h2>
      <p>
        The sandbox environment simulates real payment processing without moving actual
        money. Use it to:
      </p>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Test payment flows</li>
        <li>Test webhook delivery</li>
        <li>Test error scenarios</li>
        <li>Test refund flows</li>
        <li>Test utility and government payments</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Production Environment</h2>
      <p>
        Production processes real payments. You must complete the <a href="/docs/production-checklist" className="text-primary underline">Production Checklist</a> before requesting production access.
      </p>

      <h2 className="text-xl font-semibold mt-8">Environment Setup</h2>
      <CodeBlock language="env" title=".env" code={`# Sandbox
SALAMAPAY_BASE_URL=https://sandbox-api.salamapay.co.tz
SALAMAPAY_PUBLIC_KEY=your_test_public_key
SALAMAPAY_SECRET_KEY=your_test_secret_key
SALAMAPAY_WEBHOOK_SECRET=your_test_webhook_secret

# Production (when ready)
SALAMAPAY_BASE_URL=https://api.salamapay.co.tz
SALAMAPAY_PUBLIC_KEY=your_live_public_key
SALAMAPAY_SECRET_KEY=your_live_secret_key
SALAMAPAY_WEBHOOK_SECRET=your_live_webhook_secret`} />

      <Callout type="danger" title="Never use production credentials in testing">
        Always use sandbox credentials for development and testing. Production credentials
        should only be used in your live environment.
      </Callout>
    </>
  )
}

function GoingLiveContent() {
  return (
    <>
      <p>
        Ready to accept real payments? This guide walks you through moving from sandbox
        to production.
      </p>

      <h2 className="text-xl font-semibold mt-8">Prerequisites</h2>
      <p>Before going live, ensure you have completed:</p>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Business verification (KYC) approved</li>
        <li>All sandbox testing completed</li>
        <li>Webhook endpoint configured and tested</li>
        <li>Webhook signature verification implemented</li>
        <li>Idempotency implemented</li>
        <li>Error handling implemented</li>
        <li>Transaction reconciliation process defined</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Production Checklist</h2>
      <div className="rounded-lg border p-6 my-4 space-y-3">
        {[
          "Business verified (KYC approved)",
          "Production credentials created",
          "Webhook endpoint configured (HTTPS)",
          "Webhook signature verification implemented",
          "Idempotency-Key implemented for all POST requests",
          "Error handling for all API calls",
          "Transaction reconciliation implemented",
          "HTTPS enabled on all endpoints",
          "Secrets stored in environment variables (not in code)",
          "API logs configured",
          "Refund flow tested",
          "Production test transaction completed",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <span className="flex size-5 items-center justify-center rounded border-2 border-muted-foreground/30" />
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8">Steps to Go Live</h2>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li><strong>Request production access</strong> — Contact SalamaPay or request through the dashboard</li>
        <li><strong>Receive production credentials</strong> — New API keys for the production environment</li>
        <li><strong>Update environment variables</strong> — Replace sandbox URLs and keys with production values</li>
        <li><strong>Test with a small amount</strong> — Process a small real transaction to verify</li>
        <li><strong>Monitor</strong> — Watch API logs, webhooks, and transaction status closely</li>
      </ol>

      <Callout type="warning" title="Production access is not automatic">
        Production access requires SalamaPay approval. Ensure your integration is complete
        and tested before requesting access.
      </Callout>

      <h2 className="text-xl font-semibold mt-8">After Going Live</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Monitor transactions and webhooks daily</li>
        <li>Reconcile settlements regularly</li>
        <li>Handle failed payments promptly</li>
        <li>Keep credentials secure and rotate periodically</li>
        <li>Stay updated with the <a href="/docs/changelog" className="text-primary underline">Changelog</a></li>
      </ul>
    </>
  )
}

// ===== AUTHENTICATION =====

function AuthOverviewContent() {
  return (
    <>
      <p>
        SalamaPay uses API keys for authentication. All API requests must include an
        <code className="text-sm bg-muted px-1.5 py-0.5 rounded"> Authorization</code> header
        with your secret key.
      </p>

      <h2 className="text-xl font-semibold mt-8">Authentication Methods</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><strong>Bearer Token</strong> — Your secret API key sent in the Authorization header</li>
        <li><strong>Public Key</strong> — Used for client-side checkout (safe to expose)</li>
        <li><strong>Webhook Secret</strong> — Used to verify webhook signatures</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Example Request</h2>
      <CodeBlock language="curl" code={`curl -X GET "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json"`} />

      <Callout type="danger" title="Never expose your secret key">
        Your secret key should only be used on your server. Never embed it in frontend
        code, mobile apps, or public repositories.
      </Callout>

      <h2 className="text-xl font-semibold mt-8">Key Types</h2>
      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Key</th>
              <th className="px-4 py-2 text-left font-medium">Where to use</th>
              <th className="px-4 py-2 text-left font-medium">Example prefix</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-medium">Public Key</td><td className="px-4 py-2">Frontend (checkout)</td><td className="px-4 py-2 font-mono text-xs">sp_pub_</td></tr>
            <tr><td className="px-4 py-2 font-medium">Secret Key</td><td className="px-4 py-2">Backend only</td><td className="px-4 py-2 font-mono text-xs">sp_sec_</td></tr>
            <tr><td className="px-4 py-2 font-medium">Webhook Secret</td><td className="px-4 py-2">Webhook verification</td><td className="px-4 py-2 font-mono text-xs">sp_wh_</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

function ApiKeysContent() {
  return (
    <>
      <p>
        API keys are credentials that authenticate your requests to the SalamaPay API.
        You can generate and manage keys from the Developer section of your SalamaPay dashboard.
      </p>

      <h2 className="text-xl font-semibold mt-8">Generating API Keys</h2>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li>Log in to your SalamaPay dashboard</li>
        <li>Navigate to <strong>Developer → API Keys</strong></li>
        <li>Click <strong>Generate New Key</strong></li>
        <li>Select the key type (Public, Secret, or Webhook)</li>
        <li>Copy and store the key securely</li>
      </ol>

      <Callout type="warning" title="Keys are shown once">
        When you generate a new key, it is displayed only once. Store it immediately in a
        secure location. If you lose a key, you will need to rotate it.
      </Callout>

      <h2 className="text-xl font-semibold mt-8">Key Rotation</h2>
      <p>
        You can rotate (replace) any API key at any time. When you rotate:
      </p>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li>A new key is generated</li>
        <li>The old key is immediately deactivated</li>
        <li>Update your environment variables with the new key</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8">Deleting Keys</h2>
      <p>
        You can delete API keys that are no longer needed. Deleting a key immediately
        revokes access for any application using that key.
      </p>

      <h2 className="text-xl font-semibold mt-8">Environment Variables</h2>
      <CodeBlock language="env" title=".env" code={`SALAMAPAY_PUBLIC_KEY=sp_pub_xxxxxxxxxxxxxxxxxxxx
SALAMAPAY_SECRET_KEY=sp_sec_xxxxxxxxxxxxxxxxxxxx
SALAMAPAY_WEBHOOK_SECRET=sp_wh_xxxxxxxxxxxxxxxxxxxx`} />

      <Callout type="danger" title="Security">
        <ul className="flex flex-col gap-1 list-disc pl-4 mt-2">
          <li>Never commit API keys to Git</li>
          <li>Never hardcode keys in source code</li>
          <li>Use environment variables or a secrets manager</li>
          <li>Rotate keys if you suspect they've been compromised</li>
        </ul>
      </Callout>
    </>
  )
}

function RequestSigningContent() {
  return (
    <>
      <p>
        Request signing ensures that API requests are authentic and have not been tampered
        with. SalamaPay uses Bearer token authentication for API requests and HMAC
        signatures for webhooks.
      </p>

      <h2 className="text-xl font-semibold mt-8">API Request Authentication</h2>
      <p>
        For API requests, include your secret key as a Bearer token:
      </p>
      <CodeBlock language="text" title="Header" code={`Authorization: Bearer sp_sec_xxxxxxxxxxxxxxxxxxxx`} />

      <h2 className="text-xl font-semibold mt-8">Webhook Signature Verification</h2>
      <p>
        Webhooks are signed using HMAC-SHA256 with your webhook secret. See <a href="/docs/webhook-signatures" className="text-primary underline">Webhook Signatures</a> for details.
      </p>

      <CodeTabs examples={[
        { language: "javascript", label: "Node.js", code: `const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return expected === signature;
}` },
        { language: "python", label: "Python", code: `import hmac
import hashlib

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)` },
        { language: "php", label: "PHP", code: `<?php
function verifyWebhookSignature($payload, $signature, $secret) {
    $expected = hash_hmac('sha256', $payload, $secret);
    return hash_equals($expected, $signature);
}` },
      ]} />
    </>
  )
}

function HeadersContent() {
  return (
    <>
      <p>
        SalamaPay API requests require specific headers. This page documents all required
        and optional headers.
      </p>

      <h2 className="text-xl font-semibold mt-8">Required Headers</h2>
      <ParamsTable title="Required Headers" params={[
        { name: "Authorization", type: "string", required: true, description: "Bearer token with your secret API key" },
        { name: "Content-Type", type: "string", required: true, description: "Must be application/json for POST/PATCH requests" },
      ]} />

      <h2 className="text-xl font-semibold mt-8">Optional Headers</h2>
      <ParamsTable title="Optional Headers" params={[
        { name: "Idempotency-Key", type: "string", required: false, description: "Unique key to prevent duplicate operations (recommended for all POST requests)" },
        { name: "X-Request-ID", type: "string", required: false, description: "Custom request ID for tracing (auto-generated if not provided)" },
      ]} />

      <h2 className="text-xl font-semibold mt-8">Example</h2>
      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer sp_sec_xxxxx" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: ORDER-10001" \\
  -H "X-Request-ID: req_abc123"`} />
    </>
  )
}

function IdempotencyContent() {
  return (
    <>
      <p>
        Idempotency prevents duplicate operations when retrying requests. If a network
        timeout occurs and you retry a payment request, the same <code className="text-sm bg-muted px-1.5 py-0.5 rounded">Idempotency-Key</code> ensures
        SalamaPay returns the original response instead of creating a duplicate.
      </p>

      <h2 className="text-xl font-semibold mt-8">How It Works</h2>
      <CodeBlock language="text" title="Flow" code={`User clicks Pay
     ↓
Network timeout
     ↓
Application retries
     ↓
Same Idempotency-Key
     ↓
SalamaPay returns original transaction (no duplicate)`} />

      <h2 className="text-xl font-semibold mt-8">Usage</h2>
      <p>
        Include an <code className="text-sm bg-muted px-1.5 py-0.5 rounded">Idempotency-Key</code> header
        in any POST request that creates a resource:
      </p>

      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: ORDER-10001" \\
  -d '{
    "amount": 50000,
    "currency": "TZS",
    "reference": "ORDER-10001"
  }'`} />

      <h2 className="text-xl font-semibold mt-8">Best Practices</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Use a unique key per operation (e.g., your order ID or a UUID)</li>
        <li>Reuse the same key when retrying the same request</li>
        <li>Do not reuse keys across different operations</li>
        <li>Keys can be up to 255 characters</li>
      </ul>

      <Callout type="info" title="When to use idempotency">
        Use idempotency for all POST requests that create resources (payments, checkouts,
        refunds). GET, PATCH, and DELETE requests do not require idempotency keys.
      </Callout>
    </>
  )
}

function AuthSecurityContent() {
  return (
    <>
      <p>
        Security is critical when integrating payment APIs. Follow these best practices
        to keep your integration secure.
      </p>

      <h2 className="text-xl font-semibold mt-8">Never Expose Secret Keys</h2>
      <p>
        Your secret API key should only be used on your backend server. Never:
      </p>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Embed secret keys in frontend JavaScript</li>
        <li>Hardcode keys in mobile app source code</li>
        <li>Commit keys to Git repositories</li>
        <li>Log keys in application logs or error reports</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Correct Architecture</h2>
      <CodeBlock language="text" title="Correct Flow" code={`Frontend (Browser/App)
      ↓
Your Backend Server
      ↓
SalamaPay API (with secret key)`} />

      <CodeBlock language="text" title="Wrong Flow — Never do this" code={`Frontend (Browser/App)
      ↓
Secret API Key ← NEVER
      ↓
SalamaPay API`} />

      <h2 className="text-xl font-semibold mt-8">Use Environment Variables</h2>
      <CodeBlock language="env" title=".env" code={`SALAMAPAY_SECRET_KEY=sp_sec_xxxxxxxxxxxx
SALAMAPAY_WEBHOOK_SECRET=sp_wh_xxxxxxxxxxxx`} />

      <h2 className="text-xl font-semibold mt-8">Additional Security Measures</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><strong>Use HTTPS</strong> — All API calls and webhook endpoints must use HTTPS</li>
        <li><strong>Verify webhook signatures</strong> — Never process unverified webhooks</li>
        <li><strong>Implement idempotency</strong> — Prevent duplicate operations</li>
        <li><strong>Rotate credentials</strong> — Periodically rotate API keys</li>
        <li><strong>Restrict API access</strong> — Use IP allowlists if available</li>
        <li><strong>Log security events</strong> — Track authentication failures and suspicious activity</li>
        <li><strong>Protect customer data</strong> — Never log sensitive payment information</li>
        <li><strong>Avoid logging sensitive info</strong> — Mask phone numbers, card numbers, and tokens in logs</li>
      </ul>

      <Callout type="danger" title="If your key is compromised">
        Immediately rotate the compromised key from your SalamaPay dashboard. Review your
        logs for unauthorized transactions and contact SalamaPay support.
      </Callout>
    </>
  )
}

// ===== PAYMENTS =====

function PaymentsOverviewContent() {
  return (
    <>
      <p>
        The Payments API allows you to accept payments from customers via mobile money,
        cards, bank transfers, and QR codes.
      </p>

      <h2 className="text-xl font-semibold mt-8">Supported Channels</h2>
      <div className="grid gap-4 sm:grid-cols-2 my-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-sm">Mobile Money</h3>
          <p className="text-sm text-muted-foreground mt-1">M-Pesa, Tigo Pesa, Airtel Money, Halopesa</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-sm">Cards</h3>
          <p className="text-sm text-muted-foreground mt-1">Visa, Mastercard</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-sm">Bank Payments</h3>
          <p className="text-sm text-muted-foreground mt-1">Bank transfers and direct deposits</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-sm">QR Payments</h3>
          <p className="text-sm text-muted-foreground mt-1">QR code-based payments</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8">Payment Flow</h2>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li>Create a payment via <strong>POST /api/v1/payments/</strong></li>
        <li>SalamaPay contacts the payment provider</li>
        <li>Customer receives a payment prompt (e.g., USSD for mobile money)</li>
        <li>Customer approves the payment</li>
        <li>SalamaPay receives confirmation from the provider</li>
        <li>Transaction status updates to <code className="text-sm bg-muted px-1.5 py-0.5 rounded">SUCCESS</code> or <code className="text-sm bg-muted px-1.5 py-0.5 rounded">FAILED</code></li>
        <li>Webhook is sent to your application</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8">Next Steps</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><a href="/docs/create-payment" className="text-primary underline">Create a Payment</a></li>
        <li><a href="/docs/payment-status" className="text-primary underline">Payment Status Lifecycle</a></li>
        <li><a href="/docs/mobile-money" className="text-primary underline">Mobile Money Payments</a></li>
      </ul>
    </>
  )
}

function CreatePaymentContent() {
  return (
    <>
      <p>
        Create a payment request by sending a POST request to the payments endpoint.
      </p>

      <ApiEndpoint method="POST" path="/api/v1/payments/" description="Create a new payment request.">
        <ParamsTable params={[
          { name: "amount", type: "number", required: true, description: "Payment amount (e.g., 50000 for TZS 50,000)" },
          { name: "currency", type: "string", required: true, description: "Currency code (currently TZS)" },
          { name: "reference", type: "string", required: true, description: "Your unique order/reference number" },
          { name: "description", type: "string", required: false, description: "Payment description shown to customer" },
          { name: "channel", type: "string", required: true, description: "Payment channel: MOBILE_MONEY, CARD, BANK, QR" },
          { name: "payer_msisdn", type: "string", required: false, description: "Customer phone number (required for MOBILE_MONEY). Format: 255XXXXXXXXX" },
          { name: "payer_name", type: "string", required: false, description: "Customer name" },
          { name: "payer_email", type: "string", required: false, description: "Customer email" },
          { name: "metadata", type: "object", required: false, description: "Custom metadata to attach to the transaction" },
        ]} />
      </ApiEndpoint>

      <h2 className="text-xl font-semibold mt-8">Example Request</h2>
      <CodeTabs examples={[
        { language: "curl", label: "cURL", code: `curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: ORDER-10001" \\
  -d '{
    "amount": 50000,
    "currency": "TZS",
    "reference": "ORDER-10001",
    "description": "Payment for order #10001",
    "channel": "MOBILE_MONEY",
    "payer_msisdn": "255712345678"
  }'` },
        { language: "javascript", label: "JavaScript", code: `const response = await fetch(
  "https://sandbox-api.salamapay.co.tz/api/v1/payments/",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_SECRET_KEY",
      "Content-Type": "application/json",
      "Idempotency-Key": "ORDER-10001",
    },
    body: JSON.stringify({
      amount: 50000,
      currency: "TZS",
      reference: "ORDER-10001",
      description: "Payment for order #10001",
      channel: "MOBILE_MONEY",
      payer_msisdn: "255712345678",
    }),
  }
);
const data = await response.json();` },
        { language: "python", label: "Python", code: `import requests

response = requests.post(
    "https://sandbox-api.salamapay.co.tz/api/v1/payments/",
    headers={
        "Authorization": "Bearer YOUR_SECRET_KEY",
        "Content-Type": "application/json",
        "Idempotency-Key": "ORDER-10001",
    },
    json={
        "amount": 50000,
        "currency": "TZS",
        "reference": "ORDER-10001",
        "description": "Payment for order #10001",
        "channel": "MOBILE_MONEY",
        "payer_msisdn": "255712345678",
    },
)
data = response.json()` },
      ]} />

      <h2 className="text-xl font-semibold mt-8">Response</h2>
      <ResponseExample status={201} label="Created" body={`{
  "success": true,
  "data": {
    "id": "txn_01JXXXXXXXX",
    "reference": "ORDER-10001",
    "amount": "50000.00",
    "currency": "TZS",
    "status": "PENDING",
    "channel": "MOBILE_MONEY",
    "checkout_url": "https://sandbox-api.salamapay.co.tz/checkout/txn_01JXXXXXXXX",
    "created_at": "2026-08-09T10:20:30Z"
  }
}`} />

      <Callout type="info" title="Customer prompt">
        For mobile money payments, the customer will receive a USSD prompt on their phone
        to approve the payment. The transaction remains in PENDING status until the
        customer approves or it expires.
      </Callout>
    </>
  )
}

function PaymentStatusContent() {
  return (
    <>
      <p>
        Every transaction goes through a lifecycle of statuses. Understanding these
        statuses is essential for handling payments correctly.
      </p>

      <h2 className="text-xl font-semibold mt-8">Transaction Lifecycle</h2>
      <CodeBlock language="text" title="Success Flow" code={`created
   ↓
pending
   ↓
processing
   ↓
successful`} />

      <CodeBlock language="text" title="Failure Flow" code={`pending
   ↓
failed`} />

      <h2 className="text-xl font-semibold mt-8">All Statuses</h2>
      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-mono">PENDING</td><td className="px-4 py-2 text-muted-foreground">Payment created, awaiting customer action</td></tr>
            <tr><td className="px-4 py-2 font-mono">PROCESSING</td><td className="px-4 py-2 text-muted-foreground">Payment is being processed by the provider</td></tr>
            <tr><td className="px-4 py-2 font-mono">SUCCESS</td><td className="px-4 py-2 text-muted-foreground">Payment completed successfully</td></tr>
            <tr><td className="px-4 py-2 font-mono">FAILED</td><td className="px-4 py-2 text-muted-foreground">Payment failed (see failure_reason)</td></tr>
            <tr><td className="px-4 py-2 font-mono">REVERSED</td><td className="px-4 py-2 text-muted-foreground">Payment was reversed after success</td></tr>
            <tr><td className="px-4 py-2 font-mono">REFUNDED</td><td className="px-4 py-2 text-muted-foreground">Payment was refunded to the customer</td></tr>
            <tr><td className="px-4 py-2 font-mono">CANCELLED</td><td className="px-4 py-2 text-muted-foreground">Payment was cancelled before completion</td></tr>
            <tr><td className="px-4 py-2 font-mono">EXPIRED</td><td className="px-4 py-2 text-muted-foreground">Payment expired before customer action</td></tr>
          </tbody>
        </table>
      </div>

      <Callout type="tip" title="Always verify via API">
        Never assume a payment is successful based on the initial response alone. Always
        verify the final status via the API or webhook before fulfilling the order.
      </Callout>
    </>
  )
}

function MobileMoneyContent() {
  return (
    <>
      <p>
        Mobile money is the most popular payment method in Tanzania. SalamaPay supports
        M-Pesa, Tigo Pesa, Airtel Money, and Halopesa.
      </p>

      <h2 className="text-xl font-semibold mt-8">How Mobile Money Works</h2>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li>You create a payment with <code className="text-sm bg-muted px-1.5 py-0.5 rounded">channel: "MOBILE_MONEY"</code></li>
        <li>SalamaPay sends a USSD push to the customer's phone</li>
        <li>Customer enters their PIN to approve the payment</li>
        <li>Provider confirms the payment to SalamaPay</li>
        <li>SalamaPay updates the transaction status and sends a webhook</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8">Creating a Mobile Money Payment</h2>
      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "TZS",
    "reference": "ORDER-20001",
    "channel": "MOBILE_MONEY",
    "payer_msisdn": "255712345678",
    "description": "Mobile money payment"
  }'`} />

      <h2 className="text-xl font-semibold mt-8">Supported Providers</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><strong>Vodacom M-Pesa</strong> — 2557X, 2558X, 2559X numbers</li>
        <li><strong>Tigo Pesa</strong> — Tigo network numbers</li>
        <li><strong>Airtel Money</strong> — Airtel network numbers</li>
        <li><strong>Halopesa</strong> — Halotel network numbers</li>
      </ul>

      <Callout type="info" title="Phone number format">
        Always use the international format without the + sign (e.g., <code className="text-sm bg-muted px-1.5 py-0.5 rounded">255712345678</code>).
      </Callout>
    </>
  )
}

function CardsContent() {
  return (
    <>
      <p>
        SalamaPay supports card payments (Visa and Mastercard) through the hosted checkout
        flow.
      </p>
      <h2 className="text-xl font-semibold mt-8">Card Payment Flow</h2>
      <p>
        Card payments are processed through SalamaPay's hosted checkout. The customer is
        redirected to a secure payment page where they enter their card details.
      </p>
      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100000,
    "currency": "TZS",
    "reference": "ORDER-30001",
    "channel": "CARD",
    "description": "Card payment"
  }'`} />
      <Callout type="warning" title="PCI Compliance">
        SalamaPay handles card data securely through the hosted checkout. Never collect
        or store card numbers on your server.
      </Callout>
    </>
  )
}

function BankPaymentsContent() {
  return (
    <>
      <p>
        Bank payments allow customers to pay via bank transfer. SalamaPay generates a
        virtual account or reference for the customer to use.
      </p>
      <h2 className="text-xl font-semibold mt-8">Creating a Bank Payment</h2>
      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 500000,
    "currency": "TZS",
    "reference": "ORDER-40001",
    "channel": "BANK",
    "description": "Bank transfer payment"
  }'`} />
    </>
  )
}

function QrPaymentsContent() {
  return (
    <>
      <p>
        QR payments allow customers to scan a QR code with their mobile money app to
        complete a payment.
      </p>
      <h2 className="text-xl font-semibold mt-8">Creating a QR Payment</h2>
      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 15000,
    "currency": "TZS",
    "reference": "ORDER-50001",
    "channel": "QR",
    "description": "QR payment"
  }'`} />
    </>
  )
}

function PaymentLinksContent() {
  return (
    <>
      <p>
        Payment links are shareable URLs that allow customers to pay without integrating
        the API directly. Generate a link and share it via SMS, email, or social media.
      </p>
      <h2 className="text-xl font-semibold mt-8">Creating a Payment Link</h2>
      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/payments/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 30000,
    "currency": "TZS",
    "reference": "ORDER-60001",
    "channel": "MOBILE_MONEY",
    "description": "Payment link for invoice #60001"
  }'`} />
      <p>
        The response includes a <code className="text-sm bg-muted px-1.5 py-0.5 rounded">checkout_url</code> that
        you can share with the customer.
      </p>
    </>
  )
}

// ===== CHECKOUT =====

function CheckoutOverviewContent() {
  return (
    <>
      <p>
        SalamaPay Checkout is a hosted payment page that handles the payment UI for you.
        Create a checkout session, redirect your customer, and receive a webhook when
        payment is complete.
      </p>
      <h2 className="text-xl font-semibold mt-8">How Checkout Works</h2>
      <CodeBlock language="text" title="Flow" code={`Customer clicks Pay
      ↓
Your server creates checkout session
      ↓
Redirect to SalamaPay checkout page
      ↓
Customer selects payment method & pays
      ↓
Redirect back to your success/cancel URL
      ↓
Webhook sent to your server`} />
      <h2 className="text-xl font-semibold mt-8">Benefits</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>No need to build payment UI</li>
        <li>Supports all payment methods</li>
        <li>Mobile-responsive design</li>
        <li>Secure — card data never touches your server</li>
        <li>Customizable appearance</li>
      </ul>
    </>
  )
}

function CreateCheckoutContent() {
  return (
    <>
      <p>
        Create a checkout session by sending a POST request with the payment details and
        configuration.
      </p>
      <ApiEndpoint method="POST" path="/api/v1/developer/checkout/" description="Create a hosted checkout session.">
        <ParamsTable params={[
          { name: "amount", type: "number", required: true, description: "Payment amount" },
          { name: "currency", type: "string", required: true, description: "Currency code (TZS)" },
          { name: "reference", type: "string", required: true, description: "Your unique order reference" },
          { name: "description", type: "string", required: false, description: "Payment description" },
          { name: "customer_name", type: "string", required: false, description: "Customer name" },
          { name: "customer_email", type: "string", required: false, description: "Customer email" },
          { name: "customer_phone", type: "string", required: false, description: "Customer phone" },
          { name: "success_url", type: "string", required: false, description: "URL to redirect after successful payment" },
          { name: "cancel_url", type: "string", required: false, description: "URL to redirect if payment is cancelled" },
          { name: "payment_methods", type: "array", required: false, description: "List of allowed payment methods" },
        ]} />
      </ApiEndpoint>
      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/developer/checkout/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50000,
    "currency": "TZS",
    "reference": "ORDER-10001",
    "description": "Checkout for order #10001",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "success_url": "https://yoursite.com/success",
    "cancel_url": "https://yoursite.com/cancel"
  }'`} />
      <ResponseExample status={201} label="Created" body={`{
  "success": true,
  "data": {
    "id": "co_01JXXXXXXXX",
    "checkout_url": "https://sandbox-api.salamapay.co.tz/checkout/co_01JXXXXXXXX",
    "reference": "ORDER-10001",
    "amount": "50000.00",
    "currency": "TZS",
    "status": "OPEN",
    "expires_at": "2026-08-09T11:20:30Z"
  }
}`} />
    </>
  )
}

function CheckoutSessionContent() { return <><p>A checkout session represents a pending payment that a customer can complete at the hosted checkout page.</p><p>Each session has a unique ID and a <code className="text-sm bg-muted px-1.5 py-0.5 rounded">checkout_url</code>. Sessions expire after a configurable timeout (default: 1 hour).</p></> }
function CheckoutMethodsContent() { return <><p>You can restrict which payment methods are available in a checkout session by passing the <code className="text-sm bg-muted px-1.5 py-0.5 rounded">payment_methods</code> parameter.</p><CodeBlock language="json" code={`"payment_methods": ["MOBILE_MONEY", "CARD"]`} /></> }
function CheckoutUrlsContent() { return <><p>Configure where customers are redirected after payment.</p><ul className="flex flex-col gap-2 list-disc pl-6"><li><strong>success_url</strong> — Customer is redirected here after successful payment</li><li><strong>cancel_url</strong> — Customer is redirected here if they cancel</li></ul><Callout type="warning" title="Always verify via webhook">Never rely on the success_url redirect alone. Always verify payment status via webhook or API before fulfilling the order.</Callout></> }
function CheckoutWebhooksContent() { return <><p>Checkout sessions send webhook events when payment is completed. See the <a href="/docs/webhooks-overview" className="text-primary underline">Webhooks</a> section for details.</p><p>Key events for checkout:</p><ul className="flex flex-col gap-2 list-disc pl-6"><li><code className="text-sm bg-muted px-1.5 py-0.5 rounded">checkout.completed</code> — Payment completed successfully</li><li><code className="text-sm bg-muted px-1.5 py-0.5 rounded">checkout.expired</code> — Checkout session expired</li><li><code className="text-sm bg-muted px-1.5 py-0.5 rounded">payment.failed</code> — Payment failed during checkout</li></ul></> }
function CheckoutStatusContent() { return <><p>Check the status of a checkout session at any time:</p><CodeBlock language="curl" code={`curl -X GET "https://sandbox-api.salamapay.co.tz/api/v1/developer/checkout/co_01JXXXXXXXX/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY"`} /><ResponseExample status={200} label="OK" body={`{
  "success": true,
  "data": {
    "id": "co_01JXXXXXXXX",
    "status": "COMPLETED",
    "reference": "ORDER-10001",
    "amount": "50000.00",
    "currency": "TZS",
    "transaction_id": "txn_01JXXXXXXXX"
  }
}`} /></> }

// ===== TRANSACTIONS =====

function TransactionsOverviewContent() {
  return (
    <>
      <p>The Transactions API allows you to retrieve, list, and manage all transactions.</p>
      <h2 className="text-xl font-semibold mt-8">Transaction Object</h2>
      <ResponseExample status={200} label="Example Transaction" body={`{
  "id": "txn_01JXXXXXXXX",
  "reference": "ORDER-10001",
  "amount": "50000.00",
  "currency": "TZS",
  "status": "SUCCESS",
  "channel": "MOBILE_MONEY",
  "channel_display": "Mobile Money",
  "selcom_transid": "SELCOM-XXXXX",
  "payer_msisdn": "255712345678",
  "failure_reason": null,
  "created_at": "2026-08-09T10:20:30Z",
  "completed_at": "2026-08-09T10:21:15Z"
}`} />
    </>
  )
}

function RetrieveTransactionContent() {
  return (
    <>
      <p>Retrieve a single transaction by its ID.</p>
      <ApiEndpoint method="GET" path="/api/v1/payments/{id}/" description="Retrieve a transaction by ID.">
        <ParamsTable params={[
          { name: "id", type: "string", required: true, description: "Transaction ID (e.g., txn_01JXXXXXXXX)" },
        ]} />
      </ApiEndpoint>
      <CodeBlock language="curl" code={`curl -X GET "https://sandbox-api.salamapay.co.tz/api/v1/payments/txn_01JXXXXXXXX/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY"`} />
      <ResponseExample status={200} label="OK" body={`{
  "success": true,
  "data": {
    "id": "txn_01JXXXXXXXX",
    "reference": "ORDER-10001",
    "amount": "50000.00",
    "currency": "TZS",
    "status": "SUCCESS",
    "channel": "MOBILE_MONEY"
  }
}`} />
    </>
  )
}

function ListTransactionsContent() {
  return (
    <>
      <p>List all transactions with optional filters.</p>
      <ApiEndpoint method="GET" path="/api/v1/payments/" description="List transactions with filtering and pagination.">
        <ParamsTable params={[
          { name: "status", type: "string", required: false, description: "Filter by status (PENDING, SUCCESS, FAILED)" },
          { name: "channel", type: "string", required: false, description: "Filter by channel (MOBILE_MONEY, CARD, etc.)" },
          { name: "search", type: "string", required: false, description: "Search by reference or transaction ID" },
        ]} />
      </ApiEndpoint>
      <CodeBlock language="curl" code={`curl -X GET "https://sandbox-api.salamapay.co.tz/api/v1/payments/?status=SUCCESS" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY"`} />
    </>
  )
}

function RefundsContent() {
  return (
    <>
      <p>Process refunds for successful transactions.</p>
      <h2 className="text-xl font-semibold mt-8">Create a Refund</h2>
      <ApiEndpoint method="POST" path="/api/v1/admin-panel/refunds/" description="Request a refund for a transaction.">
        <ParamsTable params={[
          { name: "transaction", type: "string", required: true, description: "Transaction ID to refund" },
          { name: "amount", type: "number", required: true, description: "Refund amount (can be partial)" },
          { name: "reason", type: "string", required: true, description: "Reason for the refund" },
        ]} />
      </ApiEndpoint>
      <CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/admin-panel/refunds/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "transaction": "txn_01JXXXXXXXX",
    "amount": 50000,
    "reason": "Customer request"
  }'`} />
      <h2 className="text-xl font-semibold mt-8">Refund Statuses</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li><strong>REQUESTED</strong> — Refund requested, awaiting approval</li>
        <li><strong>APPROVED</strong> — Refund approved, processing</li>
        <li><strong>COMPLETED</strong> — Refund completed</li>
        <li><strong>REJECTED</strong> — Refund request rejected</li>
      </ul>
    </>
  )
}

function ReconciliationContent() {
  return (
    <>
      <p>Reconciliation is the process of matching your internal records with SalamaPay transaction data.</p>
      <h2 className="text-xl font-semibold mt-8">Best Practices</h2>
      <ul className="flex flex-col gap-2 list-disc pl-6">
        <li>Reconcile daily by comparing your order records with SalamaPay transactions</li>
        <li>Use the List Transactions API to export transaction data</li>
        <li>Match by reference number</li>
        <li>Investigate any discrepancies immediately</li>
        <li>Keep audit logs of reconciliation runs</li>
      </ul>
    </>
  )
}

// ===== WEBHOOKS =====

function WebhooksOverviewContent() {
  return (
    <>
      <p>Webhooks are HTTP callbacks sent to your server when events occur in SalamaPay. They allow you to receive real-time notifications about payment status changes.</p>
      <h2 className="text-xl font-semibold mt-8">Why Use Webhooks?</h2>
      <p>Some payment methods (like mobile money) are asynchronous. The initial API response only tells you the payment was created — not whether it succeeded. Webhooks notify you when the payment is actually completed.</p>
      <h2 className="text-xl font-semibold mt-8">Example Webhook</h2>
      <ResponseExample status={200} label="Webhook Payload" body={`{
  "event": "payment.success",
  "id": "evt_01JXXXXXXXX",
  "created_at": "2026-08-09T10:21:15Z",
  "data": {
    "transaction_id": "txn_01JXXXXXXXX",
    "reference": "ORDER-10001",
    "amount": "50000.00",
    "currency": "TZS",
    "status": "SUCCESS",
    "channel": "MOBILE_MONEY"
  }
}`} />
      <Callout type="danger" title="Always verify signatures">Never process webhook payloads without verifying the signature. See <a href="/docs/webhook-signatures" className="underline">Signature Verification</a>.</Callout>
    </>
  )
}

function WebhookSetupContent() {
  return (
    <>
      <p>Configure webhook endpoints from your SalamaPay dashboard.</p>
      <h2 className="text-xl font-semibold mt-8">Steps</h2>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li>Navigate to <strong>Developer → Webhooks</strong></li>
        <li>Click <strong>Add Endpoint</strong></li>
        <li>Enter your webhook URL (must be HTTPS)</li>
        <li>Select the events you want to receive</li>
        <li>Save and note your webhook secret</li>
      </ol>
      <Callout type="warning" title="HTTPS required">Webhook endpoints must use HTTPS. HTTP endpoints will be rejected.</Callout>
    </>
  )
}

function WebhookEventsContent() {
  return (
    <>
      <p>SalamaPay sends the following webhook events:</p>
      <div className="rounded-lg border overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="px-4 py-2 text-left font-medium">Event</th><th className="px-4 py-2 text-left font-medium">Description</th></tr></thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-mono text-xs">payment.success</td><td className="px-4 py-2 text-muted-foreground">Payment completed successfully</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">payment.failed</td><td className="px-4 py-2 text-muted-foreground">Payment failed</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">payment.pending</td><td className="px-4 py-2 text-muted-foreground">Payment is pending customer action</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">checkout.completed</td><td className="px-4 py-2 text-muted-foreground">Checkout session completed</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">checkout.expired</td><td className="px-4 py-2 text-muted-foreground">Checkout session expired</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">refund.completed</td><td className="px-4 py-2 text-muted-foreground">Refund processed</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

function WebhookSignaturesContent() {
  return (
    <>
      <p>Every webhook includes a signature header that you must verify before processing the payload.</p>
      <h2 className="text-xl font-semibold mt-8">Verification Process</h2>
      <ol className="flex flex-col gap-3 list-decimal pl-6">
        <li>Get the raw request body (before JSON parsing)</li>
        <li>Get the signature from the <code className="text-sm bg-muted px-1.5 py-0.5 rounded">X-SalamaPay-Signature</code> header</li>
        <li>Compute HMAC-SHA256 of the raw body using your webhook secret</li>
        <li>Compare the computed signature with the received signature</li>
        <li>If they match, process the webhook; otherwise, reject it</li>
      </ol>
      <CodeTabs examples={[
        { language: "javascript", label: "Node.js", code: `const crypto = require('crypto');

function verifySignature(rawBody, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  
  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}` },
        { language: "python", label: "Python", code: `import hmac
import hashlib

def verify_signature(raw_body: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        raw_body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)` },
        { language: "php", label: "PHP", code: `<?php
function verifySignature($rawBody, $signature, $secret) {
    $expected = hash_hmac('sha256', $rawBody, $secret);
    return hash_equals($expected, $signature);
}` },
      ]} />
      <Callout type="danger" title="Use raw body">Compute the signature from the raw request body, not the parsed JSON. Parsing and re-serializing may change the byte order.</Callout>
    </>
  )
}

function WebhookRetriesContent() { return <><p>SalamaPay retries failed webhook deliveries automatically.</p><h2 className="text-xl font-semibold mt-8">Retry Schedule</h2><ul className="flex flex-col gap-2 list-disc pl-6"><li>1st retry: after 1 minute</li><li>2nd retry: after 5 minutes</li><li>3rd retry: after 30 minutes</li><li>4th retry: after 2 hours</li><li>5th retry: after 6 hours</li></ul><Callout type="info" title="Respond quickly">Your webhook endpoint should respond with a 200 status code within 10 seconds. SalamaPay considers any non-2xx response a failure and will retry.</Callout></> }
function WebhookSecurityContent() { return <><p>Secure your webhook endpoints with these practices:</p><ul className="flex flex-col gap-2 list-disc pl-6"><li>Always verify signatures</li><li>Use HTTPS only</li><li>Return 200 quickly (process asynchronously)</li><li>Handle duplicate events (idempotency)</li><li>Log all webhook events</li><li>Never trust webhook data without verification</li></ul></> }

// ===== UTILITY PAYMENTS =====
function UtilityOverviewContent() { return <><p>SalamaPay supports utility bill payments for electricity, water, TV, internet, and telecom services.</p><h2 className="text-xl font-semibold mt-8">Supported Utilities</h2><ul className="flex flex-col gap-2 list-disc pl-6"><li>Electricity (TANESCO, ZECO)</li><li>Water (DAWASA, ZAWA)</li><li>TV / DTH (DStv, GOtv, AzamTV, Startimes)</li><li>Internet (various ISPs)</li><li>Telecom (airtime top-up)</li></ul></> }
function UtilityLookupContent() { return <><p>Look up a utility account before processing payment.</p><CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/developer/utilities/lookup/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "utility": "TANESCO",
    "customer_reference": "123456789"
  }'`} /></> }
function UtilityPaymentContent() { return <><p>Process a utility bill payment.</p><CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/developer/utilities/pay/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "utility": "TANESCO",
    "customer_reference": "123456789",
    "amount": 10000,
    "channel": "MOBILE_MONEY",
    "payer_msisdn": "255712345678"
  }'`} /></> }
function UtilityStatusContent() { return <><p>Check the status of a utility payment using the transaction ID.</p><CodeBlock language="curl" code={`curl -X GET "https://sandbox-api.salamapay.co.tz/api/v1/payments/txn_01JXXXXXXXX/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY"`} /></> }

// ===== GOVERNMENT PAYMENTS =====
function GovernmentOverviewContent() { return <><p>SalamaPay supports government bill payments through the GePG (Government Electronic Payment Gateway) system using control numbers.</p></> }
function ControlNumbersContent() { return <><p>A control number is a unique reference number generated by GePG for a specific government bill. Customers receive a control number from the government institution and use it to make a payment.</p></> }
function GovernmentLookupContent() { return <><p>Verify a control number before processing payment.</p><CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/developer/government/verify/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "control_number": "99123456789"
  }'`} /></> }
function GovernmentPaymentContent() { return <><p>Process a government payment using a control number.</p><CodeBlock language="curl" code={`curl -X POST "https://sandbox-api.salamapay.co.tz/api/v1/developer/government/pay/" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "control_number": "99123456789",
    "amount": 50000,
    "channel": "MOBILE_MONEY",
    "payer_msisdn": "255712345678"
  }'`} /></> }

// ===== DEVELOPMENT =====
function SandboxContent() { return <><p>The sandbox environment simulates real payment processing without moving actual money.</p><h2 className="text-xl font-semibold mt-8">Sandbox Base URL</h2><CodeBlock language="text" code={`https://sandbox-api.salamapay.co.tz`} /><h2 className="text-xl font-semibold mt-8">Test Scenarios</h2><ul className="flex flex-col gap-2 list-disc pl-6"><li><strong>Success</strong> — Use any valid phone number to simulate a successful payment</li><li><strong>Failure</strong> — Use <code className="text-sm bg-muted px-1.5 py-0.5 rounded">255000000000</code> to simulate a failed payment</li><li><strong>Pending</strong> — Use <code className="text-sm bg-muted px-1.5 py-0.5 rounded">255111111111</code> to simulate a pending payment that never completes</li></ul></> }
function TestCredentialsContent() { return <><p>Use these test credentials in the sandbox environment:</p><CodeBlock language="env" title="Sandbox Credentials" code={`SALAMAPAY_BASE_URL=https://sandbox-api.salamapay.co.tz
SALAMAPAY_PUBLIC_KEY=sp_pub_test_xxxxxxxxxxxx
SALAMAPAY_SECRET_KEY=sp_sec_test_xxxxxxxxxxxx
SALAMAPAY_WEBHOOK_SECRET=sp_wh_test_xxxxxxxxxxxx`} /><Callout type="warning" title="Get your own keys">These are example keys. Generate your own sandbox credentials from the SalamaPay dashboard.</Callout></> }
function ErrorHandlingContent() { return <><p>SalamaPay uses standard HTTP status codes. All errors return a consistent JSON structure.</p><h2 className="text-xl font-semibold mt-8">Error Format</h2><ResponseExample status={400} label="Bad Request" body={`{
  "success": false,
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "The amount must be greater than zero."
  }
}`} /><h2 className="text-xl font-semibold mt-8">HTTP Status Codes</h2><ul className="flex flex-col gap-2 list-disc pl-6"><li><strong>400</strong> — Bad Request (validation error)</li><li><strong>401</strong> — Unauthorized (invalid or missing API key)</li><li><strong>403</strong> — Forbidden (insufficient permissions)</li><li><strong>404</strong> — Not Found</li><li><strong>409</strong> — Conflict (duplicate request)</li><li><strong>422</strong> — Validation Error</li><li><strong>429</strong> — Rate Limited</li><li><strong>500</strong> — Internal Server Error</li><li><strong>502</strong> — Provider Error</li><li><strong>503</strong> — Service Unavailable</li></ul></> }
function RateLimitsContent() { return <><p>SalamaPay enforces rate limits to ensure platform stability.</p><Callout type="info" title="Not yet configured">Specific rate limit values will be displayed here once configured. Contact SalamaPay support for current limits.</Callout></> }

// ===== API REFERENCE =====
function ApiAuthRefContent() { return <><p>Authentication endpoints.</p><ApiEndpoint method="POST" path="/api/v1/accounts/login/" description="Authenticate and receive a session token." /></> }
function ApiPaymentsRefContent() { return <><p>Payment endpoints.</p><ApiEndpoint method="POST" path="/api/v1/payments/" description="Create a payment." /><ApiEndpoint method="GET" path="/api/v1/payments/" description="List transactions." /><ApiEndpoint method="GET" path="/api/v1/payments/{id}/" description="Retrieve a transaction." /></> }
function ApiCheckoutRefContent() { return <><p>Checkout endpoints.</p><ApiEndpoint method="POST" path="/api/v1/developer/checkout/" description="Create a checkout session." /><ApiEndpoint method="GET" path="/api/v1/developer/checkout/{id}/" description="Retrieve a checkout session." /></> }
function ApiTransactionsRefContent() { return <><p>Transaction endpoints.</p><ApiEndpoint method="GET" path="/api/v1/payments/" description="List all transactions." /><ApiEndpoint method="GET" path="/api/v1/payments/{id}/" description="Retrieve a transaction by ID." /></> }
function ApiRefundsRefContent() { return <><p>Refund endpoints.</p><ApiEndpoint method="POST" path="/api/v1/admin-panel/refunds/" description="Create a refund request." /><ApiEndpoint method="POST" path="/api/v1/admin-panel/refunds/{id}/approve/" description="Approve a refund." /><ApiEndpoint method="POST" path="/api/v1/admin-panel/refunds/{id}/reject/" description="Reject a refund." /></> }
function ApiWebhooksRefContent() { return <><p>Webhook management endpoints.</p><ApiEndpoint method="GET" path="/api/v1/developer/webhooks/" description="List webhook endpoints." /><ApiEndpoint method="POST" path="/api/v1/developer/webhooks/" description="Create a webhook endpoint." /><ApiEndpoint method="GET" path="/api/v1/developer/webhooks/{id}/deliveries/" description="List webhook deliveries." /></> }
function ApiUtilitiesRefContent() { return <><p>Utility payment endpoints.</p><ApiEndpoint method="POST" path="/api/v1/developer/utilities/lookup/" description="Look up a utility account." /><ApiEndpoint method="POST" path="/api/v1/developer/utilities/pay/" description="Process a utility payment." /></> }
function ApiGovernmentRefContent() { return <><p>Government payment endpoints.</p><ApiEndpoint method="POST" path="/api/v1/developer/government/verify/" description="Verify a control number." /><ApiEndpoint method="POST" path="/api/v1/developer/government/pay/" description="Process a government payment." /></> }

// ===== SDKs =====
function SdkJavascriptContent() { return <Callout type="info" title="Coming Soon">The official SalamaPay JavaScript SDK is under development. In the meantime, use the REST API directly with <code className="text-sm bg-muted px-1.5 py-0.5 rounded">fetch</code> or <code className="text-sm bg-muted px-1.5 py-0.5 rounded">axios</code>.</Callout> }
function SdkPythonContent() { return <Callout type="info" title="Coming Soon">The official SalamaPay Python SDK is under development. In the meantime, use the REST API directly with <code className="text-sm bg-muted px-1.5 py-0.5 rounded">requests</code>.</Callout> }
function SdkPhpContent() { return <Callout type="info" title="Coming Soon">The official SalamaPay PHP SDK is under development. In the meantime, use the REST API directly with <code className="text-sm bg-muted px-1.5 py-0.5 rounded">cURL</code> or <code className="text-sm bg-muted px-1.5 py-0.5 rounded">Guzzle</code>.</Callout> }
function SdkFlutterContent() { return <Callout type="info" title="Coming Soon">The official SalamaPay Flutter SDK is under development. In the meantime, use the REST API directly with the <code className="text-sm bg-muted px-1.5 py-0.5 rounded">http</code> package.</Callout> }

// ===== PRODUCTION =====
function ProductionChecklistContent() { return <><p>Complete this checklist before going live.</p><div className="rounded-lg border p-6 my-4 space-y-3">{["Business verified (KYC approved)","Production credentials created","Webhook endpoint configured (HTTPS)","Webhook signature verification implemented","Idempotency-Key implemented for all POST requests","Error handling for all API calls","Transaction reconciliation implemented","HTTPS enabled on all endpoints","Secrets stored in environment variables","API logs configured","Refund flow tested","Production test transaction completed"].map((item) => (<div key={item} className="flex items-center gap-3"><span className="flex size-5 items-center justify-center rounded border-2 border-muted-foreground/30" /><span className="text-sm">{item}</span></div>))}</div></> }
function SecurityChecklistContent() { return <><p>Security requirements for your integration.</p><div className="rounded-lg border p-6 my-4 space-y-3">{["Secret keys never exposed in frontend code","Secret keys stored in environment variables","Webhook signatures verified on every event","HTTPS used for all API calls and webhooks","Idempotency implemented to prevent duplicates","API keys rotated periodically","Sensitive data not logged","Customer data protected (PCI compliance)","Error messages do not expose internal details","Security events logged and monitored"].map((item) => (<div key={item} className="flex items-center gap-3"><span className="flex size-5 items-center justify-center rounded border-2 border-muted-foreground/30" /><span className="text-sm">{item}</span></div>))}</div></> }
function MonitoringContent() { return <><p>Monitor your SalamaPay integration to ensure reliability.</p><h2 className="text-xl font-semibold mt-8">What to Monitor</h2><ul className="flex flex-col gap-2 list-disc pl-6"><li>API response times</li><li>Error rates (4xx and 5xx)</li><li>Webhook delivery success rate</li><li>Transaction success rate</li><li>Refund processing time</li></ul></> }
function TroubleshootingContent() { return <><p>Common issues and solutions.</p><h2 className="text-xl font-semibold mt-8">Payment Stuck in PENDING</h2><p>The customer may not have approved the USSD prompt. Payments expire automatically after a timeout period. Check the transaction status via the API.</p><h2 className="text-xl font-semibold mt-8">Webhooks Not Received</h2><ul className="flex flex-col gap-2 list-disc pl-6"><li>Verify your webhook URL is HTTPS and accessible</li><li>Check that your server returns 200 within 10 seconds</li><li>Verify the correct events are subscribed</li><li>Check webhook delivery logs in the dashboard</li></ul><h2 className="text-xl font-semibold mt-8">401 Unauthorized</h2><p>Ensure your API key is valid and included in the Authorization header as a Bearer token.</p></> }

// ===== RESOURCES =====
function FeesContent() { return <><p>SalamaPay fees vary by payment method, business type, and contract.</p><Callout type="info" title="Fee configuration">Fees are managed by SalamaPay administrators and may vary. Contact SalamaPay support or check your dashboard for current fee rates applicable to your business.</Callout><h2 className="text-xl font-semibold mt-8">Fee Structure</h2><div className="rounded-lg border overflow-hidden my-4"><table className="w-full text-sm"><thead className="bg-muted/50"><tr><th className="px-4 py-2 text-left font-medium">Payment Method</th><th className="px-4 py-2 text-left font-medium">Fee Type</th><th className="px-4 py-2 text-left font-medium">Rate</th></tr></thead><tbody className="divide-y"><tr><td className="px-4 py-2">Mobile Money</td><td className="px-4 py-2 text-muted-foreground">Percentage</td><td className="px-4 py-2 text-muted-foreground">Not yet configured</td></tr><tr><td className="px-4 py-2">Cards</td><td className="px-4 py-2 text-muted-foreground">Percentage + Fixed</td><td className="px-4 py-2 text-muted-foreground">Not yet configured</td></tr><tr><td className="px-4 py-2">Bank Transfer</td><td className="px-4 py-2 text-muted-foreground">Fixed</td><td className="px-4 py-2 text-muted-foreground">Not yet configured</td></tr><tr><td className="px-4 py-2">Utility Payments</td><td className="px-4 py-2 text-muted-foreground">Fixed</td><td className="px-4 py-2 text-muted-foreground">Not yet configured</td></tr></tbody></table></div></> }
function ChangelogContent() { return <><p>API version history and changes.</p><h2 className="text-xl font-semibold mt-8">2026-08-09 — API v1</h2><p>Initial public release.</p><h3 className="text-lg font-semibold mt-4">Added</h3><ul className="flex flex-col gap-2 list-disc pl-6"><li>Payments API (mobile money, cards, bank, QR)</li><li>Checkout sessions</li><li>Webhooks</li><li>Transaction management</li><li>Refunds</li><li>Utility payments</li><li>Government payments (control numbers)</li><li>Sandbox environment</li><li>Developer dashboard</li></ul></> }
function ApiStatusContent() { return <><p>SalamaPay API service status.</p><div className="flex flex-col gap-3 my-4"><div className="flex items-center gap-3 rounded-lg border p-4"><span className="flex size-3 rounded-full bg-green-500" /><div><p className="font-medium text-sm">API</p><p className="text-xs text-muted-foreground">Operational</p></div></div><div className="flex items-center gap-3 rounded-lg border p-4"><span className="flex size-3 rounded-full bg-green-500" /><div><p className="font-medium text-sm">Checkout</p><p className="text-xs text-muted-foreground">Operational</p></div></div><div className="flex items-center gap-3 rounded-lg border p-4"><span className="flex size-3 rounded-full bg-green-500" /><div><p className="font-medium text-sm">Webhooks</p><p className="text-xs text-muted-foreground">Operational</p></div></div></div><Callout type="info" title="Status monitoring">Status monitoring will appear here once connected to a live monitoring system.</Callout></> }
function SupportContent() { return <><p>Need help? Here are the available support channels:</p><div className="grid gap-4 sm:grid-cols-2 my-4"><div className="rounded-lg border p-5"><h3 className="font-semibold text-sm">Technical Support</h3><p className="text-sm text-muted-foreground mt-1">API integration issues, bugs, and technical questions.</p></div><div className="rounded-lg border p-5"><h3 className="font-semibold text-sm">Payment Support</h3><p className="text-sm text-muted-foreground mt-1">Failed payments, refunds, and settlement issues.</p></div><div className="rounded-lg border p-5"><h3 className="font-semibold text-sm">Security Issue</h3><p className="text-sm text-muted-foreground mt-1">Report security vulnerabilities or compromised credentials.</p></div><div className="rounded-lg border p-5"><h3 className="font-semibold text-sm">Business / KYC</h3><p className="text-sm text-muted-foreground mt-1">Business verification, account issues, and pricing.</p></div></div></> }
function FaqContent() { return <><p>Frequently asked questions about SalamaPay.</p><h2 className="text-xl font-semibold mt-8">How long does KYC verification take?</h2><p>Typically 1-2 business days after submitting all required documents.</p><h2 className="text-xl font-semibold mt-8">What payment methods are supported?</h2><p>Mobile money (M-Pesa, Tigo, Airtel, Halopesa), cards (Visa, Mastercard), bank transfers, and QR codes.</p><h2 className="text-xl font-semibold mt-8">How long do payments take to process?</h2><p>Mobile money payments are typically instant once the customer approves the USSD prompt. Bank transfers may take longer.</p><h2 className="text-xl font-semibold mt-8">Can I test without real money?</h2><p>Yes. Use the sandbox environment with test credentials to simulate payments without processing real transactions.</p><h2 className="text-xl font-semibold mt-8">Do I need to integrate with Selcom directly?</h2><p>No. SalamaPay abstracts the payment provider. You only integrate with SalamaPay APIs.</p></> }
