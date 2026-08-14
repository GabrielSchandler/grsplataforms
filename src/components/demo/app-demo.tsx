"use client";

import { useState, type ComponentType } from "react";
import { MousePointerClick } from "lucide-react";
import { DemoNavContext, type Workspace } from "./chrome";
import { Documentos, Backups, Consultas, Logs, Usuarios } from "./screens-gestao";
import { DistribuicaoLeads, PainelComercial, Pipeline, Simulacao, TelaCliente } from "./screens-comercial";
import { AcademyScreen, ConfiguracaoEmpresa, EsteiraJuridica, Financeiro } from "./screens-operacao";

/**
 * Réplica navegável de uma área do sistema.
 *
 * O visitante clica na barra lateral e troca de tela dentro da própria
 * página — é a diferença entre ver uma foto do produto e usar o produto.
 * Não há backend nem dado real por trás: são os mesmos componentes que geram
 * as imagens estáticas, alimentados por dados fictícios.
 */

const telas: Record<string, ComponentType> = {
  "Painel comercial": PainelComercial,
  "Distribuição de leads": DistribuicaoLeads,
  Clientes: TelaCliente,
  "Pré-vendas": Pipeline,
  "Simulações": Simulacao,
  Documentos: Documentos,
  Esteira: EsteiraJuridica,
  "Lançamentos": Financeiro,
  Consultas: Consultas,
  Academy: AcademyScreen,
  "Usuários": Usuarios,
  Empresa: ConfiguracaoEmpresa,
  Backups: Backups,
  Logs: Logs,
};

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
  const Tela = telas[ativo] ?? telas[inicial];

  return (
    <div>
      <div className="scroll-x rounded-lg border border-ink-700 bg-ink-900 p-2">
        <div className="min-w-[1040px] overflow-hidden rounded border border-slate-200">
          <DemoNavContext.Provider value={{ workspace, active: ativo, onSelect: setAtivo }}>
            <Tela />
          </DemoNavContext.Provider>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-fog-500">
        <MousePointerClick aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300" />
        <span>
          {legenda ?? "Clique nos itens da barra lateral para navegar entre as telas."} Ambiente
          demonstrativo, com nomes, CPFs e telefones fictícios.
        </span>
      </p>
    </div>
  );
}
