"use client";

/**
 * Aplicativos e sites — `app/painel/aplicativos/page.tsx`. Quem administra a
 * empresa classifica ali mesmo; o tempo de um item sem categoria não entra no
 * índice, e classificar muda o índice de todas as telas na hora.
 */

import { AlertCircle, AppWindow, BarChart2, CheckCircle2, Globe, LayoutGrid, List, Search } from "lucide-react";
import { useState } from "react";
import { CATEGORIAS } from "./dados";
import { useFocus, type FiltroApps } from "./estado";
import { BotaoExportar, SeletorEquipe, SeletorPeriodo } from "./filtros";
import { cn, formatarDuracao, type TipoCategoria } from "./formato";
import { DonutCategorias, IconeRosca } from "./graficos";
import { Abas, Aviso, BarrasHorizontais, CabecalhoPagina, GradeIndicadores, Indicador, Secao, SeloCategoria, TabelaSimples } from "./kit";

export function TelaAplicativos() {
  const { recorte, filtroApps, definirFiltroApps, classificar, mostrarNota, layout } = useFocus();
  const celular = layout === "celular";
  const [busca, setBusca] = useState("");
  const apps = recorte.apps;

  const semCategoria = apps.filter((a) => a.tipo === null);
  const classificados = apps.length - semCategoria.length;
  const pct = (n: number) => (apps.length > 0 ? Math.round((n / apps.length) * 100) : 0);
  const minutosTotal = apps.reduce((s, a) => s + a.minutos, 0);
  const minutosPorTipo = { PRODUCTIVE: 0, NEUTRAL: 0, UNPRODUCTIVE: 0, SEM: 0 };
  const qtdPorTipo = { PRODUCTIVE: 0, NEUTRAL: 0, UNPRODUCTIVE: 0, SEM: 0 };
  for (const a of apps) {
    const k = a.tipo ?? "SEM";
    minutosPorTipo[k] += a.minutos;
    qtdPorTipo[k] += 1;
  }

  const lista = apps.filter((a) => {
    if (busca && !a.alvo.toLowerCase().includes(busca.trim().toLowerCase())) return false;
    if (filtroApps === "aplicativos") return !a.site;
    if (filtroApps === "sites") return a.site;
    if (filtroApps === "sem") return a.tipo === null;
    return true;
  });

  const aoClassificar = (alvo: string, tipo: TipoCategoria) => {
    classificar(alvo, tipo);
    const nome = CATEGORIAS.find((c) => c.id === tipo)?.nome.toLowerCase();
    mostrarNota(`${alvo} agora é ${nome}. O índice de todas as telas já considera a nova categoria.`);
  };

  return (
    <div className="space-y-4">
      <CabecalhoPagina
        titulo="Aplicativos e sites"
        descricao="Veja quais aplicativos e sites são usados pela equipe e como estão classificados."
        acoes={
          <>
            <SeletorPeriodo />
            {!celular && (
              <>
                <SeletorEquipe />
                <BotaoExportar destaque oQue="o tempo por aplicativo e site" />
              </>
            )}
          </>
        }
      />

      <div className={cn("flex gap-3", celular ? "flex-col" : "items-center justify-between")}>
        <Abas<FiltroApps>
          ativa={filtroApps}
          aoMudar={definirFiltroApps}
          abas={[
            { chave: "todos", rotulo: "Todos" },
            { chave: "aplicativos", rotulo: "Aplicativos" },
            { chave: "sites", rotulo: "Sites" },
            { chave: "sem", rotulo: "Sem classificação", selo: semCategoria.length },
          ]}
        />
        <label className="relative block w-64">
          <span className="sr-only">Buscar aplicativo ou site</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar processo ou domínio…"
            className="h-10 w-full rounded-lg border border-foco-borda bg-white pl-9 pr-3 text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-foco-acao/60 focus:ring-2 focus:ring-foco-acao/15"
          />
        </label>
      </div>

      <GradeIndicadores colunas={3}>
        <Indicador
          compacto
          icone={<LayoutGrid />}
          rotulo="Aplicativos e sites identificados"
          valor={apps.length}
          rodape={`${apps.filter((a) => !a.site).length} aplicativos · ${apps.filter((a) => a.site).length} sites`}
        />
        <Indicador compacto icone={<CheckCircle2 />} rotulo={`Classificados (${pct(classificados)}%)`} valor={classificados} rodape="com categoria efetiva no período" />
        <Indicador
          compacto
          tom={semCategoria.length > 0 ? "alerta" : "normal"}
          icone={<AlertCircle />}
          rotulo={`Pendentes de classificação (${pct(semCategoria.length)}%)`}
          valor={semCategoria.length}
          rodape={`${formatarDuracao(minutosPorTipo.SEM)} fora do índice`}
        />
      </GradeIndicadores>

      {semCategoria.length > 0 && filtroApps !== "sem" && (
        <Aviso acao={{ rotulo: "Ver não classificados", aoClicar: () => definirFiltroApps("sem") }}>
          Classifique {semCategoria.length} {semCategoria.length === 1 ? "item sem categoria" : "itens sem categoria"}: esse tempo não entra no índice e
          deixa os relatórios incompletos.
        </Aviso>
      )}

      <div className={cn("grid gap-4", celular ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]")}>
        <Secao icone={<IconeRosca />} titulo="Categorias de uso" subtitulo="Quantidade de itens por categoria e tempo de cada grupo">
          <DonutCategorias quantidades={qtdPorTipo} minutos={minutosPorTipo} />
        </Secao>
        <Secao icone={<BarChart2 />} titulo="Aplicativos e sites mais utilizados" subtitulo="Tempo ativo no período, dentro e fora da escala · % do tempo em aplicativos">
          <BarrasHorizontais
            vazio="Nenhum uso no período."
            itens={apps.slice(0, 5).map((l) => ({
              chave: l.alvo,
              rotulo: <span className="foco-mono text-[12px]">{l.alvo}</span>,
              valor: l.minutos,
              texto: formatarDuracao(l.minutos),
              percentual: minutosTotal > 0 ? (l.minutos / minutosTotal) * 100 : null,
            }))}
          />
        </Secao>
      </div>

      <Secao
        data-tour="lista-apps"
        icone={<List />}
        titulo="Lista de aplicativos e sites"
        subtitulo="O tempo inclui uso dentro e fora da escala. A categoria de um site específico prevalece sobre a do navegador."
      >
        {lista.length === 0 ? (
          <p className="rounded-lg border border-dashed border-foco-borda py-8 text-center text-[13px] text-slate-500">
            {filtroApps === "sem" ? "Tudo classificado neste período." : "Nenhum aplicativo ou site no filtro escolhido."}
          </p>
        ) : (
          <TabelaSimples minimo="min-w-[680px]">
            <thead>
              <tr>
                <th>Aplicativo / domínio</th>
                <th>Categoria</th>
                <th className="!text-right">Tempo ativo</th>
                <th className="!text-right">Pessoas</th>
                <th className="!text-right">Dias</th>
                <th className="!text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((l) => {
                const Icone = l.site ? Globe : AppWindow;
                return (
                  <tr key={l.alvo} className="hover:bg-slate-50">
                    <td>
                      <span className="flex min-w-0 items-center gap-2 font-medium text-slate-900">
                        <Icone aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="foco-mono truncate text-[12.5px]">{l.alvo}</span>
                      </span>
                    </td>
                    <td>
                      <SeloCategoria tipo={l.tipo} />
                    </td>
                    <td className="foco-num text-right">{formatarDuracao(l.minutos)}</td>
                    <td className="foco-num text-right">{l.pessoas}</td>
                    <td className="foco-num text-right">{l.dias}</td>
                    <td className="text-right">
                      <label className="sr-only" htmlFor={`classificar-${l.alvo}`}>
                        Classificar {l.alvo}
                      </label>
                      <select
                        id={`classificar-${l.alvo}`}
                        value={l.tipo ?? ""}
                        onChange={(e) => e.target.value && aoClassificar(l.alvo, e.target.value as TipoCategoria)}
                        className={cn(
                          "h-8 rounded-md border bg-white px-2 text-[12.5px] outline-none focus:ring-2 focus:ring-foco-acao/15",
                          l.tipo === null ? "border-foco-acao/70 font-medium text-foco-acao" : "border-foco-borda text-slate-700",
                        )}
                      >
                        {l.tipo === null && <option value="">Classificar…</option>}
                        {CATEGORIAS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TabelaSimples>
        )}
        <p className="mt-3 text-[11.5px] text-slate-500">Categorias e regras em lote ficam em Administração › Classificação.</p>
      </Secao>
    </div>
  );
}
