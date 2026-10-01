"use client";

/**
 * Jornada — `app/painel/jornada/page.tsx`. Expediente previsto contra a
 * atividade registrada, pessoa a pessoa. Fora da escala NÃO é marcação de
 * ponto, e a tela diz isso antes de mostrar qualquer número.
 */

import { useMemo } from "react";
import { CalendarClock, CalendarDays, ChevronLeft, ChevronRight, Clock, Database, GanttChart, UserRound, Users } from "lucide-react";
import { useFocus } from "./estado";
import { BotaoExportar, SeletorEquipe, SeletorPeriodo } from "./filtros";
import { formatarDuracao, hhmm } from "./formato";
import { ComparativoJornada } from "./graficos";
import { Aviso, CabecalhoPagina, GradeIndicadores, Indicador, Secao, TabelaSimples } from "./kit";
import { DIA_HOJE, DIA_PRIMEIRO, EQUIPES_POR_ID, dataCurta, intervalo, jornadaDoDia } from "./motor";
import { DEFINICOES } from "./tela-visao";

export function TelaJornada() {
  const { recorte, periodo, escopo, dia, definirDia, abrirTela, layout } = useFocus();
  const celular = layout === "celular";
  const linhas = recorte.linhas;

  const expediente = linhas.reduce((s, l) => s + l.minutos.expediente, 0);
  const registrados = linhas.reduce((s, l) => s + Math.min(l.minutos.registrados, l.minutos.expediente), 0);
  const fora = linhas.reduce((s, l) => s + l.minutos.ativosFora, 0);
  const comExpediente = linhas.filter((l) => l.minutos.expediente > 0).length;

  const diaAtual = dia ?? Math.min(intervalo(periodo).fim, DIA_HOJE);
  const doDia = useMemo(() => jornadaDoDia(diaAtual, escopo), [diaAtual, escopo]);
  const abrir = (id: string) => abrirTela("pessoa", { pessoaId: id });

  return (
    <div className="space-y-4">
      <CabecalhoPagina
        titulo="Jornada"
        descricao="Acompanhe o expediente previsto e a atividade registrada."
        acoes={
          <>
            <SeletorPeriodo />
            {!celular && (
              <>
                <SeletorEquipe />
                <BotaoExportar oQue="o diário por pessoa" />
              </>
            )}
          </>
        }
      />

      <GradeIndicadores>
        <Indicador compacto icone={<CalendarClock />} rotulo="Expediente previsto" valor={formatarDuracao(expediente)} rodape="escala efetiva até agora" />
        <Indicador
          compacto
          icone={<Database />}
          rotulo="Com registros"
          definicao={DEFINICOES.cobertura}
          valor={formatarDuracao(registrados)}
          rodape={expediente > 0 ? `${Math.round((registrados / expediente) * 100)}% do previsto` : "—"}
        />
        <Indicador compacto icone={<UserRound />} rotulo="Fora da escala" definicao={DEFINICOES.fora} valor={formatarDuracao(fora)} rodape="estimativa por 15 min" />
        <Indicador compacto icone={<Users />} rotulo="Pessoas" valor={comExpediente} rodape="com expediente no período" />
      </GradeIndicadores>

      <Aviso tom="info">
        Atividade fora da escala não é marcação de ponto: serve para dar contexto ao uso da estação. Primeiro e último registro também não
        confirmam chegada nem saída, e ausência de registro não é falta.
      </Aviso>

      <Secao
        data-tour="comparativo-jornada"
        icone={<GanttChart />}
        titulo="Comparativo de jornada"
        subtitulo={`${dataCurta(diaAtual)} · escala prevista e blocos de 15 min com registro`}
        acao={
          <div className="flex items-center gap-1 text-[13px] text-slate-700">
            <button
              type="button"
              aria-label="Dia anterior"
              disabled={diaAtual <= DIA_PRIMEIRO}
              onClick={() => definirDia(diaAtual - 1)}
              className="rounded-md p-1.5 hover:bg-slate-100 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="foco-num flex items-center gap-1.5 px-1">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-slate-500" />
              {dataCurta(diaAtual)}
            </span>
            <button
              type="button"
              aria-label="Próximo dia"
              disabled={diaAtual >= DIA_HOJE}
              onClick={() => definirDia(diaAtual + 1)}
              className="rounded-md p-1.5 hover:bg-slate-100 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
        rodape="As escalas são configuradas em Administração › Escalas, por empresa, equipe e pessoa, para cada dia da semana."
      >
        <ComparativoJornada dias={doDia} aoAbrir={abrir} />
      </Secao>

      <Secao icone={<Clock />} titulo="Resumo de jornada" subtitulo={`${recorte.rotuloCurto} · por pessoa`}>
        <TabelaSimples minimo="min-w-[720px]">
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Escala</th>
              <th className="!text-right">Dias com registro</th>
              <th className="!text-right">Primeiro registro (média)</th>
              <th className="!text-right">Último registro (média)</th>
              <th className="!text-right">Cobertura</th>
              <th className="!text-right">Fora da escala</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => {
              const e = EQUIPES_POR_ID[l.equipeId].escala;
              return (
                <tr key={l.colaboradorId} className="hover:bg-slate-50">
                  <td>
                    <button type="button" onClick={() => abrir(l.colaboradorId)} className="font-medium text-slate-900 hover:text-foco-acao hover:underline">
                      {l.colaborador}
                    </button>
                    <span className="block text-[11.5px] text-slate-500">{l.equipe}</span>
                  </td>
                  <td className="whitespace-nowrap text-slate-700">
                    seg–sex {hhmm(e.inicio)}–{hhmm(e.fim)}
                  </td>
                  <td className="foco-num text-right">
                    {Math.min(l.diasComRegistro, l.diasComExpediente)} de {l.diasComExpediente}
                  </td>
                  <td className="foco-num text-right">{hhmm(l.primeiroMedio)}</td>
                  <td className="foco-num text-right">{hhmm(l.ultimoMedio)}</td>
                  <td className="foco-num text-right">{l.cobertura === null ? "—" : `${Math.round(l.cobertura)}%`}</td>
                  <td className="foco-num text-right">{formatarDuracao(l.minutos.ativosFora)}</td>
                </tr>
              );
            })}
          </tbody>
        </TabelaSimples>
        <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
          Primeiro e último registro são a primeira e a última atividade recebida da estação no dia — não são marcação de ponto. Em “Dias com
          registro”, a base são só os dias em que a escala prevê expediente.
        </p>
      </Secao>
    </div>
  );
}
