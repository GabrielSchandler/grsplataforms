/**
 * Conteúdo do site. Todo o texto comercial vive aqui — editar este arquivo
 * muda a página inteira, sem tocar em componente.
 *
 * Regra que vale para tudo abaixo: nenhuma afirmação sobre o produto entra
 * aqui sem existir no código do sistema. Nada de número inventado, prazo
 * que ninguém se comprometeu a cumprir ou selo de conformidade.
 */

export const nav = {
  links: [
    { label: "Jornada", href: "#jornada" },
    { label: "Módulos", href: "#modulos" },
    { label: "Jurídico", href: "#juridico" },
    { label: "Segurança", href: "#seguranca" },
    { label: "Implantação", href: "#implantacao" },
    { label: "Perguntas", href: "#perguntas" },
  ],
  cta: "Agendar demonstração",
};

export const hero = {
  eyebrow: "Sistema de operação para empresas de serviços com comercial e jurídico",
  title: "Do primeiro lead ao acompanhamento final, toda a operação em um só lugar.",
  subtitle:
    "Comercial, jurídico, financeiro, documentos e treinamento no mesmo sistema, com o nome e a logo da sua empresa. Cada setor enxerga apenas o que é dele, e nada se perde no caminho entre um departamento e outro.",
  primaryCta: "Agendar demonstração",
  secondaryCta: "Conhecer o sistema",
  trustLine:
    "Nasceu e roda dentro de uma operação real de revisão de juros, com equipe comercial e jurídico próprios.",
  // As mensagens começam identificando a origem: na lista do WhatsApp o
  // comercial já vê que o contato veio do site do CRM, não do institucional.
  whatsappMessage:
    "GRS Plataforma (CRM) — vim pelo site e gostaria de agendar uma demonstração do sistema.",
};

export const benefitStrip = [
  {
    title: "Uma base só",
    description: "Lead, cliente, contrato, processo e pagamento no mesmo cadastro.",
  },
  {
    title: "Cada setor no seu lugar",
    description: "Áreas de trabalho separadas, com permissão por função e departamento.",
  },
  {
    title: "Rastro de tudo",
    description: "Linha do tempo por cliente, com autor, data e documento de cada passo.",
  },
  {
    title: "Com a sua marca",
    description: "O sistema exibe a logo e o nome da sua empresa, não os nossos.",
  },
];

export const problems = {
  eyebrow: "O que costuma estar quebrado",
  title: "A operação não trava por falta de esforço. Trava nas emendas.",
  intro:
    "Quase toda empresa de serviços com pós-venda chega ao mesmo ponto: cada setor resolveu o próprio problema com a própria ferramenta, e o trabalho passou a ser costurar uma coisa na outra.",
  items: [
    {
      title: "A planilha de leads não conversa com o sistema",
      description:
        "Alguém copia linha por linha, cria o mesmo cliente duas vezes e só descobre quando dois consultores ligam para a mesma pessoa.",
    },
    {
      title: "Ninguém sabe onde o cliente parou",
      description:
        "O comercial fechou, o jurídico não recebeu, e responder ao cliente depende de perguntar em três grupos de WhatsApp.",
    },
    {
      title: "Contrato montado à mão",
      description:
        "Documento editado no Word a partir do último que ficou pronto, com nome trocado, valor antigo e nenhuma numeração que permita achá-lo depois.",
    },
    {
      title: "O cliente liga para saber do processo",
      description:
        "E a equipe interrompe o que está fazendo para procurar a informação em pasta, e-mail e conversa antiga.",
    },
    {
      title: "O financeiro vive de exportação",
      description:
        "Valor previsto num lugar, valor pago em outro, comissão calculada no fim do mês na base da memória e da boa vontade.",
    },
    {
      title: "Treinamento que não escala",
      description:
        "Cada pessoa nova aprende olhando o colega do lado, e o método muda de mesa para mesa até ninguém saber qual é o certo.",
    },
  ],
};

