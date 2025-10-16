import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Insight Journal – Emotional AI Diary",
  description: "Minimal journaling with AI mood insights and weekly trends.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SiteNavbar />
            {children}
            <SiteFooter />
            <Toaster richColors position="top-right" />
            <script dangerouslySetInnerHTML={{ __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            ` }} />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}


