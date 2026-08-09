import { Geist, Geist_Mono, Inter } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: {
    default: "SalamaPay | Secure Payments for Africa",
    template: "%s | SalamaPay"
  },
  description: "The ultimate digital wallet and payment gateway built for Tanzanians. Manage transactions, pay bills, and scale your business with ease.",
  keywords: ["SalamaPay", "Payments Tanzania", "Digital Wallet", "M-Pesa API", "Tigo Pesa API", "Fintech Africa", "Payment Gateway"],
  authors: [{ name: "SalamaPay Team" }],
  creator: "SalamaPay",
  publisher: "SalamaPay",
  metadataBase: new URL("https://lipasalama.co.tz"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/image.png",
    shortcut: "/image.png",
    apple: "/image.png",
  },
  openGraph: {
    type: "website",
    locale: "en_TZ",
    url: "https://lipasalama.co.tz",
    title: "SalamaPay | Secure Payments for Africa",
    description: "Accept and send payments seamlessly across Tanzania using Mobile Money, Cards, and Banks.",
    siteName: "SalamaPay",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "SalamaPay - Secure Payments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SalamaPay | Secure Payments for Africa",
    description: "The revenue engine for African creators, merchants, and builders.",
    images: ["/image.png"],
    creator: "@salamapay",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0ea5e9", // SalamaPay Primary Color
}

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, geistHeading.variable)}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
