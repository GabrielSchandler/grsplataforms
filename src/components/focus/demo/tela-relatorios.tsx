"use client";

/**
 * Relatórios — `app/painel/relatorios/page.tsx`. Quatro relatórios com os
 * mesmos filtros e critérios do painel, e uma prévia das primeiras linhas
 * antes de gerar o arquivo.
 */

import { AppWindow, CalendarDays, CheckCircle2, Download, Eye, SlidersHorizontal, Users, UsersRound } from "lucide-react";
import { useFocus, type TipoRelatorio } from "./estado";
import { SeletorEquipe, SeletorPeriodo, SeletorPessoa } from "./filtros";
import { cn, formatarDuracao, hhmm } from "./formato";
import { Cartao, CabecalhoPagina, Secao, TabelaSimples } from "./kit";
import { dataCurta, escalaDe, historicoDaPessoa, type Minutos } from "./motor";
import { PESSOAS } from "./dados";

const RELATORIOS: Record<TipoRelatorio, { titulo: string; descricao: string; Icone: typeof Users }> = {
  diario: { titulo: "Diário por pessoa", descricao: "Uma linha por pessoa e por dia: escala, expediente, uso e índice.", Icone: CalendarDays },
  colaboradores: { titulo: "Consolidado por pessoa", descricao: "Uma linha por pessoa no período, com cobertura e fora da escala.", Icone: Users },
  equipes: { titulo: "Consolidado por equipe", descricao: "Uma linha por equipe: índice médio por pessoa e horas somadas.", Icone: UsersRound },
  aplicativos: { titulo: "Aplicativos e sites", descricao: "Tempo de uso por aplicativo ou site, com a categoria efetiva.", Icone: AppWindow },
};

const ORDEM: TipoRelatorio[] = ["diario", "colaboradores", "equipes", "aplicativos"];
const LINHAS_PREVIA = 8;
const pct = (v: number | null) => (v === null ? "—" : `${v.toFixed(1).replace(".", ",")}%`);

