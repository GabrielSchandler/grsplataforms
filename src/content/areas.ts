/**
 * Páginas de área. A divisão espelha as cinco áreas de trabalho do próprio
 * sistema (Comercial, Jurídico, Financeiro, Academy e Gestão), então o site
 * tem a mesma estrutura que o produto.
 *
 * A home resume; aqui mora a profundidade. Cada página precisa se sustentar
 * sozinha na busca, porque é por elas que a intenção específica chega.
 *
 * Mesma regra do resto do site: nada entra sem existir no código do sistema.
 */

export type AreaBlock = {
  title: string;
  paragraph?: string;
  items?: readonly string[];
  screenshot?: { id: string; alt: string; caption: string };
};

export type Area = {
  slug: string;
  navLabel: string;
  /**
   * Réplica navegável embutida na página: o visitante entra na área e clica
   * pelas telas dela. Quando existe, as capturas estáticas daquelas mesmas
   * telas saem dos blocos — seria mostrar duas vezes a mesma coisa, e a
   * segunda vez pesando no carregamento.
   */
  demo?: {
    workspace: "Comercial" | "Jurídico" | "Financeiro" | "Academy" | "Gestão";
    inicial: string;
    /** Título da seção. Escrito à mão porque montar a frase a partir do
     *  nome da área erra a concordância ("a área jurídico"). */
    titulo: string;
    legenda: string;
  };
  /** Rótulo curto para o índice na home. */
  cardTitle: string;
  cardDescription: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  lead: string;
  blocks: readonly AreaBlock[];
  faq: readonly { question: string; answer: string }[];
  whatsappMessage: string;
};

