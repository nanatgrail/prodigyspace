import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "@/styles/globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "ProdigySpace - Student Productivity Hub",
  description:
    "Comprehensive digital workspace for students with note-taking, task management, collaboration tools, and well-being tracking",
  generator: "prakash raj",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ProdigySpace",
    startupImage: [
      "/icons/apple-touch-startup-image-768x1004.png",
      {
        url: "/icons/apple-touch-startup-image-1536x2008.png",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },
  applicationName: "ProdigySpace",
  keywords: [
    "student",
    "productivity",
    "notes",
    "tasks",
    "collaboration",
    "wellbeing",
    "study planner",
    "offline",
    "1046prt",
    "prodigyspace",
    "productivity app",
    "student app",
    "note-taking",
    "task management",
    "collaboration tools",
    "well-being tracking",
    "study tools",
    "academic success",
    "student life",
    "productivity hub",
    "all-in-one app",
    "student organization",
    "time management",
    "focus",
    "motivation",
    "self-care",
    "mental health",
    "productivity tracker",
    "goal setting",
    "habit tracking",
    "study resources",
  ],
  authors: [{ name: "prodigyspace Team" }],
  creator: "prodigyspace Team",
  publisher: "prodigyspace Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.jpg",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.jpg",
        color: "#2563eb",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ProdigySpace" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen bg-background">
            <Navigation />
            <main className="flex-grow">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
