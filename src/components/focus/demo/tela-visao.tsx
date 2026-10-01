"use client";

/**
 * Visão geral — `newsecfocus/dashboard/app/painel/page.tsx` e
 * `components/painel/visao-geral.tsx`. Cabeçalho com o recorte, os quatro
 * indicadores, o aviso de coleta, o uso do expediente, os pontos de atenção,
 * a evolução e o comparativo de equipes; embaixo, a análise detalhada em abas.
 */

import { useMemo } from "react";
import { Activity, AlertCircle, ArrowRight, CheckCircle2, Clock, Database, Eye, UserRound, UsersRound } from "lucide-react";
import { CONSOLIDADO_MINUTOS, EMPRESA } from "./dados";
import { useFocus, type AbaVisao } from "./estado";
import { BotaoExportar, SeletorEquipe, SeletorPeriodo } from "./filtros";
import { cn, formatarDuracao, formatarPorcentagemEnxuta, hhmm } from "./formato";
import { GraficoAtividade, GraficoEvolucao, SecaoRitmo, UsoExpediente } from "./graficos";
import { Abas, Aviso, CabecalhoPagina, Cartao, GradeIndicadores, Indicador, SeloCategoria, Selo, TabelaSimples, Variacao } from "./kit";
import { ritmoDoPeriodo, type LinhaEquipe, type PontoAtencao } from "./motor";
import { ATRASADAS, REGISTROS, TEMPO_REAL, ULTIMO_ENVIO } from "./vivo";

export const DEFINICOES = {
  indice:
    "Média, por pessoa, de: minutos em aplicativos produtivos ÷ minutos de expediente previstos até agora. Cada pessoa pesa igual.",
  ativo: "Soma do tempo em aplicativos produtivos, neutros, improdutivos e sem classificação, dentro do expediente.",
  fora: "Tempo ativo fora da escala de cada pessoa, inclusive em dias sem expediente. Estimado por blocos de 15 minutos; não é marcação de ponto nem banco de horas.",
  cobertura:
    "Minutos com registro dentro do expediente ÷ minutos de expediente previstos. Não indica presença física nem qualidade do trabalho.",
} as const;

export function NotaAtualizacao() {
  return (
    <span className="foco-num">
      Último envio: {ULTIMO_ENVIO} · números atualizados às {hhmm(CONSOLIDADO_MINUTOS)} · {EMPRESA.fuso}
    </span>
  );
}

/** Os quatro números do topo, com a régua do expediente. */
export function CartoesIndicadores() {
  const { recorte } = useFocus();
  const { resumo, variacao, rotuloComparacao, fora } = recorte;
  const m = resumo.minutos;

  return (
    <GradeIndicadores>
      <Indicador
        data-tour="indice"
        icone={<Clock />}
        rotulo="Tempo produtivo / expediente"
        definicao={DEFINICOES.indice}
        valor={resumo.indiceMedio === null ? "—" : formatarPorcentagemEnxuta(resumo.indiceMedio)}
        rodape={
          resumo.indiceMedio === null ? (
            "Ninguém do recorte tem expediente previsto no período."
          ) : (
            <Variacao valor={variacao} rotulo={variacao === null ? null : rotuloComparacao} />
          )
        }
      />
      <Indicador
        icone={<Activity />}
        rotulo="Tempo ativo"
        definicao={DEFINICOES.ativo}
        valor={formatarDuracao(m.ativos)}
        rodape="Produtivo + neutro + improdutivo + sem classificação"
      />
      <Indicador
        data-tour="fora"
        icone={<UserRound />}
        rotulo="Atividade fora do expediente"
        definicao={DEFINICOES.fora}
        valor={formatarDuracao(fora.minutos)}
        rodape={
          fora.pessoas === 0
            ? "Ninguém acima de 15 min fora da escala"
            : `${fora.pessoas} ${fora.pessoas === 1 ? "pessoa" : "pessoas"} · estimativa por 15 min`
        }
      />
      <Indicador
        data-tour="cobertura"
        icone={<Database />}
        rotulo="Cobertura de dados"
        definicao={DEFINICOES.cobertura}
        valor={resumo.cobertura === null ? "—" : `${Math.round(resumo.cobertura)}%`}
        rodape={
          resumo.cobertura === null
            ? "Sem expediente previsto no período"
            : `${formatarDuracao(Math.min(m.registrados, m.expediente))} registradas de ${formatarDuracao(m.expediente)} previstas`
        }
      />
    </GradeIndicadores>
  );
}

