"use client";

/**
 * Gráficos da réplica, em SVG à mão. O painel usa Recharts; aqui a decisão é
 * outra (README do site: economiza mais de 100 kB numa página de venda), mas
 * o desenho segue o do painel — mesmas cores, eixos, legendas e rodapés.
 */

import { useState } from "react";
import { Activity, CalendarRange, LineChart, PieChart } from "lucide-react";
import {
  CORES_CATEGORIA,
  CORES_EXPEDIENTE,
  ORDEM_EXPEDIENTE,
  ROTULOS_CATEGORIA,
  ROTULOS_EXPEDIENTE,
  cn,
  formatarDuracao,
  formatarPorcentagemEnxuta,
  hhmm,
  type FatiaExpediente,
  type TipoCategoria,
} from "./formato";
import { Cartao, Secao } from "./kit";
import type { EstadoLinha, Minutos, PontoAtividade, PontoEvolucao, SegmentoLinha } from "./motor";
import type { Escala } from "./dados";

/* ------------------------------------------------- Uso do expediente */

/** A barra empilhada do expediente. `rotulos` escreve o % dentro das fatias largas. */
export function BarraExpediente({ minutos, rotulos = false, altura = "h-3" }: { minutos: Minutos; rotulos?: boolean; altura?: string }) {
  const total = minutos.expediente;
  if (total <= 0) return <span className="text-[12px] text-slate-500">—</span>;

  return (
    <div className={cn("flex w-full overflow-hidden rounded-md bg-slate-100", altura)}>
      {ORDEM_EXPEDIENTE.map((k) => {
        const pct = (minutos[k] / total) * 100;
        if (pct <= 0) return null;
        const escuro = k === "produtivos" || k === "neutros" || k === "improdutivos";
        return (
          <div
            key={k}
            className={cn(
              "foco-num flex h-full min-w-0 items-center justify-center overflow-hidden border-r border-white/70 text-[11px] font-semibold last:border-r-0",
              escuro ? "text-white" : "text-slate-800",
              k === "semDados" && "foco-sem-dados",
            )}
            style={{ width: `${pct}%`, background: k === "semDados" ? undefined : CORES_EXPEDIENTE[k] }}
            title={`${ROTULOS_EXPEDIENTE[k]}: ${formatarDuracao(minutos[k])} (${formatarPorcentagemEnxuta(pct)})`}
          >
            {rotulos && pct >= 5 && formatarPorcentagemEnxuta(Math.round(pct))}
          </div>
        );
      })}
    </div>
  );
}

function Bolinha({ k }: { k: FatiaExpediente }) {
  return (
    <span
      className={cn("h-2.5 w-2.5 shrink-0 rounded-full", k === "semDados" && "foco-sem-dados border border-slate-300")}
      style={{ background: k === "semDados" ? undefined : CORES_EXPEDIENTE[k] }}
    />
  );
}

export function LegendaExpediente({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-slate-600", className)}>
      {ORDEM_EXPEDIENTE.map((k) => (
        <span key={k} className="flex items-center gap-1.5">
          <Bolinha k={k} />
          {ROTULOS_EXPEDIENTE[k]}
        </span>
      ))}
    </div>
  );
}

/**
 * Como o expediente foi ocupado, em HORAS SOMADAS do recorte; o percentual de
 * cada fatia é sobre o expediente total. Por isso o "Produtivo" daqui pode
 * diferir do índice do topo, que é média por pessoa.
 */
