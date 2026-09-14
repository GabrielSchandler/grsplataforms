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
  varrer,
  type Classificacoes,
  type EscopoDemo,
  type PeriodoDemo,
  type Recorte,
  type Varredura,
} from "./motor";

/** As telas do painel que a réplica reproduz. */
export type TelaId =
  | "visao"
  | "equipes"
  | "pessoas"
  | "pessoa"
  | "aplicativos"
  | "dispositivos"
  | "horas-extras"
  | "registros"
  | "relatorios";

export type LayoutFocus = "desktop" | "celular";

type Contexto = {
  tela: TelaId;
  pessoaId: string | null;
  periodo: PeriodoDemo;
  escopo: EscopoDemo;
  classificacoes: Classificacoes;
  avisoFechado: boolean;
  nota: string | null;
  layout: LayoutFocus;
  /** No tour a réplica é só para olhar: a barra lateral não navega. */
  navegavel: boolean;
  varredura: Varredura;
  recorte: Recorte;
  abrirTela: (tela: TelaId, pessoaId?: string | null) => void;
  definirPeriodo: (periodo: PeriodoDemo) => void;
  definirEscopo: (mudancas: Partial<EscopoDemo>) => void;
  classificar: (alvo: string, tipo: TipoCategoria) => void;
  fecharAviso: () => void;
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
  const [periodo, setPeriodo] = useState<PeriodoDemo>(PERIODO_INICIAL);
  const [escopo, setEscopo] = useState<EscopoDemo>(ESCOPO_VAZIO);
  const [classificacoes, setClassificacoes] = useState<Classificacoes>({});
  const [avisoFechado, setAvisoFechado] = useState(false);
  const [nota, setNota] = useState<string | null>(null);

  // A varredura é cara o suficiente para não repetir a cada clique, e barata
  // o suficiente para refazer quando o período ou uma classificação muda.
  const varredura = useMemo(() => varrer(periodo, classificacoes), [periodo, classificacoes]);
  const recorte = useMemo(() => montarRecorte(varredura, escopo), [varredura, escopo]);

  const abrirTela = useCallback(
    (proxima: TelaId, pessoa: string | null = null) => {
      setTela(proxima);
      setPessoaId(pessoa);
      aoTrocarTela?.(proxima);
    },
    [aoTrocarTela],
  );

  const definirEscopo = useCallback((mudancas: Partial<EscopoDemo>) => {
    setEscopo((atual) => {
      const proximo = { ...atual, ...mudancas };
      // Trocar de equipe zera a pessoa: senão sobra o filtro de alguém que não
      // pertence à equipe escolhida e a tela volta vazia sem explicação.
      if (mudancas.equipeId !== undefined && mudancas.equipeId !== atual.equipeId) {
        proximo.colaboradorId = null;
      }
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
      periodo,
      escopo,
      classificacoes,
      avisoFechado,
      nota,
      layout,
      navegavel,
      varredura,
      recorte,
      abrirTela,
      definirPeriodo: setPeriodo,
      definirEscopo,
      classificar,
      fecharAviso: () => setAvisoFechado(true),
      mostrarNota,
    }),
    [
      tela,
      pessoaId,
      periodo,
      escopo,
      classificacoes,
      avisoFechado,
      nota,
      layout,
      navegavel,
      varredura,
      recorte,
      abrirTela,
      definirEscopo,
      classificar,
      mostrarNota,
    ],
  );

  return <FocusContexto.Provider value={valor}>{children}</FocusContexto.Provider>;
}
