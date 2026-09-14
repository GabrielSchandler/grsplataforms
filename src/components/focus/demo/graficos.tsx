"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { CATEGORIAS } from "./dados";
import { useFocus } from "./estado";
import {
  CORES_TIPO,
  ROTULOS_TIPO,
  ROTULO_BUCKET,
  cn,
  formatarHoras,
  formatarPorcentagem,
  type BucketSerie,
  type TipoCategoria,
} from "./formato";
import { Cartao, Selo, Seletor } from "./kit";
import type { FatiaDistribuicao, PontoSerie } from "./motor";

/**
 * Os três gráficos do painel, refeitos em SVG.
 *
 * O painel usa Recharts; aqui o desenho é feito à mão, com a mesma leitura:
 * áreas empilhadas em curva monotônica, rosca de furo largo e barras
 * horizontais empilhadas. O motivo é peso — a biblioteca custaria mais de
 * 100 kB numa página de venda que já carrega a réplica inteira, e o site tem
 * regra própria sobre isso desde o sistema de movimento.
 */

const COR_OCIOSO = "#64748b";
const COR_EIXO = "#475569";
const COR_GRADE = "#1e293b";

/** Mede a largura disponível: dentro do palco reduzido ela não muda depois. */
function useLargura(padrao: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(padrao);

  useEffect(() => {
    const no = ref.current;
    if (!no) return;

    const medir = () => setLargura(Math.max(260, Math.round(no.clientWidth)));
    medir();

    const observador = new ResizeObserver(medir);
    observador.observe(no);
    return () => observador.disconnect();
  }, []);

  return { ref, largura };
}

const PASSOS_MINUTOS = [15, 30, 60, 120, 180, 240, 360, 480, 720, 1440, 2880, 5760, 11520, 23040, 46080, 92160];

function escalaY(maximo: number) {
  for (const passo of PASSOS_MINUTOS) {
    if (maximo / passo <= 4.2) {
      return { passo, topo: Math.max(passo, Math.ceil(maximo / passo) * passo) };
    }
  }
  const passo = PASSOS_MINUTOS[PASSOS_MINUTOS.length - 1];
  return { passo, topo: Math.max(passo, Math.ceil(maximo / passo) * passo) };
}

const rotuloMinutos = (valor: number) => (valor >= 120 ? `${Math.round(valor / 60)}h` : `${valor}m`);

/* -------------------------------------------------------------------------
   Curva monotônica (a mesma do Recharts: curveMonotoneX)
   ------------------------------------------------------------------------- */

function tangentes(xs: number[], ys: number[]): number[] {
  const n = xs.length;
  if (n < 2) return [0];

  const dx: number[] = [];
  const inclinacao: number[] = [];

  for (let i = 0; i < n - 1; i += 1) {
    dx[i] = xs[i + 1] - xs[i] || 1;
    inclinacao[i] = (ys[i + 1] - ys[i]) / dx[i];
  }

  const t: number[] = new Array(n).fill(0);
  t[0] = inclinacao[0];
  t[n - 1] = inclinacao[n - 2];

  for (let i = 1; i < n - 1; i += 1) {
    if (inclinacao[i - 1] * inclinacao[i] <= 0) {
      t[i] = 0;
    } else {
      const p1 = 2 * dx[i] + dx[i - 1];
      const p2 = dx[i] + 2 * dx[i - 1];
      t[i] = (p1 + p2) / (p1 / inclinacao[i - 1] + p2 / inclinacao[i]);
    }
  }

  return t;
}

function curva(pontos: [number, number][]): string {
  if (pontos.length === 0) return "";
  if (pontos.length === 1) {
    const [x, y] = pontos[0];
    return `M ${x - 6} ${y} L ${x + 6} ${y}`;
  }

  const xs = pontos.map((p) => p[0]);
  const ys = pontos.map((p) => p[1]);
  const t = tangentes(xs, ys);

  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < pontos.length - 1; i += 1) {
    const dx = (xs[i + 1] - xs[i]) / 3;
    d += ` C ${xs[i] + dx} ${ys[i] + t[i] * dx} ${xs[i + 1] - dx} ${ys[i + 1] - t[i + 1] * dx} ${xs[i + 1]} ${ys[i + 1]}`;
  }
  return d;
}

