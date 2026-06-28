"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "./Toast";

// 打字机效果 hook
function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  // 当 text 变化时触发打字机
  const prevRef = useRef(text);
  useEffect(() => {
    if (text === prevRef.current) return; // 同一段文字不重播
    prevRef.current = text;
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayed;
}

interface Card {
  title: string;
  explanation: string;
  mnemonic: string;
  related: string[];
  difficulty: string;
}

export function CardGenerator() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [category, setCategory] = useState("通用");
  const toast = useToast();
  const typedExplanation = useTypewriter(streamingText, 20);

  const categories = [
    { name: "通用", icon: "🌐", placeholder: "输入任何知识点..." },
    { name: "翻译", icon: "📖", placeholder: "输入单词或句子..." },
    { name: "编程", icon: "💻", placeholder: "输入函数、概念或报错..." },
    { name: "科学", icon: "🔬", placeholder: "输入科学概念、公式..." },
    { name: "数学", icon: "🧮", placeholder: "输入定理、公式..." },
    { name: "历史", icon: "📚", placeholder: "输入历史事件、人物..." },
    { name: "文学", icon: "📝", placeholder: "输入文学作品、修辞..." },
  ];

  const currentCat = categories.find(c => c.name === category) || categories[0];

  async function handleGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setCard(null);
    setStreamingText("AI 正在思考...");

    try {
      const res = await fetch("/api/cards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input.trim(), category }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");

      setCard(data);
      // 打字机目标设为 explanation 字段
      setStreamingText(data.explanation || "");
    } catch (e: any) {
      setError(e.message || "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* 分类标签 */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategory(cat.name)}
            className={`px-2.5 py-1.5 rounded-full text-[12px] font-medium transition-all ${
              category === cat.name
                ? "bg-primary text-white"
                : "bg-surface-2 text-text-muted border border-border hover:border-primary/50 hover:text-text"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* 输入区 */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder={currentCat.placeholder}
          className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={!input.trim() || loading}
          className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "生成中..." : "生成卡片"}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 加载动画 */}
      {loading && (
        <div className="p-8 rounded-2xl bg-surface border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-text-muted text-sm">AI 正在生成卡片...</span>
          </div>
          {streamingText && (
            <div className="p-4 rounded-xl bg-surface-2 text-text-muted text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
              {streamingText}
            </div>
          )}
        </div>
      )}

      {/* 卡片结果 */}
      {card && (
        <div className="rounded-2xl bg-surface border border-border overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* 标题 */}
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">{card.title}</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {card.difficulty === "beginner" ? "入门" : card.difficulty === "intermediate" ? "中级" : "进阶"}
              </span>
            </div>

            {/* 解释 */}
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">📖 解释</h3>
              <p className="text-text leading-relaxed">{card.explanation}</p>
            </div>

            {/* 记忆口诀 */}
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
              <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">💡 记忆口诀</h3>
              <p className="text-accent font-medium">{card.mnemonic}</p>
            </div>

            {/* 相关知识点 */}
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">🔗 相关知识点</h3>
              <div className="flex flex-wrap gap-2">
                {card.related.map((r, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-surface-2 border border-border text-sm text-text-muted cursor-pointer hover:border-primary hover:text-text transition-colors"
                    onClick={() => { setInput(r); handleGenerate(); }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 操作栏 */}
          <div className="flex gap-2 px-6 py-3 bg-surface-2 border-t border-border">
            <button
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
              onClick={() => {
                fetch("/api/cards/save", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...card, topic: input.trim() }),
                }).then(r => r.ok ? toast.show("已保存到数据库！") : toast.show("保存失败，请重试"));
              }}
            >
              💾 保存
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-surface text-text-muted text-sm hover:text-text transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(
                  `【${card.title}】\n${card.explanation}\n\n记忆口诀：${card.mnemonic}\n\n相关：${card.related.join("、")}`
                ).then(() => toast.show("已复制到剪贴板"));
              }}
            >
              📋 复制
            </button>
            <a
              href="/cards"
              className="px-4 py-2 rounded-lg bg-surface text-text-muted text-sm hover:text-text transition-colors"
            >
              📂 全部卡片
            </a>
            <button
              className="px-4 py-2 rounded-lg bg-surface text-text-muted text-sm hover:text-text transition-colors"
              onClick={() => { setCard(null); setInput(""); setStreamingText(""); }}
            >
              🔄 重新生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
