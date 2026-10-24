import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const apexMk3 = localFont({
  src: [
    {
      path: "./fonts/Apex Mk3-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Apex Mk3-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-apex",
  display: "swap",
});

const azeretMono = localFont({
  src: [
    {
      path: "./fonts/AzeretMono[wght].ttf",
      style: "normal",
    },
    {
      path: "./fonts/AzeretMono-Italic[wght].ttf",
      style: "italic",
    },
  ],
  variable: "--font-azeret",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plataforma Comando | Cursos de Tecnologia",
  description:
    "Interface da área do aluno da plataforma de ensino Comando. Cursos práticos em layout inspirado em streaming.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${apexMk3.variable} ${azeretMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 selection:text-neutral-50 font-sans">
        {children}
      </body>
    </html>
  );
}
