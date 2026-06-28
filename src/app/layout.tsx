import type { Metadata } from "next";
import "./globals.css";
import { ReviewBadge } from "@/components/ReviewBadge";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "AI Flashcards",
  description: "输入知识点，AI 自动生成学习卡片，支持间隔重复复习。",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="AI Flashcards" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="min-h-screen antialiased">
        <ToastProvider>
          <nav className="border-b border-border bg-surface/50 backdrop-blur sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between">
              <a href="/" className="font-bold text-base sm:text-lg text-primary">
                🧠 Flashcards
              </a>
              <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-text-muted items-center">
                <a href="/" className="hover:text-text">生成</a>
                <a href="/review" className="hover:text-text">复习</a>
                <a href="/cards" className="hover:text-text hidden sm:inline">卡片</a>
                <ReviewBadge />
              </div>
            </div>
          </nav>
          <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
