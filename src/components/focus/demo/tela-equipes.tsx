"use client";

/**
 * Equipes — `app/painel/equipes/page.tsx` e o detalhe `equipes/[id]`.
 * Sem pódio nem nota: é comparação de uso do expediente, não de desempenho.
 */

import { useMemo } from "react";
import { Clock, Database, LayoutPanelTop, Timer, TrendingUp, UserRound, Users, UsersRound } from "lucide-react";
import { EQUIPES, PESSOAS } from "./dados";
import { useFocus } from "./estado";
import { BotaoExportar, SeletorPeriodo } from "./filtros";
import { cn, formatarDuracao, formatarPorcentagemEnxuta, hhmm } from "./formato";
import { BarraExpediente, LegendaExpediente, UsoExpediente } from "./graficos";
import { CabecalhoPagina, GradeIndicadores, Indicador, Secao, TabelaSimples, Variacao } from "./kit";
import { REGRAS, compararIndice, montarRecorte, variacaoDaPessoa, type LinhaEquipe } from "./motor";
import { DEFINICOES } from "./tela-visao";

function VariacaoCelula({ valor }: { valor: number | null }) {
  if (valor === null)
    return (
      <span className="text-slate-400" title="Sem base comparável: expediente ou cobertura insuficiente no período anterior">
        —
      </span>
    );
  const cor = Math.abs(valor) < 0.5 ? "text-slate-500" : valor > 0 ? "text-emerald-700" : "text-rose-700";
  return (
    <span className={cn("foco-num font-medium", cor)}>
      {valor > 0 ? "+" : valor < 0 ? "−" : ""}
      {Math.abs(valor).toFixed(1).replace(".", ",").replace(/,0$/, "")} p.p.
    </span>
  );
}

function BarraIndice({ valor }: { valor: number | null }) {
  return (
    <div className="flex min-w-[140px] items-center gap-3">
      <span className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <span className="block h-full rounded-full bg-foco-marca" style={{ width: `${Math.min(100, valor ?? 0)}%` }} />
      </span>
      <span className="foco-num w-9 shrink-0 text-right font-medium">{valor === null ? "—" : `${Math.round(valor)}%`}</span>
    </div>
  );
}

function TabelaDesempenho({ linhas }: { linhas: LinhaEquipe[] }) {
  const { abrirTela } = useFocus();
  return (
    <TabelaSimples minimo="min-w-[720px]">
      <thead>
        <tr>
          <th>Equipe</th>
          <th className="!text-right">Pessoas</th>
          <th>Produtivo ▼</th>
          <th className="!text-right">Cobertura</th>
          <th className="!text-right">Tempo ativo</th>
          <th className="!text-right">Fora da escala</th>
          <th className="!text-right">Variação</th>
        </tr>
      </thead>
      <tbody>
        {linhas.map((l) => (
          <tr key={l.equipeId} className="cursor-pointer hover:bg-slate-50" onClick={() => abrirTela("equipe", { equipeId: l.equipeId })}>
            <td className="font-medium text-slate-900">{l.equipe}</td>
            <td className="foco-num text-right">{l.pessoas}</td>
            <td>
              <BarraIndice valor={l.indice} />
            </td>
            <td className="foco-num text-right">{l.cobertura === null ? "—" : `${Math.round(l.cobertura)}%`}</td>
            <td className="foco-num text-right">{formatarDuracao(l.minutosAtivos)}</td>
            <td className="foco-num text-right">{formatarDuracao(l.minutosForaEscala)}</td>
            <td className="text-right">
              <VariacaoCelula valor={l.variacao} />
            </td>
          </tr>
        ))}
      </tbody>
    </TabelaSimples>
  );
}

export function TelaEquipes() {
  const { recorte, layout } = useFocus();
  const { resumo, equipes } = recorte;

  return (
    <div className="space-y-4">
      <CabecalhoPagina
        titulo="Equipes"
        descricao="Acompanhe o desempenho das equipes e compare indicadores."
        acoes={
          <>
            <SeletorPeriodo />
            {layout !== "celular" && <BotaoExportar destaque oQue="o consolidado por equipe" />}
          </>
        }
      />

      <GradeIndicadores>
        <Indicador icone={<UsersRound />} rotulo="Total de equipes" valor={EQUIPES.length} rodape={`${equipes.length} com expediente no período`} />
        <Indicador icone={<Users />} rotulo="Total de pessoas" valor={PESSOAS.length} rodape="pessoas ativas na operação" />
        <Indicador
          icone={<Timer />}
          rotulo="Tempo produtivo / expediente"
          definicao={DEFINICOES.indice}
          valor={resumo.indiceMedio === null ? "—" : formatarPorcentagemEnxuta(resumo.indiceMedio)}
          rodape={<Variacao valor={recorte.variacao} rotulo={recorte.rotuloComparacao} semBase="média por pessoa · sem base de comparação" />}
        />
        <Indicador
          icone={<Database />}
          rotulo="Cobertura de dados"
          definicao={DEFINICOES.cobertura}
          valor={resumo.cobertura === null ? "—" : `${Math.round(resumo.cobertura)}%`}
          rodape={`${formatarDuracao(Math.min(resumo.minutos.registrados, resumo.minutos.expediente))} de ${formatarDuracao(resumo.minutos.expediente)} previstas`}
        />
      </GradeIndicadores>

      <Secao
        data-tour="tabela-equipes"
        icone={<LayoutPanelTop />}
        titulo="Desempenho das equipes"
        subtitulo="Produtivo é média por pessoa; cobertura, tempo ativo e fora da escala são somas da equipe"
        rodape="Tempo produtivo indica uso de aplicativos classificados como produtivos; não mede a qualidade das entregas. A variação só aparece com cobertura suficiente nos dois períodos."
      >
        <TabelaDesempenho linhas={equipes} />
      </Secao>

      <Secao
        data-tour="composicao-equipes"
        icone={<Timer />}
        titulo="Composição do expediente por equipe"
        subtitulo="Horas somadas de cada equipe no período · % sobre o expediente da própria equipe"
      >
        <ul className="space-y-3">
          {equipes.map((g) => (
            <li key={g.equipeId} className={cn("grid gap-1.5", layout === "celular" ? "grid-cols-1" : "grid-cols-[9rem_minmax(0,1fr)] items-center gap-4")}>
              <span className="truncate text-[13px] text-slate-800">{g.equipe}</span>
              <BarraExpediente minutos={g.minutos} rotulos altura="h-7" />
            </li>
          ))}
        </ul>
        <LegendaExpediente className="mt-5 justify-center" />
      </Secao>
    </div>
  );
}

