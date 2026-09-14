"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlarmClockCheck,
  AppWindow,
  CircleStop,
  Download,
  FileSpreadsheet,
  FileText,
  History,
  LayoutDashboard,
  Lock,
  LockOpen,
  MonitorSmartphone,
  Moon,
  Power,
  PowerOff,
  ScrollText,
  Search,
  Sunrise,
  UserSquare2,
  Users,
} from "lucide-react";
import { EMPRESA, type TipoEventoEstacao } from "./dados";
import { useFocus, type TelaId } from "./estado";
import {
  CORES_TIPO,
  ROTULOS_TIPO,
  cn,
  formatarHoras,
  formatarHorasCurto,
  formatarPorcentagem,
} from "./formato";
import { GraficoArea, GraficoBarras, GraficoDonut } from "./graficos";
import { IndicadoresFocus } from "./kpis";
import { Botao, Cartao, CabecalhoPagina, Entrada, EstadoVazio, IndicadorLed, Selo } from "./kit";
import { BarraFiltros } from "./filtros";
import {
  PESSOAS_POR_ID,
  diasDaPessoa,
  montarRecorte,
  rotuloComparacao,
  type EscopoDemo,
} from "./motor";
import {
  TabelaAplicativos,
  TabelaColaboradores,
  TabelaDias,
  TabelaDispositivos,
  TabelaEquipes,
  TabelaHorasExtras,
  TabelaRegistros,
} from "./tabelas";
import {
  COM_SINAL,
  DISPOSITIVOS,
  ESTACOES_ONLINE,
  GRUPOS_EVENTOS,
  TEMPO_REAL,
} from "./vivo";

/** Cada tela do painel, com o mesmo conteúdo e a mesma ordem do produto. */
export function TelaFocus({ id }: { id: TelaId }) {
  switch (id) {
    case "equipes":
      return <TelaEquipes />;
    case "pessoas":
      return <TelaPessoas />;
    case "pessoa":
      return <TelaPessoa />;
    case "aplicativos":
      return <TelaAplicativos />;
    case "dispositivos":
      return <TelaDispositivos />;
    case "horas-extras":
      return <TelaHorasExtras />;
    case "registros":
      return <TelaRegistros />;
    case "relatorios":
      return <TelaRelatorios />;
    default:
      return <TelaVisaoGeral />;
  }
}

/* ------------------------------------------------------------------- exportar */

const RELATORIOS = {
  diario: {
    titulo: "Dia a dia por colaborador",
    descricao: "Uma linha por pessoa e por dia, com horas, índice e expediente.",
  },
  colaboradores: {
    titulo: "Consolidado por colaborador",
    descricao: "Uma linha por pessoa no período, com aderência à jornada.",
  },
  equipes: {
    titulo: "Consolidado por equipe",
    descricao: "Comparativo entre equipes no período.",
  },
  aplicativos: {
    titulo: "Uso de aplicativos e sites",
    descricao: "Tempo por ferramenta, com a categoria de produtividade.",
  },
} as const;

type TipoRelatorio = keyof typeof RELATORIOS;

