import "./globals.css";
import "./twemoji.css";
import "react-medium-image-zoom/dist/styles.css";
import "remark-github-blockquote-alert/alert.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import {
  Geist_Mono,
  JetBrains_Mono,
  Nunito,
  Playpen_Sans,
} from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { Toaster } from "sonner";
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
export const metadata: Metadata = {
  metadataBase: new URL(SITE_METADATA.siteUrl),
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE_METADATA.title}`,
  },
  description: SITE_METADATA.description,
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: "./",
    siteName: SITE_METADATA.title,
    images: [SITE_METADATA.socialBanner],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${SITE_METADATA.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: SITE_METADATA.title,
    card: "summary_large_image",
    images: [SITE_METADATA.socialBanner],
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const basePath = process.env.BASE_PATH || "";
  return (
    <html lang="en" suppressHydrationWarning>
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/favicon.ico`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon.png`}
      />
      <link
        rel="manifest"
        href={`${basePath}/static/favicons/site.webmanifest`}
      />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#fff"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#000"
      />
      <link
        rel="alternate"
        type="application/rss+xml"
        href={`${basePath}/feed.xml`}
      />
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
