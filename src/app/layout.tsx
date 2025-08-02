import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import CustomCursor from "@/components/custom-cursor";
import LoadingScreen from "@/components/loading-screen";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KiChao - Movie Download Site",
  description: "Download and watch the latest movies for free. KiChao offers a vast collection of movies across all genres.",
  keywords: ["movies", "download", "free movies", "watch online", "KiChao", "films", "cinema"],
  authors: [{ name: "KiChao Team" }],
  openGraph: {
    title: "KiChao - Movie Download Site",
    description: "Download and watch the latest movies for free",
    url: "https://kichao.com",
    siteName: "KiChao",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KiChao - Movie Download Site",
    description: "Download and watch the latest movies for free",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LoadingScreen />
          {children}
          <CustomCursor />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
