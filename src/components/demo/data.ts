/**
 * Dados do ambiente demonstrativo. Tudo aqui é fictício, por decisão:
 * nenhuma tela deste site sai de captura de produção.
 *
 * Convenções:
 * - CPF sempre mascarado (***.000.000-**)
 * - Telefones em faixa inexistente, para não bater em linha de ninguém
 * - Empresa, consultores e clientes são inventados
 * - A esteira jurídica é um desenho de exemplo, não o processo de nenhuma
 *   empresa real — cada cliente monta a própria
 */

export const demoCompany = {
  tradeName: "Ativa Assessoria",
  initials: "AA",
};

export const consultants = [
  { name: "Marina Vasques", initials: "MV" },
  { name: "Rafael Otoni", initials: "RO" },
  { name: "Camila Prado", initials: "CP" },
  { name: "Diego Antunes", initials: "DA" },
  { name: "Larissa Nunes", initials: "LN" },
];

export const commercialPanel = {
  period: "Agosto de 2026",
  stats: [
    { label: "Meta do mês", value: "R$ 180.000", tone: "neutral" as const },
    { label: "Vendas realizadas", value: "R$ 126.400", tone: "positive" as const, hint: "70% da meta" },
    { label: "Restante", value: "R$ 53.600", tone: "neutral" as const },
    { label: "Comissão apurada", value: "R$ 9.480", tone: "neutral" as const },
  ],
  secondary: [
    { label: "Clientes aprovados", value: "38" },
    { label: "Pagamentos pendentes", value: "7" },
    { label: "Simulações no mês", value: "112" },
    { label: "Taxa de aprovação", value: "34%" },
  ],
  ranking: [
    { name: "Marina Vasques", sales: "R$ 41.200", deals: 12, share: 100 },
    { name: "Rafael Otoni", sales: "R$ 33.800", deals: 10, share: 82 },
    { name: "Camila Prado", sales: "R$ 24.500", deals: 8, share: 59 },
    { name: "Diego Antunes", sales: "R$ 16.900", deals: 5, share: 41 },
    { name: "Larissa Nunes", sales: "R$ 10.000", deals: 3, share: 24 },
  ],
  origins: [
    { label: "Planilha — Pesquisa", share: 46 },
    { label: "Planilha — Social", share: 27 },
    { label: "Indicação", share: 18 },
    { label: "Base própria", share: 9 },
  ],
  products: [
    { label: "Veículo", value: "R$ 58.700" },
    { label: "Imóvel", value: "R$ 41.300" },
    { label: "Empréstimo", value: "R$ 26.400" },
  ],
};

export const leadDistribution = {
  source: "Planilha — Captação Pesquisa",
  lastImport: "Hoje, 09:12",
  imported: 24,
  ignored: 61,
  pending: 9,
  leads: [
    { name: "Helena Marcondes", phone: "(11) 90000-0142", origin: "Pesquisa", entry: "Hoje, 09:12", selected: true },
    { name: "Otávio Bittencourt", phone: "(21) 90000-0398", origin: "Pesquisa", entry: "Hoje, 09:12", selected: true },
    { name: "Regina Salles", phone: "(31) 90000-0771", origin: "Social", entry: "Hoje, 08:40", selected: true },
    { name: "Fábio Tanaka", phone: "(11) 90000-0256", origin: "Pesquisa", entry: "Hoje, 08:40", selected: false },
    { name: "Cleusa Andrade", phone: "(41) 90000-0519", origin: "Indicação", entry: "Ontem, 17:55", selected: false },
    { name: "Wilson Prata", phone: "(51) 90000-0684", origin: "Pesquisa", entry: "Ontem, 17:55", selected: false },
  ],
  workload: [
    { name: "Marina Vasques", current: 18, incoming: 1 },
    { name: "Rafael Otoni", current: 17, incoming: 1 },
    { name: "Camila Prado", current: 15, incoming: 1 },
    { name: "Diego Antunes", current: 15, incoming: 0 },
  ],
};

export const pipeline = {
  columns: [
    {
      title: "Novo contato",
      total: "R$ 18.400",
      cards: [
        { client: "Helena Marcondes", product: "Veículo", value: "R$ 4.800", owner: "MV", age: "1 dia" },
        { client: "Otávio Bittencourt", product: "Imóvel", value: "R$ 7.200", owner: "RO", age: "1 dia" },
        { client: "Regina Salles", product: "Empréstimo", value: "R$ 6.400", owner: "CP", age: "2 dias" },
      ],
    },
    {
      title: "Em negociação",
      total: "R$ 26.100",
      cards: [
        { client: "Fábio Tanaka", product: "Veículo", value: "R$ 5.900", owner: "MV", age: "4 dias" },
        { client: "Cleusa Andrade", product: "Imóvel", value: "R$ 12.400", owner: "DA", age: "6 dias" },
        { client: "Wilson Prata", product: "Veículo", value: "R$ 7.800", owner: "RO", age: "3 dias" },
      ],
    },
    {
      title: "Proposta enviada",
      total: "R$ 21.700",
      cards: [
        { client: "Neusa Villar", product: "Empréstimo", value: "R$ 9.300", owner: "CP", age: "8 dias" },
        { client: "Ademir Fontoura", product: "Veículo", value: "R$ 12.400", owner: "MV", age: "5 dias" },
      ],
    },
    {
      title: "Aguardando documentos",
      total: "R$ 15.200",
      cards: [
        { client: "Sueli Barcelos", product: "Imóvel", value: "R$ 15.200", owner: "LN", age: "11 dias" },
      ],
    },
    {
      title: "Aprovado",
      total: "R$ 33.900",
      cards: [
        { client: "Jorge Menegatti", product: "Veículo", value: "R$ 8.700", owner: "RO", age: "2 dias" },
        { client: "Tereza Aquino", product: "Imóvel", value: "R$ 25.200", owner: "MV", age: "1 dia" },
      ],
    },
  ],
};

