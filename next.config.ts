import type { NextConfig } from "next";

// Build estático: roda igual na Vercel e no GitHub Pages.
// O formulário aponta para o WhatsApp, então não há rota de API a preservar.
// As páginas usadas só para gerar imagem terminam em `.capture.tsx` e apenas
// entram no roteamento quando CAPTURE=1. No build de produção elas não existem.
const pageExtensions =
  process.env.CAPTURE === "1" ? ["capture.tsx", "tsx", "ts"] : ["tsx", "ts"];

// Os scripts de captura e auditoria rodam `next build` por conta própria. Se
// escrevessem na mesma pasta que o `next dev`, derrubariam o servidor de
// desenvolvimento no meio do trabalho — então eles constroem em outro lugar.
const distDir = process.env.BUILD_TARGET === "tooling" ? ".next-tooling" : ".next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  pageExtensions,
  distDir,
};

export default nextConfig;
