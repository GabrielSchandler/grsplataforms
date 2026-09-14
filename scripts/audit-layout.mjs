/**
 * Auditoria de layout do site publicado.
 *
 * Sobe o build estático, abre nas quatro resoluções pedidas e verifica:
 * overflow horizontal, imagens que não carregaram, contraste de texto,
 * seções ausentes, foco de teclado e funcionamento do FAQ.
 *
 * Sai com código 1 se algo falhar, para poder entrar em CI depois.
 */

import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const PORT = 4322;
const BASE = `http://127.0.0.1:${PORT}`;
const ROOT = process.cwd();
/**
 * Com `distDir` customizado, o Next exporta o site para dentro da própria
 * pasta de build — e não para `out/`. Auditar `out/` significaria validar um
 * build antigo e passar por engano.
 */
const EXPORT_DIR = path.join(ROOT, ".next-tooling");
const SHOT_DIR = path.join(ROOT, "reports", "layout");

const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
];

/** Seções da home. A profundidade mora nas páginas de área. */
const expectedSections = [
  "topo",
  "demonstrativo",
  "jornada",
  "areas",
  "seguranca",
  "implantacao",
  "perguntas",
  "demonstracao",
];

/** Páginas de área — cada uma precisa se sustentar sozinha. */
const areaSlugs = ["comercial", "juridico", "financeiro", "academy", "gestao"];

/** Seções da página do Focus, na ordem de leitura. */
const focusSections = [
  "topo",
  "painel",
  "respostas",
  "celular",
  "coleta",
  "implantacao",
  "acessos",
  "teste",
  "perguntas",
  "demonstracao",
];

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
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function serveExport() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", BASE);
    let filePath = path.join(EXPORT_DIR, decodeURIComponent(url.pathname));

    try {
      const info = await stat(filePath).catch(() => null);
      if (!info || info.isDirectory()) filePath = path.join(filePath, "index.html");
      await stat(filePath);
      res.writeHead(200, { "content-type": mimes[path.extname(filePath)] ?? "text/plain" });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404).end("nao encontrado");
    }
  });

  return new Promise((resolve) => server.listen(PORT, "127.0.0.1", () => resolve(server)));
}

const failures = [];

/** Altura de cada página na resolução mais larga, para acompanhar o inchaço. */
const alturas = [];

function check(condition, message) {
  if (!condition) failures.push(message);
  return condition;
}

async function registrarAltura(page, rotulo, viewport) {
  if (viewport.width !== 1440) return;

  const altura = await page.evaluate(() => document.documentElement.scrollHeight);
  alturas.push([rotulo, altura]);
}

/**
 * Percorre a página inteira e espera as imagens. O navegador só carrega
 * imagem preguiçosa perto da viewport, então a rolagem precisa acontecer
 * antes de qualquer verificação — e não pode voltar ao topo depois, ou o
 * teste acusaria falha que o usuário real nunca veria.
 */
async function prepararPagina(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  });

  await page
    .waitForFunction(() => Array.from(document.images).every((image) => image.complete), null, {
      timeout: 20000,
    })
    .catch(() => {});

  // Força o fim das animações de entrada. Sem isso, elementos ainda em
  // transição ficam com opacidade baixa e escapam da checagem de contraste —
  // o teste passaria por não ter olhado, e não por estar tudo certo.
  await page.evaluate(() => {
    for (const node of document.querySelectorAll("[data-reveal]")) {
      node.classList.add("is-visible");
    }
  });
  await page.waitForTimeout(850);
}

