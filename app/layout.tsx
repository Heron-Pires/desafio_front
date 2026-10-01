import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLATAFORMA COMANDO // Ambiente Tático de Aprendizado",
  description:
    "Ambiente de aprendizado para cursos de tecnologia com estilo visual inspirado na estética tática e industrial de Arknights: Endfield.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0C10] text-[#CBD5E1] tactical-grid-bg selection:bg-[#7C3AED] selection:text-white">
        {children}
      </body>
    </html>
  );
}
