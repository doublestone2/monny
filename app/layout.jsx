import './globals.css';

export const metadata = {
  title: 'LawGuard 로가드 · 불법사채 대응 상담 | 매일법률사무소',
  description: '매일법률사무소 로가드 불법사채·불법추심 대응 랜딩페이지',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
