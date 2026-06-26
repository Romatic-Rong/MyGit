# 🧠 AI Flashcards — 智能学习卡片

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Database-green)

**输入知识点，AI 自动生成结构化记忆卡片。支持间隔重复复习。**

---

## 🎯 项目简介

AI Flashcards 是一款全栈 Web 应用，结合大语言模型和间隔重复算法，帮助用户高效学习和记忆任何知识点。

- 🔍 输入学习主题 → AI 秒级生成知识卡片
- 📚 SM-2 间隔重复算法智能安排复习
- 🏷️ 7 种知识分类（翻译 / 编程 / 科学 / 数学 / 历史 / 文学 / 通用）
- 📱 PWA 支持，可安装到手机和桌面
- 🌙 暗色主题，护眼设计

---

## 🛠 技术架构

```
┌──────────────────────────────────────────────┐
│                  Next.js 16                   │
│  ┌─────────────┐  ┌──────────────────────┐   │
│  │  Server      │  │  Client               │   │
│  │  Components  │  │  Components            │   │
│  └──────┬───────┘  └──────────────────────┘   │
│         │                                      │
│         ▼                                      │
│  ┌──────────────────────────────────────┐     │
│  │         API Routes (Edge)             │     │
│  │  /api/cards/generate   → 智谱 GLM-4  │     │
│  │  /api/cards/save       → Supabase    │     │
│  │  /api/cards/list       → Supabase    │     │
│  │  /api/cards/review     → SM-2 算法   │     │
│  │  /api/cards/delete     → Supabase    │     │
│  └──────────────┬───────────────────────┘     │
└─────────────────┼─────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌──────────────┐        ┌──────────────┐
│  智谱 GLM-4   │        │   Supabase    │
│  (免费 AI)    │        │  (PostgreSQL) │
└──────────────┘        └──────────────┘
```

---

## 📦 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 框架 | Next.js 16 (App Router) | React 全栈框架，Server Components + API Routes |
| 语言 | TypeScript 5 | 类型安全 |
| 数据库 | Supabase (PostgreSQL) | 开源 Firebase 替代，自带 REST API |
| AI | 智谱 GLM-4-Flash | 永久免费，中文能力强 |
| 样式 | Tailwind CSS 4 | 暗色主题，响应式 |
| 部署 | 本地 / Vercel / Render | 零成本起步 |

---

## ✨ 功能

| 功能 | 描述 |
|------|------|
| 🧠 AI 生成 | 输入知识点 → AI 生成结构化卡片（标题、解释、口诀、关联） |
| 💾 云端存储 | 一键保存到 Supabase，跨设备同步 |
| 📂 卡片管理 | 列表浏览、复制、删除 |
| 📝 间隔复习 | SM-2 算法，翻面回忆 + 评分 |
| 🏷️ 知识分类 | 翻译 / 编程 / 科学 / 数学 / 历史 / 文学 / 通用 |
| 📱 PWA | 可安装到桌面和手机 |
| 🔔 复习提醒 | 待复习数量红点 + 浏览器通知 |

### SM-2 间隔重复

| 评分 | 效果 |
|------|------|
| 😵 忘了 | 明天再出现 |
| 🤔 困难 | 6 天后 |
| 😎 轻松 | 间隔×2.5 倍（1→6→15→37天...） |

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm

### 1. 安装

```bash
git clone git@github.com:Romatic-Rong/MyGit.git
cd MyGit
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入：

```bash
# 智谱 AI — https://open.bigmodel.cn
ZHIPU_API_KEY=your_key

# Supabase — https://supabase.com
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. 初始化数据库

在 Supabase SQL Editor 执行 `schema.sql`。

### 4. 启动

```bash
npm run dev
```

打开 http://localhost:3000

### 5. 桌面版

双击 `启动.bat` 一键启动。

---

## 📂 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页（生成）
│   ├── globals.css             # 暗色主题
│   ├── cards/page.tsx          # 全部卡片
│   ├── review/page.tsx         # 间隔复习
│   └── api/cards/
│       ├── generate/route.ts   # AI 生成 API
│       ├── save/route.ts       # 保存
│       ├── list/route.ts       # 列表
│       ├── review/route.ts     # 复习进度
│       └── delete/route.ts     # 删除
├── components/
│   ├── CardGenerator.tsx       # 卡片生成器
│   ├── CardList.tsx            # 卡片列表
│   ├── ReviewClient.tsx        # 复习交互
│   ├── ReviewBadge.tsx         # 复习红点 + 通知
│   └── Toast.tsx               # 提示组件
└── lib/
    ├── supabase.ts             # 数据库客户端
    └── cards.ts                # SM-2 算法 + CRUD
```

---

## 🔑 环境变量

| 变量 | 说明 |
|------|------|
| `ZHIPU_API_KEY` | 智谱 AI Key（免费） |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Key |

---

## 📊 数据模型

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| topic | TEXT | 查询主题 |
| title | TEXT | 核心概念 |
| explanation | TEXT | 解释 |
| mnemonic | TEXT | 记忆口诀 |
| related | TEXT[] | 关联知识 |
| next_review | TIMESTAMPTZ | 下次复习 |
| interval_days | INTEGER | 复习间隔 |
| ease_factor | REAL | SM-2 系数 |
| repetitions | INTEGER | 连续正确次数 |
