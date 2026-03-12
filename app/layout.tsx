export const metadata = {
  title: "비교견적서 자동 생성",
  description: "PDF 업로드 후 비교견적서 생성",
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