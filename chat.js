const KNOWLEDGE_BASE = `
=== 2025년 프리팁스(Pre-TIPS) 및 포스트팁스(Post-TIPS) 창업기업 지원계획 통합공고 ===

【사업 개요】
- 사업목적: 민간투자와 연계하여 유망 창업기업 발굴, 글로벌 유니콘 기업으로 육성
- 선정규모: 프리팁스 50개사 내외, 포스트팁스 77개사 내외
- 공고: 중소벤처기업부 공고 제2025-297호 (2025년 5월 8일)

【접수 일정】
- 1차: 2025년 5월 8일(목) ~ 5월 27일(화), 16:00까지
- 2차: 2025년 8월 1일(금) ~ 8월 20일(수), 16:00까지
- 접수 방법: K-Startup 누리집 온라인 신청 (www.k-startup.go.kr)

■ 프리팁스(Pre-TIPS)

【지원 대상】
- 창조경제혁신센터가 5천만원 이상 투자유치 및 추천한 비수도권 소재 초기창업기업
- 창업 후 3년 이내 기업 (2022년 5월 9일 ~ 2025년 5월 8일)
- 비수도권: 서울, 경기, 인천 제외

【지원 내용】
- 지원기간: 8개월
- 정부지원사업비: 최대 1억원 (평균 91백만원)
- 자기부담사업비: 총 사업비의 30% 이상 (현금 10% 이상, 현물 20% 이하)

【신청 자격 요건】
- 요건①: 모집공고일 기준 1년 이내 창조경제혁신센터가 5천만원 이상 투자 및 추천한 기업
- 요건②: 본사 또는 공장이 비수도권 소재 기업
- 요건③: 대표자 포함 상시 종업원 수 2인 이상

■ 포스트팁스(Post-TIPS)

【지원 대상】
- 팁스 R&D 수행 후 "완료(성공)" 판정받은 창업기업
- 창업 후 7년 이내 (신산업 창업분야는 10년 이내)
- 후속투자 유치 금액 100억원 미만

【지원 내용】
- 지원기간: 18개월
- 일반: 정부지원사업비 최대 5억원
- 최우수: 정부지원사업비 최대 7억원

【문의처】
- 프리팁스: 중소기업 통합 콜센터 1357
- 포스트팁스 한국벤처캐피탈협회: 02-3017-7026
- 포스트팁스 한국기술벤처재단: 02-958-6695
- K-스타트업: www.k-startup.go.kr
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  try {
    // Gemini API 형식으로 대화 내역 변환
    const geminiMessages = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const systemPrompt = `당신은 2025년 프리팁스 및 포스트팁스 창업기업 지원사업 전문 안내 챗봇입니다.
아래 공고 내용을 기반으로만 답변하세요. 공고에 없는 내용은 절대 추측하거나 임의로 답변하지 마세요.
공고 내용에 없는 질문에는 반드시 다음 문구로 답변하세요: "해당 내용은 담당자에게 직접 문의하시길 바랍니다."
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

    if (!text) {
      throw new Error("Gemini 응답 오류");
    }

    res.status(200).json({ message: text });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "API 호출 중 오류가 발생했습니다." });
  }
}
