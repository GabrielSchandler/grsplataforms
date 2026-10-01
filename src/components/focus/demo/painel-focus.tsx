"use client";

import { useEffect, type ReactNode } from "react";
import { ScaledStage } from "@/components/demo/scaled-stage";
import { useAntesDaPintura } from "@/lib/use-antes-da-pintura";
import {
  ALTURA_CELULAR,
  ALTURA_DESKTOP,
  CascaFocus,
  LARGURA_CELULAR,
  LARGURA_DESKTOP,
} from "./casca";
import { ProvedorFocus, useFocus, type LayoutFocus, type TelaId } from "./estado";

/**
 * A réplica navegável do painel do Focus, do jeito que o visitante explora:
 * clica na barra lateral, troca o período, filtra por equipe, abre uma pessoa
 * e classifica um aplicativo.
 *
 * A tela ativa fica na URL (`?tela=jornada`) para o comercial conseguir
 * mandar ao lead o endereço de uma tela específica, em vez de "abre a página e
 * clica na quinta linha do menu". Mesmo padrão da réplica do CRM.
 */

const PARAM = "tela";

const TELAS: TelaId[] = ["visao", "equipes", "pessoas", "aplicativos", "jornada", "relatorios", "dispositivos"];

/** Pedido vindo de outra seção da página. O contador força o efeito a repetir. */
export type PedidoTela = { tela: TelaId; contador: number };

/** Evento que as outras seções da página disparam para abrir uma tela. */
export const EVENTO_ABRIR_TELA = "focus:abrir-tela";

export function telaDaUrl(): TelaId | null {
  if (typeof window === "undefined") return null;
  const pedida = new URLSearchParams(window.location.search).get(PARAM);
  return TELAS.includes(pedida as TelaId) ? (pedida as TelaId) : null;
}

export function temTelaNaUrl(): boolean {
  return telaDaUrl() !== null;
}

/** Abre uma tela da réplica de qualquer lugar da página e leva o olho até ela. */
export function abrirTelaDoFocus(tela: TelaId) {
  window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_TELA, { detail: tela }));
  document.getElementById("painel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function guardarNaUrl(tela: TelaId) {
  const url = new URL(window.location.href);
  if (tela === "visao") url.searchParams.delete(PARAM);
  else url.searchParams.set(PARAM, tela);
  // replaceState: trocar de tela é olhar em volta, não navegar — empilhar
  // histórico faria o botão Voltar percorrer as telas em vez de sair da página.
  window.history.replaceState(null, "", url);
}

/** Lê a tela pedida na URL antes da primeira pintura e atende os pedidos da página. */
function Sintonia({ pedido, children }: { pedido?: PedidoTela | null; children: ReactNode }) {
  const { abrirTela } = useFocus();

  useAntesDaPintura(() => {
    const pedida = telaDaUrl();
    if (pedida) abrirTela(pedida);
  }, []);

  useEffect(() => {
    if (pedido) abrirTela(pedido.tela);
  }, [pedido, abrirTela]);

  return <>{children}</>;
}

export function PainelFocus({
  layout,
  pedido,
  sincronizarUrl = true,
}: {
  layout: LayoutFocus;
  pedido?: PedidoTela | null;
  /** A maquete do celular não mexe na URL: quem manda nela é a réplica grande. */
  sincronizarUrl?: boolean;
}) {
  const celular = layout === "celular";

  return (
    <ProvedorFocus layout={layout} aoTrocarTela={sincronizarUrl ? guardarNaUrl : undefined}>
      <Sintonia pedido={pedido}>
        <ScaledStage largura={celular ? LARGURA_CELULAR : LARGURA_DESKTOP}>
          <div
            className="overflow-hidden rounded-[12px] border border-foco-borda"
            style={{ height: celular ? ALTURA_CELULAR : ALTURA_DESKTOP }}
          >
            <CascaFocus />
          </div>
        </ScaledStage>
      </Sintonia>
    </ProvedorFocus>
  );
}
