import type { NextConfig } from "next";

// Build estático: roda igual na Vercel e no GitHub Pages.
// O formulário aponta para o WhatsApp, então não há rota de API a preservar.
// As páginas usadas só para gerar imagem terminam em `.capture.tsx` e apenas
// entram no roteamento quando CAPTURE=1. No build de produção elas não existem.
const pageExtensions =
  process.env.CAPTURE === "1" ? ["capture.tsx", "tsx", "ts"] : ["tsx", "ts"];

// Os scripts de captura e auditoria rodam `next build` por conta própria. Se
// escrevessem na mesma pasta que o `next dev`, derrubariam o servidor de
// desenvolvimento no meio do trabalho — então cada um constrói em outro lugar.
//
// Captura e auditoria também não podem dividir a mesma pasta: elas usam
// `pageExtensions` diferentes, e o cache de uma faz a outra sair sem as rotas
// de captura. Uma pasta por finalidade.
const distDirPorAlvo: Record<string, string> = {
  capture: ".next-capture",
  tooling: ".next-tooling",
};

const distDir = distDirPorAlvo[process.env.BUILD_TARGET ?? ""] ?? ".next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  pageExtensions,
  distDir,
};

export default nextConfig;
