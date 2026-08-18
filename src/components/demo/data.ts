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

/**
 * Os dois cursos que existem de fato, conforme `src/lib/academy/course.ts`
 * do CRM. A nota de corte 85 também vem de lá.
 *
 * Não inventar trilha de jurídico, financeiro ou supervisão: anunciar curso
 * que não existe é promessa que o cliente cobra na primeira semana de uso.
 */
export const academy = {
  passingScore: 85,
  tracks: [
    {
      name: "Formação Comercial GRS",
      description:
        "Venda consultiva revisional: qualificação, simulação, objeções e fechamento.",
      audience: "Consultores, supervisores e gestores que acompanham vendas.",
      progress: 86,
    },
    {
      name: "Operação do CRM GRS",
      description:
        "Uso profissional da plataforma: clientes, pré-vendas, simulações, documentos e jurídico.",
      audience: "Usuários comerciais, jurídicos, financeiros e administradores em onboarding.",
      progress: 62,
    },
  ],
  team: [
    {
      name: "Marina Vasques",
      track: "Formação Comercial GRS",
      progress: 100,
      status: "Aprovada · 92",
    },
    { name: "Rafael Otoni", track: "Formação Comercial GRS", progress: 78, status: "Em andamento" },
    { name: "Camila Prado", track: "Operação do CRM GRS", progress: 55, status: "Em andamento" },
    { name: "Diego Antunes", track: "Operação do CRM GRS", progress: 33, status: "Em andamento" },
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
    { date: "11/08 · 10:20", user: "Ana Prado", action: "company.logo_uploaded", entity: "Empresa", record: "Ativa Assessoria", detail: "Logo substituída" },
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
 * Configuração da empresa que usa o sistema — o ambiente é dela, e quem
 * administra é ela. A tela mostra o que o administrador do cliente controla
 * sozinho: marca, usuários, armazenamento e quais módulos ficam ligados.
 */
export const companySettings = {
  name: "Ativa Assessoria",
  legalName: "Ativa Assessoria e Consultoria Ltda",
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
