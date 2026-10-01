"use client";

/**
 * Pessoas — `app/painel/pessoas/page.tsx` (lista) e `pessoas/[id]` (perfil),
 * a tela mais completa do painel: indicadores, linha do tempo do dia,
 * aplicativos mais usados, atividade do dia, histórico diário, estações e
 * ritmo.
 */

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AppWindow,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock,
  Database,
  History,
  ListChecks,
  Monitor,
  Search,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
  UserX,
} from "lucide-react";
import { PESSOAS } from "./dados";
import { useFocus } from "./estado";
import { BotaoExportar, SeletorEquipe, SeletorPeriodo } from "./filtros";
import { cn, formatarDuracao, formatarPorcentagemEnxuta, hhmm } from "./formato";
import { LinhaDoTempoDia, ROTULO_ESTADO, SecaoRitmo } from "./graficos";
import {
  Abas,
  Avatar,
  BarraPercentual,
  BarrasHorizontais,
  BotaoContorno,
  CabecalhoPagina,
  GradeIndicadores,
  Indicador,
  Secao,
  Selo,
  SeloCategoria,
  TabelaSimples,
  Variacao,
} from "./kit";
import {
  DIA_HOJE,
  DIA_PRIMEIRO,
  PESSOAS_POR_ID,
  dataCurta,
  escalaDe,
  historicoDaPessoa,
  intervalo,
  linhaDoTempo,
  montarRecorte,
  paraDia,
  ritmoDoPeriodo,
  temExpediente,
  tipoDoApp,
  type LinhaProdutividade,
} from "./motor";
import { DEFINICOES } from "./tela-visao";
import { ESTACOES } from "./vivo";

type Situacao = "todas" | "com_registro" | "sem_registro" | "pendente" | "inativas";

const POR_PAGINA = 10;

function quando(l: LinhaProdutividade): string {
  if (!l.ultimoRegistro) return "—";
  if (l.ultimoRegistro.dia === DIA_HOJE) return hhmm(l.ultimoRegistro.minuto);
  return `${dataCurta(l.ultimoRegistro.dia).slice(0, 5)} ${hhmm(l.ultimoRegistro.minuto)}`;
}

