"use client";

import { TourGuiado, type EtapaTour } from "@/components/demo/guided-tour";
import { useAntesDaPintura } from "@/lib/use-antes-da-pintura";
import { ALTURA_CELULAR, ALTURA_DESKTOP, CascaFocus, LARGURA_CELULAR, LARGURA_DESKTOP } from "./casca";
import { ProvedorFocus, useFocus, type LayoutFocus, type TelaId } from "./estado";

/**
 * Roteiro do tour do Focus: o que o gestor passa a enxergar, na ordem em que
 * faz sentido descobrir. Cada etapa destaca um ponto da tela.
 *
 * Segue o painel redesenhado em 16/09/2026: a régua do índice é o
 * EXPEDIENTE, e o tour começa explicando isso — é a diferença que o
 * comprador precisa entender antes de ver qualquer número, senão ele lê
 * "36%" como nota baixa em vez de como o quanto do expediente pago virou
 * trabalho.
 *
 * Quem chega frio não sabe o que procurar num painel cheio de números — por
 * isso o tour vem antes da exploração livre, como na página do CRM.
 */

type EtapaFocus = EtapaTour & { tela: TelaId; pessoaId?: string };

const ETAPAS: EtapaFocus[] = [
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "indice",
    chave: "visao",
    titulo: "Quanto do expediente virou trabalho",
    texto:
      "Tempo em ferramentas produtivas dividido pelo expediente previsto na escala. Tela bloqueada, máquina desligada e tempo parado dentro do expediente contam contra — é o número que mostra onde o dia vaza.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "cobertura",
    chave: "visao",
    titulo: "Quanto do expediente tem dado",
    texto:
      "Cobertura não é presença: é quanto do expediente chegou ao painel. Sem ela, uma queda de índice causada por máquina desligada pareceria queda de desempenho.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "aviso-dados",
    chave: "visao",
    titulo: "Estação parada, avisada no topo",
    texto:
      "Quando uma estação para de enviar durante o expediente, o painel diz qual é e há quanto tempo — antes que vire uma semana de dados perdidos.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "uso",
    chave: "visao",
    titulo: "Para onde foi o expediente",
    texto:
      "Produtivo, neutro, improdutivo, sem classificação, ocioso, bloqueado e sem dados, em horas somadas. É o que explica jornada longa com pouca entrega.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "pontos",
    chave: "visao",
    titulo: "O que olhar primeiro",
    texto:
      "Problema de dado vem antes de leitura de atividade, e cada ponto leva direto para onde se resolve: classificar um aplicativo, revisar um cadastro, abrir a jornada.",
  },
  {
    tela: "visao",
    grupo: "Visão geral",
    destaque: "evolucao",
    chave: "visao",
    titulo: "Está melhorando?",
    texto:
      "O período atual ao lado do anterior, ponto a ponto. A comparação para no mesmo horário: às 16h40, o mês é comparado com o mês anterior até o mesmo ponto.",
  },
  {
    tela: "equipes",
    grupo: "Equipes",
    destaque: "tabela-equipes",
    chave: "equipes",
    titulo: "Equipes comparáveis de verdade",
    texto:
      "O índice da equipe é a média de cada pessoa, então um time de três se compara com um de dez. Variação só aparece quando há dado suficiente nos dois períodos.",
  },
  {
    tela: "pessoa",
    pessoaId: "p04",
    grupo: "Pessoas",
    destaque: "linha-do-tempo",
    chave: "pessoa",
    titulo: "O dia de uma pessoa, minuto a minuto",
    texto:
      "Cada trecho com a cor do que aconteceu, o expediente previsto em tracejado e o intervalo marcado. Dá para ver quem estende o dia sem ninguém perceber.",
  },
  {
    tela: "aplicativos",
    grupo: "Aplicativos",
    destaque: "lista-apps",
    chave: "aplicativos",
    titulo: "Quem decide o que é produtivo é você",
    texto:
      "Cada aplicativo e site, com a categoria que a empresa definiu. O que ainda não tem categoria fica fora do índice até alguém classificar — experimente na exploração livre.",
  },
  {
    tela: "jornada",
    grupo: "Jornada",
    destaque: "comparativo-jornada",
    chave: "jornada",
    titulo: "Jornada, sem virar ponto",
    texto:
      "A escala de cada pessoa e os blocos com registro, dentro e fora dela. Serve para equilibrar carga — e a tela avisa que não é marcação de ponto.",
  },
  {
    tela: "relatorios",
    grupo: "Relatórios",
    destaque: "relatorios",
    chave: "relatorios",
    titulo: "Para levar à diretoria",
    texto:
      "Quatro relatórios em XLSX ou CSV, com o mesmo período, os mesmos filtros e os mesmos critérios da tela. Uma prévia mostra as linhas antes de gerar o arquivo.",
  },
];

const GRUPOS = ["Visão geral", "Equipes", "Pessoas", "Aplicativos", "Jornada", "Relatórios"] as const;

/** Cores do próprio Focus: o realce muda de cor junto com o assunto. */
const CORES: Record<string, string> = {
  "Visão geral": "#1f9fb2",
  Equipes: "#1b5e8f",
  Pessoas: "#3d5f8f",
  Aplicativos: "#e0676b",
  Jornada: "#f2c14e",
  Relatórios: "#16808f",
};

/** Mantém a tela da réplica sincronizada com a etapa do tour. */
function TelaDoPasso({ etapa }: { etapa: EtapaFocus }) {
  const { tela: atual, pessoaId, abrirTela } = useFocus();

  useAntesDaPintura(() => {
    if (atual !== etapa.tela || (etapa.pessoaId && pessoaId !== etapa.pessoaId)) {
      abrirTela(etapa.tela, etapa.pessoaId ? { pessoaId: etapa.pessoaId } : undefined);
    }
  }, [etapa.tela, etapa.pessoaId]);

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
        escurecimento="rgba(9, 17, 31, 0.72)"
        renderTela={(indice) => (
          <div style={{ height: celular ? ALTURA_CELULAR : ALTURA_DESKTOP }}>
            <TelaDoPasso etapa={ETAPAS[indice]} />
          </div>
        )}
      />
    </ProvedorFocus>
  );
}