export function AvisoAtrasadas() {
  const { abrirTela, escopo } = useFocus();
  const atrasadas = ATRASADAS.filter((e) => !escopo.equipeId || e.equipe === nomeDaEquipe(escopo.equipeId));
  if (atrasadas.length === 0) return null;
  const pior = atrasadas[0];
  return (
    <Aviso data-tour="aviso-dados" titulo="Atenção aos dados" acao={{ rotulo: "Ver dispositivos", aoClicar: () => abrirTela("dispositivos") }}>
      {atrasadas.length === 1
        ? `1 estação sem enviar dados há mais de ${EMPRESA.limiarAtrasoMinutos} min durante o expediente`
        : `${atrasadas.length} estações sem enviar dados há mais de ${EMPRESA.limiarAtrasoMinutos} min durante o expediente`}
      {` (${pior.maquina}: ${formatarDuracao(pior.minutosSemEnvio)})`}. O tempo delas aparece como “sem dados” até o envio voltar.
    </Aviso>
  );
}

function nomeDaEquipe(id: string) {
  return { comercial: "Comercial", atendimento: "Atendimento", backoffice: "Backoffice", juridico: "Jurídico" }[id] ?? id;
}

export function PontosAtencao({ pontos }: { pontos: PontoAtencao[] }) {
  const { abrirTela, definirFiltroApps } = useFocus();

  const seguir = (p: PontoAtencao) => {
    if (p.acao.tela === "aplicativos") definirFiltroApps("sem");
    if (p.acao.tela === "equipe") abrirTela("equipe", { equipeId: p.acao.equipeId });
    else abrirTela(p.acao.tela);
  };

  return (
    <Cartao className="flex flex-col p-5" data-tour="pontos">
      <div className="flex items-center gap-3">
        <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-foco-acao" strokeWidth={1.75} />
        <h2 className="text-[16px] font-semibold text-slate-900">Pontos de atenção</h2>
      </div>
      {pontos.length === 0 ? (
        <p className="mt-6 flex items-center gap-2 text-[13px] text-slate-600">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-600" />
          Nada fora do esperado no período.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-foco-borda border-t border-foco-borda">
          {pontos.map((p) => {
            const Icone = p.natureza === "dados" ? Database : Eye;
            return (
              <li key={p.titulo} className="flex items-center justify-between gap-4 py-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  <Icone
                    className={cn("mt-0.5 h-4 w-4 shrink-0", p.natureza === "dados" ? "text-amber-600" : "text-slate-400")}
                    aria-label={p.natureza === "dados" ? "Qualidade do dado" : "Observação"}
                  />
                  <div className="min-w-0">
                    <p className="text-[13.5px] text-slate-800">{p.titulo}</p>
                    {p.detalhe && <p className="mt-0.5 text-[11.5px] text-slate-500">{p.detalhe}</p>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => seguir(p)}
                  className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-foco-acao hover:underline"
                >
                  {p.acao.rotulo}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Cartao>
  );
}

function VariacaoCelula({ valor }: { valor: number | null }) {
  if (valor === null) return <span className="text-slate-400">—</span>;
  const cor = Math.abs(valor) < 0.5 ? "text-slate-500" : valor > 0 ? "text-emerald-700" : "text-rose-700";
  return (
    <span className={cn("foco-num font-medium", cor)}>
      {valor > 0 ? "+" : valor < 0 ? "−" : ""}
      {Math.abs(valor).toFixed(1).replace(".", ",").replace(/,0$/, "")} p.p.
    </span>
  );
}

/** Equipes lado a lado, pela média simples do % de cada pessoa. */
export function ComparativoEquipes({ linhas }: { linhas: LinhaEquipe[] }) {
  const { abrirTela } = useFocus();
  return (
    <Cartao className="flex flex-col p-5" data-tour="comparativo">
      <div className="flex items-start gap-3">
        <UsersRound aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-foco-acao" strokeWidth={1.75} />
        <div>
          <h3 className="text-[16px] font-semibold text-slate-900">Comparativo de equipes</h3>
          <p className="mt-0.5 text-[13px] text-slate-500">Produtivo: média por pessoa · cobertura: horas somadas</p>
        </div>
      </div>
      {linhas.length === 0 ? (
        <p className="mt-6 text-[13px] text-slate-500">Nenhuma equipe com expediente no período.</p>
      ) : (
        <TabelaSimples minimo="min-w-0" className="mt-4">
          <thead>
            <tr>
              <th>Equipe</th>
              <th>Produtivo</th>
              <th className="!text-right">Cobertura</th>
              <th className="!text-right">Variação</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.equipeId} className="text-slate-800 hover:bg-slate-50">
                <td>
                  <button type="button" onClick={() => abrirTela("equipe", { equipeId: l.equipeId })} className="hover:text-foco-acao hover:underline">
                    {l.equipe}
                  </button>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-full min-w-[44px] overflow-hidden rounded-full bg-slate-100">
                      <span className="block h-full rounded-full bg-foco-marca" style={{ width: `${Math.min(100, l.indice ?? 0)}%` }} />
                    </span>
                    <span className="foco-num w-9 shrink-0 text-right font-medium">{l.indice === null ? "—" : `${Math.round(l.indice)}%`}</span>
                  </div>
                </td>
                <td className="foco-num text-right">{l.cobertura === null ? "—" : `${Math.round(l.cobertura)}%`}</td>
                <td className="whitespace-nowrap text-right">
                  <VariacaoCelula valor={l.variacao} />
                </td>
              </tr>
            ))}
          </tbody>
        </TabelaSimples>
      )}
      <p className="mt-auto pt-4 text-[11.5px] text-slate-500">
        Tempo produtivo indica uso de aplicativos classificados como produtivos; não mede a qualidade das entregas. Variação só
        aparece com cobertura de dados suficiente nos dois períodos.
      </p>
    </Cartao>
  );
}

const ABAS: { chave: AbaVisao; rotulo: string }[] = [
  { chave: "atividade", rotulo: "Atividade ao longo do período" },
  { chave: "ritmo", rotulo: "Ritmo por hora" },
  { chave: "registros", rotulo: "Últimos registros" },
];

export function TelaVisao() {
  const { recorte, abaVisao, definirAbaVisao, layout } = useFocus();
  const celular = layout === "celular";

  return (
    <div className="space-y-4">
      <CabecalhoPagina
        titulo="Visão geral"
        descricao="Atividade da operação, com contexto para decidir."
        acoes={
          celular ? (
            <SeletorPeriodo />
          ) : (
            <>
              <SeletorPeriodo />
              <SeletorEquipe />
              <BotaoExportar destaque />
            </>
          )
        }
        nota={<NotaAtualizacao />}
      />

      <CartoesIndicadores />
      <AvisoAtrasadas />

      <div className={cn("grid gap-4", celular ? "grid-cols-1" : "grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]")}>
        <UsoExpediente data-tour="uso" minutos={recorte.resumo.minutos} colunas={celular ? 4 : 4} />
        <PontosAtencao pontos={recorte.pontos} />
      </div>

      <div className={cn("grid gap-4", celular ? "grid-cols-1" : "grid-cols-[minmax(0,0.93fr)_minmax(0,1fr)]")}>
        <GraficoEvolucao data-tour="evolucao" {...recorte.evolucao} />
        <ComparativoEquipes linhas={recorte.equipes} />
      </div>

      <section aria-label="Análise detalhada" className="space-y-4 pt-2" data-tour="analise">
        <h2 className="text-[17px] font-semibold text-foco-tinta">Análise detalhada</h2>
        <Abas abas={ABAS} ativa={abaVisao} aoMudar={definirAbaVisao} variante="sublinhado" />
        {abaVisao === "atividade" && <GraficoAtividade pontos={recorte.atividade.pontos} rotuloPeriodo={recorte.rotuloCurto} />}
        {abaVisao === "ritmo" && <AbaRitmo />}
        {abaVisao === "registros" && <UltimosRegistros />}
      </section>
    </div>
  );
}

function AbaRitmo() {
  const { periodo, escopo, classificacoes } = useFocus();
  const ritmo = useMemo(() => ritmoDoPeriodo(periodo, escopo, classificacoes), [periodo, escopo, classificacoes]);
  return <SecaoRitmo horas={ritmo.horas} mapa={ritmo.mapa} />;
}

const ESTADOS: Record<string, string> = { OCIOSO: "Ocioso", BLOQUEADO: "Bloqueado" };

/** Atividade agora e os últimos minutos recebidos — com o título já higienizado. */
function UltimosRegistros() {
  const { layout } = useFocus();
  return (
    <div className={cn("grid gap-4", layout === "celular" ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]")}>
      <Cartao className="p-5">
        <h3 className="text-[14px] font-medium text-slate-800">Atividade agora</h3>
        <p className="mt-0.5 text-[12px] text-slate-500">Aplicativo em primeiro plano em cada estação</p>
        <ul className="mt-3 divide-y divide-foco-borda">
          {TEMPO_REAL.slice(0, 9).map((l) => (
            <li key={l.colaboradorId} className="flex items-start justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-900">{l.colaborador}</p>
                <p className="truncate text-[11.5px] text-slate-500">
                  <span className="foco-mono">{l.dominio ?? l.processo}</span> · {l.tituloJanela}
                </p>
              </div>
              <Selo tom={l.status === "ativo" ? "sucesso" : l.status === "ocioso" ? "atencao" : "neutro"}>
                {l.status === "ativo" ? "ativo" : l.status === "ocioso" ? `ocioso ${l.momento}` : `sem sinal ${l.momento}`}
              </Selo>
            </li>
          ))}
        </ul>
      </Cartao>
      <Cartao className="p-5">
        <h3 className="text-[14px] font-medium text-slate-800">Últimos registros</h3>
        <p className="mt-0.5 text-[12px] text-slate-500">Um registro por minuto e por estação · teclas e cliques são só contagem</p>
        <TabelaSimples minimo="min-w-[520px]" className="mt-3 max-h-[330px] overflow-y-auto">
          <thead className="sticky top-0">
            <tr>
              <th>Hora</th>
              <th>Pessoa</th>
              <th>Aplicativo / site</th>
              <th>Categoria</th>
              <th className="!text-right">Teclas</th>
              <th className="!text-right">Cliques</th>
            </tr>
          </thead>
          <tbody>
            {REGISTROS.map((r) => (
              <tr key={r.chave}>
                <td className="foco-num text-slate-700">{r.hora}</td>
                <td className="whitespace-nowrap">{r.colaborador}</td>
                <td className="foco-mono max-w-[150px] truncate text-[12px]" title={r.titulo}>
                  {r.alvo}
                </td>
                <td>{ESTADOS[r.estado] ? <Selo tom="neutro">{ESTADOS[r.estado]}</Selo> : <SeloCategoria tipo={r.tipo} />}</td>
                <td className="foco-num text-right">{r.teclas}</td>
                <td className="foco-num text-right">{r.cliques}</td>
              </tr>
            ))}
          </tbody>
        </TabelaSimples>
      </Cartao>
    </div>
  );
}
