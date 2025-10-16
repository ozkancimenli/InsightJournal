"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNavbar() {
  return (
    <nav className="w-full border-b sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-max h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-blue-600" />
            <span className="font-semibold">Insight Journal</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="px-3 py-1.5 rounded-md bg-foreground text-background text-sm">Sign in</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}


