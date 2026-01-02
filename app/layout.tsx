'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Importe o nosso StoreProvider (um wrapper que criaremos para o Redux)
import { Providers } from "./providers"; 

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} antialiased`}>
        {/* 2. Envolva o children com o Providers do Redux */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}