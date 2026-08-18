/**
 * Roteiro do tour guiado: o caminho completo de um cliente, do lead que cai
 * na planilha até o número que a gestão lê no fim do mês.
 *
 * Cada passo aponta para uma tela do mapa em `components/demo/screen-map.ts`
 * e, quando faz sentido, para o pedaço dela que deve ser destacado. A
 * explicação é curta de propósito — quem faz o tour quer ver o produto
 * andando, não ler um manual.
 */

export type TourStep = {
  /** Id da tela em screenMap. */
  screen: string;
  department: "Marketing" | "Comercial" | "Jurídico" | "Financeiro" | "Gestão";
  title: string;
  text: string;
  /**
   * Valor de `data-tour` do elemento a destacar dentro da tela. O tour
   * escurece o resto e desenha um anel em volta — é o que transforma
   * "olhe essa tela" em "olhe esta parte".
   */
  highlight?: string;
};

export const tourSteps: readonly TourStep[] = [
  {
    screen: "distribuicao-leads",
    department: "Marketing",
    title: "O lead chega pela planilha",
    text: "As fontes do Google Sheets ficam conectadas. A importação traz somente as linhas novas — rodar de novo não recria ninguém.",
    highlight: "importacao-incremental",
  },
  {
    screen: "distribuicao-leads",
    department: "Comercial",
    title: "O supervisor distribui",
    text: "Manualmente, lead a lead, ou dividindo em partes iguais entre os consultores disponíveis.",
    highlight: "carga-consultor",
  },
  {
    screen: "cliente",
    department: "Comercial",
    title: "O cliente é criado",
    text: "O lead distribuído vira cadastro já no nome do consultor responsável, e a linha do tempo começa a se alimentar sozinha.",
    highlight: "linha-do-tempo",
  },
  {
    screen: "pipeline",
    department: "Comercial",
    title: "A negociação anda no pipeline",
    text: "O consultor move o card pelo funil. Toda mudança de etapa pede o motivo, o que transforma o funil em histórico.",
    highlight: "kanban",
  },
  {
    screen: "simulacao",
    department: "Comercial",
    title: "A simulação é feita na tela",
    text: "Veículo, imóvel ou empréstimo, com percentual de redução ajustável por caso e quitação opcional.",
    highlight: "reducao",
  },
  {
    screen: "relatorio-pdf",
    department: "Comercial",
    title: "O relatório sai pronto",
    text: "Ao salvar a simulação, o sistema gera automaticamente o relatório detalhado em PDF e a imagem-resumo, vinculados ao cliente e ao protocolo, com a identidade configurada para a empresa.",
    highlight: "economia-total",
  },
  {
    screen: "imagem-resumo",
    department: "Comercial",
    title: "A imagem-resumo fica pronta para compartilhar",
    text: "A imagem-resumo sai na mesma ação, em formato pensado para o cliente entender o caso rapidamente no celular.",
    highlight: "cards-parcela",
  },
  {
    screen: "pipeline",
    department: "Comercial",
    title: "Pagamentos entram na pré-venda",
    text: "Valores previstos e pagos ficam ligados à negociação e alimentam meta, comissão e alerta de cobrança.",
    highlight: "kanban",
  },
  {
    screen: "documentos",
    department: "Comercial",
    title: "Contrato e recibo por template",
    text: "Contratos e recibos seguem os templates cadastrados, com as variáveis do cliente preenchidas e numeração própria.",
    highlight: "tabela-documentos",
  },
  {
    screen: "esteira-juridica",
    department: "Jurídico",
    title: "O aprovado entra na esteira",
    text: "Sem recadastro e com todo o histórico junto. O jurídico recebe o cliente já com documentos e simulações.",
    highlight: "esteira-colunas",
  },
  {
    screen: "esteira-juridica",
    department: "Jurídico",
    title: "A esteira é da sua empresa",
    text: "As etapas são criadas por você, com cor e documentos esperados. Move um cliente ou vários de uma vez.",
    highlight: "esteira-colunas",
  },
  {
    screen: "portal-cliente",
    department: "Jurídico",
    title: "O cliente acompanha o andamento com autonomia",
    text: "Por CPF e protocolo, vendo apenas as atualizações liberadas. A equipe para de ser interrompida por ligação de status.",
    highlight: "portal-atualizacoes",
  },
  {
    screen: "financeiro",
    department: "Financeiro",
    title: "A venda alimenta os indicadores comerciais",
    text: "Pagamentos registrados nas pré-vendas alimentam os indicadores comerciais de meta e comissão. O módulo financeiro organiza vendas, entradas, saídas e chargebacks em uma visão própria.",
    highlight: "financeiro-stats",
  },
  {
    screen: "painel-comercial",
    department: "Gestão",
    title: "A gestão acompanha resultados e produtividade",
    text: "Meta, comissão, ranking e produtividade se consolidam a partir do que a equipe já registrou, sem digitação paralela.",
    highlight: "painel-stats",
  },
];

/** Ordem das áreas na trilha, para agrupar as etapas visualmente. */
export const tourDepartments = [
  "Marketing",
  "Comercial",
  "Jurídico",
  "Financeiro",
  "Gestão",
] as const;
