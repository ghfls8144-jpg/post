import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const TAGS = [
  ['📌 사업개요', '포스트 팁스 사업이 무엇인가요?'],
  ['📋 신청자격', '신청 자격이 어떻게 되나요?'],
  ['💰 지원금액', '지원 금액과 사업화 자금 구성을 알려주세요'],
  ['📅 접수기간', '신청 기간과 방법을 알려주세요'],
  ['⚖️ 평가절차', '평가 기준과 절차를 알려주세요'],
  ['❌ 제외대상', '신청 제외 대상이 누구인가요?'],
  ['🏢 주관기관', '주관기관은 어디이고 차이가 무엇인가요?'],
  ['🎯 창업프로그램', '창업프로그램은 어떤 내용인가요?'],
  ['🔬 신산업분야', '신산업 창업 분야 27가지를 알려주세요'],
  ['📞 문의처', '문의 연락처를 알려주세요'],
];

function md(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^#{1,3} (.+)$/gm, '<b class="hd">$1</b>')
    .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function Page() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bottom = useRef(null);
  const ta = useRef(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);

  async function send(q) {
    const text = (q || input).trim();
    if (!text || busy) return;
    setInput('');
    if (ta.current) { ta.current.style.height = 'auto'; }
    const next = [...msgs, { role: 'user', content: text }];
    setMsgs(next);
    setBusy(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const d = await r.json();
      setMsgs([...next, { role: 'assistant', content: d.reply || '응답을 받지 못했습니다.' }]);
    } catch {
      setMsgs([...next, { role: 'assistant', content: '⚠️ 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }]);
    }
    setBusy(false);
    ta.current?.focus();
  }

  return (
    <>
      <Head>
        <title>포스트 팁스 AI 안내봇</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="wrap">
        {/* 헤더 */}
        <header>
          <div className="logo">🚀</div>
          <div>
            <div className="title">포스트 팁스(Post-TIPS) AI 안내봇</div>
            <div className="sub">창업진흥원 공고 제2026-13호 · Gemini AI</div>
          </div>
          <div className="online"><span />온라인</div>
        </header>

        {/* 태그 */}
        <div className="tags">
          {TAGS.map(([label, q]) => (
            <button key={label} className="tag" onClick={() => send(q)}>{label}</button>
          ))}
        </div>

        {/* 채팅 */}
        <div className="chat">
          {msgs.length === 0 && (
            <div className="welcome">
              <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
              <h2>포스트 팁스 모집공고 AI 안내봇</h2>
              <p>2026년 포스트 팁스 창업기업 모집공고 전체 내용을 학습했습니다.<br />신청 자격, 지원 금액, 절차 등 무엇이든 질문해 주세요.</p>
              <div className="notice">⚠️ 본 봇은 공고문 기반 참고용입니다. 최종 확인은 반드시 주관기관에 문의하세요.</div>
              <div className="qbtns">
                {[['신청 자격 확인','내가 신청 가능한지 자격 요건을 알려주세요'],['지원금 상세','사업화 자금은 얼마이고 어떻게 구성되나요?'],['제출 서류 안내','신청 마감일과 제출 서류를 알려주세요'],['평가지표 확인','평가지표 4가지를 자세히 알려주세요'],['문의처 안내','문의 연락처를 알려주세요']].map(([l, q]) => (
                  <button key={l} className="qbtn" onClick={() => send(q)}>{l}</button>
                ))}
              </div>
            </div>
          )}

          {msgs.map((m, i) => (
            <div key={i} className={`row ${m.role}`}>
              <div className={`av ${m.role}`}>{m.role === 'assistant' ? '🤖' : '👤'}</div>
              <div className="bwrap">
                <div className={`bubble ${m.role}`} dangerouslySetInnerHTML={{ __html: md(m.content) }} />
              </div>
            </div>
          ))}

          {busy && (
            <div className="row assistant">
              <div className="av assistant">🤖</div>
              <div className="bwrap">
                <div className="bubble assistant">
                  <div className="dots"><span /><span /><span /></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottom} />
        </div>

        {/* 입력 */}
        <div className="inputarea">
          <div className="inputbox">
            <textarea
              ref={ta}
              value={input}
              placeholder="포스트 팁스 관련 질문을 입력하세요..."
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button className="sendbtn" onClick={() => send()} disabled={busy || !input.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="hint">shift+enter 줄바꿈 · enter 전송</div>
        </div>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #07090f; color: #e2e8f0; font-family: 'Noto Sans KR', sans-serif; }
      `}</style>

      <style jsx>{`
        .wrap { display: flex; flex-direction: column; height: 100vh; }

        header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: rgba(7,9,15,0.95); border-bottom: 1px solid #1e2535; flex-shrink: 0; }
        .logo { width: 40px; height: 40px; background: linear-gradient(135deg,#3b82f6,#7c3aed); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .title { font-size: 14px; font-weight: 700; background: linear-gradient(90deg,#fff,#93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .sub { font-size: 11px; color: #4a5568; margin-top: 2px; }
        .online { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 11px; color: #718096; background: #161b26; border: 1px solid #1e2535; border-radius: 20px; padding: 4px 10px; flex-shrink: 0; }
        .online span { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }

        .tags { display: flex; gap: 7px; padding: 9px 20px; overflow-x: auto; border-bottom: 1px solid #1e2535; background: #0e1117; flex-shrink: 0; scrollbar-width: none; }
        .tags::-webkit-scrollbar { display: none; }
        .tag { white-space: nowrap; padding: 5px 11px; border-radius: 20px; border: 1px solid #1e2535; background: #161b26; color: #718096; font-size: 12px; cursor: pointer; transition: all .2s; font-family: inherit; }
        .tag:hover { border-color: #3b82f6; color: #60a5fa; background: rgba(59,130,246,.1); }

        .chat { flex: 1; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 18px; scroll-behavior: smooth; }
        .chat::-webkit-scrollbar { width: 4px; }
        .chat::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 2px; }

        .welcome { background: #0e1117; border: 1px solid #1e2535; border-radius: 16px; padding: 28px 24px; max-width: 520px; align-self: center; text-align: center; }
        .welcome h2 { font-size: 16px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg,#fff,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .welcome p { font-size: 13px; color: #718096; line-height: 1.7; }
        .notice { background: rgba(245,158,11,.08); border: 1px solid rgba(245,158,11,.2); border-radius: 8px; padding: 9px 12px; margin: 14px 0; font-size: 12px; color: #f59e0b; }
        .qbtns { display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; }
        .qbtn { padding: 7px 13px; border-radius: 8px; border: 1px solid #2d3748; background: #161b26; color: #a0aec0; font-size: 12px; cursor: pointer; transition: all .2s; font-family: inherit; }
        .qbtn:hover { border-color: #3b82f6; color: #60a5fa; background: rgba(59,130,246,.1); }

        .row { display: flex; gap: 10px; animation: up .3s ease; }
        .row.user { flex-direction: row-reverse; align-self: flex-end; }
        .row.assistant { align-self: flex-start; }
        @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .av { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .av.assistant { background: linear-gradient(135deg,#3b82f6,#7c3aed); }
        .av.user { background: #1a2744; border: 1px solid rgba(59,130,246,.3); }

        .bwrap { max-width: 74%; display: flex; flex-direction: column; }
        .row.user .bwrap { align-items: flex-end; }

        .bubble { padding: 12px 15px; border-radius: 12px; font-size: 14px; line-height: 1.75; word-break: keep-all; }
        .bubble.assistant { background: #0e1117; border: 1px solid #1e2535; border-top-left-radius: 3px; }
        .bubble.user { background: #1a2744; border: 1px solid rgba(59,130,246,.2); border-top-right-radius: 3px; }
        .bubble :global(strong) { color: #60a5fa; }
        .bubble :global(code) { background: #1c2333; border: 1px solid #2d3748; border-radius: 4px; padding: 1px 5px; font-size: 12px; color: #93c5fd; }
        .bubble :global(ul) { padding-left: 18px; margin: 5px 0; }
        .bubble :global(li) { margin: 3px 0; color: #a0aec0; }
        .bubble :global(.hd) { display: block; color: #60a5fa; font-weight: 700; margin: 5px 0 2px; }

        .dots { display: flex; gap: 4px; align-items: center; padding: 3px 0; }
        .dots span { width: 7px; height: 7px; border-radius: 50%; background: #3b82f6; animation: b 1.4s ease-in-out infinite; opacity: .7; }
        .dots span:nth-child(2) { animation-delay: .2s; }
        .dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes b { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

        .inputarea { padding: 14px 20px 18px; background: rgba(7,9,15,.97); border-top: 1px solid #1e2535; flex-shrink: 0; }
        .inputbox { display: flex; align-items: flex-end; gap: 9px; background: #161b26; border: 1px solid #2d3748; border-radius: 12px; padding: 9px 11px 9px 15px; transition: border-color .2s, box-shadow .2s; }
        .inputbox:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        textarea { flex: 1; background: none; border: none; outline: none; color: #e2e8f0; font-size: 14px; resize: none; max-height: 120px; min-height: 22px; line-height: 1.6; font-family: inherit; }
        textarea::placeholder { color: #4a5568; }
        .sendbtn { width: 34px; height: 34px; border-radius: 8px; border: none; background: linear-gradient(135deg,#3b82f6,#7c3aed); color: #fff; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all .2s; }
        .sendbtn:hover:not(:disabled) { transform: scale(1.07); }
        .sendbtn:disabled { opacity: .35; cursor: not-allowed; }
        .hint { font-size: 11px; color: #4a5568; text-align: center; margin-top: 7px; }

        @media (max-width: 600px) {
          header { padding: 11px 14px; }
          .online { display: none; }
          .chat { padding: 18px 14px; }
          .bwrap { max-width: 86%; }
          .inputarea { padding: 11px 14px 15px; }
        }
      `}</style>
    </>
  );
}