export function UsoExpediente({ minutos, colunas = 7, ...resto }: { minutos: Minutos; colunas?: 4 | 7 } & { "data-tour"?: string }) {
  const total = minutos.expediente;
  return (
    <Cartao className="flex flex-col p-5" {...resto}>
      <div className="flex items-start gap-3">
        <LineChart aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-foco-acao" strokeWidth={1.75} />
        <div>
          <h2 className="text-[16px] font-semibold text-slate-900">Como o expediente foi utilizado</h2>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {total <= 0 ? "Sem expediente previsto no período" : `${formatarDuracao(total)} de expediente previsto · horas somadas do recorte`}
          </p>
        </div>
      </div>

      {total <= 0 ? (
        <p className="mt-6 text-[13px] text-slate-500">Nada a compor: ninguém do recorte tem expediente aqui.</p>
      ) : (
        <>
          <BarraExpediente minutos={minutos} rotulos altura="mt-5 h-11" />
          <dl className={cn("mt-5 grid gap-y-4", colunas === 7 ? "grid-cols-[repeat(7,auto)] justify-between" : "grid-cols-4")}>
            {ORDEM_EXPEDIENTE.map((k, i) => (
              <div key={k} className={cn("flex min-w-0 flex-col gap-1 pr-3", colunas === 7 && i > 0 && "border-l border-foco-borda pl-3")}>
                <dt className="flex items-center gap-1.5 whitespace-nowrap text-[11.5px] text-slate-600">
                  <Bolinha k={k} />
                  {ROTULOS_EXPEDIENTE[k]}
                </dt>
                <dd className="foco-num whitespace-nowrap pl-4 text-[13px] font-semibold text-slate-900">{formatarDuracao(minutos[k])}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-auto pt-4 text-[11.5px] text-slate-500">
            Sem dados pode indicar máquina desligada, atraso de envio ou interrupção da coleta.
          </p>
        </>
      )}
    </Cartao>
  );
}

/* ------------------------------------------------ Evolução do índice */

const COR_ANTERIOR = "#9aa5b4";

/**
 * O índice do expediente ao longo do período, com o período anterior
 * tracejado ao lado. Responde "está melhorando?" sem trocar de período.
 */
export function GraficoEvolucao({
  pontos,
  descricao,
  temAnterior,
  ...resto
}: { pontos: PontoEvolucao[]; descricao: string; temAnterior: boolean } & { "data-tour"?: string }) {
  const [foco, setFoco] = useState<number | null>(null);
  const L = 560;
  const A = 200;
  const m = { e: 40, d: 10, t: 10, b: 26 };
  const larg = L - m.e - m.d;
  const alt = A - m.t - m.b;
  const n = Math.max(1, pontos.length - 1);
  const x = (i: number) => m.e + (pontos.length === 1 ? larg / 2 : (i / n) * larg);
  const y = (v: number) => m.t + alt - (v / 100) * alt;

  const caminho = (chave: "atual" | "anterior") =>
    pontos
      .map((p, i) => ({ v: p[chave], i }))
      .filter((p): p is { v: number; i: number } => p.v !== null)
      .map((p, j) => `${j === 0 ? "M" : "L"}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`)
      .join(" ");

  const passo = Math.max(1, Math.ceil(pontos.length / 8));
  const vazio = pontos.every((p) => p.atual === null && p.anterior === null);
  const ponto = foco !== null ? pontos[foco] : null;

  return (
    <Cartao className="flex flex-col p-5" {...resto}>
      <div className="flex items-start gap-3">
        <LineChart aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-foco-acao" strokeWidth={1.75} />
        <div>
          <h3 className="text-[16px] font-semibold text-slate-900">Evolução do tempo produtivo</h3>
          <p className="mt-0.5 text-[13px] text-slate-500">{descricao} · média por pessoa, % do expediente</p>
        </div>
      </div>

      {vazio ? (
        <div className="flex h-[200px] items-center justify-center text-[13px] text-slate-600">Sem expediente registrado nesta janela</div>
      ) : (
        <>
          <div className="relative mt-4">
            <svg viewBox={`0 0 ${L} ${A}`} className="h-auto w-full" role="img" aria-label="Evolução do tempo produtivo">
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line x1={m.e} x2={L - m.d} y1={y(v)} y2={y(v)} stroke="#e8ecf2" />
                  <text x={m.e - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#64748b">
                    {v}%
                  </text>
                </g>
              ))}
              <line x1={m.e} x2={L - m.d} y1={y(0)} y2={y(0)} stroke="#cbd5e1" />
              {pontos.map((p, i) =>
                i % passo === 0 ? (
                  <text key={p.chave} x={x(i)} y={A - 6} textAnchor="middle" fontSize="11" fill="#64748b">
                    {p.rotulo}
                  </text>
                ) : null,
              )}
              {temAnterior && (
                <>
                  <path d={caminho("anterior")} fill="none" stroke={COR_ANTERIOR} strokeWidth="1.75" strokeDasharray="5 4" />
                  {pontos.map((p, i) => (p.anterior !== null ? <circle key={`a${p.chave}`} cx={x(i)} cy={y(p.anterior)} r="2.6" fill={COR_ANTERIOR} /> : null))}
                </>
              )}
              <path d={caminho("atual")} fill="none" stroke={CORES_EXPEDIENTE.produtivos} strokeWidth="2.25" />
              {pontos.map((p, i) => (p.atual !== null ? <circle key={`c${p.chave}`} cx={x(i)} cy={y(p.atual)} r="3.2" fill={CORES_EXPEDIENTE.produtivos} /> : null))}
              {foco !== null && <line x1={x(foco)} x2={x(foco)} y1={m.t} y2={y(0)} stroke="#cbd5e1" />}
              {pontos.map((p, i) => (
                <rect
                  key={`h${p.chave}`}
                  x={x(i) - larg / n / 2}
                  y={m.t}
                  width={larg / n}
                  height={alt}
                  fill="transparent"
                  onMouseEnter={() => setFoco(i)}
                  onMouseLeave={() => setFoco(null)}
                />
              ))}
            </svg>
            {ponto && foco !== null && (
              <div
                className="pointer-events-none absolute top-2 z-10 rounded-lg border border-foco-borda bg-white px-3 py-2 text-[11.5px] shadow-[0_12px_32px_-8px_rgba(16,24,40,0.18)]"
                style={{ left: `${Math.min(70, Math.max(5, (x(foco) / L) * 100 - 10))}%` }}
              >
                <p className="mb-1 font-medium text-slate-800">{ponto.rotuloCompleto}</p>
                <p className="text-slate-600">
                  Período atual: <span className="foco-num font-medium text-slate-900">{ponto.atual === null ? "sem expediente" : formatarPorcentagemEnxuta(ponto.atual)}</span>
                </p>
                {temAnterior && (
                  <p className="text-slate-600">
                    Período anterior: <span className="foco-num font-medium text-slate-900">{ponto.anterior === null ? "sem expediente" : formatarPorcentagemEnxuta(ponto.anterior)}</span>
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12px] text-slate-600">
            <span className="flex items-center gap-2">
              <svg width="30" height="10" aria-hidden="true">
                <line x1="0" y1="5" x2="30" y2="5" stroke={CORES_EXPEDIENTE.produtivos} strokeWidth="2.25" />
                <circle cx="15" cy="5" r="3.5" fill={CORES_EXPEDIENTE.produtivos} />
              </svg>
              Período atual
            </span>
            {temAnterior && (
              <span className="flex items-center gap-2">
                <svg width="30" height="10" aria-hidden="true">
                  <line x1="0" y1="5" x2="30" y2="5" stroke={COR_ANTERIOR} strokeWidth="1.75" strokeDasharray="5 4" />
                  <circle cx="15" cy="5" r="3" fill={COR_ANTERIOR} />
                </svg>
                Período anterior
              </span>
            )}
          </div>
          <p className="mt-2 text-center text-[11.5px] text-slate-500">
            Dias com menos de 50% de cobertura ficam fora da linha: a queda seria falta de dado, não de trabalho.
          </p>
        </>
      )}
    </Cartao>
  );
}

/* --------------------------------------------- Atividade ao longo do período */

const SERIES_ATIVIDADE: { chave: keyof Omit<PontoAtividade, "chave" | "rotulo" | "rotuloCompleto">; rotulo: string; cor: string }[] = [
  { chave: "produtivo", rotulo: "Produtivo", cor: CORES_EXPEDIENTE.produtivos },
  { chave: "neutro", rotulo: "Neutro", cor: CORES_EXPEDIENTE.neutros },
  { chave: "improdutivo", rotulo: "Improdutivo", cor: CORES_EXPEDIENTE.improdutivos },
  { chave: "sem", rotulo: "Sem classificação", cor: CORES_EXPEDIENTE.semClassificar },
  { chave: "ocioso", rotulo: "Ocioso", cor: CORES_EXPEDIENTE.ociosos },
];

export function GraficoAtividade({ pontos, rotuloPeriodo }: { pontos: PontoAtividade[]; rotuloPeriodo: string }) {
  const [foco, setFoco] = useState<number | null>(null);
  const L = 1000;
  const A = 230;
  const m = { e: 44, d: 8, t: 10, b: 26 };
  const larg = L - m.e - m.d;
  const alt = A - m.t - m.b;
  const total = (p: PontoAtividade) => SERIES_ATIVIDADE.reduce((s, sr) => s + p[sr.chave], 0);
  const maior = Math.max(60, ...pontos.map(total));
  const teto = Math.ceil(maior / 60 / 4) * 4 * 60 || 60;
  const banda = larg / Math.max(1, pontos.length);
  const barra = Math.min(34, banda * 0.66);
  const y = (v: number) => m.t + alt - (v / teto) * alt;
  const passo = Math.max(1, Math.ceil(pontos.length / 14));
  const ponto = foco !== null ? pontos[foco] : null;

  return (
    <Secao icone={<Activity />} titulo="Produtividade ao longo do período" subtitulo={`${rotuloPeriodo} · horas ativas por categoria, dentro e fora da escala`}>
      <div className="relative">
        <svg viewBox={`0 0 ${L} ${A}`} className="h-auto w-full" role="img" aria-label="Horas ativas por categoria ao longo do período">
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1={m.e} x2={L - m.d} y1={y(teto * f)} y2={y(teto * f)} stroke="#e8ecf2" />
              <text x={m.e - 8} y={y(teto * f) + 4} textAnchor="end" fontSize="11" fill="#64748b">
                {Math.round((teto * f) / 60)}h
              </text>
            </g>
          ))}
          {pontos.map((p, i) => {
            let base = 0;
            const cx = m.e + banda * i + banda / 2;
            return (
              <g key={p.chave} onMouseEnter={() => setFoco(i)} onMouseLeave={() => setFoco(null)}>
                <rect x={cx - banda / 2} y={m.t} width={banda} height={alt} fill={foco === i ? "rgba(148,163,184,0.12)" : "transparent"} />
                {SERIES_ATIVIDADE.map((s) => {
                  const v = p[s.chave];
                  if (v <= 0) return null;
                  const topo = y(base + v);
                  const h = y(base) - topo;
                  base += v;
                  return <rect key={s.chave} x={cx - barra / 2} y={topo} width={barra} height={h} fill={s.cor} />;
                })}
                {i % passo === 0 && (
                  <text x={cx} y={A - 6} textAnchor="middle" fontSize="11" fill="#64748b">
                    {p.rotulo}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {ponto && foco !== null && (
          <div
            className="pointer-events-none absolute top-1 z-10 rounded-lg border border-foco-borda bg-white px-3 py-2 text-[11.5px] shadow-[0_12px_32px_-8px_rgba(16,24,40,0.18)]"
            style={{ left: `${Math.min(78, Math.max(4, ((m.e + banda * foco) / L) * 100 - 6))}%` }}
          >
            <p className="mb-1 font-medium text-slate-800">{ponto.rotuloCompleto}</p>
            {SERIES_ATIVIDADE.map((s) => (
              <p key={s.chave} className="flex items-center gap-2 text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ background: s.cor }} />
                {s.rotulo}: <span className="foco-num font-medium text-slate-900">{formatarDuracao(ponto[s.chave])}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11.5px] text-slate-600">
        {SERIES_ATIVIDADE.map((s) => (
          <span key={s.chave} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.cor }} />
            {s.rotulo}
          </span>
        ))}
      </div>
    </Secao>
  );
}

/* ---------------------------------------------------------------- Ritmo */

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/**
 * Ritmo do dia: quando o time rende. A parte cheia da barra é o tempo
 * PRODUTIVO; o restante é o ativo não produtivo — é o que separa "muita gente
 * online" de "muita gente rendendo".
 */
export function SecaoRitmo({
  horas,
  mapa,
}: {
  horas: { ativo: number; produtivo: number }[];
  mapa: number[][];
}) {
  let ini = 24;
  let fim = 0;
  horas.forEach((v, h) => {
    if (v.ativo > 0) {
      ini = Math.min(ini, h);
      fim = Math.max(fim, h);
    }
  });
  if (ini > fim) [ini, fim] = [8, 18];
  const faixa = Array.from({ length: fim - ini + 1 }, (_, i) => ini + i);
  const maxHora = Math.max(1, ...horas.map((v) => v.ativo));
  const maxCelula = Math.max(1, ...mapa.flat());

  return (
    <div className="space-y-4">
      <Secao
        icone={<Activity />}
        titulo="Ritmo por hora do dia"
        subtitulo="Tempo ativo somado em cada hora do período · a parte cheia é produtiva"
        acao={
          <div className="flex items-center gap-3 pt-1 text-[11.5px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CORES_EXPEDIENTE.produtivos }} />
              Produtivo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-200" />
              Ativo (demais)
            </span>
          </div>
        }
      >
        <div className="flex items-end gap-1" style={{ height: 140 }}>
          {faixa.map((h) => {
            const v = horas[h];
            const altura = (v.ativo / maxHora) * 100;
            const pctProd = v.ativo > 0 ? (v.produtivo / v.ativo) * 100 : 0;
            return (
              <div key={h} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <div
                  className="relative w-full overflow-hidden rounded-t bg-slate-200"
                  style={{ height: `${Math.max(2, altura)}%` }}
                  title={`${String(h).padStart(2, "0")}h · ${formatarDuracao(v.ativo)} ativos · ${formatarDuracao(v.produtivo)} produtivos`}
                >
                  <div className="absolute inset-x-0 bottom-0" style={{ height: `${pctProd}%`, background: CORES_EXPEDIENTE.produtivos }} />
                </div>
                <span className="foco-num text-[9.5px] text-slate-500">{h % 2 === 0 ? `${h}h` : ""}</span>
              </div>
            );
          })}
        </div>
      </Secao>

      <Secao icone={<CalendarRange />} titulo="Mapa de calor — dia da semana × hora" subtitulo="Tempo ativo · quanto mais escura a célula, mais atividade">
        <div className="foco-rolagem overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="mb-1 flex pl-9">
              {faixa.map((h) => (
                <span key={h} className="foco-num flex-1 text-center text-[9.5px] text-slate-500">
                  {h % 2 === 0 ? h : ""}
                </span>
              ))}
            </div>
            {DIAS.map((rotulo, d) => (
              <div key={rotulo} className="mb-1 flex items-center">
                <span className="w-9 shrink-0 text-[11px] text-slate-500">{rotulo}</span>
                {faixa.map((h) => {
                  const v = mapa[d][h];
                  const intensidade = v / maxCelula;
                  return (
                    <span
                      key={h}
                      className="mx-px h-5 flex-1 rounded-[3px]"
                      title={`${rotulo} ${String(h).padStart(2, "0")}h · ${formatarDuracao(v)}`}
                      style={{ background: v > 0 ? `rgba(31, 159, 178, ${0.12 + intensidade * 0.88})` : "#f1f5f9" }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Secao>
    </div>
  );
}

/* ------------------------------------------------------------- Rosca */

type Chave = TipoCategoria | "SEM";
const ORDEM_CATEGORIA: Chave[] = ["PRODUCTIVE", "NEUTRAL", "UNPRODUCTIVE", "SEM"];

/** Quantos aplicativos e sites caem em cada categoria, com o tempo de cada grupo. */
export function DonutCategorias({ quantidades, minutos }: { quantidades: Record<Chave, number>; minutos: Record<Chave, number> }) {
  const total = ORDEM_CATEGORIA.reduce((s, k) => s + quantidades[k], 0);
  const R = 60;
  const r = 41;
  let angulo = -Math.PI / 2;
  const arcos = ORDEM_CATEGORIA.filter((k) => quantidades[k] > 0).map((k) => {
    const fatia = (quantidades[k] / Math.max(1, total)) * Math.PI * 2;
    const a0 = angulo;
    const a1 = angulo + fatia - 0.015;
    angulo += fatia;
    const grande = fatia > Math.PI ? 1 : 0;
    const p = (raio: number, a: number) => `${(70 + raio * Math.cos(a)).toFixed(2)},${(70 + raio * Math.sin(a)).toFixed(2)}`;
    return {
      k,
      d: `M${p(R, a0)} A${R},${R} 0 ${grande} 1 ${p(R, a1)} L${p(r, a1)} A${r},${r} 0 ${grande} 0 ${p(r, a0)} Z`,
    };
  });

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
          {arcos.map((a) => (
            <path key={a.k} d={a.d} fill={CORES_CATEGORIA[a.k]} />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="foco-num text-[22px] font-bold text-foco-tinta">{total}</span>
          <span className="text-[11px] text-slate-500">itens</span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {ORDEM_CATEGORIA.map((k) => (
          <li key={k} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2.5 text-[12.5px]">
            <span className="flex items-center gap-2 text-slate-700">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CORES_CATEGORIA[k] }} />
              {ROTULOS_CATEGORIA[k]}
            </span>
            <span className="foco-num text-right font-medium text-slate-900">
              {quantidades[k]} <span className="font-normal text-slate-500">({total ? Math.round((quantidades[k] / total) * 100) : 0}%)</span>
            </span>
            <span className="foco-num whitespace-nowrap text-right text-[11px] text-slate-500">{formatarDuracao(minutos[k])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const IconeRosca = PieChart;

/* -------------------------------------------------- Linha do tempo do dia */

const COR_ESTADO: Record<EstadoLinha, string> = {
  PRODUTIVO: CORES_EXPEDIENTE.produtivos,
  NEUTRO: CORES_EXPEDIENTE.neutros,
  IMPRODUTIVO: CORES_EXPEDIENTE.improdutivos,
  SEM: CORES_EXPEDIENTE.semClassificar,
  OCIOSO: CORES_EXPEDIENTE.ociosos,
  BLOQUEADO: CORES_EXPEDIENTE.bloqueado,
};

export const ROTULO_ESTADO: Record<EstadoLinha, string> = {
  PRODUTIVO: "Produtivo",
  NEUTRO: "Neutro",
  IMPRODUTIVO: "Improdutivo",
  SEM: "Sem classificação",
  OCIOSO: "Ocioso",
  BLOQUEADO: "Bloqueado",
};

/**
 * Um dia de uma pessoa, minuto a minuto: cada trecho com a cor do estado, o
 * expediente previsto como moldura tracejada e o intervalo marcado. Buraco é
 * "sem dados" — pode ser máquina desligada, agente parado ou envio atrasado.
 */
export function LinhaDoTempoDia({ segmentos, escala }: { segmentos: SegmentoLinha[]; escala: Escala | null }) {
  if (segmentos.length === 0 && !escala) {
    return (
      <p className="rounded-lg border border-dashed border-foco-borda py-8 text-center text-[13px] text-slate-500">
        Sem registro neste dia e sem expediente previsto.
      </p>
    );
  }

  const menor = Math.min(escala?.inicio ?? 24 * 60, ...segmentos.map((t) => t.de));
  const maior = Math.max(escala?.fim ?? 0, ...segmentos.map((t) => t.ate));
  const eixoIni = Math.max(0, Math.floor(menor / 60) * 60 - 60);
  const eixoFim = Math.min(24 * 60, Math.ceil(maior / 60) * 60 + 60);
  const largura = eixoFim - eixoIni;
  const pos = (m: number) => `${((m - eixoIni) / largura) * 100}%`;
  const tam = (a: number, b: number) => `${(Math.max(0, b - a) / largura) * 100}%`;
  const horas = Array.from({ length: largura / 60 + 1 }, (_, i) => eixoIni + i * 60);
  const presentes = new Set(segmentos.map((t) => t.estado));

  return (
    <div className="foco-rolagem overflow-x-auto">
      <div className="min-w-[620px] px-3">
        <div className="relative mb-1 h-5 text-[10.5px] text-slate-500">
          {horas.map((h) => (
            <span key={h} className="foco-num absolute -translate-x-1/2" style={{ left: pos(h) }}>
              {String(h / 60).padStart(2, "0")}h
            </span>
          ))}
        </div>
        <div className="foco-sem-dados relative h-11 overflow-hidden rounded-md">
          {segmentos.map((t) => (
            <span
              key={t.de}
              title={`${ROTULO_ESTADO[t.estado]}${t.alvo ? ` · ${t.alvo}` : ""} · ${hhmm(t.de)}–${hhmm(t.ate)} (${t.ate - t.de} min)`}
              className="absolute top-0 h-full"
              style={{ left: pos(t.de), width: tam(t.de, t.ate), background: COR_ESTADO[t.estado] }}
            />
          ))}
          {escala && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 h-full rounded-md border-2 border-dashed border-slate-500/50"
              style={{ left: pos(escala.inicio), width: tam(escala.inicio, escala.fim) }}
            />
          )}
        </div>
        {escala && (
          <div className="relative h-7">
            <span
              className="absolute top-1 whitespace-nowrap rounded border border-dashed border-slate-300 bg-white px-1.5 text-[10.5px] text-slate-600"
              style={{ left: pos(escala.intervaloInicio) }}
            >
              Intervalo {hhmm(escala.intervaloInicio)}–{hhmm(escala.intervaloFim)}
            </span>
          </div>
        )}
        <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-slate-600", !escala && "mt-3")}>
          {(Object.keys(ROTULO_ESTADO) as EstadoLinha[])
            .filter((e) => presentes.has(e))
            .map((e) => (
              <span key={e} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COR_ESTADO[e] }} />
                {ROTULO_ESTADO[e]}
              </span>
            ))}
          <span className="flex items-center gap-1.5">
            <span className="foco-sem-dados h-2.5 w-4 rounded-sm border border-slate-300" />
            Sem dados
          </span>
          {escala && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-4 rounded-sm border-2 border-dashed border-slate-500/50" />
              Expediente {hhmm(escala.inicio)}–{hhmm(escala.fim)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------- Comparativo de jornada */

export type JornadaPessoaDia = {
  colaboradorId: string;
  colaborador: string;
  trabalha: boolean;
  escala: Escala;
  blocos: [number, number][];
  primeiro: number | null;
  ultimo: number | null;
  fora: number;
};

/**
 * Um dia, pessoa a pessoa: a escala prevista (contorno tracejado, intervalo
 * vazado) e os blocos de 15 min com registro (cheio dentro da escala,
 * listrado fora dela). Mostra de relance quem começa antes e quem estende —
 * sem transformar nada disso em ponto.
 */
export function ComparativoJornada({ dias, aoAbrir }: { dias: JornadaPessoaDia[]; aoAbrir: (id: string) => void }) {
  const comAlgo = dias.filter((d) => d.trabalha || d.blocos.length > 0);
  if (comAlgo.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-foco-borda py-8 text-center text-[13px] text-slate-500">
        Nenhum expediente previsto nem registro neste dia.
      </p>
    );
  }

  const minimos = comAlgo.flatMap((d) => [d.trabalha ? d.escala.inicio : 24 * 60, ...(d.blocos.length ? [d.blocos[0][0]] : [])]);
  const maximos = comAlgo.flatMap((d) => [d.trabalha ? d.escala.fim : 0, ...(d.blocos.length ? [d.blocos[d.blocos.length - 1][0] + 15] : [])]);
  const inicio = Math.max(0, Math.floor(Math.min(...minimos) / 60) * 60 - 60);
  const fim = Math.min(24 * 60, Math.ceil(Math.max(...maximos) / 60) * 60 + 60);
  const largura = fim - inicio;
  const pos = (m: number) => `${((m - inicio) / largura) * 100}%`;
  const horas = Array.from({ length: largura / 60 + 1 }, (_, i) => inicio + i * 60);

  return (
    <div>
      <div className="foco-rolagem overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="relative ml-36 mr-16 h-6 text-[10.5px] text-slate-500">
            {horas.map((h) => (
              <span key={h} className="foco-num absolute -translate-x-1/2" style={{ left: pos(h) }}>
                {String(h / 60).padStart(2, "0")}h
              </span>
            ))}
          </div>
          <ul className="space-y-1.5">
            {comAlgo.map((d) => {
              const e = d.escala;
              const dentro = (m: number) => d.trabalha && m >= e.inicio && m < e.fim && !(m >= e.intervaloInicio && m < e.intervaloFim);
              return (
                <li key={d.colaboradorId} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => aoAbrir(d.colaboradorId)}
                    className="w-36 shrink-0 truncate pr-3 text-left text-[13px] text-slate-800 hover:text-foco-acao hover:underline"
                    title={d.primeiro !== null ? `Primeiro registro ${hhmm(d.primeiro)} · último ${hhmm(d.ultimo)}` : "Sem registro no dia"}
                  >
                    {d.colaborador}
                  </button>
                  <div className="relative h-6 flex-1 rounded bg-slate-50">
                    {horas.map((h) => (
                      <span key={h} className="absolute top-0 h-full w-px bg-slate-200/70" style={{ left: pos(h) }} />
                    ))}
                    {d.trabalha && (
                      <span
                        className="absolute top-0.5 h-5 rounded border border-dashed border-slate-400"
                        style={{ left: pos(e.inicio), width: `${((e.fim - e.inicio) / largura) * 100}%` }}
                      />
                    )}
                    {d.blocos.map(([m, registrados]) => (
                      <span
                        key={m}
                        title={`${hhmm(m)}–${hhmm(m + 15)} · ${Math.round(registrados)} min com registro`}
                        className={cn("absolute top-1.5 h-3", dentro(m) ? "bg-foco-marca" : "foco-fora")}
                        style={{ left: pos(m), width: `${(15 / largura) * 100}%`, opacity: Math.max(0.35, Math.min(1, registrados / 15)) }}
                      />
                    ))}
                    {d.trabalha && (
                      <span
                        className="absolute top-0.5 flex h-5 items-center justify-center rounded border border-dashed border-slate-300 bg-white text-[9.5px] text-slate-500"
                        style={{ left: pos(e.intervaloInicio), width: `${((e.intervaloFim - e.intervaloInicio) / largura) * 100}%` }}
                      >
                        intervalo
                      </span>
                    )}
                  </div>
                  <span className="foco-num w-16 shrink-0 text-right text-[11px] text-slate-500">{formatarDuracao(d.fora)} fora</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 rounded border border-dashed border-slate-400" /> Expediente previsto
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 rounded bg-foco-marca" /> Registro dentro da escala
        </span>
        <span className="flex items-center gap-2">
          <span className="foco-fora h-3 w-6 rounded" /> Registro fora da escala
        </span>
        <span>Blocos de 15 min</span>
      </div>
    </div>
  );
}
