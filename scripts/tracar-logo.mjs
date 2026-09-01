/**
 * Vetoriza o símbolo da marca a partir do PNG original da identidade.
 *
 * Rodar só quando a marca mudar:  node scripts/tracar-logo.mjs <arquivo.png>
 * A saída vai para stdout e para _recebidas/simbolo-tracado.svg; os paths
 * entram à mão em src/components/site/logo.tsx.
 *
 * Como funciona: separa a imagem em máscaras por cor (preto, vermelho),
 * inunda o fundo a partir da borda para descobrir o que é vazado, extrai o
 * contorno de cada componente por vizinhança de Moore e simplifica com
 * Ramer-Douglas-Peucker. O resultado bate com o desenho original em vez de
 * ser uma aproximação feita no olho.
 *
 * O PNG original NÃO está versionado aqui — arquivo-mestre de marca não é
 * assunto do repositório do site. Ele vive no acervo de identidade.
 */

import sharp from "sharp";

const LADO = 700;                 // resolucao de trabalho do tracado
const entrada = process.argv[2] || "_recebidas/simbolo.png";
const { data, info } = await sharp(entrada)
  .resize(LADO, LADO, { kernel: "lanczos3" })
  .raw().toBuffer({ resolveWithObject: true });

const W = info.width, H = info.height, C = info.channels;
const cor = (i) => [data[i * C], data[i * C + 1], data[i * C + 2]];

// 0 fundo · 1 preto · 2 vermelho · 3 filete claro (definido depois)
const rotulo = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) {
  const [r, g, b] = cor(i);
  if (r > 175 && g < 110 && b < 110) rotulo[i] = 2;
  else if (r < 90 && g < 90 && b < 90) rotulo[i] = 1;
  else rotulo[i] = 0;
}

// O filete e claro e nao encosta na borda. Inunda o fundo a partir da borda;
// o que sobrar de claro e o filete.
const doFundo = new Uint8Array(W * H);
const fila = [];
for (let x = 0; x < W; x++) { fila.push(x, (H - 1) * W + x); }
for (let y = 0; y < H; y++) { fila.push(y * W, y * W + W - 1); }
while (fila.length) {
  const i = fila.pop();
  if (doFundo[i] || rotulo[i] !== 0) continue;
  doFundo[i] = 1;
  const x = i % W, y = (i / W) | 0;
  if (x > 0) fila.push(i - 1);
  if (x < W - 1) fila.push(i + 1);
  if (y > 0) fila.push(i - W);
  if (y < H - 1) fila.push(i + W);
}
for (let i = 0; i < W * H; i++) if (rotulo[i] === 0 && !doFundo[i]) rotulo[i] = 3;

// Componentes conexos de um rotulo
function componentes(alvo) {
  const visto = new Uint8Array(W * H), saida = [];
  for (let s = 0; s < W * H; s++) {
    if (visto[s] || rotulo[s] !== alvo) continue;
    const pilha = [s], pix = [];
    visto[s] = 1;
    while (pilha.length) {
      const i = pilha.pop();
      pix.push(i);
      const x = i % W, y = (i / W) | 0;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (!visto[j] && rotulo[j] === alvo) { visto[j] = 1; pilha.push(j); }
      }
    }
    if (pix.length > 400) saida.push(new Set(pix));
  }
  return saida;
}

// Contorno pela vizinhanca de Moore, sentido horario
function contorno(conj) {
  let inicio = -1;
  for (const i of conj) if (inicio === -1 || i < inicio) inicio = i;
  const dentro = (x, y) => x >= 0 && y >= 0 && x < W && y < H && conj.has(y * W + x);
  const viz = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  let px = inicio % W, py = (inicio / W) | 0, dir = 6;
  const pontos = [[px, py]];
  for (let passo = 0; passo < 400000; passo++) {
    let achou = false;
    for (let k = 0; k < 8; k++) {
      const d = (dir + 6 + k) % 8;
      const nx = px + viz[d][0], ny = py + viz[d][1];
      if (dentro(nx, ny)) { px = nx; py = ny; dir = d; achou = true; break; }
    }
    if (!achou) break;
    if (px === (inicio % W) && py === ((inicio / W) | 0) && pontos.length > 2) break;
    pontos.push([px, py]);
  }
  return pontos;
}

// Ramer-Douglas-Peucker
function simplificar(pts, eps) {
  if (pts.length < 3) return pts;
  const dist = (p, a, b) => {
    const [x, y] = p, [x1, y1] = a, [x2, y2] = b;
    const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
    if (L === 0) return Math.hypot(x - x1, y - y1);
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / L));
    return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
  };
  const rec = (ini, fim) => {
    let pior = 0, idx = -1;
    for (let i = ini + 1; i < fim; i++) {
      const d = dist(pts[i], pts[ini], pts[fim]);
      if (d > pior) { pior = d; idx = i; }
    }
    if (pior > eps) return [...rec(ini, idx), ...rec(idx, fim).slice(1)];
    return [pts[ini], pts[fim]];
  };
  return rec(0, pts.length - 1);
}

// Caixa da marca, para normalizar o viewBox
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let i = 0; i < W * H; i++) {
  if (rotulo[i] === 0) continue;
  const x = i % W, y = (i / W) | 0;
  if (x < x0) x0 = x; if (x > x1) x1 = x;
  if (y < y0) y0 = y; if (y > y1) y1 = y;
}
const larg = x1 - x0, alt = y1 - y0, escala = 100 / Math.max(larg, alt);
const fmt = (v) => Math.round(v * 100) / 100;
const caminho = (pts) =>
  "M " + pts.map(([x, y]) => `${fmt((x - x0) * escala)},${fmt((y - y0) * escala)}`).join(" L ") + " Z";

const grupos = { 1: [], 2: [], 3: [] };
for (const alvo of [1, 2, 3]) {
  for (const comp of componentes(alvo)) {
    const bruto = contorno(comp);
    const simples = simplificar(bruto, 1.6);
    grupos[alvo].push({ d: caminho(simples), n: simples.length, area: comp.size });
  }
}

console.log("caixa da marca:", larg + "x" + alt, "| viewBox 0 0 100", fmt(alt * escala));
for (const [k, nome] of [[1, "preto"], [2, "vermelho"], [3, "filete"]]) {
  for (const g of grupos[k]) console.log(`  ${nome.padEnd(9)} area=${String(g.area).padStart(6)}  vertices=${g.n}`);
}

const cores = { 1: "currentColor", 2: "#E31B23", 3: "#FFFFFF" };
const corpo = [1, 2, 3].flatMap((k) =>
  grupos[k].map((g) => `      <path fill="${cores[k]}" d="${g.d}" />`)
).join("\n");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${fmt(alt * escala)}">\n${corpo}\n</svg>\n`;
await import("node:fs").then((fs) => fs.writeFileSync("_recebidas/simbolo-tracado.svg", svg));
console.log("\nsimbolo-tracado.svg escrito |", svg.length, "bytes");
