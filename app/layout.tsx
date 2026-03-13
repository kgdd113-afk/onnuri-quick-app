export const metadata = {
  title: "온누리퀵 배송비 조회",
  description: "테스트 페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}