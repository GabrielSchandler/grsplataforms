"use client";

import { useEffect, useState } from "react";
import { Compass, Route } from "lucide-react";
import { useAntesDaPintura } from "@/lib/use-antes-da-pintura";
import { MolduraFeixe } from "@/components/efeitos/feixe-borda";
import type { LayoutFocus, TelaId } from "./estado";
import { EVENTO_ABRIR_TELA, PainelFocus, temTelaNaUrl, type PedidoTela } from "./painel-focus";
import { TourFocus } from "./tour-focus";

/**
 * Os dois jeitos de conhecer o Focus na página.
 *
 * O tour vem primeiro por padrão: quem chega frio não sabe o que procurar num
 * painel cheio de número, e um roteiro converte melhor do que uma tela
 * esperando um clique. Quem quiser bisbilhotar troca para a exploração livre —
 * e um link com `?tela=` já abre nela.
 *
 * O layout segue a largura da janela: no computador, a réplica do painel; no
 * celular, a mesma interface que o gestor instala no telefone.
 */
export function SistemaFocus() {
  const [modo, setModo] = useState<"tour" | "livre">("tour");
  const [layout, setLayout] = useState<LayoutFocus>("desktop");
  const [pedido, setPedido] = useState<PedidoTela | null>(null);

  useAntesDaPintura(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setLayout("celular");
    if (temTelaNaUrl()) setModo("livre");
  }, []);

  useEffect(() => {
    const consulta = window.matchMedia("(max-width: 767px)");
    const aoMudar = () => setLayout(consulta.matches ? "celular" : "desktop");
    consulta.addEventListener("change", aoMudar);
    return () => consulta.removeEventListener("change", aoMudar);
  }, []);

  // Um cartão da página pediu uma tela: a demonstração sai do tour e abre nela.
  useEffect(() => {
    function aoPedir(evento: Event) {
      const tela = (evento as CustomEvent<TelaId>).detail;
      setModo("livre");
      setPedido((atual) => ({ tela, contador: (atual?.contador ?? 0) + 1 }));
    }

    window.addEventListener(EVENTO_ABRIR_TELA, aoPedir);
    return () => window.removeEventListener(EVENTO_ABRIR_TELA, aoPedir);
  }, []);

  const modos = [
    { id: "tour" as const, rotulo: "Tour guiado", Icone: Route },
    { id: "livre" as const, rotulo: "Exploração livre", Icone: Compass },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Modo de demonstração" className="flex flex-wrap gap-1.5">
        {modos.map(({ id, rotulo, Icone }) => {
          const ativo = modo === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={ativo}
              onClick={() => setModo(id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                ativo
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-ink-700 bg-ink-900 text-fog-300 hover:border-fog-600 hover:text-white"
              }`}
            >
              <Icone aria-hidden="true" className="h-4 w-4" />
              {rotulo}
            </button>
          );
        })}
      </div>

      <MolduraFeixe className="mt-5 rounded-lg">
        <div className="rounded-lg bg-ink-900 p-2">
          {modo === "tour" ? (
            <TourFocus layout={layout} />
          ) : (
            <PainelFocus layout={layout} pedido={pedido} />
          )}
        </div>
      </MolduraFeixe>

      <p className="mt-3 text-xs leading-relaxed text-fog-500">
        Ambiente demonstrativo, com dados fictícios: a empresa, as 18 pessoas, as estações e os
        números foram inventados para esta página. A interface é a do sistema.
      </p>
    </div>
  );
}
