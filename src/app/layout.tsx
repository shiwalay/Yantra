import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://influq.com";
const title = "Influq | AI YouTube Growth OS";
const description =
  "The AI YouTube Growth Operating System for creators, businesses, and agencies. From idea to viral strategy, script, thumbnail layout, and analytics optimization.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Influq" },
  description,
  keywords: ["YouTube growth", "AI YouTube tools", "video script generator", "YouTube SEO", "thumbnail CTR", "creator analytics"],
  applicationName: "Influq",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Influq",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

import { CSPostHogProvider } from '@/providers/posthog-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
              `,
            }}
          />
        )}
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-[#0a0a0c] text-foreground antialiased selection:bg-primary/30 selection:text-white"
      >
        <CSPostHogProvider>
          <LayoutShell>{children}</LayoutShell>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
