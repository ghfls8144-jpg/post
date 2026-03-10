# 2025 팁스(TIPS) 창업지원 안내 챗봇

2025년 프리팁스·포스트팁스 창업기업 지원사업 공고 기반 AI 챗봇입니다.

## 배포 방법 (Vercel - 무료)

### 1단계: GitHub에 업로드
1. GitHub.com에서 새 repository 생성
2. 이 폴더의 파일들을 모두 업로드

### 2단계: Vercel 배포
1. https://vercel.com 에서 회원가입 (GitHub 계정으로 로그인)
2. "New Project" 클릭
3. GitHub repository 선택
4. **Environment Variables** 설정:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (Anthropic API 키)
5. "Deploy" 클릭

### 3단계: 공유
- 배포 완료 후 `https://your-project.vercel.app` 링크 공유

## 로컬 실행 방법

```bash
npm install
cp .env.local.example .env.local
# .env.local 파일에 실제 API 키 입력
npm run dev
```

## Anthropic API 키 발급
https://console.anthropic.com/api-keys 에서 발급

## 기술 스택
- Next.js 14
- Anthropic Claude API
- Vercel 배포