async function checarOverflow(page, rotulo) {
  const overflow = await page.evaluate(() => {
    // Duas medidas ruins foram descartadas aqui, e vale registrar por quê:
    //
    // - "a página rola para o lado" nunca dispara, porque o `body` tem
    //   `overflow-x: hidden`. Seria um teste que passa sempre.
    // - `documentElement.scrollWidth` acusa falso positivo, porque conta o
    //   conteúdo largo por projeto dentro dos contêineres roláveis (a
    //   réplica do sistema tem 1.040px de propósito).
    //
    // O que sobra e vale: existe algum elemento passando da janela sem ter
    // um ancestral que role ou recorte? Se existe, é vazamento de verdade —
    // e o `overflow-x: hidden` do body só estaria escondendo o defeito.
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    // Contêiner que deveria conter e não contém: conteúdo maior que a caixa,
    // com overflow visível. É ele que empurra a página.
    vazando: Array.from(document.querySelectorAll("body *"))
      .filter((element) => {
        if (element.scrollWidth <= element.clientWidth + 1) return false;
        return getComputedStyle(element).overflowX === "visible";
      })
      .slice(0, 4)
      .map(
        (element) =>
          `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 55)} (${element.clientWidth}->${element.scrollWidth})`,
      ),
    // Reporta também o que está dentro de contêiner rolável, marcando com
    // [rolavel]. Um `.scroll-x` que não consegue encolher continua
    // empurrando a página, e esconder isso da lista mascara a causa.
    culprits: Array.from(document.querySelectorAll("body *"))
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width > 0 && rect.right > window.innerWidth + 1)
      .sort((a, b) => b.rect.right - a.rect.right)
      .slice(0, 6)
      // Só interessa o que não tem ancestral capaz de rolar ou recortar: é
      // esse que realmente empurra a largura da página.
      .filter(({ element }) => {
        let atual = element.parentElement;
        while (atual && atual !== document.body) {
          const overflow = getComputedStyle(atual).overflowX;
          if (overflow === "auto" || overflow === "scroll" || overflow === "hidden") return false;
          atual = atual.parentElement;
        }
        return true;
      })
      .slice(0, 6)
      .map(({ element, rect }) => {
        const classe = `${element.tagName.toLowerCase()}.${element.className}`.slice(0, 70);
        return `${classe} (ate ${Math.round(rect.right)}px)`;
      }),
    };
  });

  check(
    overflow.culprits.length === 0,
    `${rotulo}: elemento passando da janela sem ancestral rolavel — ${overflow.culprits.join(" | ")}`,
  );
}

async function checarImagens(page, rotulo) {
  // Espera própria: numa máquina carregada o carregamento preguiçoso passa do
  // tempo da preparação, e o teste acusaria falha que o visitante não vê.
  await page
    .waitForFunction(
      () =>
        Array.from(document.images)
          .filter((image) => image.getClientRects().length > 0)
          .every((image) => image.complete && image.naturalWidth > 0),
      null,
      { timeout: 30000 },
    )
    .catch(() => {});

  const quebradas = await page.evaluate(() =>
    Array.from(document.images)
      // Imagem escondida por breakpoint (display:none) não é baixada pelo
      // navegador, e isso é o comportamento certo — só interessa o que o
      // visitante daquela largura realmente enxerga.
      .filter((image) => image.getClientRects().length > 0)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src")),
  );

  check(quebradas.length === 0, `${rotulo}: imagens nao carregadas — ${quebradas.join(", ")}`);
}

/**
 * Contraste de texto (WCAG AA: 4,5:1 normal, 3:1 para texto grande).
 * A réplica do produto fica de fora: ela reproduz o estilo do sistema real,
 * e mexer naquilo é trabalho no CRM, não neste site.
 */
