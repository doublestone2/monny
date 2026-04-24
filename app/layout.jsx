import "./globals.css";

export const metadata = {
  title: "LawGuard 로가드 · 불법사채 대응 상담 | 매일법률사무소",
  description:
    "연 20% 초과 이자, 협박 추심, 가족 연락. 변호사가 직접 설계한 3가지 법적 무기로 24시간 내 추심을 멈춥니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}