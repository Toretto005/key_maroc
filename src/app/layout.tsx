import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/dictionaries";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50">
        <LanguageProvider initialLang={locale}>
          <Sidebar />
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto flex flex-col relative z-0">
            <TopHeader />
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
