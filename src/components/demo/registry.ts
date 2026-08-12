import type { ComponentType } from "react";
import {
  DistribuicaoLeads,
  PainelComercial,
  Pipeline,
  Simulacao,
  TelaCliente,
} from "./screens-comercial";
import {
  AcademyScreen,
  EsteiraJuridica,
  Financeiro,
  GestaoEmpresas,
  PortalCliente,
} from "./screens-operacao";

export type DemoScreen = {
  id: string;
  label: string;
  /** Frase curta exibida abaixo das abas, orientando o que olhar. */
  caption: string;
  component: ComponentType;
};

export const demoScreens: DemoScreen[] = [
  {
    id: "painel-comercial",
    label: "Painel comercial",
    caption: "Meta, vendas, comissão e ranking montados do que a equipe já registrou.",
    component: PainelComercial,
  },
  {
    id: "distribuicao-leads",
    label: "Distribuição de leads",
    caption: "Importação incremental da planilha e repasse manual ou equilibrado.",
    component: DistribuicaoLeads,
  },
  {
    id: "pipeline",
    label: "Pipeline",
    caption: "Pré-vendas em Kanban, com valor por etapa e responsável em cada card.",
    component: Pipeline,
  },
  {
    id: "cliente",
    label: "Tela do cliente",
    caption: "Um cadastro dividido em abas, com linha do tempo alimentada automaticamente.",
    component: TelaCliente,
  },
  {
    id: "simulacao",
    label: "Simulação",
    caption: "Redução ajustável, quitação opcional e os arquivos gerados ao salvar.",
    component: Simulacao,
  },
  {
    id: "esteira-juridica",
    label: "Esteira jurídica",
    caption: "Etapas criadas pela própria empresa, com documentos esperados por coluna.",
    component: EsteiraJuridica,
  },
  {
    id: "portal-cliente",
    label: "Portal do cliente",
    caption: "Consulta por CPF e protocolo, exibindo apenas o que foi liberado.",
    component: PortalCliente,
  },
  {
    id: "financeiro",
    label: "Financeiro",
    caption: "Entradas, saídas, chargebacks e importação de planilha por período.",
    component: Financeiro,
  },
  {
    id: "academy",
    label: "Academy",
    caption: "Trilhas de treinamento e progresso de cada pessoa da equipe.",
    component: AcademyScreen,
  },
  {
    id: "empresas",
    label: "Multiempresa",
    caption: "Módulos, usuários contratados e armazenamento controlados por empresa.",
    component: GestaoEmpresas,
  },
];
