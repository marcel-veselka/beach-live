import type { Metadata, Viewport } from "next"
import { Header } from "@/components/layout/header"
import { DesktopNav } from "@/components/layout/desktop-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Footer } from "@/components/layout/footer"
import { Providers } from "@/components/layout/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Beach Live — Živé výsledky",
    template: "%s | Beach Live",
  },
  description: "Živé výsledky plážového volejbalu — pavouk, skupiny, zápasy, týmy",
  metadataBase: new URL("https://beach-live.vercel.app"),
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "Beach Live",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#0c7792",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <Header />
          <DesktopNav />
          <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-20 md:pb-6">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  )
}
