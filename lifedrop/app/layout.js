import Link from "next/link";
import { Inter } from "next/font/google";
import AuthNav from "@/components/AuthNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    template: "%s · LifeDrop",
    default: "LifeDrop — Blood Donor & Request Finder in Ethiopia",
  },
  description:
    "Find blood donors and urgent blood requests across Ethiopia. Search by blood type and city.",
  openGraph: {
    siteName: "LifeDrop",
    locale: "en_ET",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <div className="app">
          <header className="site-header">
            <div className="container header-inner">
              <Link href="/" className="brand">
                <img
                  src="/droplet.svg"
                  alt="LifeDrop logo"
                  className="logo"
                  width={32}
                  height={32}
                />
                <span className="brand-name">LifeDrop</span>
              </Link>
              <nav className="site-nav">
                <Link href="/requests">Requests</Link>
                <Link href="/donate">Donate</Link>
                <Link href="/about">About</Link>
              </nav>
              <AuthNav />
            </div>
          </header>
          <main className="site-main container">{children}</main>
          <footer className="site-footer">
            <div className="container">
              LifeDrop · Blood Donor &amp; Request Finder · IBT College 2026
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