export const journey = {
  eyebrow: "Jornada ponta a ponta",
  title: "O caminho que o cliente percorre, sem sair do sistema.",
  intro:
    "Cada etapa entrega a próxima já preenchida. Não há reentrada de dado, planilha intermediária nem cadastro refeito quando o cliente muda de setor.",
  phases: [
    {
      name: "Entrada do lead",
      steps: [
        {
          title: "Fontes conectadas por empresa",
          description:
            "Cada empresa liga as próprias planilhas do Google Sheets como fonte de captação.",
        },
        {
          title: "Importação incremental",
          description:
            "O sistema confere o que já entrou e importa somente as linhas novas. Rodar duas vezes não duplica nada.",
        },
        {
          title: "Distribuição",
          description:
            "O supervisor distribui manualmente ou divide em partes iguais entre os consultores.",
        },
        {
          title: "Cliente criado",
          description:
            "O lead distribuído vira cadastro de cliente já no nome do consultor responsável.",
        },
      ],
    },
    {
      name: "Pré-venda e negociação",
      steps: [
        {
          title: "Pipeline comercial",
          description:
            "O consultor registra a pré-venda e move o card pelo funil. Toda mudança de etapa pede o motivo.",
        },
        {
          title: "Simulação quando o caso pede",
          description:
            "Veículo, imóvel ou empréstimo, com percentual de redução ajustável e quitação opcional.",
        },
        {
          title: "Relatório gerado na hora",
          description:
            "A simulação produz o PDF e a imagem-resumo automaticamente, prontos para enviar ao cliente.",
        },
        {
          title: "Pagamentos registrados",
          description:
            "Previsto e pago ficam na pré-venda e alimentam meta, comissão e alerta de cobrança.",
        },
        {
          title: "Documentos por template",
          description:
            "Contrato e recibo saem do modelo com as variáveis do cliente preenchidas, cada um com numeração própria.",
        },
      ],
    },
    {
      name: "Jurídico",
      steps: [
        {
          title: "Entrada sem recadastro",
          description:
            "Aprovado no comercial, o cliente entra na esteira jurídica com todo o histórico junto.",
        },
        {
          title: "Esteira controlada",
          description:
            "Etapa, documento esperado, responsável, e-mail e cobrança, com movimentação individual ou em massa.",
        },
        {
          title: "Portal do cliente",
          description:
            "O que o jurídico libera aparece no acompanhamento do cliente. O que não foi liberado não aparece.",
        },
      ],
    },
    {
      name: "Gestão",
      steps: [
        {
          title: "Resultado consolidado",
          description:
            "Metas, comissões, caixa, produtividade e histórico reunidos para quem precisa decidir.",
        },
      ],
    },
  ],
};

export const modules = {
  eyebrow: "Modular de verdade",
  title: "Monte o sistema do tamanho da sua operação.",
  intro:
    "Onze módulos ligados ou desligados por empresa. O que não é contratado não fica cinza esperando upgrade: some da barra lateral, e a equipe não perde tempo com tela que não vai usar.",
  items: [
    {
      name: "Comercial",
      description: "Clientes, pré-vendas, pipeline e painel do consultor.",
      group: "Operação",
    },
    {
      name: "Jurídico",
      description: "Esteira configurável, responsáveis, documentos e cobranças.",
      group: "Operação",
    },
    {
      name: "Financeiro",
      description: "Entradas, saídas, chargebacks, consultas por período e importação de planilha.",
      group: "Operação",
    },
    {
      name: "Simulações",
      description: "Veículo, imóvel e empréstimo, com relatório em PDF e imagem-resumo.",
      group: "Operação",
    },
    {
      name: "Documentos",
      description: "Upload múltiplo, categorias por cliente e geração a partir de template.",
      group: "Operação",
    },
    {
      name: "Templates personalizados",
      description: "Modelos DOCX e PDF com variáveis, mantidos pela própria empresa.",
      group: "Operação",
    },
    {
      name: "Distribuição de leads",
      description: "Conexão com planilhas e repasse manual ou equilibrado entre consultores.",
      group: "Crescimento",
    },
    {
      name: "Portal do cliente",
      description: "Acompanhamento público protegido por CPF e protocolo.",
      group: "Crescimento",
    },
    {
      name: "Academy",
      description: "Trilhas, capítulos, avaliações e progresso por usuário.",
      group: "Crescimento",
    },
    {
      name: "E-mail Outlook",
      description: "Envio pelo Microsoft Graph com template, anexo, cópia e assinatura.",
      group: "Gestão",
    },
    {
      name: "Backups",
      description: "Cópia automática diária, restauração completa ou por cliente.",
      group: "Gestão",
    },
  ],
};

