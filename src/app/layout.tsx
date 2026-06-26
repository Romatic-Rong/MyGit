import type { Metadata } from "next";
import "./globals.css";
import { ReviewBadge } from "@/components/ReviewBadge";

export const metadata: Metadata = {
  title: "AI Flashcards — 智能学习卡片",
  description: "输入知识点，AI 自动生成结构化学习卡片。支持间隔重复复习。",
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
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="AI Flashcards" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="min-h-screen antialiased">
        <nav className="border-b border-border bg-surface/50 backdrop-blur sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-bold text-lg text-primary">
              🧠 AI Flashcards
            </a>
            <div className="flex gap-4 text-sm text-text-muted items-center">
              <a href="/" className="hover:text-text">生成</a>
              <a href="/review" className="hover:text-text">📝 复习</a>
              <a href="/cards" className="hover:text-text">全部卡片</a>
              <ReviewBadge />
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
