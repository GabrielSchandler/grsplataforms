/**
 * Gera as imagens das telas demonstrativas e a imagem de Open Graph.
 *
 * As telas são os mesmos componentes React usados no demo interativo, então
 * imagem e demo nunca divergem. Nada aqui toca o CRM real: os dados vêm de
 * src/components/demo/data.ts, que é inteiramente fictício.
 *
 * Roda sobre um build estático com CAPTURE=1 servido localmente, e não sobre
 * o `next dev` — sem HMR, o carregamento termina de verdade e a captura fica
 * determinística. Usa o Chrome instalado na máquina em vez de baixar o
 * Chromium do Playwright.
 */

import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const PORT = 4321;
const BASE = `http://127.0.0.1:${PORT}`;
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "img", "telas");
const PUBLIC_DIR = path.join(ROOT, "public");
/**
 * Com `distDir` customizado, o Next exporta o site para dentro da própria
 * pasta de build — e não para `out/`. Servir `out/` aqui significaria
 * fotografar um build antigo, então o servidor aponta para onde a exportação
 * realmente caiu.
 */
const EXPORT_DIR = path.join(ROOT, ".next-capture");

/**
 * Só entram aqui as telas que aparecem como imagem em alguma página. As
 * demais existem apenas dentro do demo navegável, onde são renderizadas ao
 * vivo — gerar imagem delas seria peso no repositório sem nenhum uso.
 */
const screens = [
  // Jornada da home
  "distribuicao-leads",
  "pipeline",
  "esteira-juridica",
  "painel-comercial",
  // Páginas de área
  "relatorio-pdf",
  "imagem-resumo",
  "portal-cliente",
  "academy",
];

/** Chama o Next diretamente pelo Node — sem npx e sem shell intermediário. */
function nextBuild({ capture = false } = {}) {
  execFileSync(
    process.execPath,
    [path.join(ROOT, "node_modules", "next", "dist", "bin", "next"), "build"],
    {
      env: {
        ...process.env,
        // CAPTURE liga as rotas /capturas. Sempre explícito, para uma variável
        // deixada no ambiente não vazar de um build para o outro.
        CAPTURE: capture ? "1" : "",
        // Cada finalidade tem a própria pasta de build: não derruba um
        // `npm run dev` aberto, e o cache de um build não contamina o outro,
        // que usa `pageExtensions` diferente.
        BUILD_TARGET: capture ? "capture" : "tooling",
      },
      stdio: "inherit",
      cwd: ROOT,
    },
  );
}

const mimes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

/** Servidor mínimo para o diretório exportado. */
function serveExport() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", BASE);
    let filePath = path.join(EXPORT_DIR, decodeURIComponent(url.pathname));

    try {
      const info = await stat(filePath).catch(() => null);

      if (!info || info.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }

      await stat(filePath);
      res.writeHead(200, { "content-type": mimes[path.extname(filePath)] ?? "text/plain" });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404).end("nao encontrado");
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

/** Dimensões finais de cada arquivo, consumidas pelo componente Screenshot. */
const manifest = {};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Remove imagens de telas que não existem mais, para o repositório não
  // acumular arquivo órfão que ninguém referencia.
  const existentes = await readdir(OUT_DIR).catch(() => []);
  for (const arquivo of existentes) {
    const id = arquivo.replace(/\.webp$/, "");
    if (!screens.includes(id)) {
      await rm(path.join(OUT_DIR, arquivo), { force: true });
      console.log(`  removido: ${arquivo} (tela nao existe mais)`);
    }
  }

  console.log("Gerando build de captura (CAPTURE=1)...");
  nextBuild({ capture: true });

  // Confere que o build de captura realmente exportou as rotas. Sem isso, a
  // falha aparece lá na frente como "timeout esperando #alvo", que não diz
  // nada sobre a causa.
  const sonda = path.join(EXPORT_DIR, "capturas", screens[0], "index.html");
  if (!(await stat(sonda).catch(() => null))) {
    throw new Error(
      `O build com CAPTURE=1 nao exportou ${sonda}. Verifique pageExtensions em next.config.ts.`,
    );
  }

  const server = await serveExport();
  console.log("Build servido em " + BASE + ". Abrindo o Chrome.\n");

  const browser = await chromium.launch({ channel: "chrome" });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 2,
    });

    for (const id of screens) {
      await page.goto(`${BASE}/capturas/${id}/`, { waitUntil: "load", timeout: 30000 });
      await page.waitForSelector("#alvo", { timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);

      const raw = await page.locator("#alvo").screenshot({ type: "png" });
      const file = path.join(OUT_DIR, `${id}.webp`);

      // A imagem aparece em no máximo ~1090px de largura; 2048 cobre telas
      // 2x sem carregar o dobro de bytes à toa.
      const info = await sharp(raw).resize({ width: 2048 }).webp({ quality: 80 }).toFile(file);

      // Miniatura de 16px embutida como base64: o navegador mostra o borrão
      // no primeiro quadro e troca pela imagem quando ela chega, em vez de
      // deixar um retângulo vazio e depois estourar o conteúdo na tela.
      const borrao = await sharp(raw).resize({ width: 16 }).webp({ quality: 32 }).toBuffer();

      manifest[id] = {
        width: info.width,
        height: info.height,
        blur: `data:image/webp;base64,${borrao.toString("base64")}`,
      };

      const { size } = await stat(file);
      console.log(`  ${id.padEnd(20)} ${(size / 1024).toFixed(0)} KB  ${info.width}x${info.height}`);
    }

    // Open Graph em PNG: formato que todo agregador aceita sem discussão.
    await page.goto(`${BASE}/capturas/og/`, { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector("#alvo", { timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);

    const ogRaw = await page.locator("#alvo").screenshot({ type: "png" });
    const ogFile = path.join(PUBLIC_DIR, "og.png");
    await sharp(ogRaw).resize(1200, 630).png({ compressionLevel: 9 }).toFile(ogFile);

    const { size: ogSize } = await stat(ogFile);
    console.log(`  ${"og.png".padEnd(20)} ${(ogSize / 1024).toFixed(0)} KB`);
  } finally {
    await browser.close();
    server.close();
  }

  // O componente lê estas dimensões para reservar o espaço da imagem.
  await writeFile(
    path.join(ROOT, "src", "content", "screenshot-sizes.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log("\nRefazendo o build de producao (sem as rotas de captura)...");
  nextBuild();

  console.log("Pronto.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