export const workspaces = {
  eyebrow: "Áreas de trabalho",
  title: "Cinco operações, uma base de dados.",
  intro:
    "A barra lateral se reconfigura conforme a área. O consultor não navega por tela de financeiro, o jurídico não esbarra em configuração de empresa, e a gestão vê o conjunto.",
  items: [
    { name: "Comercial", description: "Clientes, pré-vendas, simulações e documentos." },
    { name: "Jurídico", description: "Esteira, documentos jurídicos, e-mails e acompanhamento." },
    { name: "Financeiro", description: "Lançamentos e consultas por período." },
    { name: "Academy", description: "Trilhas de treinamento e progresso." },
    { name: "Gestão", description: "Painel, usuários, templates, integrações, backups e logs." },
  ],
};

export const simulations = {
  eyebrow: "Simulações e documentos",
  title: "O material que o cliente recebe sai pronto do sistema.",
  intro:
    "A simulação é feita na tela, com o percentual de redução ajustável e quitação opcional. Ao salvar, o relatório em PDF e a imagem-resumo são gerados automaticamente, com numeração de protocolo própria.",
  items: [
    "Três tipos de cálculo: veículo, imóvel e empréstimo",
    "Percentual de redução ajustável por caso, com quitação opcional",
    "Relatório em PDF e imagem-resumo gerados na mesma ação",
    "Visualização, download e envio sem sair do cadastro do cliente",
    "Importação dos dados da anotação interna da Totalk pelo telefone",
    "Contratos e recibos a partir de template DOCX ou PDF com variáveis",
    "Numeração única de protocolo e de contrato para localizar depois",
  ],
};

export const legal = {
  eyebrow: "Esteira jurídica",
  title: "A esteira é sua. Você desenha as etapas.",
  intro:
    "Nada de fluxo fixo imposto por quem fez o sistema. Cada empresa cria as próprias colunas, define o título, a cor e quais documentos são esperados em cada etapa, e reordena quando o processo mudar.",
  items: [
    "Colunas criadas, editadas e reordenadas pela própria empresa",
    "Documentos esperados declarados por etapa",
    "Cliente arrastado entre etapas, individualmente ou em massa",
    "Filtros por responsável, consultor e situação",
    "Inativação e distrato tratados sem apagar histórico",
    "Cobranças e pagamentos jurídicos vinculados à pré-venda, com recibo",
    "E-mail pelo Outlook com template ou texto livre, anexo, cópia e rascunho",
  ],
};

export const integrations = {
  eyebrow: "Integrações e automações",
  title: "O trabalho repetitivo já está feito quando alguém abre a tela.",
  main: [
    {
      name: "Google Sheets",
      description:
        "Fontes de lead conectadas por empresa, com importação incremental que não repete linha já registrada.",
    },
    {
      name: "Microsoft Outlook",
      description:
        "Envio pelo Microsoft Graph, com template ou texto livre, destinatário cliente ou banco, cópia, anexo e assinatura.",
    },
    {
      name: "Totalk",
      description:
        "Importação dos dados da anotação interna pelo telefone e envio do material gerado na simulação.",
    },
  ],
  automations: [
    "Importação de lead apenas do que é novo",
    "Distribuição equilibrada entre consultores",
    "Criação do cliente logo após a distribuição",
    "Geração do PDF e da imagem ao salvar a simulação",
    "Substituição de variáveis nos documentos por template",
    "Protocolo único por simulação e por contrato",
    "Entrada automática do aprovado na esteira jurídica",
    "Cálculo de meta e comissão a partir dos pagamentos",
    "Alerta de cobrança pelo valor previsto e pago",
    "Linha do tempo alimentada por cada ação registrada",
    "Backup completo gerado todo dia, sem ninguém apertar botão",
  ],
};