export function TelaRelatorios() {
  const { recorte, periodo, escopo, classificacoes, tipoRelatorio, definirTipoRelatorio, mostrarNota, layout } = useFocus();
  const celular = layout === "celular";

  const MINUTOS_COLUNAS: [string, keyof Minutos][] = [
    ["Expediente previsto", "expediente"],
    ["Com registro", "registrados"],
    ["Tempo ativo", "ativos"],
    ["Produtivo", "produtivos"],
    ["Neutro", "neutros"],
    ["Improdutivo", "improdutivos"],
    ["Sem classificação", "semClassificar"],
    ["Ocioso", "ociosos"],
    ["Bloqueado", "bloqueado"],
    ["Sem dados", "semDados"],
    ["Fora da escala", "ativosFora"],
  ];
  const horas = (m: Minutos) => MINUTOS_COLUNAS.map(([, k]) => formatarDuracao(m[k]));
  const rotulosMinutos = MINUTOS_COLUNAS.map(([r]) => r);

  let colunas: string[] = [];
  let linhas: string[][] = [];
  let textos = 2;

  if (tipoRelatorio === "diario") {
    textos = 4;
    colunas = ["Data", "Pessoa", "Equipe", "Escala", ...rotulosMinutos, "Índice", "Cobertura"];
    const pessoas = PESSOAS.filter((p) => (!escopo.equipeId || p.equipeId === escopo.equipeId) && (!escopo.colaboradorId || p.id === escopo.colaboradorId));
    linhas = pessoas
      .slice(0, 3)
      .flatMap((p) => {
        const e = escalaDe(p);
        return historicoDaPessoa(p.id, periodo, classificacoes)
          .slice(0, 3)
          .map((h) => [
            dataCurta(h.dia),
            p.nome,
            h.linha.equipe,
            h.trabalha ? `${hhmm(e.inicio)}–${hhmm(e.fim)} (int. ${hhmm(e.intervaloInicio)}–${hhmm(e.intervaloFim)})` : "Sem expediente",
            ...horas(h.linha.minutos),
            pct(h.linha.indice),
            pct(h.linha.cobertura),
          ]);
      });
  } else if (tipoRelatorio === "colaboradores") {
    colunas = ["Pessoa", "Equipe", "Dias com expediente", "Dias com registro", ...rotulosMinutos, "Índice", "Cobertura"];
    linhas = recorte.linhas.map((l) => [
      l.colaborador,
      l.equipe,
      String(l.diasComExpediente),
      String(l.diasComRegistro),
      ...horas(l.minutos),
      pct(l.indice),
      pct(l.cobertura),
    ]);
  } else if (tipoRelatorio === "equipes") {
    textos = 1;
    colunas = ["Equipe", "Pessoas", "Índice (média por pessoa)", "Cobertura (horas)", ...rotulosMinutos];
    linhas = recorte.equipes.map((e) => [e.equipe, String(e.pessoas), pct(e.indice), pct(e.cobertura), ...horas(e.minutos)]);
  } else {
    textos = 3;
    colunas = ["Aplicativo / domínio", "Tipo", "Categoria", "Tempo ativo", "Pessoas", "Dias com uso"];
    linhas = recorte.apps.map((a) => [
      a.alvo,
      a.site ? "Site" : "Aplicativo",
      a.tipo === "PRODUCTIVE" ? "Produtivo" : a.tipo === "NEUTRAL" ? "Neutro" : a.tipo === "UNPRODUCTIVE" ? "Improdutivo" : "Sem classificação",
      formatarDuracao(a.minutos),
      String(a.pessoas),
      String(a.dias),
    ]);
  }

  return (
    <div className="space-y-4">
      <CabecalhoPagina titulo="Relatórios" descricao="Exporte dados de uso e produtividade com os mesmos filtros e critérios do painel." />

      <div className={cn("grid gap-3", celular ? "grid-cols-1" : "grid-cols-4")} data-tour="relatorios">
        {ORDEM.map((t) => {
          const { Icone, titulo, descricao } = RELATORIOS[t];
          const ativo = t === tipoRelatorio;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={ativo}
              onClick={() => definirTipoRelatorio(t)}
              className={cn(
                "relative rounded-[0.625rem] border bg-white p-4 text-left transition-colors",
                ativo ? "border-foco-acao bg-foco-acao-suave/40 ring-1 ring-foco-acao" : "border-foco-borda hover:border-slate-300",
              )}
            >
              {ativo && <CheckCircle2 aria-hidden="true" className="absolute right-3.5 top-3.5 h-5 w-5 text-foco-acao" />}
              <Icone aria-hidden="true" className="h-6 w-6 text-foco-acao" strokeWidth={1.75} />
              <p className="mt-3 text-[14px] font-semibold text-slate-900">{titulo}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-slate-500">{descricao}</p>
            </button>
          );
        })}
      </div>

      <Cartao className="p-5">
        <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-slate-900">
          <SlidersHorizontal aria-hidden="true" className="h-5 w-5 text-foco-acao" strokeWidth={1.75} />
          Filtros
        </div>
        <div className={cn("flex gap-3", celular ? "flex-col" : "items-end justify-between")}>
          <div className="flex flex-wrap items-center gap-2.5">
            <SeletorPeriodo />
            <SeletorEquipe />
            {tipoRelatorio !== "equipes" && <SeletorPessoa />}
          </div>
          <div className="flex gap-2">
            {(["XLSX", "CSV"] as const).map((formato, i) => (
              <button
                key={formato}
                type="button"
                onClick={() => mostrarNota(`No painel, isto gera o relatório em ${formato}. No Excel em português, o arquivo abre sem pedir importação.`)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg px-4 text-[13.5px] font-medium transition-colors",
                  i === 0 ? "bg-foco-acao text-white hover:bg-[#154b73]" : "border border-foco-acao/70 bg-white text-foco-acao hover:bg-foco-acao-suave",
                )}
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Gerar {formato}
              </button>
            ))}
          </div>
        </div>
      </Cartao>

      <Secao
        icone={<Eye />}
        titulo="Prévia do relatório"
        subtitulo={`${RELATORIOS[tipoRelatorio].titulo} · ${recorte.rotuloCurto} · ${linhas.length === 0 ? "sem linhas" : `mostrando ${Math.min(LINHAS_PREVIA, linhas.length)} linhas`}`}
        acao={!celular ? <span className="text-[13px] text-slate-500">Mesmos filtros e critérios do painel</span> : undefined}
      >
        {linhas.length === 0 ? (
          <p className="rounded-lg border border-dashed border-foco-borda py-10 text-center text-[13px] text-slate-500">
            Nenhuma linha para este recorte. O arquivo sairia só com o cabeçalho.
          </p>
        ) : (
          <TabelaSimples minimo="min-w-[1300px]">
            <thead>
              <tr>
                {colunas.map((c, i) => (
                  <th key={c} className={cn("whitespace-nowrap", i >= textos && "!text-right")}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.slice(0, LINHAS_PREVIA).map((linha, i) => (
                <tr key={i}>
                  {linha.map((celula, j) => (
                    <td key={j} className={cn("whitespace-nowrap", j >= textos && "foco-num text-right", j === 0 && tipoRelatorio === "aplicativos" && "foco-mono text-[12px]")}>
                      {celula}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </TabelaSimples>
        )}
      </Secao>
    </div>
  );
}
