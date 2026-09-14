"use client";

import { TourGuiado, type EtapaTour } from "@/components/demo/guided-tour";
import { useAntesDaPintura } from "@/lib/use-antes-da-pintura";
import {
  ALTURA_CELULAR,
  ALTURA_DESKTOP,
  CascaFocus,
  LARGURA_CELULAR,
  LARGURA_DESKTOP,
} from "./casca";
import { ProvedorFocus, useFocus, type LayoutFocus, type TelaId } from "./estado";

/**
 * Roteiro do tour do Focus: o que o gestor passa a enxergar, na ordem em que
 * faz sentido descobrir. Dez etapas, cada uma destacando um ponto da tela.
 *
 * Quem chega frio não sabe o que procurar num painel cheio de números — por
 * isso o tour vem antes da exploração livre, como na página do CRM.
 */

type EtapaFocus = EtapaTour & { tela: TelaId };

const ETAPAS: EtapaFocus[] = [
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "indice",
    chave: "visao",
    titulo: "O índice de produtividade",
    texto:
      "Tempo produtivo sobre o tempo classificado. Quem decide o que é produtivo em cada aplicativo e site é a sua empresa — o sistema só conta.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "media",
    chave: "visao",
    titulo: "Quanto a equipe trabalha, em média",
    texto:
      "Média de tempo ativo por pessoa e por dia. É o número que compara equipes de tamanhos diferentes e meses de durações diferentes — o total do período não julga nada.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "composicao",
    chave: "visao",
    titulo: "Onde o tempo foi parar",
    texto:
      "Produtivo, neutro, improdutivo e o que ainda não tem categoria. O tempo ocioso e o de tela bloqueada aparecem à parte: é o que explica jornada longa com pouca entrega.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "distribuicao",
    chave: "visao",
    titulo: "Cada ferramenta, com a categoria ao lado",
    texto:
      "O que ainda não tem categoria pode ser classificado ali mesmo, e o índice passa a considerar na hora. Experimente na exploração livre.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "comparativo",
    chave: "visao",
    titulo: "As equipes lado a lado",
    texto:
      "Tempo ativo por categoria, equipe por equipe. É onde a conversa sobre desempenho deixa de ser impressão e passa a ser leitura.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "agora",
    chave: "visao",
    titulo: "Quem está fazendo o quê, agora",
    texto:
      "Aplicativo em primeiro plano e título da janela já higienizado — e-mails e números longos são removidos ainda na estação, antes de qualquer envio.",
  },
  {
    tela: "pessoas",
    grupo: "Pessoas",
    destaque: "tabela-pessoas",
    chave: "pessoas",
    titulo: "O ranking que mostra o ponto fora da curva",
    texto:
      "Ordenável por tempo ativo, média por dia, aderência e índice. Um clique abre o dia a dia da pessoa, com o expediente de cada data.",
  },
  {
    tela: "horas-extras",
    grupo: "Horas extras",
    destaque: "tabela-extras",
    chave: "horas-extras",
    titulo: "Hora extra antes de virar problema",
    texto:
      "Atividade fora da janela de expediente, por pessoa, com faixa de risco. Serve para equilibrar carga — e costuma ser a primeira coisa que o RH pede.",
  },
  {
    tela: "dispositivos",
    grupo: "Estações",
    destaque: "diario",
    chave: "dispositivos",
    titulo: "O diário de bordo das estações",
    texto:
      "Quando cada máquina ligou, bloqueou a tela, hibernou e desligou. E, no topo do painel, o aviso de quem parou de enviar — o risco silencioso deste tipo de sistema.",
  },
  {
    tela: "relatorios",
    grupo: "Relatórios",
    destaque: "relatorios",
    chave: "relatorios",
    titulo: "Para levar à diretoria",
    texto:
      "Quatro relatórios em XLSX ou CSV, com o mesmo recorte de período e de equipe que está na tela. No Excel em português, abrem sem pedir importação.",
  },
];

const GRUPOS = ["Visão geral", "Pessoas", "Horas extras", "Estações", "Relatórios"] as const;

/** Cores do próprio Focus: o realce muda de cor junto com o assunto. */
const CORES: Record<string, string> = {
  "Visão geral": "#22d3ee",
  Pessoas: "#a78bfa",
  "Horas extras": "#fbbf24",
  "Estações": "#38bdf8",
  "Relatórios": "#34d399",
};

/** Mantém a tela da réplica sincronizada com a etapa do tour. */
function TelaDoPasso({ tela }: { tela: TelaId }) {
  const { tela: atual, abrirTela } = useFocus();

  useAntesDaPintura(() => {
    if (atual !== tela) abrirTela(tela);
  }, [tela]);

  return <CascaFocus />;
}

export function TourFocus({ layout }: { layout: LayoutFocus }) {
  const celular = layout === "celular";

  return (
    <ProvedorFocus layout={layout} navegavel={false}>
      <TourGuiado
        etapas={ETAPAS}
        grupos={GRUPOS}
        cores={CORES}
        largura={celular ? LARGURA_CELULAR : LARGURA_DESKTOP}
        classeTela="overflow-hidden rounded-[12px] border border-foco-borda"
        escurecimento="rgba(2, 6, 16, 0.82)"
        renderTela={(indice) => (
          <div style={{ height: celular ? ALTURA_CELULAR : ALTURA_DESKTOP }}>
            <TelaDoPasso tela={ETAPAS[indice].tela} />
          </div>
        )}
      />
    </ProvedorFocus>
  );
}