export const portal = {
  eyebrow: "Portal do cliente",
  title: "O cliente consulta sozinho. A equipe volta a trabalhar.",
  intro:
    "O acompanhamento é aberto com CPF e número de protocolo, e mostra apenas as atualizações que o jurídico liberou. O que está em andamento interno permanece interno.",
  items: [
    "Acesso por CPF e protocolo, sem criar senha",
    "Exibe somente o que foi explicitamente liberado",
    "Reduz a ligação de status que interrompe a equipe",
    "Cada liberação fica registrada com autor e data",
  ],
};

export const dashboards = {
  eyebrow: "Painéis e financeiro",
  title: "O número que a reunião precisa, sem exportar nada.",
  intro:
    "O painel comercial é montado a partir do que a equipe já registrou no dia a dia. Ninguém precisa parar para alimentar relatório.",
  commercial: [
    "Meta, vendas realizadas e quanto falta",
    "Comissão apurada no período",
    "Clientes aprovados e pagamentos pendentes",
    "Ranking de consultores",
    "Origem do lead e produto vendido",
    "Produtividade das simulações",
  ],
  finance: [
    "Entradas, saídas e vendas por período",
    "Chargebacks tratados como lançamento próprio",
    "Importação de planilha Excel",
    "Consultas por intervalo de datas",
    "Histórico de alterações de cada lançamento",
  ],
};

export const academy = {
  eyebrow: "Academy",
  title: "O treinamento mora dentro do sistema.",
  intro:
    "As videoaulas ficam na própria plataforma, organizadas em duas trilhas: uma para o supervisor, cobrindo todas as funções, e uma por setor, mostrando como cada equipe usa o que é dela. Quem entra na empresa aprende o método, não o jeito do colega ao lado.",
  items: [
    "Trilha do supervisor com todas as funções do sistema",
    "Trilha por setor, com o uso específico de cada equipe",
    "Capítulos, avaliações e conclusão registrada",
    "Painel de acompanhamento do progresso para a gestão",
  ],
};

export const security = {
  eyebrow: "Segurança e governança",
  title: "Separação de dados, rastro e cópia fora do banco.",
  intro:
    "O sistema foi desenvolvido com controles alinhados à proteção e à governança de dados. Abaixo está o que existe implementado, sem promessa de conformidade absoluta nem selo que não temos.",
  items: [
    {
      title: "Isolamento por empresa",
      description:
        "Cada empresa enxerga apenas os próprios dados, com políticas de segurança aplicadas no banco e não somente na tela.",
    },
    {
      title: "Arquivo em armazenamento privado",
      description:
        "Documentos e logos ficam em bucket fechado. O acesso acontece por link temporário, que expira.",
    },
    {
      title: "Permissão por função e departamento",
      description:
        "Administrador, gestor e consultor têm alcances distintos, cruzados com a área de negócio do usuário.",
    },
    {
      title: "Log de auditoria",
      description:
        "Ações relevantes ficam registradas com autor e data, mantidas sem expiração automática.",
    },
    {
      title: "Histórico de alterações",
      description:
        "A linha do tempo do cliente guarda mudanças, anotações, documentos, e-mails e simulações.",
    },
    {
      title: "Backup diário automático",
      description:
        "Cópia completa gerada todo dia e guardada fora do banco de dados, em repositório privado separado.",
    },
    {
      title: "Sete dias de restauração",
      description:
        "Cada backup carrega a própria data de expiração. A restauração pode ser completa ou de um cliente específico.",
    },
    {
      title: "Credenciais de integração protegidas",
      description:
        "Tokens de e-mail e integrações são guardados cifrados, não em texto aberto.",
    },
  ],
};

