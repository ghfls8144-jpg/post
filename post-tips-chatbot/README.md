# 🚀 포스트 팁스(Post-TIPS) AI 안내봇

2026년 창업진흥원 포스트 팁스 모집공고를 기반으로 한 Google Gemini AI 챗봇입니다.

## 📁 프로젝트 구조

```
post-tips-chatbot/
├── api/
│   └── chat.js          # Vercel Serverless Function (Gemini API 호출)
├── public/
│   └── index.html       # 프론트엔드 챗봇 UI
├── .env.example         # 환경변수 예시
├── .gitignore
├── package.json
├── vercel.json          # Vercel 배포 설정
└── README.md
```

## ⚙️ 배포 방법 (Vercel + GitHub)

### 1단계 — Google API 키 발급
1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. **Create API key** 클릭
3. 발급된 키를 복사해 둡니다.

### 2단계 — GitHub에 올리기
```bash
git init
git add .
git commit -m "feat: 포스트 팁스 AI 챗봇 초기 배포"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/post-tips-chatbot.git
git push -u origin main
```

### 3단계 — Vercel 배포
1. [vercel.com](https://vercel.com) 로그인 (GitHub 계정 연동)
2. **Add New Project** → 위에서 만든 GitHub 저장소 선택
3. **Import** 클릭
4. **Environment Variables** 섹션에서:
   - Name: `GOOGLE_API_KEY`
   - Value: `1단계에서 복사한 API 키`
5. **Deploy** 클릭
6. 배포 완료 후 제공되는 URL로 접속!

### 로컬에서 테스트하기
```bash
# 의존성 설치
npm install

# .env 파일 생성
cp .env.example .env
# .env 파일을 열어 GOOGLE_API_KEY 값 입력

# Vercel CLI 설치 (최초 1회)
npm i -g vercel

# 로컬 개발 서버 실행
vercel dev
```
→ http://localhost:3000 에서 확인

## 🔑 환경변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `GOOGLE_API_KEY` | Google AI Studio API 키 | ✅ |

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| AI 모델 | Google Gemini 2.0 Flash |
| 서버 | Vercel Serverless Functions (Node.js) |
| 프론트엔드 | Vanilla HTML/CSS/JS |
| 배포 | Vercel |

## 📞 공고 문의처

- **한국벤처캐피탈협회**: 02-3017-7030, 7034, 7032
- **키스트이노베이션**: 02-958-6682, 6685, 6688
- **창업진흥원 민관협력실**: 02-2039-1354
- **시스템 문의**: ☎ 1357 (중소기업 통합콜센터)
- **K-Startup**: www.k-startup.go.kr
