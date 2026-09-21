import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DB Auction - 대화형 AI 부동산 경매",
  description: "파일을 올리고 질문하는 대화형 AI 부동산 경매 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} min-h-screen bg-[#070b16] text-slate-100 antialiased`}>
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DB Auction - 대화형 AI 부동산 경매",
  description: "파일을 올리고 질문하는 대화형 AI 부동산 경매 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
