"use client";

import type { ReactNode } from "react";
import {
  Activity,
  AlarmClockCheck,
  AppWindow,
  Gauge,
  Keyboard,
  Minus,
  MousePointerClick,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useFocus } from "./estado";
import {
  CORES_TIPO,
  ROTULOS_TIPO,
  cn,
  faixaIndice,
  formatarHoras,
  formatarNumero,
  formatarNumeroCompacto,
  formatarPorcentagem,
  formatarVariacao,
} from "./formato";
import { Cartao, CartaoBrilho, Selo } from "./kit";
import type { KpisDemo, Recorte } from "./motor";

/**
 * Topo do painel, em duas camadas — igual ao produto:
 *
 * 1. cartões de leitura imediata, em MÉDIA por pessoa/dia, que é o número
 *    comparável entre equipes de tamanhos diferentes e entre períodos de
 *    durações diferentes;
 * 2. a composição do tempo, para quem quer entender o porquê do número.
 */

/** O número que responde "quanto minha equipe trabalha". */
function mediaDiariaPorPessoa(k: KpisDemo): number | null {
  if (k.colaboradores === 0 || k.diasComRegistro === 0) return null;
  return k.minutosAtivos / k.colaboradores / k.diasComRegistro;
}

function mediaInteracoes(k: KpisDemo): number | null {
  if (k.colaboradores === 0 || k.diasComRegistro === 0) return null;
  return (k.teclas + k.cliques) / k.colaboradores / k.diasComRegistro;
}

function variacao(atual: number | null, anterior: number | null): number | null {
  if (atual === null || anterior === null || anterior === 0) return null;
  return Number((((atual - anterior) / anterior) * 100).toFixed(1));
}

