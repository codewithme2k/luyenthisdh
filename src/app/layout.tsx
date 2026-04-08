import type { Metadata } from "next";
import {
  Geist_Mono,
  JetBrains_Mono,
  Nunito,
  Playpen_Sans,
} from "next/font/google";
import "./globals.css";
import "./twemoji.css";
import "react-medium-image-zoom/dist/styles.css";
import "remark-github-blockquote-alert/alert.css";
import "katex/dist/katex.min.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { KBarSearchProvider } from "@/components/search/kbar-provider";
import { SITE_METADATA } from "@/shared/site-metadata";

const FONT_PLAYPEN_SANS = Playpen_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["800"],
  variable: "--font-playpen-sans",
});

const FONT_NUNITO = Nunito({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

const FONT_GEIST = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  style: ["normal"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
});

const FONT_JETBRAINS_MONO = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${FONT_PLAYPEN_SANS.variable} ${FONT_NUNITO.variable} ${FONT_GEIST.variable} ${FONT_JETBRAINS_MONO.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              closeButton={true}
              position="top-right"
              richColors={true}
            />
            <KBarSearchProvider configs={SITE_METADATA.search.kbarConfigs}>
              {children}
            </KBarSearchProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
