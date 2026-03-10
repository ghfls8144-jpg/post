import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const SUGGESTED_QUESTIONS = [
  "포스트팁스 신청 자격은?",
  "제출 서류 목록이 궁금해요",
  "지원금은 얼마인가요?",
  "접수 기간은 언제인가요?",
  "최우수 기업 기준은?",
  "가점 받을 수 있는 항목은?",
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>팁스 창업지원 안내 챗봇</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-inner">
            <div className="logo-area">
              <div className="logo-icon">T</div>
              <div>
                <div className="logo-title">TIPS 창업지원 안내</div>
                <div className="logo-sub">2025년 프리팁스 · 포스트팁스</div>
              </div>
            </div>
            <div className="header-badge">AI 상담</div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">💼</div>
              <h2 className="welcome-title">안녕하세요!</h2>
              <p className="welcome-desc">
                2025년 프리팁스·포스트팁스 창업기업 지원사업에 대해<br />
                궁금한 점을 자유롭게 질문해주세요.
              </p>
              <div className="suggestions">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} className="suggestion-btn" onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message-row ${msg.role}`}>
                  {msg.role === "assistant" && (
                    <div className="avatar">T</div>
                  )}
                  <div className={`bubble ${msg.role}`}>
                    {msg.content.split("\n").map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message-row assistant">
                  <div className="avatar">T</div>
                  <div className="bubble assistant loading">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <footer className="input-area">
          <div className="input-inner">
            <textarea
              className="input-box"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="질문을 입력하세요... (Enter로 전송)"
              rows={1}
              disabled={isLoading}
            />
            <button
              className={`send-btn ${isLoading || !input.trim() ? "disabled" : ""}`}
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
            >
              ↑
            </button>
          </div>
          <p className="disclaimer">공고문 기반 AI 답변 · 정확한 내용은 담당 기관에 확인하세요</p>
        </footer>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; font-family: 'Noto Sans KR', sans-serif; background: #f0f2f5; }
        #__next { height: 100%; }
      `}</style>

      <style jsx>{`
        .app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 780px;
          margin: 0 auto;
          background: #fff;
          box-shadow: 0 0 40px rgba(0,0,0,0.08);
        }

        /* Header */
        .header {
          background: linear-gradient(135deg, #1a3a8f 0%, #0f2460 100%);
          padding: 0 20px;
          height: 64px;
          flex-shrink: 0;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          color: white;
        }
        .logo-title {
          color: white;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.3px;
        }
        .logo-sub {
          color: rgba(255,255,255,0.6);
          font-size: 11px;
          margin-top: 1px;
        }
        .header-badge {
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.9);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* Chat Area */
        .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fc;
        }

        /* Welcome */
        .welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 180px);
          text-align: center;
          padding: 40px 20px;
        }
        .welcome-icon {
          font-size: 52px;
          margin-bottom: 16px;
        }
        .welcome-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 10px;
        }
        .welcome-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          max-width: 560px;
        }
        .suggestion-btn {
          background: white;
          border: 1.5px solid #e0e4ef;
          color: #1a3a8f;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .suggestion-btn:hover {
          background: #1a3a8f;
          color: white;
          border-color: #1a3a8f;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26,58,143,0.25);
        }

        /* Messages */
        .messages {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .message-row.user {
          flex-direction: row-reverse;
        }
        .avatar {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #1a3a8f, #0f2460);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }
        .bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.6;
        }
        .bubble.user {
          background: linear-gradient(135deg, #1a3a8f, #0f2460);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .bubble.assistant {
          background: white;
          color: #1a1a2e;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.07);
        }
        .bubble.loading {
          display: flex;
          gap: 5px;
          align-items: center;
          padding: 16px 20px;
        }
        .dot {
          width: 7px;
          height: 7px;
          background: #1a3a8f;
          border-radius: 50%;
          opacity: 0.4;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        /* Input */
        .input-area {
          padding: 12px 16px 16px;
          background: white;
          border-top: 1px solid #eef0f6;
          flex-shrink: 0;
        }
        .input-inner {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: #f3f5fb;
          border-radius: 16px;
          padding: 8px 8px 8px 16px;
          border: 1.5px solid #e0e4ef;
          transition: border-color 0.2s;
        }
        .input-inner:focus-within {
          border-color: #1a3a8f;
          background: white;
        }
        .input-box {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          font-family: 'Noto Sans KR', sans-serif;
          color: #1a1a2e;
          resize: none;
          max-height: 120px;
          line-height: 1.5;
        }
        .input-box::placeholder { color: #aaa; }
        .send-btn {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1a3a8f, #0f2460);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .send-btn:hover:not(.disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(26,58,143,0.4);
        }
        .send-btn.disabled {
          background: #c0c8e0;
          cursor: not-allowed;
        }
        .disclaimer {
          text-align: center;
          font-size: 11px;
          color: #bbb;
          margin-top: 8px;
        }
      `}</style>
    </>
  );
}
