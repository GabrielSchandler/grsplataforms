"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TipoCategoria } from "./formato";
import {
  ESCOPO_VAZIO,
  PERIODO_INICIAL,
  montarRecorte,
  type Classificacoes,
  type EscopoDemo,
  type PeriodoDemo,
  type Recorte,
} from "./motor";

/**
 * As telas do painel que a réplica reproduz. O menu é o do painel desde o
 * redesenho de 16/09/2026: três olhares (Visão geral, Equipes, Pessoas) mais
 * Aplicativos e sites, Jornada e Relatórios. Dispositivos não está no menu —
 * no painel também não; chega-se a ela pelos avisos de dentro das telas.
 */
export type TelaId =
  | "visao"
  | "equipes"
  | "equipe"
  | "pessoas"
  | "pessoa"
  | "aplicativos"
  | "jornada"
  | "relatorios"
  | "dispositivos";

export type LayoutFocus = "desktop" | "celular";

export type AbaVisao = "atividade" | "ritmo" | "registros";
export type FiltroApps = "todos" | "aplicativos" | "sites" | "sem";
export type TipoRelatorio = "diario" | "colaboradores" | "equipes" | "aplicativos";

type Contexto = {
  tela: TelaId;
  pessoaId: string | null;
  equipeId: string | null;
  periodo: PeriodoDemo;
  escopo: EscopoDemo;
  classificacoes: Classificacoes;
  abaVisao: AbaVisao;
  filtroApps: FiltroApps;
  tipoRelatorio: TipoRelatorio;
  /** Dia escolhido na linha do tempo da pessoa e no comparativo de jornada. */
  dia: number | null;
  nota: string | null;
  layout: LayoutFocus;
  /** No tour a réplica é só para olhar: a barra lateral não navega. */
  navegavel: boolean;
  recorte: Recorte;
  abrirTela: (tela: TelaId, alvo?: { pessoaId?: string; equipeId?: string }) => void;
  definirPeriodo: (periodo: PeriodoDemo) => void;
  definirEscopo: (mudancas: Partial<EscopoDemo>) => void;
  classificar: (alvo: string, tipo: TipoCategoria) => void;
  definirAbaVisao: (aba: AbaVisao) => void;
  definirFiltroApps: (filtro: FiltroApps) => void;
  definirTipoRelatorio: (tipo: TipoRelatorio) => void;
  definirDia: (dia: number | null) => void;
  mostrarNota: (texto: string) => void;
};

const FocusContexto = createContext<Contexto | null>(null);

export function useFocus(): Contexto {
  const contexto = useContext(FocusContexto);
  if (!contexto) throw new Error("useFocus precisa estar dentro de <ProvedorFocus>.");
  return contexto;
}

export function ProvedorFocus({
  children,
  layout = "desktop",
  navegavel = true,
  telaInicial = "visao",
  aoTrocarTela,
}: {
  children: ReactNode;
  layout?: LayoutFocus;
  navegavel?: boolean;
  telaInicial?: TelaId;
  /** Avisa quem está por fora (para guardar a tela na URL, por exemplo). */
  aoTrocarTela?: (tela: TelaId) => void;
}) {
  const [tela, setTela] = useState<TelaId>(telaInicial);
  const [pessoaId, setPessoaId] = useState<string | null>(null);
  const [equipeId, setEquipeId] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoDemo>(PERIODO_INICIAL);
  const [escopo, setEscopo] = useState<EscopoDemo>(ESCOPO_VAZIO);
  const [classificacoes, setClassificacoes] = useState<Classificacoes>({});
  const [abaVisao, setAbaVisao] = useState<AbaVisao>("atividade");
  const [filtroApps, setFiltroApps] = useState<FiltroApps>("todos");
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("diario");
  const [dia, setDia] = useState<number | null>(null);
  const [nota, setNota] = useState<string | null>(null);

  const recorte = useMemo(() => montarRecorte(periodo, escopo, classificacoes), [periodo, escopo, classificacoes]);

  const abrirTela = useCallback(
    (proxima: TelaId, alvo: { pessoaId?: string; equipeId?: string } = {}) => {
      setTela(proxima);
      setPessoaId(alvo.pessoaId ?? null);
      setEquipeId(alvo.equipeId ?? null);
      setDia(null);
      aoTrocarTela?.(proxima);
    },
    [aoTrocarTela],
  );

  const definirPeriodo = useCallback((novo: PeriodoDemo) => {
    setPeriodo(novo);
    // O dia da linha do tempo acompanha o período: senão a tela mostraria um
    // dia de outro mês, fora do recorte que o gestor acabou de escolher.
    setDia(null);
  }, []);

  const definirEscopo = useCallback((mudancas: Partial<EscopoDemo>) => {
    setEscopo((atual) => {
      const proximo = { ...atual, ...mudancas };
      // Trocar de equipe zera a pessoa: senão sobra o filtro de alguém que não
      // pertence à equipe escolhida e a tela volta vazia sem explicação.
      if (mudancas.equipeId !== undefined && mudancas.equipeId !== atual.equipeId) proximo.colaboradorId = null;
      return proximo;
    });
  }, []);

  const classificar = useCallback((alvo: string, tipo: TipoCategoria) => {
    setClassificacoes((atual) => ({ ...atual, [alvo]: tipo }));
  }, []);

  const mostrarNota = useCallback((texto: string) => setNota(texto), []);

  useEffect(() => {
    if (!nota) return;
    const tempo = window.setTimeout(() => setNota(null), 4200);
    return () => window.clearTimeout(tempo);
  }, [nota]);

  const valor = useMemo<Contexto>(
    () => ({
      tela,
      pessoaId,
      equipeId,
      periodo,
      escopo,
      classificacoes,
      abaVisao,
      filtroApps,
      tipoRelatorio,
      dia,
      nota,
      layout,
      navegavel,
      recorte,
      abrirTela,
      definirPeriodo,
      definirEscopo,
      classificar,
      definirAbaVisao: setAbaVisao,
      definirFiltroApps: setFiltroApps,
      definirTipoRelatorio: setTipoRelatorio,
      definirDia: setDia,
      mostrarNota,
    }),
    [
      tela, pessoaId, equipeId, periodo, escopo, classificacoes, abaVisao, filtroApps, tipoRelatorio,
      dia, nota, layout, navegavel, recorte, abrirTela, definirPeriodo, definirEscopo, classificar, mostrarNota,
    ],
  );

  return <FocusContexto.Provider value={valor}>{children}</FocusContexto.Provider>;
}
