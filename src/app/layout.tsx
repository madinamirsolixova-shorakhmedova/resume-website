import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Генератор ATS-резюме | Скачать DOCX и PDF",
  description:
    "Пошаговый мастер создания профессионального ATS-совместимого резюме под конкретную вакансию. Скачивание в форматах DOCX (Word) и PDF с кириллицей. 100% приватность.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