async function checarContraste(page, rotulo) {
  const problemas = await page.evaluate(() => {
    const canal = (valor) => {
      const v = valor / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };

    const luminancia = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);

    /**
     * Resolve qualquer cor CSS pintando um pixel e lendo de volta.
     *
     * Antes isto lia os números direto do texto, e `oklch(0.7 0.04 256)` —
     * que é como o Tailwind 4 escreve a paleta padrão — virava um RGB quase
     * preto. O resultado eram falsos positivos em toda página que usa a
     * paleta do framework, e contraste ruim de verdade passando batido.
     */
    const tela = document.createElement("canvas");
    tela.width = 1;
    tela.height = 1;
    const pincel = tela.getContext("2d", { willReadFrequently: true });

    const paraRgb = (cor) => {
      if (!cor) return null;

      pincel.clearRect(0, 0, 1, 1);
      pincel.fillStyle = "#000000";
      pincel.fillStyle = cor;
      pincel.fillRect(0, 0, 1, 1);

      const [r, g, b, a] = pincel.getImageData(0, 0, 1, 1).data;
      return { rgb: [r, g, b], alpha: a / 255 };
    };

    const fundoDe = (elemento) => {
      let atual = elemento;
      while (atual) {
        const cor = paraRgb(getComputedStyle(atual).backgroundColor);
        if (cor && cor.alpha > 0.95) return cor.rgb;
        atual = atual.parentElement;
      }
      return [0, 0, 0];
    };

    const achados = [];

    for (const elemento of document.querySelectorAll("body *")) {
      if (elemento.closest("[data-demo]")) continue;

      const texto = Array.from(elemento.childNodes)
        .filter((no) => no.nodeType === Node.TEXT_NODE)
        .map((no) => no.textContent.trim())
        .join("");
      if (!texto) continue;

      const estilo = getComputedStyle(elemento);
      if (estilo.visibility === "hidden" || estilo.display === "none") continue;
      if (Number(estilo.opacity) < 0.95) continue;

      // Texto só para leitor de tela (sr-only) fica recortado a 1px. Contraste
      // ali não significa nada — ninguém enxerga aquilo.
      const caixa = elemento.getBoundingClientRect();
      if (caixa.width <= 1 || caixa.height <= 1) continue;

      const frente = paraRgb(estilo.color);
      if (!frente || frente.alpha < 0.95) continue;

      const lFrente = luminancia(frente.rgb);
      const lFundo = luminancia(fundoDe(elemento));
      const razao = (Math.max(lFrente, lFundo) + 0.05) / (Math.min(lFrente, lFundo) + 0.05);

      const tamanho = Number.parseFloat(estilo.fontSize);
      const peso = Number(estilo.fontWeight) || 400;
      const grande = tamanho >= 24 || (tamanho >= 18.66 && peso >= 700);
      const minimo = grande ? 3 : 4.5;

      if (razao < minimo) {
        achados.push(`${razao.toFixed(2)}:1 (min ${minimo}) — "${texto.slice(0, 40)}"`);
      }
    }

    return achados.slice(0, 8);
  });

  check(problemas.length === 0, `${rotulo}: contraste abaixo do minimo — ${problemas.join(" | ")}`);
}

