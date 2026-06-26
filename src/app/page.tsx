import { CardGenerator } from "@/components/CardGenerator";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 pt-12">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI 学习卡片
        </h1>
        <p className="text-text-muted max-w-md mx-auto">
          输入任何知识点 — AI 自动生成结构化的记忆卡片，支持间隔重复复习
        </p>
      </header>
      <CardGenerator />
    </div>
  );
}