export function IndicadoresFocus({
  rotuloAnterior,
  recorte: recorteDado,
}: {
  rotuloAnterior: string;
  /** A tela de detalhe da pessoa passa o recorte dela; as demais usam o do painel. */
  recorte?: Recorte;
}) {
  const contexto = useFocus();
  const recorte = recorteDado ?? contexto.recorte;
  const layout = contexto.layout;
  const { kpis, anterior, escala, variacao: variacaoKpis } = recorte;
  const faixa = faixaIndice(kpis.indice);

  const media = mediaDiariaPorPessoa(kpis);
  const mediaAnterior = mediaDiariaPorPessoa(anterior);
  const interacoes = mediaInteracoes(kpis);
  const interacoesAnterior = mediaInteracoes(anterior);

  const aderencia = kpis.jornadaEsperada > 0 ? (kpis.minutosAtivos / kpis.jornadaEsperada) * 100 : null;
  const aderenciaAnterior =
    anterior.jornadaEsperada > 0 ? (anterior.minutosAtivos / anterior.jornadaEsperada) * 100 : null;

  const mostrarEscala = escala.temJanela && escala.indiceEscala !== null;

  return (
    <div className="space-y-4">
      <section
        className={cn(
          "grid gap-3",
          layout === "celular" ? "grid-cols-2" : "grid-cols-4 gap-4",
        )}
      >
        <CartaoBrilho animar className="col-span-2" >
          <div className="flex h-full flex-col justify-between p-6" data-tour="indice">
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-400">
                <Gauge aria-hidden="true" className="h-4 w-4 text-cyan-400" />
                Índice de produtividade
              </span>
              <Selo variante={kpis.indice === null ? "neutro" : "ciano"}>{faixa.rotulo}</Selo>
            </div>

            {kpis.indice === null ? (
              <div className="mt-5">
                <p className="text-3xl font-semibold text-slate-400">Sem classificação</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Nenhum aplicativo do período está classificado ainda.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
                    {formatarPorcentagem(kpis.indice, 1)}
                  </span>
                  <Comparacao valor={variacaoKpis.indice} sufixo=" p.p." rotulo={rotuloAnterior} />
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-700"
                    style={{ width: `${Math.min(100, kpis.indice)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  tempo produtivo sobre o tempo classificado
                </p>

                {/* O índice geral mistura expediente e hora extra. Para avaliar
                    desempenho, o que vale é o horário contratado. */}
                {mostrarEscala ? (
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-foco-borda pt-3">
                    <div>
                      <dt className="text-xs text-slate-500">Dentro da escala</dt>
                      <dd className="mt-0.5 text-lg font-semibold text-cyan-300">
                        {formatarPorcentagem(escala.indiceEscala, 1)}
                        <span className="ml-1.5 text-xs font-normal text-slate-500">
                          em {formatarHoras(escala.minutosAtivosEscala)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Fora da escala</dt>
                      <dd className="mt-0.5 text-lg font-semibold text-slate-300">
                        {escala.minutosAtivosExtra === 0
                          ? "nenhuma"
                          : formatarHoras(escala.minutosAtivosExtra)}
                        {escala.pessoasComExtra > 0 ? (
                          <span className="ml-1.5 text-xs font-normal text-slate-500">
                            · {escala.pessoasComExtra}{" "}
                            {escala.pessoasComExtra === 1 ? "pessoa" : "pessoas"}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  </dl>
                ) : null}
              </>
            )}
          </div>
        </CartaoBrilho>

        <CartaoKpi
          marca="media"
          icone={<Activity aria-hidden="true" className="h-4 w-4 text-emerald-400" />}
          rotulo="Média por pessoa/dia"
          valor={media === null ? "—" : formatarHoras(media)}
          rodape={<Comparacao valor={variacao(media, mediaAnterior)} rotulo={rotuloAnterior} />}
          detalhe={`${formatarHoras(kpis.minutosAtivos)} no total do período`}
        />

        <CartaoKpi
          icone={<Target aria-hidden="true" className="h-4 w-4 text-violet-400" />}
          rotulo="Aderência à jornada"
          valor={aderencia === null ? "—" : formatarPorcentagem(aderencia, 0)}
          rodape={
            <Comparacao
              valor={variacao(aderencia, aderenciaAnterior)}
              sufixo=" p.p."
              rotulo={rotuloAnterior}
            />
          }
          detalhe={
            kpis.jornadaEsperada > 0
              ? `${formatarHoras(kpis.minutosAtivos)} ativos de ${formatarHoras(kpis.jornadaEsperada)} previstas`
              : "sem jornada configurada"
          }
        />

        <CartaoKpi
          icone={<Users aria-hidden="true" className="h-4 w-4 text-sky-400" />}
          rotulo="Pessoas com registro"
          valor={formatarNumero(kpis.colaboradores)}
          rodape={
            <span className="text-slate-500">
              {kpis.dispositivos} {kpis.dispositivos === 1 ? "estação" : "estações"} ·{" "}
              {kpis.diasComRegistro} {kpis.diasComRegistro === 1 ? "dia" : "dias"} com dado
            </span>
          }
        />

        <CartaoKpi
          icone={<AppWindow aria-hidden="true" className="h-4 w-4 text-cyan-400" />}
          rotulo="Ferramenta mais usada"
          valor={kpis.topAplicacao ?? "—"}
          valorClasse="truncate text-xl"
          rodape={<span className="text-slate-500">maior tempo em primeiro plano</span>}
        />

        <CartaoKpi
          icone={<Keyboard aria-hidden="true" className="h-4 w-4 text-amber-400" />}
          rotulo="Interações por pessoa/dia"
          valor={interacoes === null ? "—" : formatarNumeroCompacto(interacoes)}
          rodape={
            <Comparacao valor={variacao(interacoes, interacoesAnterior)} rotulo={rotuloAnterior} />
          }
          detalhe={
            <span className="flex flex-wrap items-center gap-1">
              <MousePointerClick aria-hidden="true" className="h-3 w-3" />
              {formatarNumeroCompacto(kpis.cliques)} cliques ·{" "}
              {formatarNumeroCompacto(kpis.teclas)} teclas no total
            </span>
          }
        />
      </section>

      <ComposicaoTempo media={media} recorte={recorte} />
    </div>
  );
}

function CartaoKpi({
  icone,
  rotulo,
  valor,
  rodape,
  detalhe,
  valorClasse = "text-2xl",
  marca,
}: {
  icone: ReactNode;
  rotulo: string;
  valor: string;
  rodape?: ReactNode;
  detalhe?: ReactNode;
  valorClasse?: string;
  marca?: string;
}) {
  return (
    <Cartao className="bg-foco-cartao/90" data-tour={marca}>
      <div className="flex h-full flex-col justify-between p-5">
        <span className="flex items-start gap-2 text-sm leading-tight text-slate-400">
          <span className="mt-0.5 shrink-0">{icone}</span>
          {rotulo}
        </span>
        <p className={cn("mt-3 font-semibold text-slate-100", valorClasse)}>{valor}</p>
        <div className="mt-3 space-y-1 text-xs">
          {rodape}
          {detalhe ? <div className="text-slate-600">{detalhe}</div> : null}
        </div>
      </div>
    </Cartao>
  );
}

/** Variação contra o período anterior, com direção explícita além da cor. */
function Comparacao({
  valor,
  rotulo,
  sufixo = "%",
}: {
  valor: number | null;
  rotulo: string;
  sufixo?: string;
}) {
  if (valor === null) {
    return <span className="text-slate-600">sem base de comparação</span>;
  }

  const neutro = Math.abs(valor) < 0.05;
  const positivo = valor > 0;
  const Icone = neutro ? Minus : positivo ? TrendingUp : TrendingDown;
  const cor = neutro ? "text-slate-500" : positivo ? "text-emerald-400" : "text-rose-400";

  const texto =
    sufixo === "%"
      ? formatarVariacao(valor)
      : `${valor > 0 ? "+" : valor < 0 ? "−" : ""}${Math.abs(valor).toFixed(1).replace(".", ",")}${sufixo}`;

  return (
    <span className={cn("flex flex-wrap items-center gap-1", cor)}>
      <Icone aria-hidden="true" className="h-3.5 w-3.5" />
      {texto}
      <span className="text-slate-600">vs. {rotulo}</span>
    </span>
  );
}

function ComposicaoTempo({ media, recorte }: { media: number | null; recorte: Recorte }) {
  const { abrirTela } = useFocus();
  const { kpis, escala } = recorte;

  const faixas = [
    { chave: "PRODUCTIVE", minutos: kpis.minutosProdutivos },
    { chave: "NEUTRAL", minutos: kpis.minutosNeutros },
    { chave: "UNPRODUCTIVE", minutos: kpis.minutosImprodutivos },
    { chave: "SEM", minutos: kpis.minutosSemClassificar },
  ];

  const totalAtivo = faixas.reduce((soma, faixa) => soma + faixa.minutos, 0);
  const podeMediar = kpis.colaboradores > 0 && kpis.diasComRegistro > 0;

  return (
    <section className="rounded-foco border border-foco-borda foco-vidro p-5" data-tour="composicao">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium text-slate-200">Composição do tempo ativo</h3>
        <p className="text-xs text-slate-500">
          {media === null
            ? "sem registro no período"
            : `média de ${formatarHoras(media)} ativos por pessoa/dia`}
        </p>
      </div>

      {totalAtivo === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Sem tempo ativo registrado no período.</p>
      ) : (
        <>
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
            {faixas.map((faixa) => {
              const parte = (faixa.minutos / totalAtivo) * 100;
              if (parte === 0) return null;
              return (
                <div
                  key={faixa.chave}
                  className="h-full transition-all duration-500"
                  style={{ width: `${parte}%`, background: CORES_TIPO[faixa.chave] }}
                  title={`${ROTULOS_TIPO[faixa.chave]}: ${formatarHoras(faixa.minutos)}`}
                />
              );
            })}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {faixas.map((faixa) => {
              const parte = (faixa.minutos / totalAtivo) * 100;
              const mediaFaixa = podeMediar
                ? faixa.minutos / kpis.colaboradores / kpis.diasComRegistro
                : null;

              return (
                <div key={faixa.chave} className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: CORES_TIPO[faixa.chave] }}
                    />
                    {ROTULOS_TIPO[faixa.chave]}
                  </dt>
                  <dd className="text-sm font-medium text-slate-100">
                    {formatarHoras(mediaFaixa ?? faixa.minutos)}
                    <span className="ml-1.5 text-xs font-normal text-slate-500">
                      {formatarPorcentagem(parte, 0)}
                    </span>
                    {mediaFaixa !== null ? (
                      <span className="block text-xs font-normal text-slate-600">
                        por pessoa/dia
                      </span>
                    ) : null}
                  </dd>
                </div>
              );
            })}
          </dl>

          {/* O gráfico acima só cobre o tempo ATIVO. Sem esta linha, o ocioso e
              a tela bloqueada não apareceriam em lugar nenhum — e é justamente
              o que explica jornada longa com pouca entrega. */}
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-foco-borda pt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <dt className="text-slate-500">Ocioso:</dt>
              <dd className="text-slate-300">
                {formatarHoras(kpis.minutosOciosos)}
                {kpis.minutosRegistrados > 0 ? (
                  <span className="ml-1 text-slate-600">
                    ({formatarPorcentagem((kpis.minutosOciosos / kpis.minutosRegistrados) * 100, 0)}{" "}
                    do tempo registrado)
                  </span>
                ) : null}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="text-slate-500">Tela bloqueada:</dt>
              <dd className="text-slate-300">{formatarHoras(kpis.minutosBloqueado)}</dd>
            </div>
            {escala.temJanela && escala.minutosAtivosExtra > 0 ? (
              <div className="flex items-center gap-1.5">
                <dt className="flex items-center gap-1 text-slate-500">
                  <AlarmClockCheck aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
                  Fora da escala:
                </dt>
                <dd className="text-amber-300">
                  <button
                    type="button"
                    onClick={() => abrirTela("horas-extras")}
                    className="hover:underline"
                  >
                    {formatarHoras(escala.minutosAtivosExtra)}
                  </button>
                </dd>
              </div>
            ) : null}
          </dl>

          {kpis.minutosSemClassificar > 0 ? (
            <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-amber-300/90">
              {formatarPorcentagem((kpis.minutosSemClassificar / totalAtivo) * 100, 0)} do tempo
              ativo está em aplicativos ainda sem categoria — esse tempo fica de fora do índice.{" "}
              <button
                type="button"
                onClick={() => abrirTela("aplicativos")}
                className="font-medium underline underline-offset-2 hover:text-amber-100"
              >
                Classificar agora
              </button>{" "}
              para o número refletir a operação.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}