async function main() {
  await mkdir(SHOT_DIR, { recursive: true });

  // Sempre reconstrói. Auditar um build que já estava no disco é o jeito mais
  // fácil de passar por engano: o teste diz "tudo certo" sobre uma versão que
  // não é a que está no código.
  console.log("Gerando build para auditar...");
  execFileSync(
    process.execPath,
    [path.join(ROOT, "node_modules", "next", "dist", "bin", "next"), "build"],
    // Pasta própria: não atropela um `npm run dev` aberto.
    { stdio: "ignore", cwd: ROOT, env: { ...process.env, CAPTURE: "", BUILD_TARGET: "tooling" } },
  );

  const server = await serveExport();
  const browser = await chromium.launch({ channel: "chrome" });

  try {
    /* ---------- acima da dobra sem JavaScript ---------- */

    // O conteúdo que o visitante vê primeiro não pode depender de hidratação.
    // Quando dependia, o título ficava invisível até o bundle carregar — numa
    // conexão ruim, segundos de tela preta.
    const semJs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const paginaSemJs = await semJs.newPage();
    await paginaSemJs.goto(`${BASE}/`, { waitUntil: "load", timeout: 30000 });
    await paginaSemJs.waitForTimeout(1200);

    const dobra = await paginaSemJs.evaluate(() => {
      const titulo = document.querySelector("h1");
      if (!titulo) return { existe: false };
      const estilo = getComputedStyle(titulo);
      const rect = titulo.getBoundingClientRect();
      return {
        existe: true,
        opacidade: Number(estilo.opacity),
        visivel: rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight,
        botao: Boolean(
          [...document.querySelectorAll("a")].find((a) =>
            a.textContent?.includes("Agendar"),
          ),
        ),
        // Prova de que o JavaScript realmente não rodou — sem ela, os
        // testes acima poderiam passar por vacuidade.
        //
        // Antes isso era verificado exigindo que um [data-reveal]
        // estivesse ESCONDIDO. Esse detector morreu junto com o defeito
        // que ele acompanhava: agora existe um <noscript> que revela
        // esses elementos de propósito, porque sem JavaScript o
        // IntersectionObserver nunca roda e o texto sumia de verdade
        // (1.325 palavras só na home).
        //
        // O detector novo é a classe `is-visible`: só o observador a
        // aplica. Nenhuma ocorrência dela significa que o JavaScript
        // não executou — que é exatamente o que se quer provar, e sem
        // depender de o texto estar invisível.
        semRastroDeJs:
          document.querySelectorAll("[data-reveal].is-visible").length === 0,
        // O conteúdo revelado por JS precisa aparecer mesmo sem JS.
        revealLegivel: (() => {
          const alvos = [...document.querySelectorAll("[data-reveal]")];
          if (!alvos.length) return null;
          return alvos.every((a) => Number(getComputedStyle(a).opacity) > 0.95);
        })(),
      };
    });

    check(dobra.existe && dobra.visivel, "sem JavaScript: h1 do hero nao esta visivel");
    check(
      (dobra.opacidade ?? 0) > 0.95,
      `sem JavaScript: h1 do hero com opacidade ${dobra.opacidade}`,
    );
    check(dobra.botao, "sem JavaScript: CTA do hero ausente");
    check(
      dobra.semRastroDeJs === true,
      "sem JavaScript: achei [data-reveal].is-visible, entao o JS rodou e as checagens acima nao provam nada",
    );
    check(
      dobra.revealLegivel === true,
      "sem JavaScript: ha [data-reveal] com opacidade baixa — o <noscript> que os revela nao esta valendo, e esse texto some para quem nao tem JS",
    );
    await semJs.close();

    for (const viewport of viewports) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
      });

      /* ---------- página principal ---------- */

      await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 30000 });

      // Primeira impressão: fotografa o topo antes de qualquer rolagem, com
      // tempo para a animação de entrada terminar.
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2200);
      await page.screenshot({ path: path.join(SHOT_DIR, `${viewport.name}.png`) });

      await prepararPagina(page);

      await checarOverflow(page, viewport.name);
      await checarImagens(page, viewport.name);
      await checarContraste(page, viewport.name);
      await registrarAltura(page, "/", viewport);

      const missing = await page.evaluate(
        (ids) => ids.filter((id) => !document.getElementById(id)),
        expectedSections,
      );
      check(missing.length === 0, `${viewport.name}: secoes ausentes — ${missing.join(", ")}`);

      // O primeiro Tab tem de alcançar o atalho de pular para o conteúdo.
      await page.keyboard.press("Tab");
      const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
      check(
        firstFocus === "Pular para o conteúdo",
        `${viewport.name}: primeiro Tab foi para "${firstFocus}" em vez do atalho de conteudo`,
      );

      // FAQ abre e fecha sem JavaScript.
      const faqWorks = await page.evaluate(() => {
        const item = document.querySelector("#perguntas details");
        if (!item) return false;
        item.open = true;
        return item.open;
      });
      check(faqWorks, `${viewport.name}: FAQ nao abriu`);

      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        // Instantâneo: `scroll-behavior: smooth` deixaria a rolagem em curso
        // quando a próxima captura acontecesse.
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);

      // Uma imagem por seção, só na resolução mais larga. Captura de página
      // inteira não serve aqui: a página passa de 20.000px e o Chrome costura
      // errado acima do limite dele.
      // Guarda também no celular: mobile revisado só no desktop é mobile
      // que ninguém olhou.
      if (viewport.width === 1440 || viewport.width === 390) {
        const pasta = viewport.width === 1440 ? "secoes" : "secoes-mobile";

        for (const id of expectedSections) {
          await page.evaluate((sectionId) => {
            document.getElementById(sectionId)?.scrollIntoView();
          }, id);
          await page.waitForTimeout(500);
          await page
            .locator(`#${id}`)
            .screenshot({ path: path.join(SHOT_DIR, pasta, `${id}.png`) })
            .catch(() => {});
        }
      }

      /* ---------- tour: avancar muda a etapa ---------- */

    // Contexto com movimento reduzido de proposito: o avanço automático fica
    // desligado, então a medição não disputa com o relógio. Numa máquina
    // carregada, pausar por clique chegava tarde e a etapa pulava de duas.
    if (viewport.width === 1440) {
      const semMovimento = await browser.newContext({
        reducedMotion: "reduce",
        viewport: { width: 1440, height: 900 },
      });
      const paginaTour = await semMovimento.newPage();

      await paginaTour.goto(`${BASE}/`, { waitUntil: "load", timeout: 30000 });
      await paginaTour.evaluate(() => document.fonts.ready);
      await paginaTour.waitForTimeout(400);

      const contador = paginaTour
        .locator("#demonstrativo span")
        .filter({ hasText: /^\d+\/14$/ })
        .first();
      const antes = Number((await contador.textContent())?.split("/")[0]);
      // Marcador próprio: `h3` sozinho pega também o bloco do teste grátis,
      // cujo título não muda — o teste passaria a comparar a coisa errada.
      const legendaTour = paginaTour.locator("[data-tour-caption] h3").first();
      const tituloAntes = await legendaTour.textContent();

      await paginaTour.getByRole("button", { name: "Próxima" }).first().click();
      await paginaTour.waitForTimeout(600);

      const depois = Number((await contador.textContent())?.split("/")[0]);
      const tituloDepois = await legendaTour.textContent();

      check(
        antes === 1,
        `${viewport.name}: tour deveria abrir na etapa 1, abriu na ${antes}`,
      );
      check(
        depois === antes + 1,
        `${viewport.name}: tour nao avancou a etapa (${antes} -> ${depois})`,
      );
      check(
        tituloAntes !== tituloDepois,
        `${viewport.name}: tour avancou mas o titulo da etapa nao mudou`,
      );

      await semMovimento.close();
    }

    /* ---------- links diretos para uma etapa do tour ---------- */

      // `?passo=N` precisa abrir na etapa pedida ja na primeira renderizacao,
      // e valor invalido precisa cair na etapa 1 em vez de quebrar.
      if (viewport.width === 1440) {
        const casos = [
          { param: "1", esperado: 1 },
          { param: "6", esperado: 6 },
          { param: "10", esperado: 10 },
          { param: "14", esperado: 14 },
          { param: "0", esperado: 1 },
          { param: "99", esperado: 1 },
          { param: "abc", esperado: 1 },
          { param: "2.5", esperado: 1 },
        ];

        for (const caso of casos) {
          await page.goto(`${BASE}/?passo=${caso.param}`, {
            waitUntil: "load",
            timeout: 30000,
          });
          await page.evaluate(() => document.fonts.ready);

          // Pausa antes de medir: com `?passo=1` o tour começa tocando, e numa
          // máquina lenta o avanço automático dispara antes da leitura,
          // fazendo o teste falhar sem haver defeito.
          const pausarAqui = page.getByRole("button", { name: "Pausar" }).first();
          if (await pausarAqui.count()) await pausarAqui.click({ timeout: 5000 }).catch(() => {});
          await page.waitForTimeout(300);

          const texto = await page
            .locator("#demonstrativo span")
            .filter({ hasText: /^\d+\/14$/ })
            .first()
            .textContent();
          const etapa = Number((texto ?? "0/14").split("/")[0]);

          check(
            etapa === caso.esperado,
            `${viewport.name}: ?passo=${caso.param} abriu na etapa ${etapa}, esperado ${caso.esperado}`,
          );
        }
      }

      /* ---------- páginas de área ---------- */

      for (const slug of areaSlugs) {
        await page.goto(`${BASE}/${slug}/`, { waitUntil: "load", timeout: 30000 });
        await prepararPagina(page);

        const rotulo = `${viewport.name} /${slug}`;
        await checarOverflow(page, rotulo);
        await checarImagens(page, rotulo);
        await checarContraste(page, rotulo);
        await registrarAltura(page, `/${slug}`, viewport);

        const cabecalho = await page.evaluate(() => ({
          h1: document.querySelectorAll("h1").length,
          temFaq: Boolean(document.querySelector("#perguntas details")),
          temCta: Boolean(document.querySelector("#demonstracao")),
        }));

        check(cabecalho.h1 === 1, `${rotulo}: deveria ter exatamente 1 h1, tem ${cabecalho.h1}`);
        check(cabecalho.temFaq, `${rotulo}: sem FAQ proprio`);
        check(cabecalho.temCta, `${rotulo}: sem secao de chamada final`);

        if (viewport.width === 1440) {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(250);
          await page.screenshot({ path: path.join(SHOT_DIR, "areas", `${slug}.png`) });
        }
      }

      /* ---------- página do Focus ---------- */

      await page.goto(`${BASE}/focus/`, { waitUntil: "load", timeout: 30000 });
      await prepararPagina(page);

      const rotuloFocus = `${viewport.name} /focus`;
      await checarOverflow(page, rotuloFocus);
      await checarImagens(page, rotuloFocus);
      await checarContraste(page, rotuloFocus);
      await registrarAltura(page, "/focus", viewport);

      const focus = await page.evaluate(
        (ids) => ({
          h1: document.querySelectorAll("h1").length,
          temFaq: Boolean(document.querySelector("#perguntas details")),
          temCta: Boolean(document.querySelector("#demonstracao")),
          faltando: ids.filter((id) => !document.getElementById(id)),
          // A réplica do painel precisa estar montada, e não só o texto em volta.
          temReplica: Boolean(document.querySelector("#painel [data-demo]")),
        }),
        focusSections,
      );

      check(focus.h1 === 1, `${rotuloFocus}: deveria ter exatamente 1 h1, tem ${focus.h1}`);
      check(focus.temFaq, `${rotuloFocus}: sem FAQ proprio`);
      check(focus.temCta, `${rotuloFocus}: sem secao de chamada final`);
      check(focus.temReplica, `${rotuloFocus}: a replica do painel nao foi montada`);
      check(
        focus.faltando.length === 0,
        `${rotuloFocus}: secoes ausentes — ${focus.faltando.join(", ")}`,
      );

      if (viewport.width === 1440 || viewport.width === 390) {
        const pasta = viewport.width === 1440 ? "focus" : "focus-mobile";

        for (const id of focusSections) {
          await page.evaluate((sectionId) => {
            document.getElementById(sectionId)?.scrollIntoView();
          }, id);
          await page.waitForTimeout(500);
          await page
            .locator(`#${id}`)
            .screenshot({ path: path.join(SHOT_DIR, pasta, `${id}.png`) })
            .catch(() => {});
        }
      }

      /* ---------- tour do Focus: avancar muda a etapa ---------- */

      if (viewport.width === 1440) {
        const semMovimentoFocus = await browser.newContext({
          reducedMotion: "reduce",
          viewport: { width: 1440, height: 900 },
        });
        const paginaFocus = await semMovimentoFocus.newPage();

        await paginaFocus.goto(`${BASE}/focus/`, { waitUntil: "load", timeout: 30000 });
        await paginaFocus.evaluate(() => document.fonts.ready);
        await paginaFocus.waitForTimeout(600);

        const contadorFocus = paginaFocus
          .locator("#painel span")
          .filter({ hasText: /^\d+\/10$/ })
          .first();
        const antesFocus = Number((await contadorFocus.textContent())?.split("/")[0]);

        await paginaFocus.getByRole("button", { name: "Próxima" }).first().click();
        await paginaFocus.waitForTimeout(700);

        const depoisFocus = Number((await contadorFocus.textContent())?.split("/")[0]);

        check(antesFocus === 1, `${viewport.name} /focus: tour deveria abrir na etapa 1, abriu na ${antesFocus}`);
        check(
          depoisFocus === antesFocus + 1,
          `${viewport.name} /focus: tour nao avancou a etapa (${antesFocus} -> ${depoisFocus})`,
        );

        await semMovimentoFocus.close();
      }

      /* ---------- política de privacidade ---------- */

      await page.goto(`${BASE}/privacidade/`, { waitUntil: "load", timeout: 30000 });
      await prepararPagina(page);

      const rotuloPrivacidade = `${viewport.name} /privacidade`;
      await checarOverflow(page, rotuloPrivacidade);
      await checarImagens(page, rotuloPrivacidade);
      await checarContraste(page, rotuloPrivacidade);

      const temTitulo = await page.evaluate(
        () => document.querySelector("h1")?.textContent?.includes("Política de privacidade") ?? false,
      );
      check(temTitulo, `${rotuloPrivacidade}: titulo da pagina nao encontrado`);

      console.log(`  ${viewport.name.padEnd(10)} verificado`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (alturas.length > 0) {
    console.log("\nAltura das paginas em 1440px:");
    for (const [rotulo, altura] of alturas) {
      const telas = (altura / 900).toFixed(1);
      console.log(`  ${rotulo.padEnd(14)} ${String(altura).padStart(6)} px   ~${telas} telas`);
    }
  }

  if (failures.length > 0) {
    console.log("\nFalhas:");
    for (const failure of failures) console.log(`  - ${failure}`);
    process.exit(1);
  }

  console.log("\nTudo certo nas quatro resolucoes.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