/** Detalhe de uma equipe: resumo, uso do expediente e as pessoas dela. */
export function TelaEquipe() {
  const { equipeId, periodo, classificacoes, abrirTela, layout } = useFocus();
  const equipe = EQUIPES.find((e) => e.id === equipeId) ?? EQUIPES[0];
  const recorte = useMemo(
    () => montarRecorte(periodo, { equipeId: equipe.id, colaboradorId: null }, classificacoes),
    [periodo, equipe.id, classificacoes],
  );
  const { resumo } = recorte;
  const membros = [...recorte.linhas].sort((a, b) => (b.indice ?? -1) - (a.indice ?? -1));

  return (
    <div className="space-y-4">
      <CabecalhoPagina
        trilha={[{ rotulo: "Equipes", aoClicar: () => abrirTela("equipes") }, { rotulo: equipe.nome }]}
        titulo={equipe.nome}
        descricao={
          <span>
            {membros.length} pessoas · escala {hhmm(equipe.escala.inicio)}–{hhmm(equipe.escala.fim)}, intervalo{" "}
            {hhmm(equipe.escala.intervaloInicio)}–{hhmm(equipe.escala.intervaloFim)}
          </span>
        }
        acoes={<SeletorPeriodo />}
      />

      <GradeIndicadores>
        <Indicador
          compacto
          icone={<TrendingUp />}
          rotulo="Produtivo"
          definicao={DEFINICOES.indice}
          valor={resumo.indiceMedio === null ? "—" : formatarPorcentagemEnxuta(resumo.indiceMedio)}
          rodape={<Variacao valor={compararIndice(resumo, recorte.resumoAnterior)} rotulo={recorte.rotuloComparacao} />}
        />
        <Indicador compacto icone={<Clock />} rotulo="Tempo ativo" definicao={DEFINICOES.ativo} valor={formatarDuracao(resumo.minutos.ativos)} rodape="dentro do expediente" />
        <Indicador
          compacto
          icone={<Database />}
          rotulo="Cobertura"
          valor={resumo.cobertura === null ? "—" : `${Math.round(resumo.cobertura)}%`}
          rodape={`${formatarDuracao(Math.min(resumo.minutos.registrados, resumo.minutos.expediente))} de ${formatarDuracao(resumo.minutos.expediente)}`}
        />
        <Indicador compacto icone={<UserRound />} rotulo="Fora da escala" definicao={DEFINICOES.fora} valor={formatarDuracao(resumo.minutos.ativosFora)} rodape="estimativa por 15 min" />
      </GradeIndicadores>

      <UsoExpediente minutos={resumo.minutos} colunas={layout === "celular" ? 4 : 7} />

      <Secao icone={<Users />} titulo="Pessoas da equipe" subtitulo="Produtivo, cobertura e variação de cada pessoa no período">
        <TabelaSimples minimo="min-w-[640px]">
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Produtivo ▼</th>
              <th className="!text-right">Tempo ativo</th>
              <th className="!text-right">Cobertura</th>
              <th className="!text-right">Fora da escala</th>
              <th className="!text-right">Variação</th>
            </tr>
          </thead>
          <tbody>
            {membros.map((l) => (
              <tr key={l.colaboradorId} className="cursor-pointer hover:bg-slate-50" onClick={() => abrirTela("pessoa", { pessoaId: l.colaboradorId })}>
                <td className="font-medium text-slate-900">
                  {l.colaborador}
                  {(l.cobertura ?? 100) < REGRAS.coberturaBaixa && <span className="block text-[11px] text-amber-700">dado incompleto</span>}
                </td>
                <td>
                  <BarraIndice valor={l.indice} />
                </td>
                <td className="foco-num text-right">{formatarDuracao(l.minutos.ativos)}</td>
                <td className="foco-num text-right">{l.cobertura === null ? "—" : `${Math.round(l.cobertura)}%`}</td>
                <td className="foco-num text-right">{formatarDuracao(l.minutos.ativosFora)}</td>
                <td className="text-right">
                  <VariacaoCelula valor={variacaoDaPessoa(recorte, l.colaboradorId)} />
                </td>
              </tr>
            ))}
          </tbody>
        </TabelaSimples>
      </Secao>
    </div>
  );
}
