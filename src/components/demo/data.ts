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
  tradeName: "SuaEmpresa",
  initials: "SE",
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

/**
 * Pipeline. O sistema mostra o valor do contrato em cada card, mas **não**
 * soma por coluna — conferido em `pre-sales-kanban.tsx`, que só formata o
 * valor do card. A réplica não pode mostrar o que o produto não faz.
 */
export const pipeline = {
  columns: [
    {
      title: "Novo contato",
      cards: [
        { client: "Helena Marcondes", product: "Veículo", value: "R$ 4.800", owner: "MV", age: "1 dia" },
        { client: "Otávio Bittencourt", product: "Imóvel", value: "R$ 7.200", owner: "RO", age: "1 dia" },
        { client: "Regina Salles", product: "Empréstimo", value: "R$ 6.400", owner: "CP", age: "2 dias" },
      ],
    },
    {
      title: "Em negociação",
      cards: [
        { client: "Fábio Tanaka", product: "Veículo", value: "R$ 5.900", owner: "MV", age: "4 dias" },
        { client: "Cleusa Andrade", product: "Imóvel", value: "R$ 12.400", owner: "DA", age: "6 dias" },
        { client: "Wilson Prata", product: "Veículo", value: "R$ 7.800", owner: "RO", age: "3 dias" },
      ],
    },
    {
      title: "Proposta enviada",
      cards: [
        { client: "Neusa Villar", product: "Empréstimo", value: "R$ 9.300", owner: "CP", age: "8 dias" },
        { client: "Ademir Fontoura", product: "Veículo", value: "R$ 12.400", owner: "MV", age: "5 dias" },
      ],
    },
    {
      title: "Aguardando documentos",
      cards: [
        { client: "Sueli Barcelos", product: "Imóvel", value: "R$ 15.200", owner: "LN", age: "11 dias" },
      ],
    },
    {
      title: "Aprovado",
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
  savedAt: "12/08/2026, 14:32",
  /** Parcela atual e nova parcela, em reais, para o comparativo em barras. */
  installments: { current: 3184.6, corrected: 2611.37 },
  /**
   * Resumo da análise. Confere: 3.184,60 × 0,82 = 2.611,37; os totais são a
   * parcela × 312 restantes; a economia é a diferença entre os dois.
   */
  summary: [
    ["Valor financiado", "R$ 320.000,00"],
    ["Quantidade de parcelas", "360"],
    ["Parcelas restantes", "312"],
    ["Parcela atual", "R$ 3.184,60"],
    ["Nova parcela", "R$ 2.611,37"],
    ["Total atual", "R$ 993.595,20"],
    ["Total corrigido", "R$ 814.747,44"],
    ["Economia estimada", "R$ 178.847,76"],
  ] as const,
  results: [
    { label: "Economia estimada", value: "R$ 178.847,76", accent: "success" as const },
    { label: "Nova parcela", value: "R$ 2.611,37", accent: "primary" as const },
    { label: "Redução escolhida", value: "18%", accent: "warning" as const },
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
        { client: "Jorge Menegatti", type: "Veículo", protocol: "2026-04790", owner: "Dra. Helena Prates", days: 2 },
        { client: "Tereza Aquino", type: "Imóvel", protocol: "2026-04801", owner: "Dra. Helena Prates", days: 1 },
      ],
    },
    {
      title: "Análise do contrato",
      color: "#1d4ed8",
      expected: "Laudo técnico",
      cards: [
        { client: "Ademir Fontoura", type: "Veículo", protocol: "2026-04688", owner: "Dr. Caio Sobral", days: 6 },
        { client: "Neusa Villar", type: "Empréstimo", protocol: "2026-04702", owner: "Dr. Caio Sobral", days: 4 },
        { client: "Sueli Barcelos", type: "Imóvel", protocol: "2026-04715", owner: "Dra. Helena Prates", days: 3 },
      ],
    },
    {
      title: "Notificação ao banco",
      color: "#b45309",
      expected: "Comprovante de envio",
      cards: [
        { client: "Wilson Prata", type: "Veículo", protocol: "2026-04559", owner: "Dr. Caio Sobral", days: 9 },
      ],
    },
    {
      title: "Ação protocolada",
      color: "#7e22ce",
      expected: "Número do processo",
      cards: [
        { client: "Fábio Tanaka", type: "Veículo", protocol: "2026-04402", owner: "Dra. Helena Prates", days: 21 },
        { client: "Regina Salles", type: "Empréstimo", protocol: "2026-04418", owner: "Dr. Caio Sobral", days: 18 },
      ],
    },
    {
      title: "Acompanhamento",
      color: "#0f766e",
      expected: "Movimentações do processo",
      cards: [
        { client: "Otávio Bittencourt", type: "Imóvel", protocol: "2026-04120", owner: "Dra. Helena Prates", days: 64 },
      ],
    },
  ],
};

