javascriptconst KNOWLEDGE_BASE = `
=== 2025년 프리팁스·포스트팁스 창업기업 지원계획 통합공고 ===
(여기에 기존 chat.js의 KNOWLEDGE_BASE 내용 그대로 붙여넣기)
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  try {
    const geminiMessages = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const systemPrompt = `당신은 2025년 프리팁스 및 포스트팁스 창업기업 지원사업 전문 안내 챗봇입니다.
아래 공고 내용을 기반으로만 답변하세요. 공고에 없는 내용은 절대 추측하지 마세요.
공고에 없는 질문에는 "해당 내용은 담당자에게 직접 문의하시길 바랍니다." 라고 답변하세요.
친절하고 명확하게 답변하세요.

=== 공고 내용 ===
${KNOWLEDGE_BASE}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.3,
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Gemini 응답 오류");

    res.status(200).json({ message: text });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "API 호출 중 오류가 발생했습니다." });
  }
}
