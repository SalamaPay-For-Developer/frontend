"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  TwitterIcon, 
  InstagramIcon, 
  Linkedin01Icon, 
  Facebook01Icon,
  ArrowRight01Icon
} from "@hugeicons/core-free-icons"
import { Separator } from "@/components/ui/separator"

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/salamapaylogo.png" alt="Salamapay" className="size-8 object-contain" />
              <span className="text-xl font-bold tracking-tight">Salamapay</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mb-8">
              The revenue engine for African creators, merchants, and builders. 
              Built in Dar es Salaam, Tanzania.
            </p>
            <div className="space-y-4">
              <h4 className="font-bold text-sm">See what you&apos;ll pay</h4>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                Integrated per-transaction pricing with no hidden fees.
              </p>
              <Link href="#" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                Pricing details <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Products</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Salamapay Me</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Salamapay Store</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Salamapay Pay</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Mobile App</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Get verified</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Affiliates</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contacts</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Salamapay Payments. All rights reserved.</p>
            <div className="hidden md:flex gap-4 items-center opacity-30">
              <div className="size-1 rounded-full bg-current" />
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <div className="size-1 rounded-full bg-current" />
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
              <HugeiconsIcon icon={TwitterIcon} className="size-4" />
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="#" className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
              <HugeiconsIcon icon={InstagramIcon} className="size-4" />
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="#" className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
              <HugeiconsIcon icon={Linkedin01Icon} className="size-4" />
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="#" className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
              <HugeiconsIcon icon={Facebook01Icon} className="size-4" />
            </Link>
          </div>
        </div>
        {/* Mobile-only policy links */}
        <div className="md:hidden mt-4 flex justify-center gap-6 text-[10px] text-muted-foreground opacity-60">
           <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
           <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