function BotaoExportar({
  tipos = ["diario", "colaboradores", "equipes", "aplicativos"],
  rotulo = "Exportar",
}: {
  tipos?: TipoRelatorio[];
  rotulo?: string;
}) {
  const { recorte, mostrarNota } = useFocus();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    function aoClicarFora(evento: MouseEvent) {
      if (caixa.current && !caixa.current.contains(evento.target as Node)) setAberto(false);
    }

    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  return (
    <div className="relative" ref={caixa} data-tour="relatorios">
      <Botao variante="contorno" tamanho="sm" onClick={() => setAberto((v) => !v)} aria-expanded={aberto}>
        <Download aria-hidden="true" className="h-3.5 w-3.5" />
        {rotulo}
      </Botao>

      {aberto ? (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-foco border border-foco-borda bg-foco-cartao/95 foco-glow">
          <p className="border-b border-foco-borda px-4 py-2.5 text-xs text-slate-500">
            {recorte.intervalo.rotulo}
          </p>
          <ul className="divide-y divide-slate-800/70">
            {tipos.map((tipo) => (
              <li key={tipo} className="px-4 py-3">
                <p className="text-sm font-medium text-slate-200">{RELATORIOS[tipo].titulo}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {RELATORIOS[tipo].descricao}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAberto(false);
                      mostrarNota("No ambiente demonstrativo o arquivo não é gerado. No sistema, o download começa aqui.");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
                  >
                    <FileSpreadsheet aria-hidden="true" className="h-3.5 w-3.5" />
                    XLSX
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAberto(false);
                      mostrarNota("No ambiente demonstrativo o arquivo não é gerado. No sistema, o download começa aqui.");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-foco-borda px-2.5 py-1 text-xs font-medium text-slate-300"
                  >
                    <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                    CSV
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- visão geral */

function TelaVisaoGeral() {
  const { recorte, periodo, escopo, layout } = useFocus();
  const comparativo = !escopo.equipeId && !escopo.colaboradorId && recorte.equipes.length > 1;

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo="Visão geral"
        descricao={`${EMPRESA.nome} · ${recorte.intervalo.rotulo}`}
        icone={<LayoutDashboard aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
        acoes={<BotaoExportar />}
      />

      <BarraFiltros campos={["equipe", "colaborador", "dispositivo"]} />

      <IndicadoresFocus rotuloAnterior={rotuloComparacao(periodo)} />

      <div className={cn("grid gap-5", layout === "desktop" && "grid-cols-5")}>
        <div className={cn("min-w-0", layout === "desktop" && "col-span-3")}>
          <GraficoArea
            dados={recorte.serie}
            bucket={recorte.intervalo.bucket}
            periodoRotulo={recorte.intervalo.rotulo}
          />
        </div>
        <div className={cn("min-w-0", layout === "desktop" && "col-span-2")} data-tour="distribuicao">
          <GraficoDonut dados={recorte.distribuicao.slice(0, 8)} podeClassificar />
        </div>
      </div>

      {comparativo ? (
        <div data-tour="comparativo">
          <GraficoBarras
            titulo="Comparativo entre equipes"
            subtitulo="tempo ativo por categoria no período"
            dados={recorte.equipes.map((equipe) => ({
              id: equipe.equipeId,
              nome: equipe.equipe,
              produtivo: equipe.minutosProdutivos,
              neutro: equipe.minutosNeutros,
              improdutivo: equipe.minutosImprodutivos,
              indice: equipe.indice,
            }))}
          />
        </div>
      ) : null}

      <AtividadeAgora />
    </div>
  );
}

/**
 * Quem está fazendo o quê agora. No produto a lista se atualiza por consulta
 * periódica; aqui ela é o retrato de um instante — o mesmo em toda visita.
 */
function AtividadeAgora() {
  const [busca, setBusca] = useState("");

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return TEMPO_REAL;
    return TEMPO_REAL.filter((linha) =>
      [linha.colaborador, linha.equipe, linha.maquina, linha.processo, linha.dominio]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(termo)),
    );
  }, [busca]);

  return (
    <Cartao className="overflow-hidden" data-tour="agora">
      <div className="flex flex-col gap-3 border-b border-foco-borda p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-200">Atividade agora</h3>
          <p className="text-xs text-slate-500">
            {COM_SINAL} de {TEMPO_REAL.length} com sinal · atualizado agora
          </p>
        </div>

        <div className="relative sm:w-64">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          />
          <Entrada
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar pessoa, equipe, app…"
            aria-label="Buscar na atividade"
            className="pl-9"
          />
        </div>
      </div>

      {filtradas.length === 0 ? (
        <p className="p-10 text-center text-sm text-slate-500">Nenhum resultado para essa busca.</p>
      ) : (
        <ul className="divide-y divide-slate-800/70">
          {filtradas.map((linha) => (
            <li key={linha.colaboradorId} className="flex items-start gap-3 p-4">
              <span className="mt-1.5">
                <IndicadorLed estado={linha.status} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="truncate text-sm font-medium text-slate-100">
                    {linha.colaborador}
                  </span>
                  <Selo>{linha.equipe}</Selo>
                  <span className="hidden text-xs text-slate-600 sm:inline">{linha.maquina}</span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">
                  {linha.dominio ?? linha.processo}
                  <span className="text-slate-600"> · {linha.tituloJanela}</span>
                </p>
              </div>

              <div className="shrink-0 text-right">
                <Selo
                  variante={
                    linha.status === "ativo" ? "ativo" : linha.status === "ocioso" ? "ocioso" : "offline"
                  }
                >
                  {linha.status}
                </Selo>
                <p className="mt-1 text-xs text-slate-600">{linha.momento}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Cartao>
  );
}

/* ------------------------------------------------------------------- equipes */

function TelaEquipes() {
  const { recorte } = useFocus();
  const equipes = recorte.equipes;

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo="Equipes"
        descricao={`${equipes.length} ${equipes.length === 1 ? "equipe" : "equipes"} · ${recorte.intervalo.rotulo}`}
        icone={<Users aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
        acoes={<BotaoExportar tipos={["equipes", "colaboradores"]} />}
      />

      <BarraFiltros campos={[]} />

      {equipes.length === 0 ? (
        <EstadoVazio
          titulo="Nenhuma equipe com registro"
          descricao="Sem atividade no período escolhido. Troque o período ou volte para o mês."
        />
      ) : (
        <>
          <GraficoBarras
            titulo="Comparativo entre equipes"
            subtitulo="tempo ativo por categoria no período"
            dados={equipes.map((equipe) => ({
              id: equipe.equipeId,
              nome: equipe.equipe,
              produtivo: equipe.minutosProdutivos,
              neutro: equipe.minutosNeutros,
              improdutivo: equipe.minutosImprodutivos,
              indice: equipe.indice,
            }))}
          />

          <TabelaEquipes linhas={equipes} />

          <p className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <Selo>como ler</Selo>
            Aderência compara o tempo ativo com a jornada esperada das pessoas da equipe. Índice é o
            tempo produtivo sobre o tempo classificado — aplicativos sem categoria não entram na
            conta.
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- pessoas */

function TelaPessoas() {
  const { recorte, escopo } = useFocus();
  const pessoas = recorte.pessoas;
  const comAtividade = pessoas.filter((p) => p.minutosAtivos > 0).slice(0, 12);

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo="Pessoas"
        descricao={`${pessoas.length} ${pessoas.length === 1 ? "colaborador" : "colaboradores"} · ${recorte.intervalo.rotulo}`}
        icone={<UserSquare2 aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
        acoes={<BotaoExportar tipos={["colaboradores", "diario"]} />}
      />

      <BarraFiltros campos={["equipe"]} />

      {pessoas.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum colaborador com registro"
          descricao="Cada pessoa aparece sozinha cerca de dois minutos depois de o agente ser instalado na estação dela."
        />
      ) : (
        <>
          {comAtividade.length > 1 ? (
            <GraficoBarras
              titulo={`Top ${comAtividade.length} por tempo ativo`}
              subtitulo="composição do tempo no período"
              dados={comAtividade.map((pessoa) => ({
                id: pessoa.colaboradorId,
                nome: pessoa.colaborador,
                produtivo: pessoa.minutosProdutivos,
                neutro: pessoa.minutosNeutros,
                improdutivo: pessoa.minutosImprodutivos,
                indice: pessoa.indice,
              }))}
            />
          ) : null}

          <TabelaColaboradores linhas={pessoas} mostrarEquipe={!escopo.equipeId} />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------ detalhe de uma pessoa */

function TelaPessoa() {
  const { pessoaId, varredura, periodo, abrirTela } = useFocus();
  const pessoa = pessoaId ? PESSOAS_POR_ID[pessoaId] : null;

  const escopoPessoa: EscopoDemo = useMemo(
    () => ({ equipeId: null, colaboradorId: pessoaId, dispositivoId: null }),
    [pessoaId],
  );

  const recortePessoa = useMemo(
    () => montarRecorte(varredura, escopoPessoa),
    [varredura, escopoPessoa],
  );

  const dias = useMemo(
    () => (pessoaId ? diasDaPessoa(varredura, pessoaId) : []),
    [varredura, pessoaId],
  );

  if (!pessoa) {
    return <EstadoVazio titulo="Pessoa não encontrada" descricao="Volte para a lista de pessoas." />;
  }

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo={pessoa.nome}
        descricao={`${pessoa.cargo} · usuário ${pessoa.usuario} · estação ${pessoa.maquina}`}
        icone={<UserSquare2 aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
        voltarPara={{ rotulo: "Pessoas", aoVoltar: () => abrirTela("pessoas") }}
        acoes={<BotaoExportar tipos={["diario", "aplicativos"]} />}
      />

      <BarraFiltros campos={[]} />

      <IndicadoresFocus rotuloAnterior={rotuloComparacao(periodo)} recorte={recortePessoa} />

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <GraficoArea
            dados={recortePessoa.serie}
            bucket={recortePessoa.intervalo.bucket}
            periodoRotulo={recortePessoa.intervalo.rotulo}
            titulo="Atividade no período"
          />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <GraficoDonut
            dados={recortePessoa.distribuicao.slice(0, 10)}
            titulo="Ferramentas mais usadas"
          />
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-slate-200">Dia a dia</h3>
          <Selo>
            jornada de {formatarHorasCurto(EMPRESA.jornadaMinutos)}/dia (padrão da empresa)
          </Selo>
        </div>
        <TabelaDias linhas={dias} />
      </section>
    </div>
  );
}

/* --------------------------------------------------------------- aplicativos */

function TelaAplicativos() {
  const { recorte } = useFocus();
  const apps = recorte.distribuicao;
  const total = apps.reduce((soma, app) => soma + app.minutos, 0);
  const semCategoria = apps.filter((app) => !app.tipo);
  const minutosSemCategoria = semCategoria.reduce((soma, app) => soma + app.minutos, 0);

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo="Aplicativos e sites"
        descricao={`${apps.length} ferramentas · ${recorte.intervalo.rotulo}`}
        icone={<AppWindow aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
        acoes={<BotaoExportar tipos={["aplicativos"]} />}
      />

      <BarraFiltros campos={["equipe", "colaborador"]} />

      {apps.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum uso registrado"
          descricao="Assim que os agentes sincronizarem, o tempo por aplicativo e site aparece aqui."
        />
      ) : (
        <div className="space-y-5">
          {minutosSemCategoria > 0 ? (
            <p className="rounded-foco border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs leading-relaxed text-amber-200/90">
              {semCategoria.length}{" "}
              {semCategoria.length === 1 ? "ferramenta representa" : "ferramentas representam"}{" "}
              {formatarHoras(minutosSemCategoria)} sem categoria — esse tempo não entra no índice de
              produtividade. Classifique na lista ao lado da rosca.
            </p>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-2">
            <div data-tour="distribuicao">
              <GraficoDonut dados={apps.slice(0, 8)} titulo="Top 8 do período" podeClassificar />
            </div>

            <div className="rounded-foco border border-foco-borda foco-vidro p-5">
              <h3 className="text-sm font-medium text-slate-200">Por categoria</h3>
              <p className="text-xs text-slate-500">tempo agregado no período</p>
              <dl className="mt-4 space-y-3">
                {(["PRODUCTIVE", "NEUTRAL", "UNPRODUCTIVE", "SEM"] as const).map((tipo) => {
                  const minutos = apps
                    .filter((app) => (tipo === "SEM" ? !app.tipo : app.tipo === tipo))
                    .reduce((soma, app) => soma + app.minutos, 0);
                  const parte = total > 0 ? (minutos / total) * 100 : 0;

                  return (
                    <div key={tipo}>
                      <div className="flex items-center justify-between text-sm">
                        <dt className="text-slate-300">{ROTULOS_TIPO[tipo]}</dt>
                        <dd className="tabular-nums text-slate-400">
                          {formatarHoras(minutos)}
                          <span className="ml-2 text-xs text-slate-600">
                            {formatarPorcentagem(parte, 0)}
                          </span>
                        </dd>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${parte}%`, background: CORES_TIPO[tipo] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>

          <TabelaAplicativos linhas={apps} />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- dispositivos */

const ESTILOS_EVENTO: Record<
  TipoEventoEstacao,
  { rotulo: string; Icone: typeof Power; cor: string; ponto: string }
> = {
  AGENTE_INICIADO: { rotulo: "Ligou", Icone: Power, cor: "text-emerald-400", ponto: "bg-emerald-400/15" },
  RETOMADA: { rotulo: "Retomou", Icone: Sunrise, cor: "text-cyan-400", ponto: "bg-cyan-400/15" },
  DESBLOQUEADA: { rotulo: "Desbloqueou", Icone: LockOpen, cor: "text-sky-400", ponto: "bg-sky-400/15" },
  BLOQUEADA: { rotulo: "Bloqueou a tela", Icone: Lock, cor: "text-amber-400", ponto: "bg-amber-400/15" },
  SUSPENSA: { rotulo: "Suspendeu / hibernou", Icone: Moon, cor: "text-violet-400", ponto: "bg-violet-400/15" },
  DESLIGANDO: { rotulo: "Desligou", Icone: PowerOff, cor: "text-rose-400", ponto: "bg-rose-400/15" },
  AGENTE_PARADO: { rotulo: "Agente encerrado", Icone: CircleStop, cor: "text-slate-400", ponto: "bg-slate-500/15" },
};

function TelaDispositivos() {
  const ocupacao = (DISPOSITIVOS.length / EMPRESA.maxDispositivos) * 100;

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo="Dispositivos"
        descricao={`${DISPOSITIVOS.length} estações · ${ESTACOES_ONLINE} online`}
        icone={<MonitorSmartphone aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
      />

      <div className="rounded-foco border border-foco-borda foco-vidro p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium text-slate-200">Licenças do plano</h3>
          <p className="text-xs text-slate-500">
            {DISPOSITIVOS.length} de {EMPRESA.maxDispositivos} estações do plano {EMPRESA.plano}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
            style={{ width: `${Math.min(100, ocupacao)}%` }}
          />
        </div>
      </div>

      <TabelaDispositivos />

      <DiarioEstacao />
    </div>
  );
}

/**
 * Linha do tempo do ciclo de vida das estações: ligou, bloqueou a tela,
 * suspendeu, desligou. É diário de bordo, não medição — por isso não soma nada.
 */
function DiarioEstacao() {
  const [ativos, setAtivos] = useState<Set<TipoEventoEstacao>>(
    () => new Set(Object.keys(ESTILOS_EVENTO) as TipoEventoEstacao[]),
  );

  const tiposPresentes = useMemo(() => {
    const vistos = new Set(GRUPOS_EVENTOS.flatMap((grupo) => grupo.eventos.map((e) => e.tipo)));
    return (Object.keys(ESTILOS_EVENTO) as TipoEventoEstacao[]).filter((tipo) => vistos.has(tipo));
  }, []);

  function alternar(tipo: TipoEventoEstacao) {
    setAtivos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(tipo)) proximo.delete(tipo);
      else proximo.add(tipo);
      // Nunca deixa tudo desmarcado: sem isso a lista some e parece defeito.
      return proximo.size === 0 ? new Set(tiposPresentes) : proximo;
    });
  }

  const grupos = GRUPOS_EVENTOS.map((grupo) => ({
    ...grupo,
    eventos: grupo.eventos.filter((evento) => ativos.has(evento.tipo)),
  })).filter((grupo) => grupo.eventos.length > 0);

  return (
    <div className="rounded-foco border border-foco-borda foco-vidro p-5" data-tour="diario">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-slate-800/60">
          <History aria-hidden="true" className="h-5 w-5 text-cyan-400" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-slate-200">Linha do tempo das estações</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Quando cada máquina ligou, bloqueou a tela, hibernou e desligou nos últimos 14 dias. É o
            diário de bordo — não entra em nenhum cálculo de produtividade.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tiposPresentes.map((tipo) => {
          const { rotulo, Icone, cor } = ESTILOS_EVENTO[tipo];
          const ligado = ativos.has(tipo);
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => alternar(tipo)}
              aria-pressed={ligado}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                ligado
                  ? "border-foco-borda bg-slate-800/60 text-slate-200"
                  : "border-transparent bg-slate-900/40 text-slate-600",
              )}
            >
              <Icone aria-hidden="true" className={cn("h-3 w-3", ligado ? cor : "text-slate-600")} />
              {rotulo}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-5">
        {grupos.map((grupo) => (
          <div key={grupo.titulo}>
            <h4 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {grupo.titulo}
            </h4>
            <ul className="space-y-1">
              {grupo.eventos.map((evento) => {
                const { rotulo, Icone, cor, ponto } = ESTILOS_EVENTO[evento.tipo];
                return (
                  <li key={evento.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                    <span className="foco-mono w-11 shrink-0 text-xs text-slate-500">
                      {evento.hora}
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                        ponto,
                      )}
                    >
                      <Icone aria-hidden="true" className={cn("h-3.5 w-3.5", cor)} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm text-slate-200">{rotulo}</span>
                    <span className="truncate text-xs text-slate-500">{evento.maquina}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- horas extras */

function TelaHorasExtras() {
  const { recorte, escopo } = useFocus();

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo="Horas extras"
        descricao={`Atividade fora da janela de expediente esperada · ${recorte.intervalo.rotulo}`}
        icone={<AlarmClockCheck aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
      />

      <BarraFiltros campos={["equipe"]} />

      {recorte.horasExtras.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum registro no período"
          descricao="Assim que houver atividade classificada por hora, a comparação com a janela de expediente aparece aqui."
        />
      ) : (
        <TabelaHorasExtras linhas={recorte.horasExtras} mostrarEquipe={!escopo.equipeId} />
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- registros */

function TelaRegistros() {
  const { recorte } = useFocus();

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo="Registros"
        descricao={`Atividade minuto a minuto · ${recorte.intervalo.rotulo}`}
        icone={<ScrollText aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
        acoes={<Selo>retenção de {EMPRESA.retencaoDias} dias</Selo>}
      />

      <BarraFiltros campos={["equipe", "colaborador", "dispositivo"]} />

      <TabelaRegistros total={recorte.kpis.minutosRegistrados} />

      <p className="text-xs leading-relaxed text-slate-600">
        Cada linha é um minuto de atividade enviado pelo agente. Nenhum conteúdo digitado é
        registrado: o que aparece é a contagem de teclas e cliques, o aplicativo em primeiro plano e
        o título da janela já higienizado.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- relatórios */

function TelaRelatorios() {
  const { recorte, escopo } = useFocus();
  const equipe = recorte.equipes.find((linha) => linha.equipeId === escopo.equipeId);
  const pessoa = escopo.colaboradorId ? PESSOAS_POR_ID[escopo.colaboradorId] : null;

  return (
    <div className="space-y-5">
      <CabecalhoPagina
        titulo="Relatórios"
        descricao="Exportação em XLSX ou CSV, com o mesmo recorte de período e escopo do painel."
        icone={<FileSpreadsheet aria-hidden="true" className="h-5 w-5 text-cyan-400" />}
      />

      <BarraFiltros campos={["equipe", "colaborador"]} />

      <Cartao className="p-5">
        <h3 className="text-sm font-medium text-slate-200">Recorte selecionado</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Selo variante="ciano">{recorte.intervalo.rotulo}</Selo>
          <Selo>{equipe ? `Equipe: ${equipe.equipe}` : "Todas as equipes"}</Selo>
          <Selo>{pessoa ? `Colaborador: ${pessoa.nome}` : "Todos os colaboradores"}</Selo>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          No XLSX o tempo sai como duração (soma e média funcionam direto na planilha) e o índice
          como percentual, com cabeçalho congelado, autofiltro e linha de totais. No CSV o separador
          é ponto e vírgula e o decimal é vírgula — o padrão que o Excel em português abre sem pedir
          importação.
        </p>
      </Cartao>

      <div className="grid gap-4 lg:grid-cols-2" data-tour="relatorios">
        {(Object.keys(RELATORIOS) as TipoRelatorio[]).map((tipo) => (
          <Cartao key={tipo} className="flex flex-col justify-between gap-4 p-5">
            <div>
              <h3 className="text-sm font-medium text-slate-100">{RELATORIOS[tipo].titulo}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {RELATORIOS[tipo].descricao}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-600">{recorte.intervalo.rotulo}</span>
              <BotaoExportar tipos={[tipo]} rotulo="Baixar" />
            </div>
          </Cartao>
        ))}
      </div>
    </div>
  );
}