export const implementation = {
  eyebrow: "Implantação",
  title: "Sua equipe começa a usar em menos de 24 horas.",
  intro:
    "O acesso do supervisor é liberado em menos de um dia útil, e é ele mesmo quem cria os usuários da equipe. A migração de base anterior corre em paralelo, sem impedir ninguém de trabalhar.",
  steps: [
    {
      title: "Diagnóstico",
      description:
        "Entendemos como sua operação funciona hoje, quais módulos fazem sentido e o que existe de base para trazer.",
    },
    {
      title: "Ambiente liberado em menos de 24h",
      description:
        "O supervisor recebe o acesso, cadastra a equipe, sobe a logo da empresa e já começa a operar.",
    },
    {
      title: "Migração analisada caso a caso",
      description:
        "Importamos de planilhas e de sistemas anteriores quando há exportação disponível. Os dados passam por tratamento antes da carga, e o cronograma sai do diagnóstico — depende do que a sua base entrega.",
    },
    {
      title: "Treinamento e operação assistida",
      description:
        "As videoaulas ficam na Academy dentro do sistema, com trilha do supervisor e trilha por setor.",
    },
  ],
  support: {
    title: "Suporte",
    description: "Atendimento pelo WhatsApp em horário comercial, todos os dias.",
  },
  commercialModel: {
    title: "Modelo de contratação",
    description:
      "Mensalidade por usuário contratado, mais implantação. Os módulos são escolhidos por empresa, e o valor é apresentado na proposta depois do diagnóstico.",
  },
};

export const faq = {
  eyebrow: "Perguntas frequentes",
  title: "O que costumam perguntar antes de decidir.",
  items: [
    {
      question: "Preciso trocar tudo que já uso de uma vez?",
      answer:
        "Não. Os módulos são contratados por empresa, então dá para começar pelo comercial e ligar jurídico, financeiro ou Academy depois. O que não foi contratado nem aparece na barra lateral da equipe.",
    },
    {
      question: "Em quanto tempo minha equipe começa a usar?",
      answer:
        "O acesso do supervisor sai em menos de 24 horas, e é ele quem cria os usuários dele. A partir daí a equipe já opera, mesmo que a migração de base anterior ainda esteja em andamento.",
    },
    {
      question: "Vocês migram os dados do meu sistema atual?",
      answer:
        "Sim, quando há exportação disponível. Importamos de planilhas e de sistemas anteriores, e os dados passam por tratamento antes de entrar. O prazo depende do que a sua base entrega, então ele é definido no diagnóstico e não antes.",
    },
    {
      question: "O sistema fica com a marca da minha empresa?",
      answer:
        "Fica. A logo e o nome da sua empresa aparecem na plataforma para toda a equipe. A paleta de cores da interface é a do sistema — a personalização hoje é da identidade da empresa, não do tema visual.",
    },
    {
      question: "A esteira jurídica é engessada?",
      answer:
        "Não. Cada empresa cria as próprias etapas, define título, cor e quais documentos são esperados em cada uma, reordena quando o processo mudar e move clientes individualmente ou em massa.",
    },
    {
      question: "Meus dados ficam separados dos de outra empresa?",
      answer:
        "Sim. O sistema é multiempresa desde a base, com isolamento aplicado no próprio banco de dados, não apenas na interface. Cada empresa acessa somente o que é dela.",
    },
    {
      question: "E se alguém apagar algo por engano?",
      answer:
        "Há backup completo gerado automaticamente todo dia e guardado fora do banco, com sete dias de janela de restauração. A restauração pode ser completa ou limitada a um cliente específico.",
    },
    {
      question: "Como é a cobrança?",
      answer:
        "Mensalidade por usuário contratado, mais implantação. Como os módulos variam por empresa, o valor é apresentado na proposta, depois do diagnóstico.",
    },
    {
      question: "Tem treinamento para a equipe?",
      answer:
        "Tem, e ele fica dentro da própria plataforma. São videoaulas em duas trilhas: uma do supervisor, com todas as funções, e uma por setor, com o uso específico de cada equipe. A gestão acompanha o progresso de cada usuário.",
    },
    {
      question: "Meu cliente consegue acompanhar o andamento?",
      answer:
        "Sim, por um portal aberto com CPF e número de protocolo, que exibe apenas as atualizações liberadas pelo jurídico. O andamento interno continua interno.",
    },
    {
      question: "Consigo testar antes de contratar?",
      answer:
        "Consegue. Além do ambiente demonstrativo aberto nesta página, liberamos um acesso de avaliação com a sua empresa já configurada depois da conversa com o comercial — assim a equipe usa o sistema de verdade antes de decidir.",
    },
    {
      question: "Como funciona o suporte depois que entra no ar?",
      answer:
        "Atendimento pelo WhatsApp em horário comercial, todos os dias.",
    },
  ],
};