export const clientRecord = {
  name: "Cleusa Andrade",
  document: "***.412.708-**",
  phone: "(41) 90000-0519",
  city: "Curitiba, PR",
  owner: "Diego Antunes",
  protocol: "2026-04812",
  status: "Em negociação",
  tabs: [
    "Dados",
    "Pré-vendas",
    "Documentação",
    "Extrajudicial",
    "Processual",
    "Simulações",
    "Acompanhamento",
    "Linha do tempo",
  ],
  activeTab: "Linha do tempo",
  timeline: [
    {
      when: "Hoje, 14:32",
      who: "Diego Antunes",
      title: "Simulação registrada",
      detail: "Imóvel · redução de 18% · relatório e imagem-resumo gerados",
    },
    {
      when: "Hoje, 11:07",
      who: "Diego Antunes",
      title: "Documento anexado",
      detail: "contrato-financiamento.pdf · categoria Documentação",
    },
    {
      when: "Ontem, 16:48",
      who: "Sistema",
      title: "Etapa alterada",
      detail: "Novo contato → Em negociação · motivo: cliente retornou o contato",
    },
    {
      when: "Ontem, 16:45",
      who: "Diego Antunes",
      title: "Anotação",
      detail: "Cliente pediu retorno após o dia 20. Prefere contato por WhatsApp.",
    },
    {
      when: "09/08/2026, 10:20",
      who: "Sistema",
      title: "Cliente criado a partir do lead",
      detail: "Fonte: Planilha — Captação Indicação · responsável: Diego Antunes",
    },
  ],
  documents: 6,
  preSales: 1,
  simulations: 2,
};

export const simulation = {
  type: "Imóvel",
  protocol: "SIM-2026-00318",
  client: "Cleusa Andrade",
  fields: [
    { label: "Valor financiado", value: "R$ 320.000,00" },
    { label: "Parcelas contratadas", value: "360" },
    { label: "Parcelas pagas", value: "48" },
    { label: "Parcela atual", value: "R$ 3.184,60" },
    { label: "Taxa do contrato", value: "1,18% a.m." },
  ],
  reduction: 18,
  payoff: true,
  results: [
    { label: "Parcela simulada", value: "R$ 2.611,37", tone: "positive" as const },
    { label: "Diferença mensal", value: "R$ 573,23", tone: "positive" as const },
    { label: "Parcelas restantes", value: "312" },
    { label: "Diferença acumulada", value: "R$ 178.847,76", tone: "positive" as const },
  ],
  outputs: ["Relatório em PDF", "Imagem-resumo"],
};

/**
 * Esteira de exemplo. Cada empresa cria as próprias colunas no sistema —
 * esta é uma composição fictícia, não o fluxo de nenhuma operação real.
 */
export const legalPipeline = {
  columns: [
    {
      title: "Documentação inicial",
      color: "#0f766e",
      expected: "Contrato, procuração, RG/CPF",
      cards: [
        { client: "Jorge Menegatti", protocol: "2026-04790", owner: "Dra. Helena Prates", days: 2 },
        { client: "Tereza Aquino", protocol: "2026-04801", owner: "Dra. Helena Prates", days: 1 },
      ],
    },
    {
      title: "Análise do contrato",
      color: "#1d4ed8",
      expected: "Laudo técnico",
      cards: [
        { client: "Ademir Fontoura", protocol: "2026-04688", owner: "Dr. Caio Sobral", days: 6 },
        { client: "Neusa Villar", protocol: "2026-04702", owner: "Dr. Caio Sobral", days: 4 },
        { client: "Sueli Barcelos", protocol: "2026-04715", owner: "Dra. Helena Prates", days: 3 },
      ],
    },
    {
      title: "Notificação ao banco",
      color: "#b45309",
      expected: "Comprovante de envio",
      cards: [
        { client: "Wilson Prata", protocol: "2026-04559", owner: "Dr. Caio Sobral", days: 9 },
      ],
    },
    {
      title: "Ação protocolada",
      color: "#7e22ce",
      expected: "Número do processo",
      cards: [
        { client: "Fábio Tanaka", protocol: "2026-04402", owner: "Dra. Helena Prates", days: 21 },
        { client: "Regina Salles", protocol: "2026-04418", owner: "Dr. Caio Sobral", days: 18 },
      ],
    },
    {
      title: "Acompanhamento",
      color: "#0f766e",
      expected: "Movimentações do processo",
      cards: [
        { client: "Otávio Bittencourt", protocol: "2026-04120", owner: "Dra. Helena Prates", days: 64 },
      ],
    },
  ],
};

