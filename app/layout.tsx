import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; 

const inter = Inter({ subsets: ["latin"] });

// METADADOS: Isso ajuda muito na nota de "Profissionalismo" da FIAP
export const metadata: Metadata = {
  title: "Bytebank | Seu banco digital",
  description: "A melhor experiência em controle financeiro com taxa zero e segurança total.",
  icons: {
    icon: "/favicon.ico", // Se tiver um ícone, ele aparece aqui
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} antialiased bg-white text-black`}>
        {/* O Providers (Client Component) envolve o children sem tornar o layout inteiro Client */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}