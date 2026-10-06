import type { ComponentType } from "react";
import { AtendimentoWhatsApp } from "./screens-atendimento";
import {
  DistribuicaoLeads,
  PainelComercial,
  Pipeline,
  Simulacao,
  TelaCliente,
} from "./screens-comercial";
import {
  AcademyScreen,
  ConfiguracaoEmpresa,
  EsteiraJuridica,
  Financeiro,
  PortalCliente,
} from "./screens-operacao";
import { ImagemResumo, RelatorioPdf } from "./screens-documentos";

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
    id: "atendimento",
    label: "Atendimento com IA",
    caption:
      "WhatsApp dentro do CRM: a IA atende o contato novo e passa para a equipe com os dados. Clique nas abas e nas conversas.",
    component: AtendimentoWhatsApp,
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
    caption: "Pré-vendas em quadro, com o valor do contrato e o responsável em cada card.",
    component: Pipeline,
  },
  {
    id: "cliente",
    label: "Tela do cliente",
    caption: "Cliente 360: um cadastro dividido em abas, com linha do tempo alimentada automaticamente.",
    component: TelaCliente,
  },
  {
    id: "simulacao",
    label: "Simulação",
    caption: "Economia estimada, nova parcela e comparativo, com os arquivos gerados ao salvar.",
    component: Simulacao,
  },
  {
    id: "relatorio-pdf",
    label: "Relatório em PDF",
    caption:
      "Gerado pelo sistema ao salvar a simulação, com a marca da sua empresa e protocolo próprio.",
    component: RelatorioPdf,
  },
  {
    id: "imagem-resumo",
    label: "Imagem-resumo",
    caption: "A peça que o consultor envia ao cliente, produzida na mesma ação do relatório.",
    component: ImagemResumo,
  },
  {
    id: "esteira-juridica",
    label: "Esteira jurídica",
    caption: "Etapas criadas pela própria empresa, com responsável e tempo na etapa em cada card.",
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
    caption: "Saldo do mês, a receber, a pagar e fluxo de caixa, com cada lançamento aberto ao lado.",
    component: Financeiro,
  },
  {
    id: "academy",
    label: "Academy",
    caption: "Catálogo de cursos com capítulos, duração e o seu progresso em cada um.",
    component: AcademyScreen,
  },
  {
    id: "empresa",
    label: "Sua empresa",
    caption:
      "Marca, usuários, armazenamento e módulos ativos — administrados pela sua própria equipe.",
    component: ConfiguracaoEmpresa,
  },
];