/**
 * Os dois arquivos que a simulação gera sozinha ao ser salva: o relatório em
 * PDF e a imagem-resumo.
 *
 * Todos os números fecham entre si — parcela × quantidade, diferença mensal,
 * economia total e quitação — porque comprador de software confere conta, e
 * exemplo que não bate destrói a credibilidade da tela inteira.
 *
 * A financeira é inventada de propósito: material de exemplo sobre juros
 * abusivos não cita instituição real.
 */
export const simulationDocument = {
  protocol: "202608417",
  issuedAt: "12/08/2026",
  client: "Fábio Tanaka",
  phone: "(11) 90000-0256",
  lender: "Financeira Meridiano",
  specialist: "Marina Vasques",
  type: "Veículo",
  model: "Honda CB 300R",
  year: "2019",
  status: "Aprovado",
  headline: {
    totalSaving: "R$ 15.052,80",
    currentInstallment: "R$ 1.120,00",
    correctedInstallment: "R$ 806,40",
    monthlySaving: "R$ 313,60",
  },
  current: [
    { label: "Valor à vista", value: "R$ 34.500,00" },
    { label: "Entrada", value: "R$ 12.000,00" },
    { label: "Valor financiado", value: "R$ 22.500,00" },
    { label: "Quantidade de parcelas", value: "48" },
    { label: "Valor atual da parcela", value: "R$ 1.120,00" },
    { label: "Parcelas a pagar", value: "48" },
  ],
  projected: [
    { label: "Economia mensal", value: "R$ 313,60", strong: true },
    { label: "Total da dívida atual", value: "R$ 53.760,00" },
    { label: "Total da dívida após revisão", value: "R$ 38.707,20" },
    { label: "Economia total", value: "R$ 15.052,80", strong: true },
    { label: "Saldo devedor sem correção", value: "R$ 53.760,00" },
    { label: "Saldo devedor pós-correção", value: "R$ 38.707,20" },
    { label: "Valor estimado para quitação", value: "R$ 27.095,04", strong: true },
  ],
  disclaimer:
    "Simulação de caráter estimativo. Os valores partem dos dados informados e o resultado final depende da análise documental e das condições da instituição financeira.",
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

/**
 * Visão geral do financeiro. Os números fecham entre si e com as outras telas:
 * saldo do mês = entradas − saídas de agosto; julho + agosto do fluxo de caixa
 * somam o período de Consultas; as premiações previstas são a comissão apurada
 * do painel comercial.
 */
export const finance = {
  period: "Agosto de 2026 · até 12/08",
  stats: [
    { label: "Saldo do mês", value: "R$ 94.570", accent: "primary" as const, hint: "Entradas − saídas pagas" },
    { label: "A receber", value: "R$ 38.200", accent: "success" as const, hint: "Em aberto no período" },
    { label: "A pagar", value: "R$ 12.940", accent: "danger" as const, hint: "Em aberto no período" },
    { label: "Premiações previstas", value: "R$ 9.480", accent: "warning" as const, hint: "Das vendas pendentes" },
  ],
  /** Entradas e saídas pagas por mês, em milhares de reais. */
  cashFlow: [
    { month: "Mar", in: 118.4, out: 52.1 },
    { month: "Abr", in: 131.25, out: 49.8 },
    { month: "Mai", in: 126.9, out: 55.3 },
    { month: "Jun", in: 149.6, out: 51.7 },
    { month: "Jul", in: 175.36, out: 58.56 },
    { month: "Ago", in: 142.88, out: 48.31 },
  ],
  entries: [
    { date: "12/08", description: "Honorários — Tereza Aquino", category: "Venda", method: "Pix", status: "Pago / recebido", value: "R$ 12.600", kind: "in" as const },
    { date: "12/08", description: "Comissão — Marina Vasques", category: "Comissão", method: "Transferência", status: "Pago / recebido", value: "R$ 3.780", kind: "out" as const },
    { date: "11/08", description: "Honorários — Jorge Menegatti", category: "Venda", method: "Boleto", status: "Pago / recebido", value: "R$ 8.700", kind: "in" as const },
    { date: "11/08", description: "Chargeback — Neusa Villar", category: "Chargeback", method: "Cartão", status: "Pago / recebido", value: "R$ 3.400", kind: "out" as const },
    { date: "15/08", description: "Honorários — Ademir Fontoura", category: "Venda", method: "Cartão", status: "Pendente", value: "R$ 12.400", kind: "in" as const },
    { date: "08/08", description: "Assinatura de ferramentas", category: "Custo fixo", method: "Cartão", status: "Pago / recebido", value: "R$ 1.240", kind: "out" as const },
  ],
  /** O lançamento aberto no painel lateral: o primeiro da lista. */
  selected: [
    ["Vencimento", "12/08/2026"],
    ["Tipo", "Receita"],
    ["Categoria", "Venda"],
    ["Cliente / origem", "Tereza Aquino"],
    ["Registrado por", "Ana Prado"],
    ["Valor previsto", "R$ 12.600,00"],
    ["Valor pago", "R$ 12.600,00"],
    ["Forma de pagamento", "Pix"],
  ] as const,
};

/**
 * Os dois cursos que existem de fato, conforme `src/lib/academy/course.ts`
 * do CRM. A nota de corte 85 também vem de lá.
 *
 * Não inventar trilha de jurídico, financeiro ou supervisão: anunciar curso
 * que não existe é promessa que o cliente cobra na primeira semana de uso.
 */
export const academy = {
  passingScore: 85,
  /** Catálogo inteiro: 8 + 7 capítulos, 465 + 395 minutos. */
  totals: { chapters: 15, minutes: 860 },
  tracks: [
    {
      name: "Formação Comercial",
      category: "Venda consultiva",
      description:
        "Venda consultiva: qualificação, simulação, objeções e fechamento.",
      audience: "Consultores, supervisores e gestores que acompanham vendas.",
      chapters: 8,
      done: 7,
      minutes: 465,
      progress: 88,
    },
    {
      name: "Operação do CRM",
      category: "Uso profissional da plataforma",
      description:
        "Uso profissional da plataforma: clientes, pré-vendas, simulações, documentos e jurídico.",
      audience: "Usuários comerciais, jurídicos, financeiros e administradores em onboarding.",
      chapters: 7,
      done: 4,
      minutes: 395,
      progress: 57,
    },
  ],
  /** Primeiros capítulos da Formação Comercial, como aparecem no painel lateral. */
  chapterList: [
    { title: "Mentalidade comercial", minutes: 45 },
    { title: "Qualificação: produto, documentos e prioridade", minutes: 55 },
    { title: "Diagnóstico consultivo e roteiro de perguntas", minutes: 65 },
    { title: "Simulação e apresentação da proposta", minutes: 60 },
    { title: "Comunicação comercial: ligação, WhatsApp e follow-up", minutes: 60 },
  ],
  team: [
    {
      name: "Marina Vasques",
      track: "Formação Comercial",
      progress: 100,
      status: "Aprovada · 92",
    },
    { name: "Rafael Otoni", track: "Formação Comercial", progress: 78, status: "Em andamento" },
    { name: "Camila Prado", track: "Operação do CRM", progress: 55, status: "Em andamento" },
    { name: "Diego Antunes", track: "Operação do CRM", progress: 33, status: "Em andamento" },
  ],
};

/**
 * Telas de apoio, com as mesmas colunas que existem no sistema.
 *
 * As colunas não foram inventadas: saíram das tabelas do próprio CRM
 * (documentos, usuários, backups e logs). O que muda é só o conteúdo, que é
 * fictício.
 */
export const documentos = {
  filters: ["Todos os tipos", "Contrato", "Recibo", "Procuração", "Notificação"],
  stats: [
    { label: "Documentos carregados", value: "148", accent: "primary" as const },
    { label: "Templates utilizados", value: "6", accent: "success" as const },
    { label: "PDFs pendentes / erros", value: "3", accent: "danger" as const },
    { label: "Clientes vinculados", value: "61", accent: "success" as const },
  ],
  rows: [
    {
      title: "Contrato de prestação de serviços",
      type: "Contrato",
      client: "Tereza Aquino",
      template: "Contrato padrão v4",
      source: "Template",
      status: "Gerado",
      date: "12/08/2026",
      author: "Marina Vasques",
    },
    {
      title: "Recibo de honorários",
      type: "Recibo",
      client: "Jorge Menegatti",
      template: "Recibo simples",
      source: "Template",
      status: "Gerado",
      date: "11/08/2026",
      author: "Rafael Otoni",
    },
    {
      title: "Procuração ad judicia",
      type: "Procuração",
      client: "Ademir Fontoura",
      template: "Procuração v2",
      source: "Template",
      status: "Assinado",
      date: "09/08/2026",
      author: "Dra. Helena Prates",
    },
    {
      title: "contrato-financiamento.pdf",
      type: "Documento do cliente",
      client: "Cleusa Andrade",
      template: "—",
      source: "Upload",
      status: "Recebido",
      date: "09/08/2026",
      author: "Diego Antunes",
    },
    {
      title: "Notificação extrajudicial",
      type: "Notificação",
      client: "Wilson Prata",
      template: "Notificação banco",
      source: "Template",
      status: "Enviado",
      date: "05/08/2026",
      author: "Dr. Caio Sobral",
    },
  ],
};

export const usuarios = {
  rows: [
    { name: "Marina Vasques", nick: "Marina", login: "marina.v", phone: "(11) 90000-0011", area: "Comercial", goal: "R$ 45.000", role: "Consultora", active: true },
    { name: "Rafael Otoni", nick: "Rafa", login: "rafael.o", phone: "(11) 90000-0012", area: "Comercial", goal: "R$ 40.000", role: "Consultor", active: true },
    { name: "Camila Prado", nick: "Cah", login: "camila.p", phone: "(11) 90000-0013", area: "Comercial", goal: "R$ 35.000", role: "Consultora", active: true },
    { name: "Helena Prates", nick: "Dra. Helena", login: "helena.p", phone: "(11) 90000-0021", area: "Jurídico", goal: "—", role: "Advogada", active: true },
    { name: "Caio Sobral", nick: "Dr. Caio", login: "caio.s", phone: "(11) 90000-0022", area: "Jurídico", goal: "—", role: "Advogado", active: true },
    { name: "Sônia Rebelo", nick: "Sônia", login: "sonia.r", phone: "(11) 90000-0031", area: "Financeiro", goal: "—", role: "Analista", active: false },
  ],
};

export const backups = {
  rows: [
    { name: "backup-2026-08-12", origin: "Automático", status: "Concluído", size: "412 MB", created: "12/08 · 00:10", expires: "19/08" },
    { name: "backup-2026-08-11", origin: "Automático", status: "Concluído", size: "409 MB", created: "11/08 · 00:10", expires: "18/08" },
    { name: "backup-2026-08-10", origin: "Manual", status: "Concluído", size: "408 MB", created: "10/08 · 15:42", expires: "17/08" },
    { name: "backup-2026-08-09", origin: "Automático", status: "Concluído", size: "405 MB", created: "09/08 · 00:10", expires: "16/08" },
    { name: "backup-2026-08-08", origin: "Automático", status: "Concluído", size: "401 MB", created: "08/08 · 00:10", expires: "15/08" },
  ],
  note: "Rotina deste ambiente demonstrativo. Backups podem ser mantidos fora do banco de produção, conforme a configuração do ambiente.",
};

export const logs = {
  rows: [
    { date: "12/08 · 14:32", user: "Diego Antunes", action: "simulation.created", entity: "Simulação", record: "SIM-2026-00318", detail: "Imóvel · redução 18%" },
    { date: "12/08 · 11:07", user: "Diego Antunes", action: "document.uploaded", entity: "Documento", record: "DOC-4471", detail: "contrato-financiamento.pdf" },
    { date: "12/08 · 09:12", user: "Sistema", action: "leads.imported", entity: "Lead", record: "lote 2026-08-12", detail: "24 novos · 61 ignorados" },
    { date: "11/08 · 16:48", user: "Marina Vasques", action: "presale.stage_changed", entity: "Pré-venda", record: "PV-2211", detail: "Novo contato → Em negociação" },
    { date: "11/08 · 10:20", user: "Ana Prado", action: "company.logo_uploaded", entity: "Empresa", record: "SuaEmpresa", detail: "Logo substituída" },
    { date: "11/08 · 00:10", user: "Sistema", action: "backup.completed", entity: "Backup", record: "backup-2026-08-11", detail: "409 MB · expira em 18/08" },
  ],
};

export const consultas = {
  period: "01/07/2026 a 12/08/2026",
  totals: [
    { label: "Entradas no período", value: "R$ 318.240", tone: "positive" as const },
    { label: "Saídas no período", value: "R$ 106.870", tone: "negative" as const },
    { label: "Resultado", value: "R$ 211.370" },
    { label: "Lançamentos", value: "212" },
  ],
  byCategory: [
    { label: "Venda", value: "R$ 296.400", share: 100 },
    { label: "Comissão", value: "R$ 74.100", share: 25 },
    { label: "Custo fixo", value: "R$ 24.360", share: 8 },
    { label: "Chargeback", value: "R$ 8.410", share: 3 },
  ],
};

/**
 * Visão geral da Gestão. Tudo aqui confere com as outras telas: 18 usuários
 * (17 ativos), um inativo, e as aprovações pendentes são a soma das duas
 * linhas de "Requer sua atenção".
 */
export const gestao = {
  stats: [
    { label: "Aprovações pendentes", value: "4", accent: "danger" as const, hint: "Acompanhamentos e documentos" },
    { label: "Usuários online", value: "11", accent: "primary" as const, hint: "17 usuários ativos" },
    { label: "Simulações criadas hoje", value: "9", accent: "success" as const, hint: "Ontem: 12 · -25%" },
    { label: "Pré-vendas criadas hoje", value: "6", accent: "warning" as const, hint: "Ontem: 5 · +20%" },
  ],
  attention: [
    { label: "Acompanhamentos para revisão", value: "3" },
    { label: "Documentos para aprovação", value: "1" },
    { label: "Usuários inativos", value: "1" },
  ],
  areas: [
    { label: "Comercial", people: 12, active: 92 },
    { label: "Jurídico", people: 4, active: 100 },
    { label: "Gestão", people: 2, active: 100 },
  ],
  operation: [
    { label: "Clientes cadastrados", value: "1.284" },
    { label: "Pré-vendas em andamento", value: "9" },
  ],
  lastBackup: "12/08/2026, 00:10 · Concluído",
  activity: [
    { action: "Simulação criada", who: "Diego Antunes · SIM-2026-00318", when: "12/08/2026, 14:32" },
    { action: "Documento enviado", who: "Diego Antunes · contrato-financiamento.pdf", when: "12/08/2026, 11:07" },
    { action: "Leads importados", who: "Sistema · 24 novos", when: "12/08/2026, 09:12" },
    { action: "Etapa da pré-venda alterada", who: "Marina Vasques · PV-2211", when: "11/08/2026, 16:48" },
  ],
};

/**
 * Atendimento por WhatsApp dentro do CRM.
 *
 * As três abas respondem "de quem é a conversa": as minhas, as de outro
 * consultor e as que ainda estão com a IA, que faz o primeiro atendimento do
 * contato novo e passa para a equipe com os dados que coletou. A conversa da
 * Helena mostra o caminho inteiro: IA → nota de transferência → consultora.
 */
export type MensagemDemo = {
  de: "cliente" | "ia" | "equipe" | "nota" | "sistema";
  autor?: string;
  hora?: string;
  texto: string;
};

export type ConversaDemo = {
  id: string;
  nome: string;
  telefone: string;
  previa: string;
  quando: string;
  naoLidas?: number;
  selo?: "Contato novo" | "IA";
  estado: "IA" | "Em atendimento" | "Aguardando atendente" | "Aguardando cliente";
  responsavel: string;
  mensagens: MensagemDemo[];
};

const conversaHelena: MensagemDemo[] = [
  { de: "cliente", hora: "14:18", texto: "Oi, vi o anúncio de vocês e queria entender como funciona." },
  {
    de: "ia",
    autor: "Ana (IA)",
    hora: "14:18",
    texto: "Olá! Aqui é a Ana, da SuaEmpresa. Para adiantar o seu atendimento: qual é o tipo de contrato?",
  },
  { de: "cliente", hora: "14:20", texto: "Financiamento de veículo. São 48 parcelas de R$ 1.120 e estou em dia." },
  {
    de: "ia",
    autor: "Ana (IA)",
    hora: "14:20",
    texto: "Obrigada, Helena. Vou chamar um especialista da nossa equipe, que continua com você por aqui mesmo, neste WhatsApp.",
  },
  {
    de: "nota",
    texto:
      "Ana (IA) passou a conversa para a equipe — Comercial.\nMotivo: dados principais coletados.\n• Nome: Helena\n• Tipo de contrato: Veículo\n• Valor da parcela: R$ 1.120\n• Parcelas: 48 no total\n• Situação de pagamento: em dia\nResumo: quer entender como funciona a análise do contrato do veículo.",
  },
  { de: "sistema", texto: "Conversa transferida para Marina Vasques · 14:24" },
  { de: "equipe", autor: "Marina", hora: "14:26", texto: "Oi, Helena! Já vi tudo aqui. Vou te explicar os próximos passos." },
  { de: "cliente", hora: "14:32", texto: "Pode me explicar quais documentos preciso enviar?" },
];

export const atendimento = {
  canal: "WhatsApp Comercial",
  abas: [
    { id: "meus", rotulo: "Meus", total: 6 },
    { id: "outros", rotulo: "Outros", total: 14 },
    { id: "ia", rotulo: "IA", total: 3 },
  ] as const,
  filtros: [
    { rotulo: "Todas", total: 6 },
    { rotulo: "Não lidas", total: 1 },
    { rotulo: "Aguardando resposta", total: 2 },
  ],
  conversas: {
    meus: [
      {
        id: "helena",
        nome: "Helena Marcondes",
        telefone: "(11) 90000-0142",
        previa: "Pode me explicar quais documentos preciso enviar?",
        quando: "14:32",
        naoLidas: 1,
        selo: "Contato novo",
        estado: "Em atendimento",
        responsavel: "Marina Vasques",
        mensagens: conversaHelena,
      },
      {
        id: "fabio",
        nome: "Fábio Tanaka",
        telefone: "(11) 90000-0256",
        previa: "Vou enviar o contrato hoje à tarde.",
        quando: "13:10",
        estado: "Em atendimento",
        responsavel: "Marina Vasques",
        mensagens: [
          { de: "equipe", autor: "Marina", hora: "12:58", texto: "Fábio, segue a simulação em PDF e a imagem-resumo." },
          { de: "cliente", hora: "13:10", texto: "Vou enviar o contrato hoje à tarde." },
        ],
      },
      {
        id: "ademir",
        nome: "Ademir Fontoura",
        telefone: "(11) 90000-0633",
        previa: "Marina: Combinado, te aviso assim que sair.",
        quando: "11:47",
        estado: "Aguardando cliente",
        responsavel: "Marina Vasques",
        mensagens: [
          { de: "cliente", hora: "11:40", texto: "Tem novidade da proposta?" },
          { de: "equipe", autor: "Marina", hora: "11:47", texto: "Combinado, te aviso assim que sair." },
        ],
      },
      {
        id: "tereza",
        nome: "Tereza Aquino",
        telefone: "(11) 90000-0871",
        previa: "Obrigada, fico no aguardo.",
        quando: "Ontem",
        estado: "Em atendimento",
        responsavel: "Marina Vasques",
        mensagens: [
          { de: "equipe", autor: "Marina", hora: "16:02", texto: "Tereza, o contrato foi gerado e segue em anexo." },
          { de: "cliente", hora: "16:10", texto: "Obrigada, fico no aguardo." },
        ],
      },
    ],
    outros: [
      {
        id: "wilson",
        nome: "Wilson Prata",
        telefone: "(51) 90000-0684",
        previa: "Rafael: Te ligo às 15h para fechar os detalhes.",
        quando: "13:52",
        estado: "Em atendimento",
        responsavel: "Rafael Otoni",
        mensagens: [
          { de: "cliente", hora: "13:44", texto: "Consegue me ligar hoje?" },
          { de: "equipe", autor: "Rafael", hora: "13:52", texto: "Te ligo às 15h para fechar os detalhes." },
        ],
      },
      {
        id: "neusa",
        nome: "Neusa Villar",
        telefone: "(11) 90000-0417",
        previa: "Já mandei o comprovante.",
        quando: "12:31",
        naoLidas: 2,
        estado: "Em atendimento",
        responsavel: "Camila Prado",
        mensagens: [
          { de: "equipe", autor: "Camila", hora: "12:10", texto: "Neusa, falta só o comprovante de residência." },
          { de: "cliente", hora: "12:31", texto: "Já mandei o comprovante." },
        ],
      },
      {
        id: "sueli",
        nome: "Sueli Barcelos",
        telefone: "(41) 90000-0903",
        previa: "Preciso falar com alguém do jurídico.",
        quando: "10:05",
        estado: "Aguardando atendente",
        responsavel: "Sem responsável",
        mensagens: [
          { de: "cliente", hora: "10:05", texto: "Preciso falar com alguém do jurídico." },
          { de: "sistema", texto: "Na fila da equipe · gerente avisado às 10:20" },
        ],
      },
    ],
    ia: [
      {
        id: "otavio",
        nome: "Otávio Bittencourt",
        telefone: "(21) 90000-0398",
        previa: "Ana (IA): Está em dia com as parcelas?",
        quando: "14:41",
        selo: "IA",
        estado: "IA",
        responsavel: "Sem responsável",
        mensagens: [
          { de: "cliente", hora: "14:39", texto: "Boa tarde, queria saber se vocês analisam contrato de imóvel." },
          {
            de: "ia",
            autor: "Ana (IA)",
            hora: "14:39",
            texto: "Boa tarde! Aqui é a Ana, da SuaEmpresa. Analisamos, sim. Como posso te chamar?",
          },
          { de: "cliente", hora: "14:40", texto: "Otávio. A parcela é de R$ 3.180." },
          { de: "ia", autor: "Ana (IA)", hora: "14:41", texto: "Obrigada, Otávio. Está em dia com as parcelas?" },
        ],
      },
      {
        id: "regina",
        nome: "Regina Salles",
        telefone: "(31) 90000-0771",
        previa: "Quero falar com um atendente.",
        quando: "14:36",
        selo: "IA",
        estado: "IA",
        responsavel: "Sem responsável",
        mensagens: [
          { de: "cliente", hora: "14:36", texto: "Quero falar com um atendente." },
          {
            de: "ia",
            autor: "Ana (IA)",
            hora: "14:36",
            texto: "Claro, Regina. Vou chamar um especialista da nossa equipe, que continua com você por aqui mesmo.",
          },
        ],
      },
      {
        id: "novo",
        nome: "(11) 90000-0519",
        telefone: "(11) 90000-0519",
        previa: "Oi, boa tarde.",
        quando: "14:30",
        selo: "IA",
        estado: "IA",
        responsavel: "Sem responsável",
        mensagens: [
          { de: "cliente", hora: "14:30", texto: "Oi, boa tarde." },
          {
            de: "ia",
            autor: "Ana (IA)",
            hora: "14:30",
            texto: "Boa tarde! Aqui é a Ana, da SuaEmpresa. Como posso te chamar?",
          },
        ],
      },
    ],
  } satisfies Record<string, ConversaDemo[]>,
};

/** Chat interno: conversa entre funcionários, em grupo ou um a um. */
export const chatInterno = {
  conversas: [
    { nome: "Comercial", grupo: true, previa: "Camila: Planilha de leads atualizada.", quando: "14:12", naoLidas: 2 },
    { nome: "Jurídico", grupo: true, previa: "Dr. Caio: Notificação do Wilson enviada.", quando: "13:40" },
    { nome: "Rafael Otoni", grupo: false, previa: "Você: Fechado, obrigado!", quando: "11:58" },
    { nome: "Dra. Helena Prates", grupo: false, previa: "Consegue me passar o contrato da Tereza?", quando: "Ontem" },
  ],
  aberta: {
    nome: "Comercial",
    participantes: 5,
    mensagens: [
      { autor: "Rafael Otoni", hora: "13:58", texto: "Alguém consegue cobrir o plantão das 17h?" },
      { autor: "Você", hora: "14:01", texto: "Eu cubro.", citando: "Alguém consegue cobrir o plantão das 17h?" },
      { autor: "Diego Antunes", hora: "14:07", texto: "Subi a simulação da Cleusa, já está no cadastro dela." },
      { autor: "Camila Prado", hora: "14:12", texto: "Planilha de leads atualizada.", arquivo: "leads-agosto.xlsx" },
    ],
  },
};

/**
 * Configuração da empresa que usa o sistema — o ambiente é dela, e quem
 * administra é ela. A tela mostra o que o administrador do cliente controla
 * sozinho: marca, usuários, armazenamento e quais módulos ficam ligados.
 */
export const companySettings = {
  name: "SuaEmpresa",
  legalName: "SuaEmpresa Ltda",
  taxId: "00.000.000/0001-00",
  since: "Ambiente ativo desde 03/2026",
  users: { used: 18, contracted: 20 },
  storage: { label: "6,2 GB de 10 GB", pct: 62 },
  teams: [
    { name: "Comercial", people: 11 },
    { name: "Jurídico", people: 4 },
    { name: "Financeiro", people: 2 },
    { name: "Administração", people: 1 },
  ],
  modules: [
    { name: "Comercial", enabled: true, group: "Operação" },
    { name: "Jurídico", enabled: true, group: "Operação" },
    { name: "Financeiro", enabled: true, group: "Operação" },
    { name: "Simulações", enabled: true, group: "Operação" },
    { name: "Documentos", enabled: true, group: "Operação" },
    { name: "Templates", enabled: true, group: "Operação" },
    { name: "Distribuição de leads", enabled: true, group: "Crescimento" },
    { name: "Portal do cliente", enabled: true, group: "Crescimento" },
    { name: "Academy", enabled: true, group: "Crescimento" },
    { name: "E-mail Outlook", enabled: false, group: "Gestão" },
    { name: "Backups", enabled: true, group: "Gestão" },
  ],
};