export const clientPortal = {
  client: "Cleusa A.",
  protocol: "2026-04812",
  document: "***.412.708-**",
  status: "Em análise do contrato",
  updates: [
    {
      when: "12/08/2026",
      title: "Análise técnica em andamento",
      detail: "Seu contrato está em análise pela equipe responsável.",
    },
    {
      when: "05/08/2026",
      title: "Documentação recebida",
      detail: "Recebemos os documentos enviados e a conferência foi concluída.",
    },
    {
      when: "01/08/2026",
      title: "Atendimento iniciado",
      detail: "Seu caso foi registrado e encaminhado ao setor responsável.",
    },
  ],
};

export const finance = {
  period: "01/08/2026 a 12/08/2026",
  stats: [
    { label: "Entradas", value: "R$ 142.880", tone: "positive" as const },
    { label: "Saídas", value: "R$ 48.310", tone: "negative" as const },
    { label: "Saldo do período", value: "R$ 94.570", tone: "neutral" as const },
    { label: "Chargebacks", value: "R$ 3.400", tone: "negative" as const },
  ],
  entries: [
    { date: "12/08", description: "Honorários — Tereza Aquino", category: "Venda", method: "Pix", value: "R$ 12.600", kind: "in" as const },
    { date: "12/08", description: "Comissão — Marina Vasques", category: "Saída", method: "Transferência", value: "R$ 3.780", kind: "out" as const },
    { date: "11/08", description: "Honorários — Jorge Menegatti", category: "Venda", method: "Boleto", value: "R$ 8.700", kind: "in" as const },
    { date: "11/08", description: "Chargeback — Neusa Villar", category: "Chargeback", method: "Cartão", value: "R$ 3.400", kind: "out" as const },
    { date: "09/08", description: "Honorários — Ademir Fontoura", category: "Venda", method: "Cartão", value: "R$ 12.400", kind: "in" as const },
    { date: "08/08", description: "Assinatura de ferramentas", category: "Custo fixo", method: "Cartão", value: "R$ 1.240", kind: "out" as const },
  ],
};

export const academy = {
  tracks: [
    {
      name: "Trilha do supervisor",
      description: "Todas as funções do sistema, ponta a ponta.",
      chapters: 14,
      progress: 86,
    },
    {
      name: "Comercial — uso diário",
      description: "Pipeline, pré-venda, simulação e documentos.",
      chapters: 9,
      progress: 62,
    },
    {
      name: "Jurídico — esteira e documentos",
      description: "Etapas, anexos, e-mail e cobranças.",
      chapters: 7,
      progress: 41,
    },
    {
      name: "Financeiro — lançamentos",
      description: "Entradas, saídas, chargebacks e consultas.",
      chapters: 5,
      progress: 20,
    },
  ],
  team: [
    { name: "Marina Vasques", track: "Comercial — uso diário", progress: 100, status: "Concluído" },
    { name: "Rafael Otoni", track: "Comercial — uso diário", progress: 78, status: "Em andamento" },
    { name: "Camila Prado", track: "Comercial — uso diário", progress: 55, status: "Em andamento" },
    { name: "Diego Antunes", track: "Jurídico — esteira", progress: 33, status: "Em andamento" },
  ],
};

export const companies = {
  list: [
    {
      name: "Ativa Assessoria",
      status: "Ativa",
      users: "18 de 20",
      storage: "6,2 GB de 10 GB",
      storagePct: 62,
      modules: ["Comercial", "Jurídico", "Financeiro", "Simulações", "Documentos", "Academy", "Portal", "Backups"],
    },
    {
      name: "Prisma Consultoria",
      status: "Ativa",
      users: "9 de 10",
      storage: "2,8 GB de 10 GB",
      storagePct: 28,
      modules: ["Comercial", "Simulações", "Documentos", "Backups"],
    },
    {
      name: "Nova Rota Serviços",
      status: "Teste",
      users: "3 de 5",
      storage: "0,4 GB de 10 GB",
      storagePct: 4,
      modules: ["Comercial", "Documentos"],
    },
    {
      name: "Marco Legal Assessoria",
      status: "Ativa",
      users: "12 de 15",
      storage: "4,1 GB de 10 GB",
      storagePct: 41,
      modules: ["Comercial", "Jurídico", "Documentos", "Portal", "E-mail Outlook", "Backups"],
    },
  ],
  allModules: [
    "Comercial",
    "Jurídico",
    "Financeiro",
    "Simulações",
    "Documentos",
    "Templates",
    "Distribuição de leads",
    "Portal do cliente",
    "Academy",
    "E-mail Outlook",
    "Backups",
  ],
};