/* -------------------------------------------------------------------------
   Área empilhada — composição do tempo e curva do índice
   ------------------------------------------------------------------------- */

type Visao = "composicao" | "indice";

const SERIES = [
  { chave: "produtivo", nome: "Produtivo", cor: CORES_TIPO.PRODUCTIVE },
  { chave: "neutro", nome: "Neutro", cor: CORES_TIPO.NEUTRAL },
  { chave: "improdutivo", nome: "Improdutivo", cor: CORES_TIPO.UNPRODUCTIVE },
  { chave: "ocioso", nome: "Ocioso", cor: COR_OCIOSO },
] as const;

export function GraficoArea({
  dados,
  bucket,
  periodoRotulo,
  titulo = "Produtividade ao longo do período",
}: {
  dados: PontoSerie[];
  bucket: BucketSerie;
  periodoRotulo: string;
  titulo?: string;
}) {
  const { layout } = useFocus();
  const [visao, setVisao] = useState<Visao>("composicao");
  const [ativo, setAtivo] = useState<number | null>(null);
  const altura = layout === "celular" ? 232 : 288;
  const { ref, largura } = useLargura(layout === "celular" ? 320 : 500);

  const vazio = dados.length === 0 || dados.every((d) => d.ativo + d.ocioso === 0);
  const legendaEixo = `${periodoRotulo} · ${ROTULO_BUCKET[bucket]}`;

  const margem = { topo: 8, direita: 8, base: 24, esquerda: 38 };
  const larguraPlot = Math.max(40, largura - margem.esquerda - margem.direita);
  const alturaPlot = altura - margem.topo - margem.base;

  const maximo = useMemo(() => {
    if (visao === "indice") return 100;
    return Math.max(
      1,
      ...dados.map((d) => d.produtivo + d.neutro + d.improdutivo + d.ocioso),
    );
  }, [dados, visao]);

  const { passo, topo } = visao === "indice" ? { passo: 25, topo: 100 } : escalaY(maximo);

  const x = (indice: number) =>
    margem.esquerda +
    (dados.length <= 1 ? larguraPlot / 2 : (indice / (dados.length - 1)) * larguraPlot);
  const y = (valor: number) => margem.topo + alturaPlot - (valor / topo) * alturaPlot;

  const marcas: number[] = [];
  for (let valor = 0; valor <= topo + 0.001; valor += passo) marcas.push(valor);

  const saltoRotulo = Math.max(1, Math.ceil((dados.length * 34) / larguraPlot));
  const ponto = ativo !== null ? dados[ativo] : null;

  return (
    <Cartao className="p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-slate-200">{titulo}</h3>
          <p className="text-xs text-slate-500">
            {legendaEixo} ·{" "}
            {visao === "composicao" ? "minutos por categoria" : "% de tempo produtivo"}
          </p>
        </div>

        <div className="flex gap-1 rounded-lg border border-foco-borda bg-foco-suave p-1">
          {(
            [
              ["composicao", "Composição"],
              ["indice", "Índice"],
            ] as const
          ).map(([valor, rotulo]) => (
            <button
              key={valor}
              type="button"
              onClick={() => setVisao(valor)}
              aria-pressed={visao === valor}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                visao === valor
                  ? "bg-cyan-500/15 text-cyan-300"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      {vazio ? (
        <div
          className="flex flex-col items-center justify-center gap-2 text-center"
          style={{ height: altura }}
        >
          <p className="text-sm text-slate-400">Sem atividade registrada no período</p>
          <p className="text-xs text-slate-600">
            Os dados aparecem aqui assim que os agentes sincronizarem.
          </p>
        </div>
      ) : (
        <div ref={ref} className="relative" style={{ height: altura }}>
          <svg
            width={largura}
            height={altura}
            role="img"
            aria-label={`${titulo}: ${legendaEixo}`}
            onPointerLeave={() => setAtivo(null)}
            onPointerMove={(evento) => {
              const caixa = evento.currentTarget.getBoundingClientRect();
              const escala = caixa.width / largura || 1;
              const posicao = (evento.clientX - caixa.left) / escala;
              const indice = Math.round(
                ((posicao - margem.esquerda) / larguraPlot) * Math.max(1, dados.length - 1),
              );
              setAtivo(Math.min(dados.length - 1, Math.max(0, indice)));
            }}
          >
            <defs>
              {SERIES.map((serie) => (
                <linearGradient key={serie.chave} id={`foco-${serie.chave}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={serie.cor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={serie.cor} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>

            {marcas.map((valor) => (
              <g key={valor}>
                <line
                  x1={margem.esquerda}
                  x2={largura - margem.direita}
                  y1={y(valor)}
                  y2={y(valor)}
                  stroke={COR_GRADE}
                  strokeDasharray="3 3"
                />
                <text
                  x={margem.esquerda - 8}
                  y={y(valor) + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill={COR_EIXO}
                >
                  {visao === "indice" ? `${valor}%` : rotuloMinutos(valor)}
                </text>
              </g>
            ))}

            {dados.map((dado, indice) =>
              indice % saltoRotulo === 0 ? (
                <text
                  key={dado.chave}
                  x={x(indice)}
                  y={altura - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fill={COR_EIXO}
                >
                  {dado.rotulo}
                </text>
              ) : null,
            )}

            {visao === "composicao" ? (
              <AreasEmpilhadas dados={dados} x={x} y={y} base={margem.topo + alturaPlot} />
            ) : (
              <LinhaIndice dados={dados} x={x} y={y} />
            )}

            {ponto ? (
              <line
                x1={x(ativo!)}
                x2={x(ativo!)}
                y1={margem.topo}
                y2={margem.topo + alturaPlot}
                stroke="#334155"
              />
            ) : null}
          </svg>

          {ponto ? (
            <div
              className="pointer-events-none absolute top-2 rounded-lg border border-foco-borda bg-foco-cartao/95 px-3 py-2 text-xs"
              style={{
                left: Math.min(Math.max(0, x(ativo!) - 70), Math.max(0, largura - 170)),
                width: 168,
              }}
            >
              <p className="mb-1.5 font-medium text-slate-300">{ponto.rotuloCompleto}</p>
              {visao === "composicao" ? (
                <>
                  {SERIES.map((serie) => (
                    <p key={serie.chave} className="flex items-center gap-2 text-slate-400">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: serie.cor }}
                      />
                      {serie.nome}:{" "}
                      <span className="text-slate-200">
                        {formatarHoras(ponto[serie.chave])}
                      </span>
                    </p>
                  ))}
                  <p className="mt-1.5 border-t border-foco-borda pt-1.5 text-slate-500">
                    total:{" "}
                    <span className="text-slate-300">
                      {formatarHoras(
                        ponto.produtivo + ponto.neutro + ponto.improdutivo + ponto.ocioso,
                      )}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-slate-400">
                  Índice:{" "}
                  <span className="text-slate-100">
                    {ponto.indice === null ? "sem classificação" : formatarPorcentagem(ponto.indice, 1)}
                  </span>
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}

      {!vazio && visao === "composicao" ? (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {SERIES.map((serie) => (
            <span key={serie.chave} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ background: serie.cor }} />
              {serie.nome}
            </span>
          ))}
        </div>
      ) : null}
    </Cartao>
  );
}

function AreasEmpilhadas({
  dados,
  x,
  y,
  base,
}: {
  dados: PontoSerie[];
  x: (indice: number) => number;
  y: (valor: number) => number;
  base: number;
}) {
  const acumulados = dados.map(() => 0);

  return (
    <>
      {SERIES.map((serie) => {
        const superior: [number, number][] = [];
        const inferior: [number, number][] = [];

        dados.forEach((dado, indice) => {
          const anterior = acumulados[indice];
          const atual = anterior + dado[serie.chave];
          acumulados[indice] = atual;
          superior.push([x(indice), y(atual)]);
          inferior.push([x(indice), y(anterior)]);
        });

        const caminhoSuperior = curva(superior);
        const caminhoInferior = curva([...inferior].reverse());
        const area =
          dados.length === 1
            ? `${caminhoSuperior} L ${x(0) + 6} ${base} L ${x(0) - 6} ${base} Z`
            : `${caminhoSuperior} L ${inferior[inferior.length - 1][0]} ${inferior[inferior.length - 1][1]} ${caminhoInferior.replace(/^M/, "L")} Z`;

        return (
          <g key={serie.chave}>
            <path d={area} fill={`url(#foco-${serie.chave})`} />
            <path d={caminhoSuperior} fill="none" stroke={serie.cor} strokeWidth={2} />
          </g>
        );
      })}
    </>
  );
}

function LinhaIndice({
  dados,
  x,
  y,
}: {
  dados: PontoSerie[];
  x: (indice: number) => number;
  y: (valor: number) => number;
}) {
  const pontos: [number, number][] = [];
  dados.forEach((dado, indice) => {
    if (dado.indice === null) return;
    pontos.push([x(indice), y(dado.indice)]);
  });

  return (
    <>
      <path d={curva(pontos)} fill="none" stroke={CORES_TIPO.PRODUCTIVE} strokeWidth={2.5} />
      {pontos.map(([px, py]) => (
        <circle key={`${px}-${py}`} cx={px} cy={py} r={2.5} fill={CORES_TIPO.PRODUCTIVE} />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------
   Rosca de distribuição por aplicativo / site
   ------------------------------------------------------------------------- */

function arco(cx: number, cy: number, raioInterno: number, raioExterno: number, de: number, ate: number) {
  const ponto = (raio: number, grau: number) => {
    const rad = (grau * Math.PI) / 180;
    return [cx + raio * Math.cos(rad), cy - raio * Math.sin(rad)];
  };

  const grande = ate - de > 180 ? 1 : 0;
  const [x1, y1] = ponto(raioExterno, de);
  const [x2, y2] = ponto(raioExterno, ate);
  const [x3, y3] = ponto(raioInterno, ate);
  const [x4, y4] = ponto(raioInterno, de);

  return [
    `M ${x1} ${y1}`,
    `A ${raioExterno} ${raioExterno} 0 ${grande} 0 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${raioInterno} ${raioInterno} 0 ${grande} 1 ${x4} ${y4}`,
    "Z",
  ].join(" ");
}

export function GraficoDonut({
  dados,
  titulo = "Distribuição por aplicativo / site",
  podeClassificar = false,
}: {
  dados: FatiaDistribuicao[];
  titulo?: string;
  podeClassificar?: boolean;
}) {
  const { layout } = useFocus();
  const [ativo, setAtivo] = useState<string | null>(null);
  const total = dados.reduce((soma, fatia) => soma + fatia.minutos, 0);
  const semCategoria = dados.filter((fatia) => !fatia.tipo).length;

  let angulo = 0;
  const fatias = dados.map((fatia) => {
    const abertura = total > 0 ? (fatia.minutos / total) * 360 : 0;
    const de = angulo;
    const ate = angulo + Math.max(0, abertura - 2);
    angulo += abertura;
    return { fatia, de, ate };
  });

  const destacada = dados.find((fatia) => fatia.nome === ativo) ?? null;

  return (
    <Cartao className="p-5">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-slate-200">{titulo}</h3>
          <p className="text-xs text-slate-500">tempo em primeiro plano no período</p>
        </div>
        {podeClassificar && semCategoria > 0 ? (
          <Selo variante="ocioso">{semCategoria} sem categoria</Selo>
        ) : null}
      </div>

      {total === 0 ? (
        <div className="flex h-[288px] items-center justify-center text-center text-sm text-slate-500">
          Sem uso registrado no período
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center gap-5",
            layout === "desktop" && "xl:flex-row",
          )}
        >
          <div className="relative h-[200px] w-[200px] shrink-0">
            <svg width={200} height={200} role="img" aria-label={titulo}>
              {fatias.map(({ fatia, de, ate }) => (
                <path
                  key={fatia.nome}
                  d={arco(100, 100, 62, ativo === fatia.nome ? 96 : 92, de, ate)}
                  fill={fatia.cor}
                  opacity={ativo === null || ativo === fatia.nome ? 1 : 0.55}
                  onPointerEnter={() => setAtivo(fatia.nome)}
                  onPointerLeave={() => setAtivo(null)}
                />
              ))}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {destacada ? (
                <>
                  <span className="max-w-[120px] truncate text-sm font-medium text-slate-100">
                    {destacada.nome}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatarHoras(destacada.minutos)}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {ROTULOS_TIPO[destacada.tipo ?? "SEM"]}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl font-semibold text-slate-100">
                    {formatarHoras(total)}
                  </span>
                  <span className="text-xs text-slate-500">total</span>
                </>
              )}
            </div>
          </div>

          <ul className="w-full space-y-2">
            {dados.map((fatia) => {
              const parte = (fatia.minutos / total) * 100;
              return (
                <li key={fatia.nome} className="space-y-1.5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: fatia.cor }}
                    />
                    <span className="min-w-0 flex-1 truncate text-slate-300" title={fatia.nome}>
                      {fatia.nome}
                    </span>
                    {!fatia.tipo && !podeClassificar ? (
                      <Selo className="shrink-0">sem categoria</Selo>
                    ) : null}
                    <span className="w-10 shrink-0 text-right text-xs text-slate-500">
                      {formatarPorcentagem(parte, 0)}
                    </span>
                    <span className="w-16 shrink-0 text-right text-slate-400">
                      {formatarHoras(fatia.minutos)}
                    </span>
                  </div>

                  {!fatia.tipo && podeClassificar ? <ClassificarAqui alvo={fatia.nome} /> : null}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Cartao>
  );
}

/**
 * Classificar sem sair do painel. Tempo sem categoria fica de fora do índice,
 * e o lugar onde isso incomoda é justamente aqui — olhando a distribuição e
 * vendo "sem categoria" no que mais consumiu tempo.
 */
function ClassificarAqui({ alvo }: { alvo: string }) {
  const { classificar } = useFocus();
  const [tipo, setTipo] = useState("");
  const [pronto, setPronto] = useState(false);

  if (pronto) {
    return (
      <p className="flex items-center gap-1.5 pl-5 text-xs text-emerald-400">
        <Check aria-hidden="true" className="h-3.5 w-3.5" />
        classificado — o índice já considera
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pl-5">
      <Seletor
        aria-label={`Categoria de ${alvo}`}
        className="w-40"
        valor={tipo}
        aoMudar={setTipo}
        opcoes={[
          { valor: "", rotulo: "sem categoria" },
          ...CATEGORIAS.map((categoria) => ({ valor: categoria.id, rotulo: categoria.nome })),
        ]}
      />
      <button
        type="button"
        disabled={!tipo}
        onClick={() => {
          classificar(alvo, tipo as TipoCategoria);
          setPronto(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-foco-borda px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Classificar
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Barras horizontais empilhadas — comparativo entre equipes e pessoas
   ------------------------------------------------------------------------- */

export type BarraComparativa = {
  id: string;
  nome: string;
  produtivo: number;
  neutro: number;
  improdutivo: number;
  indice: number | null;
};

export function GraficoBarras({
  dados,
  titulo,
  subtitulo,
}: {
  dados: BarraComparativa[];
  titulo: string;
  subtitulo?: string;
}) {
  const { layout } = useFocus();
  const [ativo, setAtivo] = useState<string | null>(null);
  const { ref, largura } = useLargura(layout === "celular" ? 320 : 860);

  const vazio =
    dados.length === 0 ||
    dados.every((d) => d.produtivo + d.neutro + d.improdutivo === 0);

  const alturaBanda = 38;
  const margem = { topo: 6, direita: 16, base: 26, esquerda: layout === "celular" ? 92 : 132 };
  const altura = Math.max(200, dados.length * alturaBanda + margem.topo + margem.base);
  const larguraPlot = Math.max(40, largura - margem.esquerda - margem.direita);

  const maximo = Math.max(1, ...dados.map((d) => d.produtivo + d.neutro + d.improdutivo));
  const { passo, topo } = escalaY(maximo);
  const x = (valor: number) => margem.esquerda + (valor / topo) * larguraPlot;

  const marcas: number[] = [];
  for (let valor = 0; valor <= topo + 0.001; valor += passo) marcas.push(valor);

  const destacada = dados.find((d) => d.id === ativo) ?? null;

  return (
    <Cartao className="p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-200">{titulo}</h3>
        {subtitulo ? <p className="text-xs text-slate-500">{subtitulo}</p> : null}
      </div>

      {vazio ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-slate-500">
          Sem dados suficientes para comparar no período
        </div>
      ) : (
        <div ref={ref} className="relative">
          <svg width={largura} height={altura} role="img" aria-label={titulo}>
            {marcas.map((valor) => (
              <g key={valor}>
                <line
                  x1={x(valor)}
                  x2={x(valor)}
                  y1={margem.topo}
                  y2={altura - margem.base}
                  stroke={COR_GRADE}
                  strokeDasharray="3 3"
                />
                <text
                  x={x(valor)}
                  y={altura - margem.base + 16}
                  textAnchor="middle"
                  fontSize={11}
                  fill={COR_EIXO}
                >
                  {rotuloMinutos(valor)}
                </text>
              </g>
            ))}

            {dados.map((item, indice) => {
              const y = margem.topo + indice * alturaBanda;
              const alturaBarra = alturaBanda - 12;
              const partes = [
                { valor: item.produtivo, cor: CORES_TIPO.PRODUCTIVE },
                { valor: item.neutro, cor: CORES_TIPO.NEUTRAL },
                { valor: item.improdutivo, cor: CORES_TIPO.UNPRODUCTIVE },
              ];

              let acumulado = 0;

              return (
                <g
                  key={item.id}
                  onPointerEnter={() => setAtivo(item.id)}
                  onPointerLeave={() => setAtivo(null)}
                >
                  <rect
                    x={margem.esquerda}
                    y={y}
                    width={larguraPlot}
                    height={alturaBanda}
                    fill={ativo === item.id ? "rgba(30,41,59,0.4)" : "transparent"}
                  />
                  <text
                    x={margem.esquerda - 10}
                    y={y + alturaBanda / 2 + 4}
                    textAnchor="end"
                    fontSize={11}
                    fill="#94a3b8"
                  >
                    {item.nome.length > (layout === "celular" ? 12 : 18)
                      ? `${item.nome.slice(0, layout === "celular" ? 12 : 18)}…`
                      : item.nome}
                  </text>

                  {partes.map((parte, posicao) => {
                    const inicio = x(acumulado);
                    acumulado += parte.valor;
                    const fim = x(acumulado);
                    const larguraParte = Math.max(0, fim - inicio);
                    if (larguraParte <= 0) return null;

                    return (
                      <rect
                        key={posicao}
                        x={inicio}
                        y={y + 6}
                        width={larguraParte}
                        height={alturaBarra}
                        fill={parte.cor}
                        rx={posicao === 2 ? 4 : 0}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {destacada ? (
            <div className="pointer-events-none absolute right-2 top-2 rounded-lg border border-foco-borda bg-foco-cartao/95 px-3 py-2 text-xs">
              <p className="mb-1.5 font-medium text-slate-200">{destacada.nome}</p>
              <p className="flex items-center gap-2 text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ background: CORES_TIPO.PRODUCTIVE }} />
                Produtivo: <span className="text-slate-200">{formatarHoras(destacada.produtivo)}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ background: CORES_TIPO.NEUTRAL }} />
                Neutro: <span className="text-slate-200">{formatarHoras(destacada.neutro)}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ background: CORES_TIPO.UNPRODUCTIVE }} />
                Improdutivo:{" "}
                <span className="text-slate-200">{formatarHoras(destacada.improdutivo)}</span>
              </p>
              <p className="mt-1.5 border-t border-foco-borda pt-1.5 text-slate-500">
                total{" "}
                {formatarHoras(destacada.produtivo + destacada.neutro + destacada.improdutivo)} ·
                índice{" "}
                <span className="text-slate-300">
                  {destacada.indice === null ? "—" : formatarPorcentagem(destacada.indice, 1)}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      )}
    </Cartao>
  );
}
