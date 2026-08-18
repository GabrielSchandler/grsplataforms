"use client";

import { useState } from "react";
import { MousePointerClick } from "lucide-react";
import { DemoNavContext, type Workspace } from "./chrome";
import { ScaledStage } from "./scaled-stage";
import { navToScreen, screenMap } from "./screen-map";

/**
 * Réplica navegável de uma área do sistema.
 *
 * O visitante clica na barra lateral e troca de tela dentro da própria
 * página — é a diferença entre ver uma foto do produto e usar o produto.
 * Não há backend nem dado real por trás: são os mesmos componentes que geram
 * as imagens estáticas, alimentados por dados fictícios.
 */

export function AppDemo({
  workspace,
  inicial,
  legenda,
}: {
  workspace: Workspace;
  /** Tela aberta ao carregar. */
  inicial: string;
  legenda?: string;
}) {
  const [ativo, setAtivo] = useState(inicial);
  const idTela = navToScreen[ativo] ?? navToScreen[inicial];
  const Tela = screenMap[idTela].component;

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900 p-2">
        <ScaledStage>
          <div className="overflow-hidden rounded border border-slate-200">
            <DemoNavContext.Provider
              value={{ workspace, active: ativo, onSelect: setAtivo }}
            >
              <Tela />
            </DemoNavContext.Provider>
          </div>
        </ScaledStage>
      </div>

      <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-fog-500">
        <MousePointerClick
          aria-hidden="true"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300"
        />
        <span>
          {legenda ??
            "Clique nos itens da barra lateral para navegar entre as telas."}{" "}
          Ambiente demonstrativo, com nomes, CPFs e telefones fictícios.
        </span>
      </p>
    </div>
  );
}