export const areas: readonly Area[] = [
  {
    slug: "comercial",
    navLabel: "Comercial",
    demo: {
      workspace: "Comercial",
      inicial: "Painel comercial",
      titulo: "Use a área comercial aqui mesmo.",
      legenda:
        "Navegue pelo comercial: painel, distribuição de leads, clientes, pré-vendas, simulações e documentos.",
    },
    cardTitle: "Comercial",
    cardDescription:
      "Do lead da planilha ao contrato assinado: distribuição, pipeline, simulação e documento.",
    metaTitle: "CRM comercial com pipeline, simulação e documentos",
    metaDescription:
      "Distribuição de leads de planilha, pipeline em Kanban, simulações de veículo, imóvel e empréstimo com relatório automático, e contratos por template. Agende uma demonstração.",
    eyebrow: "Área comercial",
    headline: "O consultor trabalha em uma tela só, do primeiro contato ao contrato.",
    lead:
      "Cada etapa entrega a próxima já preenchida. Não existe reentrada de dado, planilha intermediária nem cadastro refeito quando o cliente avança.",
    blocks: [
      {
        title: "Distribuição de leads sem duplicar ninguém",
        paragraph:
          "Cada empresa liga as próprias planilhas do Google Sheets como fonte. O sistema confere o que já entrou e importa somente as linhas novas, então rodar a importação duas vezes não cria cliente repetido. O supervisor distribui manualmente ou divide em partes iguais entre os consultores disponíveis, e o lead distribuído vira cadastro já no nome do responsável.",
      },
      {
        title: "Pipeline com o motivo de cada movimento",
        paragraph:
          "As pré-vendas ficam em Kanban, com o valor do contrato e o responsável em cada card. Toda mudança de etapa pede o motivo, o que transforma o funil em histórico consultável em vez de fotografia do momento.",
        items: [
          "Filtro por consultor, origem e produto",
          "Valor do contrato visível em cada card",
          "Registro obrigatório do motivo em cada mudança",
          "Pagamentos previstos e pagos vinculados à pré-venda",
          "Alerta de cobrança pelo que está previsto e não entrou",
        ],
      },
      {
        title: "Um cadastro por cliente, com tudo dentro",
        paragraph:
          "A tela do cliente é dividida em abas — dados, pré-vendas, documentação, extrajudicial, processual, simulações, acompanhamento e linha do tempo. A busca encontra por nome ou CPF, tanto do contratante quanto do titular da dívida quando são pessoas diferentes, sem devolver o mesmo cliente duas vezes.",
        items: [
          "Contratante e titular da dívida cadastrados separadamente",
          "Upload múltiplo de documento, imagem, áudio WAV, DOCX, PDF e e-mail MSG",
          "Linha do tempo alimentada por cada ação registrada, com autor e data",
        ],
      },
      {
        title: "Simulação feita na tela, em três tipos de contrato",
        paragraph:
          "Veículo, imóvel e empréstimo, com percentual de redução ajustável por caso e quitação opcional. O consultor preenche os dados do contrato e o cálculo acontece ali, sem planilha paralela.",
        items: [
          "Percentual de redução ajustável caso a caso",
          "Quitação antecipada como opção do cálculo",
          "Importação dos dados da anotação interna da Totalk pelo telefone",
          "Numeração de protocolo própria por simulação",
        ],
      },
      {
        title: "O sistema produz a análise. Ninguém monta arquivo à mão.",
        paragraph:
          "Ao salvar a simulação, o próprio sistema gera o relatório completo em PDF e a imagem-resumo na mesma ação — com os dados do cliente, os números do contrato, o protocolo e a marca da sua empresa já aplicados. O consultor não abre editor, não formata nada e não tem como enviar uma versão desatualizada: o arquivo nasce do cálculo que acabou de ser feito.",
        items: [
          "Relatório em PDF de três páginas, gerado automaticamente",
          "Imagem-resumo para enviar direto ao cliente",
          "Marca da sua empresa aplicada nos dois arquivos",
          "Protocolo único ligando os arquivos à simulação que os originou",
          "Visualização, download e envio sem sair do cadastro",
        ],
        screenshot: {
          id: "relatorio-pdf",
          alt: "Primeira página do relatório em PDF gerado automaticamente pela simulação",
          caption:
            "Primeira das três páginas. O documento sai com a marca da empresa que usa o sistema, não com a de quem o desenvolveu.",
        },
      },
      {
        title: "A peça que o cliente recebe no WhatsApp",
        paragraph:
          "A imagem-resumo sai na mesma ação do relatório e é feita para ser lida no celular: economia total, comparação entre a parcela atual e a corrigida, e os dois cenários lado a lado. É o material que faz o cliente entender o caso em dez segundos.",
        screenshot: {
          id: "imagem-resumo",
          alt: "Imagem-resumo da simulação, com economia total, parcelas e os dois cenários comparados",
          caption:
            "Mesma simulação, formato diferente: o consultor manda esta imagem e o PDF completo fica anexado ao cadastro.",
        },
      },
      {
        title: "Contrato e recibo por template, não por cópia do anterior",
        paragraph:
          "Os documentos também saem do próprio sistema: modelos DOCX ou PDF com as variáveis do cliente preenchidas automaticamente. Cada contrato recebe numeração única, então localizar depois não depende de lembrar o nome do arquivo nem de procurar em pasta compartilhada.",
      },
      {
        title: "Painel que se monta do trabalho do dia",
        paragraph:
          "Ninguém precisa parar para alimentar relatório: o painel comercial é construído do que a equipe já registrou.",
        items: [
          "Meta, vendas realizadas e quanto falta",
          "Comissão apurada no período",
          "Clientes aprovados e pagamentos pendentes",
          "Ranking de consultores",
          "Origem do lead e produto vendido",
          "Produtividade das simulações",
        ],
      },
    ],
    faq: [
      {
        question: "Preciso parar de usar minhas planilhas de captação?",
        answer:
          "Não. As planilhas do Google Sheets continuam sendo a fonte, conectadas por empresa. O que muda é que a cópia manual para o sistema deixa de existir, e a importação só traz o que é novo.",
      },
      {
        question: "Consigo dividir os leads igualmente entre a equipe?",
        answer:
          "Consegue. A distribuição pode ser manual, lead a lead, ou dividida em partes iguais entre os consultores disponíveis. Em qualquer um dos dois casos, o lead vira cadastro de cliente já no nome do responsável.",
      },
      {
        question: "A simulação serve para quais tipos de contrato?",
        answer:
          "Veículo, imóvel e empréstimo. Em todos, o percentual de redução é ajustável por caso e a quitação antecipada é opcional.",
      },
    ],
    whatsappMessage:
      "GRS Plataforma (CRM) — vim pela página do módulo comercial e gostaria de agendar uma demonstração.",
  },
  {
    slug: "juridico",
    navLabel: "Jurídico",
    demo: {
      workspace: "Jurídico",
      inicial: "Esteira",
      titulo: "Use a área jurídica aqui mesmo.",
      legenda:
        "Navegue pela área jurídica: esteira, cliente, pré-vendas e documentos.",
    },
    cardTitle: "Jurídico",
    cardDescription:
      "Esteira que você desenha, com documentos esperados por etapa e portal para o cliente.",
    metaTitle: "Esteira jurídica configurável, documentos e portal do cliente",
    metaDescription:
      "Software com esteira jurídica que a própria empresa configura: etapas, cores, documentos esperados, movimentação em massa, e-mail pelo Outlook e portal de acompanhamento do cliente.",
    eyebrow: "Área jurídica",
    headline: "A esteira é sua. Você desenha as etapas, não o contrário.",
    lead:
      "Nada de fluxo fixo imposto por quem fez o sistema. Cada empresa cria as próprias colunas e reordena quando o processo mudar — porque o processo sempre muda.",
    blocks: [
      {
        title: "Etapas criadas pela própria empresa",
        paragraph:
          "Cada coluna tem título, cor, descrição e a lista de documentos que espera receber. Quem tem permissão cria, edita, reordena e remove etapas sem depender de suporte. O cliente aprovado no comercial entra na esteira com todo o histórico junto, sem novo cadastro.",
        items: [
          "Colunas criadas, editadas e reordenadas pela empresa",
          "Documentos esperados declarados por etapa",
          "Cliente arrastado entre etapas, individualmente ou em massa",
          "Filtros por responsável, consultor e situação",
          "Inativação e distrato tratados sem apagar histórico",
        ],
      },
      {
        title: "E-mail sem sair do processo",
        paragraph:
          "O envio acontece pelo Microsoft Graph, com a conta da própria empresa. Dá para usar template ou texto livre, escolher se o destinatário é o cliente, o banco ou ambos, incluir cópia, cópia oculta, anexo e assinatura, e salvar como rascunho em vez de enviar.",
      },
      {
        title: "Cobranças vinculadas à pré-venda",
        paragraph:
          "Os pagamentos jurídicos ficam ligados à pré-venda que os originou, com geração de recibo. Isso mantém a conversa entre comercial e jurídico sobre o mesmo número, em vez de duas contabilidades paralelas do mesmo cliente.",
      },
      {
        title: "O cliente consulta sozinho",
        paragraph:
          "O portal de acompanhamento é aberto com CPF e número de protocolo, sem criar senha, e mostra apenas as atualizações que o jurídico liberou. O andamento interno continua interno, e a equipe para de ser interrompida por ligação de status.",
        items: [
          "Acesso por CPF e protocolo, sem cadastro",
          "Exibe somente o que foi explicitamente liberado",
          "Cada liberação fica registrada com autor e data",
        ],
        screenshot: {
          id: "portal-cliente",
          alt: "Portal público de acompanhamento, com CPF mascarado, protocolo e atualizações liberadas",
          caption:
            "É a única tela que o cliente final enxerga, e ela mostra exclusivamente o que foi liberado.",
        },
      },
    ],
    faq: [
      {
        question: "A esteira vem com etapas prontas que não posso mudar?",
        answer:
          "Não. As etapas são criadas pela própria empresa, com título, cor, descrição e documentos esperados, e podem ser reordenadas ou removidas quando o processo mudar.",
      },
      {
        question: "Consigo mover vários clientes de etapa de uma vez?",
        answer:
          "Sim. A movimentação pode ser individual, arrastando o card, ou em massa, para vários clientes ao mesmo tempo.",
      },
      {
        question: "O cliente enxerga tudo o que está no processo?",
        answer:
          "Não. O portal mostra somente as atualizações que o jurídico liberou explicitamente. O que está em andamento interno não aparece.",
      },
    ],
    whatsappMessage:
      "GRS Plataforma (CRM) — vim pela página do módulo jurídico e gostaria de agendar uma demonstração.",
  },
  {
    slug: "financeiro",
    navLabel: "Financeiro",
    demo: {
      workspace: "Financeiro",
      inicial: "Lançamentos",
      titulo: "Use o financeiro aqui mesmo.",
      legenda: "Navegue pelo financeiro: lançamentos do período e consultas por intervalo.",
    },
    cardTitle: "Financeiro",
    cardDescription:
      "Entradas, saídas, chargebacks e comissões no mesmo lugar em que a venda foi registrada.",
    metaTitle: "Controle financeiro integrado ao comercial",
    metaDescription:
      "Entradas, saídas, chargebacks, importação de planilha Excel, consultas por período e histórico de alterações — ligados à venda que os originou, sem exportação.",
    eyebrow: "Área financeira",
    headline: "O número da reunião, sem exportar nada.",
    lead:
      "O financeiro deixa de viver de exportação porque o lançamento nasce ligado à venda que o originou.",
    blocks: [
      {
        title: "Lançamentos do período",
        paragraph:
          "Entradas, saídas e chargebacks tratados como categorias próprias, com forma de pagamento e vínculo ao cliente. A importação de planilha Excel resolve a entrada de dado que vem de fora.",
        items: [
          "Entradas, saídas e vendas por período",
          "Chargebacks como lançamento próprio, não como estorno solto",
          "Importação de planilha Excel",
          "Consultas por intervalo de datas",
          "Histórico de alterações de cada lançamento",
        ],
      },
      {
        title: "Meta e comissão calculadas do que entrou",
        paragraph:
          "Os pagamentos registrados na pré-venda alimentam meta e comissão automaticamente. Ninguém precisa refazer a conta no fim do mês, e a divergência entre o que o consultor acha que vendeu e o que a empresa recebeu aparece antes da reunião, não durante.",
      },
    ],
    faq: [
      {
        question: "Consigo trazer meu histórico financeiro de planilha?",
        answer:
          "Sim, por importação de planilha Excel. Os dados passam por tratamento antes da carga, e o cronograma sai do diagnóstico, porque depende do que a sua base entrega.",
      },
      {
        question: "Como o chargeback é tratado?",
        answer:
          "Como categoria própria de lançamento, e não como um estorno solto. Isso mantém o valor visível no resultado do período em vez de sumir do relatório.",
      },
    ],
    whatsappMessage:
      "GRS Plataforma (CRM) — vim pela página do módulo financeiro e gostaria de agendar uma demonstração.",
  },
  {
    slug: "academy",
    navLabel: "Academy",
    cardTitle: "Academy",
    cardDescription:
      "Treinamento em vídeo dentro do próprio sistema, com progresso acompanhado pela gestão.",
    metaTitle: "Treinamento de equipe dentro do próprio CRM",
    metaDescription:
      "Trilhas de treinamento em vídeo dentro da plataforma, com capítulos, avaliações, conclusão registrada e painel de progresso por usuário para a gestão.",
    eyebrow: "Academy",
    headline: "Quem entra na empresa aprende o método, não o jeito do colega.",
    lead:
      "O treinamento mora dentro do sistema, no mesmo lugar onde o trabalho acontece. Não é PDF que ninguém abre nem vídeo perdido em pasta compartilhada.",
    blocks: [
      {
        title: "Dois cursos, propósitos diferentes",
        paragraph:
          "A Formação Comercial GRS trata da venda consultiva revisional — qualificação, simulação, objeções e fechamento. A Operação do CRM GRS ensina a usar a plataforma: clientes, pré-vendas, simulações, documentos e jurídico. Os dois exigem nota mínima 85 para aprovação.",
        items: [
          "Formação Comercial GRS, para quem vende e para quem acompanha vendas",
          "Operação do CRM GRS, para o onboarding de qualquer área",
          "Capítulos, avaliações com nota mínima 85 e conclusão registrada",
          "Painel de acompanhamento do progresso para a gestão",
        ],
        screenshot: {
          id: "academy",
          alt: "Academy com trilhas de treinamento e acompanhamento de progresso por usuário",
          caption:
            "A gestão vê quem concluiu cada trilha, o que torna o treinamento cobrável em vez de opcional.",
        },
      },
      {
        title: "Por que isso importa na troca de equipe",
        paragraph:
          "Operação comercial tem rotatividade. Quando o treinamento depende de alguém sentar ao lado do novato, o método se degrada a cada troca e ninguém percebe até o resultado cair. Com a trilha registrada, a gestão vê quem concluiu o quê e cobra de forma objetiva.",
      },
    ],
    faq: [
      {
        question: "O treinamento está incluído ou é contratado à parte?",
        answer:
          "As videoaulas ficam dentro da própria plataforma, na Academy, nos cursos Formação Comercial GRS e Operação do CRM GRS. O que entra no pacote é definido na proposta, depois do diagnóstico.",
      },
      {
        question: "Consigo acompanhar quem já fez o treinamento?",
        answer:
          "Sim. A gestão tem um painel com o progresso de cada usuário por trilha, incluindo capítulos concluídos e avaliações.",
      },
    ],
    whatsappMessage:
      "GRS Plataforma (CRM) — vim pela página da Academy e gostaria de agendar uma demonstração.",
  },
  {
    slug: "gestao",
    navLabel: "Gestão e segurança",
    demo: {
      workspace: "Gestão",
      inicial: "Empresa",
      titulo: "Use a gestão do seu ambiente aqui mesmo.",
      legenda:
        "Navegue pela gestão: configuração da empresa, usuários, painel, backups e logs de auditoria.",
    },
    cardTitle: "Gestão e segurança",
    cardDescription:
      "Controle do seu ambiente: marca, usuários, módulos, permissões, backup e implantação.",
    metaTitle: "Controle total do ambiente, permissões, backup e segurança de dados",
    metaDescription:
      "Ambiente exclusivo da sua empresa, com a sua marca, módulos que você escolhe, permissões por função e departamento, log de auditoria e backup diário com sete dias de restauração.",
    eyebrow: "Gestão e segurança",
    headline: "O ambiente é da sua empresa, e quem administra é ela.",
    lead:
      "Marca, usuários, permissões e quais módulos ficam ligados são decisões da sua equipe, tomadas dentro do sistema — sem abrir chamado e sem esperar ninguém.",
    blocks: [
      {
        title: "O ambiente é montado conforme o seu pacote",
        paragraph:
          "São onze módulos, configurados conforme o pacote contratado e definidos com o comercial. O que não faz parte do pacote não fica cinza esperando upgrade: some da barra lateral, e a equipe não perde tempo com tela que não vai usar. Usuários contratados e limite de armazenamento ficam visíveis para o administrador da sua equipe acompanhar.",
        items: [
          "Comercial, Jurídico, Financeiro, Simulações, Documentos e Templates",
          "Distribuição de leads, Portal do cliente e Academy",
          "E-mail Outlook e Backups",
          "Usuários contratados e armazenamento acompanhados pela sua equipe",
        ],
      },
      {
        title: "O sistema leva a marca da sua empresa",
        paragraph:
          "A logo e o nome da sua empresa aparecem na plataforma para toda a equipe, e também nos documentos que o sistema gera — relatório de simulação, imagem-resumo, contrato e recibo saem com a sua identidade, não com a de quem desenvolveu o sistema. O arquivo da logo fica em armazenamento privado, servido por link temporário, e a troca fica registrada no log de auditoria. A paleta de cores da interface é a do sistema; a personalização hoje é da identidade da empresa, não do tema visual.",
      },
      {
        title: "Perfis e permissões definidos por você",
        paragraph:
          "Administrador, gestor e consultor têm alcances distintos, cruzados com a área de negócio do usuário. O consultor não navega por tela de financeiro, o jurídico não esbarra em configuração da empresa, e a gestão enxerga o conjunto. Quem cria e ajusta os usuários é o supervisor da sua equipe.",
      },
      {
        title: "Segurança, sem promessa que não se cumpre",
        paragraph:
          "O sistema foi desenvolvido com controles alinhados à proteção e à governança de dados. Abaixo está o que existe implementado — sem afirmação de conformidade absoluta e sem selo que não temos.",
        items: [
          "Dados da sua empresa isolados no próprio banco, não somente na tela",
          "Documentos e logos em armazenamento privado, com link temporário que expira",
          "Permissão por função e departamento",
          "Log de auditoria com autor e data, mantido sem expiração automática",
          "Linha do tempo com o histórico de alterações de cada cliente",
          "Rotinas de backup e restauração conforme a configuração do ambiente e do pacote contratado",
          "Cópia guardada fora do banco de dados, em repositório privado separado",
          "Restauração completa ou limitada a um cliente específico",
          "Tokens de e-mail e integrações guardados cifrados",
        ],
      },
      {
        title: "Implantação e suporte",
        paragraph:
          "O acesso do supervisor é liberado em menos de 24 horas, e é ele mesmo quem cria os usuários da equipe. A migração de base anterior corre em paralelo, sem impedir ninguém de trabalhar: importamos de planilhas e de sistemas anteriores quando há exportação disponível, com tratamento dos dados antes da carga. O cronograma sai do diagnóstico, porque depende do que a sua base entrega. O suporte é pelo WhatsApp, em horário comercial, todos os dias.",
      },
    ],
    faq: [
      {
        question: "Quem tem acesso aos dados da minha operação?",
        answer:
          "A sua equipe, conforme as permissões que o seu supervisor definir. O ambiente é exclusivo da sua empresa, com isolamento aplicado no próprio banco de dados e não apenas na interface, e todo acesso relevante fica registrado no log de auditoria.",
      },
      {
        question: "E se alguém apagar algo por engano?",
        answer:
          "Há rotinas de backup e restauração, definidas conforme a configuração do ambiente e do pacote contratado. A cópia é guardada fora do banco de dados, e a restauração pode ser completa ou limitada a um cliente específico.",
      },
      {
        question: "O sistema fica com a marca da minha empresa?",
        answer:
          "Fica. A logo e o nome da sua empresa aparecem na plataforma para toda a equipe. A paleta de cores da interface é a do sistema — a personalização hoje é da identidade da empresa, não do tema visual.",
      },
      {
        question: "Consigo contratar só uma parte do sistema?",
        answer:
          "Sim. Os módulos são configurados conforme o pacote contratado, definido com o comercial. O que não faz parte do pacote nem aparece na barra lateral da equipe.",
      },
    ],
    whatsappMessage:
      "GRS Plataforma (CRM) — vim pela página de gestão e segurança e gostaria de agendar uma demonstração.",
  },
];

/** Falha no build se uma rota apontar para uma área que não existe. */
export function requireArea(slug: string): Area {
  const area = areas.find((item) => item.slug === slug);

  if (!area) {
    throw new Error(`Área "${slug}" não existe em src/content/areas.ts`);
  }

  return area;
}
