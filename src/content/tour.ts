/**
 * Roteiro do tour guiado: o caminho completo de um cliente, do lead que cai
 * na planilha até o número que a gestão lê no fim do mês.
 *
 * Cada passo aponta para uma tela do mapa em `components/demo/screen-map.ts`.
 * A explicação é curta de propósito — quem faz o tour quer ver o produto
 * andando, não ler um manual.
 */

export type TourStep = {
  /** Id da tela em screenMap. */
  screen: string;
  department: "Marketing" | "Comercial" | "Jurídico" | "Financeiro" | "Gestão";
  title: string;
  text: string;
};

export const tourSteps: readonly TourStep[] = [
  {
    screen: "distribuicao-leads",
    department: "Marketing",
    title: "O lead chega pela planilha",
    text: "As fontes do Google Sheets ficam conectadas. A importação traz somente as linhas novas — rodar de novo não recria ninguém.",
  },
  {
    screen: "distribuicao-leads",
    department: "Comercial",
    title: "O supervisor distribui",
    text: "Manualmente, lead a lead, ou dividindo em partes iguais entre os consultores disponíveis.",
  },
  {
    screen: "cliente",
    department: "Comercial",
    title: "O cliente é criado",
    text: "O lead distribuído vira cadastro já no nome do consultor responsável, com abas para dados, documentos, simulações e linha do tempo.",
  },
  {
    screen: "pipeline",
    department: "Comercial",
    title: "A negociação anda no pipeline",
    text: "O consultor move o card pelo funil. Toda mudança de etapa pede o motivo, o que transforma o funil em histórico.",
  },
  {
    screen: "simulacao",
    department: "Comercial",
    title: "A simulação é feita na tela",
    text: "Veículo, imóvel ou empréstimo, com percentual de redução ajustável por caso e quitação opcional.",
  },
  {
    screen: "relatorio-pdf",
    department: "Comercial",
    title: "O relatório sai pronto",
    text: "Ao salvar, o próprio sistema gera o PDF completo — com os dados do cliente, o protocolo e a marca da sua empresa.",
  },
  {
    screen: "imagem-resumo",
    department: "Comercial",
    title: "E a peça para o WhatsApp",
    text: "Na mesma ação sai a imagem-resumo, feita para o cliente entender o caso em dez segundos no celular.",
  },
  {
    screen: "pipeline",
    department: "Comercial",
    title: "Pagamentos entram na pré-venda",
    text: "Valores previstos e pagos ficam ligados à negociação e alimentam meta, comissão e alerta de cobrança.",
  },
  {
    screen: "documentos",
    department: "Comercial",
    title: "Contrato e recibo por template",
    text: "Saem de modelo com as variáveis do cliente preenchidas e numeração própria, em vez de cópia do último arquivo.",
  },
  {
    screen: "esteira-juridica",
    department: "Jurídico",
    title: "O aprovado entra na esteira",
    text: "Sem recadastro e com todo o histórico junto. O jurídico recebe o cliente já com documentos e simulações.",
  },
  {
    screen: "esteira-juridica",
    department: "Jurídico",
    title: "A esteira é da sua empresa",
    text: "As etapas são criadas por você, com cor e documentos esperados. Move um cliente ou vários de uma vez.",
  },
  {
    screen: "portal-cliente",
    department: "Jurídico",
    title: "O cliente acompanha sozinho",
    text: "Por CPF e protocolo, vendo apenas as atualizações liberadas. A equipe para de ser interrompida por ligação de status.",
  },
  {
    screen: "financeiro",
    department: "Financeiro",
    title: "O caixa fecha com a venda",
    text: "Entradas, saídas e chargebacks do período, ligados à negociação que os originou — sem exportar planilha.",
  },
  {
    screen: "painel-comercial",
    department: "Gestão",
    title: "A gestão lê o resultado",
    text: "Meta, comissão, ranking e produtividade se consolidam do que a equipe já registrou. Ninguém para para alimentar relatório.",
  },
];
