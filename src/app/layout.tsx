import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sarouti — Find Key Makers Near You",
  description: "Discover and connect with professional locksmiths and key makers in your city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        {/* Main Content Area - Scrollable with padding on mobile to account for bottom bar */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
