export const runtime = "edge";
export const maxDuration = 60;

function buildPrompt(category: string): string {
  const base = `你是一个专业的知识提炼助手。用户输入一个查询，将其转换为学习卡片。严格只输出JSON，不要其他内容。`;

  const categoryPrompts: Record<string, string> = {
    通用: `格式：{"title":"核心概念","explanation":"简洁解释","mnemonic":"记忆口诀","related":["相关1","相关2","相关3"],"difficulty":"beginner|intermediate|advanced"}`,
    翻译: `用户可能输入一个单词、短语或句子。如果是英文→翻译成中文并解释用法/词源；如果是中文→翻译成英文并解释语法点。格式：{"title":"单词/短语","explanation":"翻译+用法说明","mnemonic":"记忆技巧/词根词缀","related":["同义词","反义词","例句"],"difficulty":"beginner"}`,
    编程: `用户输入编程相关的概念、函数、报错或语法。用技术语言准确解释，包括代码示例。格式：{"title":"技术点","explanation":"解释+代码示例","mnemonic":"记忆技巧/常见错误","related":["相关技术1","相关技术2","最佳实践"],"difficulty":"beginner|intermediate|advanced"}`,
    科学: `用户输入科学概念。用严谨但易懂的语言解释原理。格式：{"title":"科学概念","explanation":"原理+应用","mnemonic":"记忆口诀","related":["相关概念1","相关概念2","现实应用"],"difficulty":"beginner|intermediate|advanced"}`,
    数学: `用户输入数学定理、公式或概念。解释定义、推导思路和应用场景。格式：{"title":"定理/公式","explanation":"定义+推导思路","mnemonic":"记忆技巧","related":["相关定理1","相关定理2","典型例题"],"difficulty":"beginner|intermediate|advanced"}`,
    历史: `用户输入历史事件、人物或时期。解释背景、经过、影响。格式：{"title":"历史事件/人物","explanation":"背景+经过+影响","mnemonic":"记忆线索","related":["关联事件1","关联人物2","时代背景"],"difficulty":"beginner|intermediate|advanced"}`,
    文学: `用户输入文学作品、修辞手法或文学概念。解释含义、作者、艺术特点。格式：{"title":"文学概念","explanation":"含义+艺术特点","mnemonic":"记忆线索","related":["相关作品1","相关概念2","作者背景"],"difficulty":"beginner|intermediate|advanced"}`,
  };

  return base + " " + (categoryPrompts[category] || categoryPrompts["通用"]);
}

export async function POST(req: Request) {
  try {
    const { topic, category } = await req.json();
    if (!topic || typeof topic !== "string") {
      return Response.json({ error: "请输入知识点" }, { status: 400 });
    }

    const systemPrompt = buildPrompt(category || "通用");

    const res = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `查询内容：${topic}` },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "";
    const clean = content.replace(/```json\s*|```/g, "").trim();
    const card = JSON.parse(clean);

    return Response.json(card);
  } catch (e) {
    console.error("Generate error:", e);
    return Response.json({ error: "生成失败，请稍后重试" }, { status: 500 });
  }
}
