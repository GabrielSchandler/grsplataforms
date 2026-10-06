import type { ComponentType } from "react";
import type { Workspace } from "./chrome";
import { AtendimentoWhatsApp, ChatInterno } from "./screens-atendimento";
import {
  DistribuicaoLeads,
  PainelComercial,
  Pipeline,
  Simulacao,
  TelaCliente,
} from "./screens-comercial";
import { ImagemResumo, RelatorioPdf } from "./screens-documentos";
import {
  Backups,
  Consultas,
  Documentos,
  GestaoVisaoGeral,
  Logs,
  Usuarios,
} from "./screens-gestao";
import {
  AcademyScreen,
  ConfiguracaoEmpresa,
  EsteiraJuridica,
  Financeiro,
  PortalCliente,
} from "./screens-operacao";

/**
 * Mapa único das telas da réplica. O tour guiado, a exploração livre e as
 * rotas de captura consultam esta lista — telas duplicadas em três lugares
 * seria garantia de divergirem.
 *
 * `nav` é o rótulo do item na barra lateral. Telas que não vivem no menu
 * (documentos gerados e portal do cliente) ficam sem rótulo.
 */
export type ScreenEntry = {
  component: ComponentType;
  workspace: Workspace;
  nav?: string;
};

export const screenMap: Record<string, ScreenEntry> = {
  atendimento: { component: AtendimentoWhatsApp, workspace: "Comercial", nav: "Atendimento WhatsApp" },
  "chat-interno": { component: ChatInterno, workspace: "Comercial", nav: "Chat interno" },
  "painel-comercial": { component: PainelComercial, workspace: "Comercial", nav: "Painel comercial" },
  "distribuicao-leads": {
    component: DistribuicaoLeads,
    workspace: "Comercial",
    nav: "Distribuição de leads",
  },
  cliente: { component: TelaCliente, workspace: "Comercial", nav: "Clientes" },
  pipeline: { component: Pipeline, workspace: "Comercial", nav: "Pré-vendas" },
  simulacao: { component: Simulacao, workspace: "Comercial", nav: "Simulações" },
  documentos: { component: Documentos, workspace: "Comercial", nav: "Documentos" },
  "relatorio-pdf": { component: RelatorioPdf, workspace: "Comercial" },
  "imagem-resumo": { component: ImagemResumo, workspace: "Comercial" },
  "esteira-juridica": { component: EsteiraJuridica, workspace: "Jurídico", nav: "Esteira" },
  "portal-cliente": { component: PortalCliente, workspace: "Jurídico" },
  financeiro: { component: Financeiro, workspace: "Financeiro", nav: "Financeiro" },
  consultas: { component: Consultas, workspace: "Financeiro", nav: "Consultas" },
  academy: { component: AcademyScreen, workspace: "Academy", nav: "Academy" },
  gestao: { component: GestaoVisaoGeral, workspace: "Gestão", nav: "Gestão" },
  empresa: { component: ConfiguracaoEmpresa, workspace: "Gestão", nav: "Empresa" },
  usuarios: { component: Usuarios, workspace: "Gestão", nav: "Usuários" },
  backups: { component: Backups, workspace: "Gestão", nav: "Backups" },
  logs: { component: Logs, workspace: "Gestão", nav: "Logs" },
};

/** Rótulo da barra lateral → id da tela, para a navegação dentro da réplica. */
export const navToScreen: Record<string, string> = Object.fromEntries(
  Object.entries(screenMap)
    .filter(([, entry]) => entry.nav)
    .map(([id, entry]) => [entry.nav as string, id]),
);
