/** @type {import('next').NextConfig} */
const nextConfig = {
  // Se quiser manter a configuração, o Next.js agora sugere fazer assim:
  devIndicators: {
    appIsrStatus: false,
  },
  // O aviso de cross-origin é informativo, não trava o projeto no momento.
};

export default nextConfig;