export const finalCta = {
  eyebrow: "Próximo passo",
  title: "Veja o sistema rodando com a sua operação em mente.",
  description:
    "Na demonstração passamos pelo caminho completo — entrada do lead, pré-venda, simulação, documento, esteira jurídica e painel — e avaliamos quais módulos fazem sentido para o seu tamanho.",
  formTitle: "Agendar demonstração",
  formDescription:
    "Preencha os campos e o envio abre o WhatsApp com a mensagem pronta para o nosso comercial.",
  consent:
    "Autorizo o contato comercial da GRS Soluções sobre a GRS Plataforma. Os dados preenchidos são enviados pelo seu próprio WhatsApp e não ficam armazenados neste site.",
  submit: "Enviar pelo WhatsApp",
  specialistCta: "Falar com um especialista",
  specialistMessage:
    "GRS Plataforma (CRM) — vim pelo site e gostaria de falar com um especialista sobre o sistema.",
};

export const footer = {
  description:
    "Sistema de operação ponta a ponta para empresas de serviços com comercial, jurídico e financeiro. Desenvolvido e operado pela GRS Soluções.",
  columns: [
    {
      title: "Produto",
      links: [
        { label: "Jornada ponta a ponta", href: "#jornada" },
        { label: "Módulos", href: "#modulos" },
        { label: "Simulações e documentos", href: "#simulacoes" },
        { label: "Esteira jurídica", href: "#juridico" },
        { label: "Portal do cliente", href: "#portal" },
      ],
    },
    {
      title: "Operação",
      links: [
        { label: "Integrações", href: "#integracoes" },
        { label: "Painéis e financeiro", href: "#paineis" },
        { label: "Academy", href: "#academy" },
        { label: "Segurança", href: "#seguranca" },
        { label: "Implantação", href: "#implantacao" },
      ],
    },
  ],
  disclaimer:
    "Desenvolvido com controles alinhados à proteção e à governança de dados. As telas exibidas nesta página são demonstrativas, construídas com dados fictícios.",
};

export const demoLabels = {
  eyebrow: "Ambiente demonstrativo",
  title: "Navegue pelo sistema aqui mesmo.",
  intro:
    "As telas abaixo reproduzem a interface do sistema com dados fictícios. Troque de módulo para ver como cada área trabalha.",
  badge: "Ambiente demonstrativo",
  note: "Nomes, CPFs e telefones são fictícios.",
  testAccess: {
    title: "Quer testar com a sua própria equipe?",
    description:
      "Depois da conversa com o comercial, liberamos um acesso de avaliação com a sua empresa configurada, para a equipe usar de verdade antes de decidir.",
    cta: "Pedir acesso de avaliação",
    ctaExternal: "Abrir ambiente de demonstração",
    whatsappMessage:
      "GRS Plataforma (CRM) — vim pelo site e gostaria de um acesso de avaliação do sistema.",
  },
};
