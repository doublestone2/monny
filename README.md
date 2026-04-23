# 로가드 불법사채 랜딩페이지 (Next.js)

## 1. 설치
```bash
npm install
```

## 2. 환경변수 설정
`.env.example` 를 복사해서 `.env.local` 로 만든 뒤 값을 넣어주세요.

## 3. 개발 서버 실행
```bash
npm run dev
```

## 4. 구글시트 헤더
Sheet1 1행에 아래 헤더를 먼저 만들어주세요.

```text
접수일시 | 이름 | 연락처 | 피해유형 | 추심강도 | 대여원금(만원) | 상환총액(만원) | 증거보유 | 주변인피해 | 추천조치 | 긴급도 | 요약 | 유입경로 | privacyAgreed
```

## 5. Vercel 배포
- GitHub에 push 후 Vercel에서 import
- 또는 프로젝트 루트에서 `vercel --prod`
- 배포 전 Vercel 프로젝트 환경변수에 `.env.local` 값과 같은 항목을 등록하세요.