export function TelaPessoas() {
  const { recorte, abrirTela, layout } = useFocus();
  const celular = layout === "celular";
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("todas");
  const [pagina, setPagina] = useState(1);

  const pendentes = PESSOAS.filter((p) => p.pendente);
  const comRegistro = recorte.linhas.filter((l) => l.diasComRegistro > 0).length;

  const linhas = recorte.linhas
    .filter((l) => {
      const termo = busca.trim().toLowerCase();
      if (termo && !`${l.colaborador} ${PESSOAS_POR_ID[l.colaboradorId].usuario}`.toLowerCase().includes(termo)) return false;
      if (situacao === "com_registro") return l.diasComRegistro > 0;
      if (situacao === "sem_registro") return l.diasComRegistro === 0;
      if (situacao === "pendente") return PESSOAS_POR_ID[l.colaboradorId].pendente;
      if (situacao === "inativas") return false;
      return true;
    })
    .sort((a, b) => a.colaborador.localeCompare(b.colaborador, "pt-BR"));
  const paginas = Math.max(1, Math.ceil(linhas.length / POR_PAGINA));
  const atual = Math.min(pagina, paginas);
  const visiveis = linhas.slice((atual - 1) * POR_PAGINA, atual * POR_PAGINA);

  return (
    <div className="space-y-4">
      <CabecalhoPagina
        titulo="Pessoas"
        descricao="Veja os registros de cada colaborador e acompanhe a atividade no período."
        acoes={
          <>
            <label className="relative block w-52">
              <span className="sr-only">Buscar pessoa</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar por nome ou usuário…"
                className="h-10 w-full rounded-lg border border-foco-borda bg-white pl-9 pr-3 text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-foco-acao/60 focus:ring-2 focus:ring-foco-acao/15"
              />
            </label>
            <SeletorPeriodo />
            {!celular && <SeletorEquipe />}
          </>
        }
      />

      <GradeIndicadores colunas={3}>
        <Indicador compacto icone={<Users />} rotulo="Pessoas cadastradas" valor={PESSOAS.length} rodape="ativas na plataforma" />
        <Indicador
          compacto
          icone={<UserCheck />}
          rotulo="Com registros no período"
          valor={comRegistro}
          rodape={`${recorte.linhas.length - comRegistro} sem nenhum registro`}
        />
        <Indicador
          compacto
          tom={pendentes.length > 0 ? "alerta" : "normal"}
          icone={<UserX />}
          rotulo="Cadastro pendente"
          valor={pendentes.length}
          rodape="0 sem equipe"
        />
      </GradeIndicadores>

      <div className={cn("grid gap-4", celular ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_15rem]")}>
        <Secao data-tour="tabela-pessoas" icone={<CircleUserRound />} titulo="Lista de pessoas" subtitulo={`Métricas de ${recorte.rotuloCurto}`}>
          <div className="mb-4">
            <Abas
              ativa={situacao}
              aoMudar={(s) => {
                setSituacao(s);
                setPagina(1);
              }}
              abas={[
                { chave: "todas", rotulo: "Todas" },
                { chave: "com_registro", rotulo: "Com registro" },
                { chave: "sem_registro", rotulo: "Sem registro" },
                { chave: "pendente", rotulo: "Cadastro pendente", selo: pendentes.length },
                { chave: "inativas", rotulo: "Inativas" },
              ]}
            />
          </div>

          {visiveis.length === 0 ? (
            <p className="rounded-lg border border-dashed border-foco-borda py-10 text-center text-[13px] text-slate-500">
              {busca ? "Ninguém encontrado com essa busca." : "Nenhuma pessoa nesta situação."}
            </p>
          ) : (
            <>
              <TabelaSimples minimo="min-w-[600px]">
                <thead>
                  <tr>
                    <th>Pessoa ▲</th>
                    <th>Equipe</th>
                    <th>Produtivo</th>
                    <th className="!text-right">Tempo ativo</th>
                    <th className="!text-right">Cobertura</th>
                    <th className="!text-right">Último</th>
                  </tr>
                </thead>
                <tbody>
                  {visiveis.map((p) => {
                    const perfil = PESSOAS_POR_ID[p.colaboradorId];
                    return (
                      <tr key={p.colaboradorId} className="cursor-pointer hover:bg-slate-50" onClick={() => abrirTela("pessoa", { pessoaId: p.colaboradorId })}>
                        <td>
                          <span className="flex min-w-0 items-center gap-2.5">
                            <Avatar nome={p.colaborador} />
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-slate-900">{p.colaborador}</span>
                              <span className="block truncate text-[11.5px] text-slate-500">{p.cargo}</span>
                            </span>
                          </span>
                        </td>
                        <td className="text-slate-700">
                          {p.equipe}
                          {perfil.pendente && <span className="block text-[11.5px] text-amber-700">cadastro pendente</span>}
                        </td>
                        <td className="min-w-[112px]">
                          {p.minutos.expediente ? <BarraPercentual valor={p.indice} largura="min-w-[52px]" /> : <span className="text-slate-400">sem expediente</span>}
                        </td>
                        <td className="foco-num text-right">{formatarDuracao(p.minutos.ativos)}</td>
                        <td className="foco-num text-right">{p.cobertura === null ? "—" : `${Math.round(p.cobertura)}%`}</td>
                        <td className="foco-num text-right text-slate-700">{quando(p)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </TabelaSimples>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="foco-num text-[12.5px] text-slate-500">
                  Exibindo {(atual - 1) * POR_PAGINA + 1}–{Math.min(linhas.length, atual * POR_PAGINA)} de {linhas.length} pessoas
                </p>
                {paginas > 1 && (
                  <nav aria-label="Paginação" className="flex items-center gap-1">
                    {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-current={n === atual ? "page" : undefined}
                        onClick={() => setPagina(n)}
                        className={cn(
                          "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px]",
                          n === atual ? "bg-foco-acao font-medium text-white" : "text-slate-700 hover:bg-slate-100",
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            </>
          )}
        </Secao>

        <Secao icone={<AlertCircle />} titulo="Pontos de atenção" subtitulo="Cadastro, não atividade">
          {pendentes.length === 0 ? (
            <p className="text-[13px] text-slate-600">Nenhum cadastro pendente.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {pendentes.map((p) => (
                  <li key={p.id} className="flex items-start gap-3">
                    <Avatar nome={p.nome} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-slate-900">{p.nome}</p>
                      <p className="text-[11.5px] text-slate-500">Instalou nesta semana · cadastro ainda não revisado</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <BotaoContorno aoClicar={() => abrirTela("pessoa", { pessoaId: pendentes[0].id })}>
                  Ver perfil
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </BotaoContorno>
              </div>
            </>
          )}
        </Secao>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Perfil */

const ESTADOS_SESSAO: Record<string, string> = { OCIOSO: "Ocioso", BLOQUEADO: "Bloqueado" };

export function TelaPessoa() {
  const { pessoaId, periodo, classificacoes, abrirTela, dia, definirDia, mostrarNota, layout } = useFocus();
  const celular = layout === "celular";
  const pessoa = PESSOAS_POR_ID[pessoaId ?? ""] ?? PESSOAS[0];
  const escala = escalaDe(pessoa);
  const estacao = ESTACOES.find((e) => e.colaboradorId === pessoa.id);

  const recorte = useMemo(
    () => montarRecorte(periodo, { equipeId: null, colaboradorId: pessoa.id }, classificacoes),
    [periodo, pessoa.id, classificacoes],
  );
  const linha = recorte.linhas[0];
  const { resumo } = recorte;

  const iv = intervalo(periodo);
  const diaAtual = dia ?? Math.min(iv.fim, DIA_HOJE);
  const trabalha = temExpediente(diaAtual) && !(pessoa.desde && diaAtual < paraDia(pessoa.desde));
  const segmentos = useMemo(() => linhaDoTempo(pessoa.id, diaAtual, classificacoes), [pessoa.id, diaAtual, classificacoes]);
  const sessoes = segmentos.filter((s) => s.ate - s.de >= 2 || s.estado === "OCIOSO" || s.estado === "BLOQUEADO");
  const historico = useMemo(() => historicoDaPessoa(pessoa.id, periodo, classificacoes), [pessoa.id, periodo, classificacoes]);
  const ritmo = useMemo(
    () => ritmoDoPeriodo(periodo, { equipeId: null, colaboradorId: pessoa.id }, classificacoes),
    [periodo, pessoa.id, classificacoes],
  );
  const totalApps = recorte.apps.reduce((s, a) => s + a.minutos, 0);

  return (
    <div className="space-y-4">
      <CabecalhoPagina
        trilha={[{ rotulo: "Pessoas", aoClicar: () => abrirTela("pessoas") }, { rotulo: pessoa.nome }]}
        marca={<Avatar nome={pessoa.nome} tamanho="lg" />}
        titulo={pessoa.nome}
        descricao={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
            <span>{[linha.equipe, pessoa.cargo].join(" · ")}</span>
            <span className="text-slate-500">Estação: {pessoa.maquina}</span>
            <span className="text-slate-500">Último registro: {quando(linha)}</span>
            {pessoa.pendente && <Selo tom="atencao">cadastro pendente</Selo>}
          </div>
        }
        acoes={
          <>
            <SeletorPeriodo />
            {!celular && (
              <>
                <BotaoContorno aoClicar={() => mostrarNota("No painel, “Ver registros” abre os minutos desta pessoa, um por linha, já filtrados pelo dia.")}>
                  <ListChecks aria-hidden="true" className="h-4 w-4" />
                  Ver registros
                </BotaoContorno>
                <BotaoExportar oQue="o diário desta pessoa" />
              </>
            )}
          </>
        }
      />

      <GradeIndicadores>
        <Indicador
          compacto
          icone={<TrendingUp />}
          rotulo="Produtivo"
          definicao={DEFINICOES.indice}
          valor={resumo.indiceMedio === null ? "—" : formatarPorcentagemEnxuta(resumo.indiceMedio)}
          rodape={<Variacao valor={recorte.variacao} rotulo={recorte.rotuloComparacao} />}
        />
        <Indicador compacto icone={<Clock />} rotulo="Tempo ativo" definicao={DEFINICOES.ativo} valor={formatarDuracao(resumo.minutos.ativos)} rodape="dentro do expediente" />
        <Indicador
          compacto
          icone={<Database />}
          rotulo="Cobertura"
          definicao={DEFINICOES.cobertura}
          valor={resumo.cobertura === null ? "—" : `${Math.round(resumo.cobertura)}%`}
          rodape={`${formatarDuracao(Math.min(resumo.minutos.registrados, resumo.minutos.expediente))} de ${formatarDuracao(resumo.minutos.expediente)}`}
        />
        <Indicador compacto icone={<UserRound />} rotulo="Fora da escala" definicao={DEFINICOES.fora} valor={formatarDuracao(resumo.minutos.ativosFora)} rodape="estimativa por 15 min" />
      </GradeIndicadores>

      <Secao
        data-tour="linha-do-tempo"
        icone={<Activity />}
        titulo="Linha do tempo de atividades"
        subtitulo={
          trabalha
            ? `Escala do dia ${hhmm(escala.inicio)}–${hhmm(escala.fim)} · intervalo ${hhmm(escala.intervaloInicio)}–${hhmm(escala.intervaloFim)}`
            : "Dia sem expediente na escala"
        }
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
      >
        <LinhaDoTempoDia segmentos={segmentos} escala={trabalha ? escala : null} />
      </Secao>

      <div className={cn("grid gap-4", celular ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]")}>
        <Secao icone={<AppWindow />} titulo="Aplicativos mais usados" subtitulo={`${recorte.rotuloCurto} · % do tempo ativo`}>
          <BarrasHorizontais
            vazio="Nenhum aplicativo no período."
            itens={recorte.apps.slice(0, 5).map((l) => ({
              chave: l.alvo,
              rotulo: <span className="foco-mono text-[12px]">{l.alvo}</span>,
              valor: l.minutos,
              texto: formatarDuracao(l.minutos),
              percentual: totalApps > 0 ? (l.minutos / totalApps) * 100 : null,
            }))}
          />
        </Secao>

        <Secao icone={<ListChecks />} titulo="Atividade do dia" subtitulo={`${dataCurta(diaAtual)} · sessões de 2 min ou mais`}>
          {sessoes.length === 0 ? (
            <p className="rounded-lg border border-dashed border-foco-borda py-8 text-center text-[13px] text-slate-500">Nenhuma atividade registrada neste dia.</p>
          ) : (
            <TabelaSimples minimo="min-w-[440px]" className="max-h-[300px] overflow-y-auto">
              <thead className="sticky top-0">
                <tr>
                  <th>Horário</th>
                  <th>Aplicativo / site</th>
                  <th>Categoria</th>
                  <th className="!text-right">Duração</th>
                </tr>
              </thead>
              <tbody>
                {[...sessoes].reverse().slice(0, 60).map((s) => (
                  <tr key={s.de}>
                    <td className="foco-num whitespace-nowrap text-slate-700">{hhmm(s.de)}</td>
                    <td className="foco-mono max-w-[200px] truncate text-[12px]">{s.alvo ?? "—"}</td>
                    <td>
                      {ESTADOS_SESSAO[s.estado] ? (
                        <Selo tom="neutro">{ROTULO_ESTADO[s.estado]}</Selo>
                      ) : (
                        <SeloCategoria tipo={s.alvo ? tipoDoApp(s.alvo, classificacoes) : null} />
                      )}
                    </td>
                    <td className="foco-num text-right">{formatarDuracao(s.ate - s.de)}</td>
                  </tr>
                ))}
              </tbody>
            </TabelaSimples>
          )}
        </Secao>
      </div>

      <div className={cn("grid gap-4", celular ? "grid-cols-1" : "grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]")}>
        <Secao icone={<History />} titulo="Histórico diário" subtitulo="Escala, expediente e uso por dia do período">
          {historico.length === 0 ? (
            <p className="text-[13px] text-slate-500">Sem expediente nem registro no período.</p>
          ) : (
            <TabelaSimples minimo="min-w-[500px]" className="max-h-[320px] overflow-y-auto">
              <thead className="sticky top-0">
                <tr>
                  <th>Data</th>
                  <th>Escala</th>
                  <th className="!text-right">Expediente</th>
                  <th className="!text-right">Produtivo</th>
                  <th className="!text-right">Cobertura</th>
                  <th className="!text-right">Fora da escala</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((h) => (
                  <tr key={h.dia} className={h.dia === diaAtual ? "bg-foco-acao-suave/60" : "hover:bg-slate-50"}>
                    <td>
                      <button type="button" onClick={() => definirDia(h.dia)} className="foco-num text-slate-900 hover:text-foco-acao hover:underline">
                        {dataCurta(h.dia)}
                      </button>
                    </td>
                    <td className="whitespace-nowrap text-slate-600">{h.trabalha ? `${hhmm(escala.inicio)}–${hhmm(escala.fim)}` : "folga"}</td>
                    <td className="foco-num text-right">{formatarDuracao(h.linha.minutos.expediente)}</td>
                    <td className="foco-num text-right">{h.linha.indice === null ? "—" : `${Math.round(h.linha.indice)}%`}</td>
                    <td className="foco-num text-right">{h.linha.cobertura === null ? "—" : `${Math.round(h.linha.cobertura)}%`}</td>
                    <td className="foco-num text-right">{formatarDuracao(h.linha.minutos.ativosFora)}</td>
                  </tr>
                ))}
              </tbody>
            </TabelaSimples>
          )}
        </Secao>

        <Secao icone={<Monitor />} titulo="Estações vinculadas" subtitulo="Onde houve registro desta pessoa">
          {estacao && (
            <ul className="divide-y divide-foco-borda">
              <li className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <button type="button" onClick={() => abrirTela("dispositivos")} className="font-medium text-slate-900 hover:text-foco-acao hover:underline">
                    {estacao.maquina}
                  </button>
                  <p className="text-[11.5px] text-slate-500">
                    {estacao.usuarioWindows} · agente {estacao.versao} · último envio {estacao.ultimoEnvio}
                  </p>
                </div>
                {estacao.situacao === "RECENTE" ? <Selo tom="sucesso">Envio recente</Selo> : <Selo tom="atencao">Sem envio recente</Selo>}
              </li>
            </ul>
          )}
        </Secao>
      </div>

      <SecaoRitmo horas={ritmo.horas} mapa={ritmo.mapa} />
    </div>
  );
}
