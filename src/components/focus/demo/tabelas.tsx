"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { EMPRESA } from "./dados";
import { useFocus } from "./estado";
import {
  ROTULOS_TIPO,
  cn,
  faixaIndice,
  faixaRisco,
  formatarHoras,
  formatarHorasCurto,
  formatarNumero,
  formatarNumeroCompacto,
  formatarPorcentagem,
} from "./formato";
import { Botao, Cartao, Entrada, IndicadorLed, Selo, Seletor } from "./kit";
import type {
  FatiaDistribuicao,
  LinhaDia,
  LinhaEquipe,
  LinhaHorasExtras,
  LinhaPessoa,
} from "./motor";
import { DISPOSITIVOS, REGISTROS, type DispositivoDemo } from "./vivo";

/**
 * Tabela responsiva do painel: grade no computador, lista de cartões no
 * celular. Uma tabela de oito colunas com rolagem lateral é ilegível no
 * telefone — e é no telefone que o gestor mais consulta.
 */

export type ColunaTabela<T> = {
  chave: string;
  rotulo: string;
  alinhar?: "direita";
  /** Coluna que identifica a linha: vira o título do cartão no celular. */
  principal?: boolean;
  ocultarCelular?: boolean;
  render: (linha: T) => ReactNode;
  valorOrdenacao?: (linha: T) => number | string;
};

type Ordenacao = { coluna: string; direcao: "asc" | "desc" };

export function Tabela<T>({
  colunas,
  linhas,
  chave,
  aoAbrir,
  vazio = "Nenhum registro no período.",
  ordenacaoInicial,
}: {
  colunas: ColunaTabela<T>[];
  linhas: T[];
  chave: (linha: T) => string;
  aoAbrir?: (linha: T) => void;
  vazio?: string;
  ordenacaoInicial?: Ordenacao;
}) {
  const { layout } = useFocus();
  const [ordenacao, setOrdenacao] = useState<Ordenacao | undefined>(ordenacaoInicial);

  const ordenadas = useMemo(() => {
    if (!ordenacao) return linhas;
    const coluna = colunas.find((c) => c.chave === ordenacao.coluna);
    if (!coluna?.valorOrdenacao) return linhas;

    const fator = ordenacao.direcao === "asc" ? 1 : -1;
    return [...linhas].sort((a, b) => {
      const va = coluna.valorOrdenacao!(a);
      const vb = coluna.valorOrdenacao!(b);
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * fator;
      return String(va).localeCompare(String(vb), "pt-BR") * fator;
    });
  }, [linhas, colunas, ordenacao]);

  if (linhas.length === 0) {
    return <Cartao className="p-10 text-center text-sm text-slate-500">{vazio}</Cartao>;
  }

  const principal = colunas.find((c) => c.principal) ?? colunas[0];
  const secundarias = colunas.filter((c) => c !== principal && !c.ocultarCelular);

  if (layout === "celular") {
    return (
      <Cartao className="overflow-hidden">
        <ul className="divide-y divide-slate-800/70">
          {ordenadas.map((linha) => (
            <li key={chave(linha)} className="p-4">
              <button
                type="button"
                onClick={aoAbrir ? () => aoAbrir(linha) : undefined}
                className={cn("block w-full text-left", !aoAbrir && "cursor-default")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 font-medium text-slate-100">{principal.render(linha)}</div>
                  {aoAbrir ? (
                    <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-600" />
                  ) : null}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                  {secundarias.map((coluna) => (
                    <div key={coluna.chave} className="min-w-0">
                      <dt className="text-xs text-slate-500">{coluna.rotulo}</dt>
                      <dd className="truncate text-sm text-slate-300">{coluna.render(linha)}</dd>
                    </div>
                  ))}
                </dl>
              </button>
            </li>
          ))}
        </ul>
      </Cartao>
    );
  }

  function alternar(coluna: ColunaTabela<T>) {
    if (!coluna.valorOrdenacao) return;
    setOrdenacao((atual) =>
      atual?.coluna === coluna.chave
        ? { coluna: coluna.chave, direcao: atual.direcao === "asc" ? "desc" : "asc" }
        : { coluna: coluna.chave, direcao: "desc" },
    );
  }

  return (
    <Cartao className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-foco-borda">
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            {colunas.map((coluna) => {
              const ativa = ordenacao?.coluna === coluna.chave;
              return (
                <th
                  key={coluna.chave}
                  scope="col"
                  aria-sort={
                    ativa ? (ordenacao!.direcao === "asc" ? "ascending" : "descending") : "none"
                  }
                  className={cn("px-4 py-3 font-medium", coluna.alinhar === "direita" && "text-right")}
                >
                  {coluna.valorOrdenacao ? (
                    <button
                      type="button"
                      onClick={() => alternar(coluna)}
                      className={cn(
                        "inline-flex items-center gap-1 transition-colors hover:text-slate-300",
                        ativa && "text-cyan-300",
                      )}
                    >
                      {coluna.rotulo}
                      {ativa ? (
                        ordenacao!.direcao === "asc" ? (
                          <ArrowUp aria-hidden="true" className="h-3 w-3" />
                        ) : (
                          <ArrowDown aria-hidden="true" className="h-3 w-3" />
                        )
                      ) : null}
                    </button>
                  ) : (
                    coluna.rotulo
                  )}
                </th>
              );
            })}
            {aoAbrir ? <th className="w-8" /> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {ordenadas.map((linha) => (
            <tr
              key={chave(linha)}
              onClick={aoAbrir ? () => aoAbrir(linha) : undefined}
              className={cn("transition-colors hover:bg-slate-800/30", aoAbrir && "cursor-pointer")}
            >
              {colunas.map((coluna) => (
                <td
                  key={coluna.chave}
                  className={cn("px-4 py-3", coluna.alinhar === "direita" && "text-right")}
                >
                  {coluna.render(linha)}
                </td>
              ))}
              {aoAbrir ? (
                <td className="px-2">
                  <ChevronRight aria-hidden="true" className="h-4 w-4 text-slate-600" />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </Cartao>
  );
}

/** Barra proporcional dentro da célula — comparação sem sair da tabela. */
export function CelulaBarra({
  valor,
  maximo,
  rotulo,
  cor = "#22d3ee",
}: {
  valor: number;
  maximo: number;
  rotulo: string;
  cor?: string;
}) {
  const parte = maximo > 0 ? Math.min(100, (valor / maximo) * 100) : 0;
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="tabular-nums text-slate-300">{rotulo}</span>
      <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-800 lg:block">
        <span
          className="block h-full rounded-full"
          style={{ width: `${parte}%`, background: cor }}
        />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ equipes */

export function TabelaEquipes({ linhas }: { linhas: LinhaEquipe[] }) {
  const { abrirTela, definirEscopo } = useFocus();
  const maiorTempo = Math.max(1, ...linhas.map((l) => l.minutosAtivos));

  const colunas: ColunaTabela<LinhaEquipe>[] = [
    {
      chave: "equipe",
      rotulo: "Equipe",
      principal: true,
      valorOrdenacao: (l) => l.equipe,
      render: (l) => (
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.cor }} />
          <span className="truncate font-medium text-slate-100">{l.equipe}</span>
        </span>
      ),
    },
    {
      chave: "pessoas",
      rotulo: "Pessoas",
      alinhar: "direita",
      valorOrdenacao: (l) => l.pessoas,
      render: (l) => <span className="tabular-nums text-slate-300">{l.pessoas}</span>,
    },
    {
      chave: "ativo",
      rotulo: "Tempo ativo",
      alinhar: "direita",
      valorOrdenacao: (l) => l.minutosAtivos,
      render: (l) => (
        <CelulaBarra
          valor={l.minutosAtivos}
          maximo={maiorTempo}
          rotulo={formatarHorasCurto(l.minutosAtivos)}
        />
      ),
    },
    {
      chave: "mediaPessoa",
      rotulo: "Média/pessoa",
      alinhar: "direita",
      valorOrdenacao: (l) => (l.pessoas > 0 ? l.minutosAtivos / l.pessoas : 0),
      // Sem isto, uma equipe de dez sempre parece melhor que uma de três.
      render: (l) => (
        <span className="tabular-nums text-slate-200">
          {l.pessoas > 0 ? formatarHorasCurto(l.minutosAtivos / l.pessoas) : "—"}
        </span>
      ),
    },
    {
      chave: "produtivo",
      rotulo: "Produtivo",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.minutosProdutivos,
      render: (l) => (
        <span className="tabular-nums text-slate-400">{formatarHorasCurto(l.minutosProdutivos)}</span>
      ),
    },
    {
      chave: "improdutivo",
      rotulo: "Improdutivo",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.minutosImprodutivos,
      render: (l) => (
        <span className="tabular-nums text-slate-400">
          {formatarHorasCurto(l.minutosImprodutivos)}
        </span>
      ),
    },
    {
      chave: "aderencia",
      rotulo: "Aderência",
      alinhar: "direita",
      valorOrdenacao: (l) => l.aderencia ?? -1,
      render: (l) => (
        <span className="tabular-nums text-slate-300">{formatarPorcentagem(l.aderencia, 0)}</span>
      ),
    },
    {
      chave: "indice",
      rotulo: "Índice",
      alinhar: "direita",
      valorOrdenacao: (l) => l.indice ?? -1,
      render: (l) => (
        <span className={cn("font-medium tabular-nums", faixaIndice(l.indice).classe)}>
          {formatarPorcentagem(l.indice, 1)}
        </span>
      ),
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      linhas={linhas}
      chave={(l) => l.equipeId}
      aoAbrir={(l) => {
        definirEscopo({ equipeId: l.equipeId });
        abrirTela("pessoas");
      }}
      ordenacaoInicial={{ coluna: "ativo", direcao: "desc" }}
      vazio="Nenhuma equipe com registro no período."
    />
  );
}

/* -------------------------------------------------------------- colaboradores */

export function TabelaColaboradores({
  linhas,
  mostrarEquipe = true,
}: {
  linhas: LinhaPessoa[];
  mostrarEquipe?: boolean;
}) {
  const { abrirTela } = useFocus();
  const maiorTempo = Math.max(1, ...linhas.map((l) => l.minutosAtivos));

  const colunas: ColunaTabela<LinhaPessoa>[] = [
    {
      chave: "colaborador",
      rotulo: "Colaborador",
      principal: true,
      valorOrdenacao: (l) => l.colaborador,
      render: (l) => (
        <span className="block min-w-0">
          <span className="block truncate font-medium text-slate-100">{l.colaborador}</span>
          <span className="block truncate text-xs text-slate-500">{l.cargo}</span>
        </span>
      ),
    },
    ...(mostrarEquipe
      ? [
          {
            chave: "equipe",
            rotulo: "Equipe",
            valorOrdenacao: (l: LinhaPessoa) => l.equipe,
            render: (l: LinhaPessoa) => <span className="truncate text-slate-400">{l.equipe}</span>,
          } as ColunaTabela<LinhaPessoa>,
        ]
      : []),
    {
      chave: "dias",
      rotulo: "Dias",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.diasComRegistro,
      render: (l) => <span className="tabular-nums text-slate-400">{l.diasComRegistro}</span>,
    },
    {
      chave: "ativo",
      rotulo: "Tempo ativo",
      alinhar: "direita",
      valorOrdenacao: (l) => l.minutosAtivos,
      render: (l) => (
        <CelulaBarra
          valor={l.minutosAtivos}
          maximo={maiorTempo}
          rotulo={formatarHorasCurto(l.minutosAtivos)}
        />
      ),
    },
    {
      chave: "mediaDia",
      rotulo: "Média/dia",
      alinhar: "direita",
      valorOrdenacao: (l) => (l.diasComRegistro > 0 ? l.minutosAtivos / l.diasComRegistro : 0),
      render: (l) => (
        <span className="tabular-nums text-slate-200">
          {l.diasComRegistro > 0 ? formatarHorasCurto(l.minutosAtivos / l.diasComRegistro) : "—"}
        </span>
      ),
    },
    {
      chave: "ocioso",
      rotulo: "Ocioso",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.minutosOciosos,
      render: (l) => (
        <span className="tabular-nums text-slate-400">{formatarHorasCurto(l.minutosOciosos)}</span>
      ),
    },
    {
      chave: "interacoes",
      rotulo: "Interações",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.teclas + l.cliques,
      render: (l) => (
        <span className="tabular-nums text-slate-400">
          {formatarNumeroCompacto(l.teclas + l.cliques)}
        </span>
      ),
    },
    {
      chave: "aderencia",
      rotulo: "Aderência",
      alinhar: "direita",
      valorOrdenacao: (l) => l.aderencia ?? -1,
      render: (l) => (
        <span className="tabular-nums text-slate-300">{formatarPorcentagem(l.aderencia, 0)}</span>
      ),
    },
    {
      chave: "indice",
      rotulo: "Índice",
      alinhar: "direita",
      valorOrdenacao: (l) => l.indice ?? -1,
      render: (l) => (
        <span className={cn("font-medium tabular-nums", faixaIndice(l.indice).classe)}>
          {formatarPorcentagem(l.indice, 1)}
        </span>
      ),
    },
  ];

  return (
    <div data-tour="tabela-pessoas">
      <Tabela
        colunas={colunas}
        linhas={linhas}
        chave={(l) => l.colaboradorId}
        aoAbrir={(l) => abrirTela("pessoa", l.colaboradorId)}
        ordenacaoInicial={{ coluna: "ativo", direcao: "desc" }}
        vazio="Nenhum colaborador com registro no período."
      />
    </div>
  );
}

/* -------------------------------------------------------------- aplicativos */

export function TabelaAplicativos({ linhas }: { linhas: FatiaDistribuicao[] }) {
  const total = linhas.reduce((soma, linha) => soma + linha.minutos, 0);
  const maior = Math.max(1, ...linhas.map((linha) => linha.minutos));

  const colunas: ColunaTabela<FatiaDistribuicao>[] = [
    {
      chave: "nome",
      rotulo: "Aplicativo / site",
      principal: true,
      valorOrdenacao: (l) => l.nome,
      render: (l) => (
        <span className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.cor }} />
          <span className="truncate font-medium text-slate-100">{l.nome}</span>
        </span>
      ),
    },
    {
      chave: "categoria",
      rotulo: "Categoria",
      valorOrdenacao: (l) => l.tipo ?? "ZZZ",
      render: (l) =>
        l.tipo ? (
          <Selo
            variante={l.tipo === "PRODUCTIVE" ? "ativo" : l.tipo === "NEUTRAL" ? "roxo" : "offline"}
          >
            {ROTULOS_TIPO[l.tipo]}
          </Selo>
        ) : (
          <Selo>sem categoria</Selo>
        ),
    },
    {
      chave: "pessoas",
      rotulo: "Pessoas",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.pessoas,
      render: (l) => <span className="tabular-nums text-slate-400">{l.pessoas}</span>,
    },
    {
      chave: "participacao",
      rotulo: "Participação",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.minutos,
      render: (l) => (
        <span className="tabular-nums text-slate-400">
          {formatarPorcentagem(total > 0 ? (l.minutos / total) * 100 : 0, 1)}
        </span>
      ),
    },
    {
      chave: "tempo",
      rotulo: "Tempo",
      alinhar: "direita",
      valorOrdenacao: (l) => l.minutos,
      render: (l) => (
        <CelulaBarra valor={l.minutos} maximo={maior} rotulo={formatarHoras(l.minutos)} cor={l.cor} />
      ),
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      linhas={linhas}
      chave={(l) => l.nome}
      ordenacaoInicial={{ coluna: "tempo", direcao: "desc" }}
      vazio="Nenhum uso registrado no período."
    />
  );
}

/* -------------------------------------------------------------- dispositivos */

export function TabelaDispositivos() {
  const colunas: ColunaTabela<DispositivoDemo>[] = [
    {
      chave: "maquina",
      rotulo: "Estação",
      principal: true,
      valorOrdenacao: (d) => d.maquina,
      render: (d) => (
        <span className="flex items-center gap-2">
          <IndicadorLed estado={d.online ? "ativo" : "offline"} />
          <span className="truncate font-medium text-slate-100">{d.maquina}</span>
        </span>
      ),
    },
    {
      chave: "usuario",
      rotulo: "Último usuário",
      valorOrdenacao: (d) => d.usuario,
      render: (d) => <span className="truncate text-slate-400">{d.usuario}</span>,
    },
    {
      chave: "status",
      rotulo: "Status",
      render: (d) => {
        if (d.online) return <Selo variante="ativo">online</Selo>;
        if (d.parada) return <Selo variante="ocioso">parada</Selo>;
        return <Selo variante="offline">offline</Selo>;
      },
    },
    {
      chave: "versao",
      rotulo: "Versão do agente",
      ocultarCelular: true,
      valorOrdenacao: (d) => d.versao,
      render: (d) => <span className="foco-mono text-xs text-slate-500">{d.versao}</span>,
    },
    {
      chave: "sync",
      rotulo: "Última sincronização",
      alinhar: "direita",
      valorOrdenacao: (d) => -d.minutosAtras,
      render: (d) => <span className="text-slate-400">{d.sincronizou}</span>,
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      linhas={DISPOSITIVOS}
      chave={(d) => d.id}
      ordenacaoInicial={{ coluna: "sync", direcao: "desc" }}
      vazio="Nenhuma estação matriculada."
    />
  );
}

/* -------------------------------------------------------------- horas extras */

export function TabelaHorasExtras({
  linhas,
  mostrarEquipe = true,
}: {
  linhas: LinhaHorasExtras[];
  mostrarEquipe?: boolean;
}) {
  const maiorExtra = Math.max(1, ...linhas.map((l) => l.minutosExtras));

  const colunas: ColunaTabela<LinhaHorasExtras>[] = [
    {
      chave: "colaborador",
      rotulo: "Colaborador",
      principal: true,
      valorOrdenacao: (l) => l.colaborador,
      render: (l) => (
        <span className="block min-w-0">
          <span className="block truncate font-medium text-slate-100">{l.colaborador}</span>
          <span className="block truncate text-xs text-slate-500">{l.cargo}</span>
        </span>
      ),
    },
    ...(mostrarEquipe
      ? [
          {
            chave: "equipe",
            rotulo: "Equipe",
            valorOrdenacao: (l: LinhaHorasExtras) => l.equipe,
            render: (l: LinhaHorasExtras) => (
              <span className="truncate text-slate-400">{l.equipe}</span>
            ),
          } as ColunaTabela<LinhaHorasExtras>,
        ]
      : []),
    {
      chave: "janela",
      rotulo: "Janela esperada",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.janela,
      render: (l) => <span className="tabular-nums text-slate-400">{l.janela}</span>,
    },
    {
      chave: "ativoTotal",
      rotulo: "Tempo ativo",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.minutosAtivosTotais,
      render: (l) => (
        <span className="tabular-nums text-slate-400">
          {formatarHorasCurto(l.minutosAtivosTotais)}
        </span>
      ),
    },
    {
      chave: "extras",
      rotulo: "Fora da janela",
      alinhar: "direita",
      valorOrdenacao: (l) => l.minutosExtras,
      render: (l) => (
        <CelulaBarra
          valor={l.minutosExtras}
          maximo={maiorExtra}
          rotulo={formatarHorasCurto(l.minutosExtras)}
          cor="#fb7185"
        />
      ),
    },
    {
      chave: "dias",
      rotulo: "Dias com extra",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.diasComHoraExtra,
      render: (l) => <span className="tabular-nums text-slate-400">{l.diasComHoraExtra}</span>,
    },
    {
      chave: "percentual",
      rotulo: "% fora da janela",
      alinhar: "direita",
      valorOrdenacao: (l) => l.percentualExtra ?? -1,
      render: (l) => (
        <span className={cn("font-medium tabular-nums", faixaRisco(l.percentualExtra).classe)}>
          {formatarPorcentagem(l.percentualExtra, 1)}
        </span>
      ),
    },
  ];

  return (
    <div data-tour="tabela-extras">
      <Tabela
        colunas={colunas}
        linhas={linhas}
        chave={(l) => l.colaboradorId}
        ordenacaoInicial={{ coluna: "extras", direcao: "desc" }}
        vazio="Nenhum colaborador com registro no período."
      />
    </div>
  );
}

/* ------------------------------------------------------------------ dia a dia */

export function TabelaDias({ linhas }: { linhas: LinhaDia[] }) {
  const colunas: ColunaTabela<LinhaDia>[] = [
    {
      chave: "dia",
      rotulo: "Data",
      principal: true,
      valorOrdenacao: (l) => l.dia,
      render: (l) => <span className="font-medium text-slate-100">{l.data}</span>,
    },
    {
      chave: "expediente",
      rotulo: "Expediente",
      valorOrdenacao: (l) => l.primeiroSinal,
      render: (l) => (
        <span className="tabular-nums text-slate-400">
          {l.primeiroSinal} — {l.ultimoSinal}
        </span>
      ),
    },
    {
      chave: "ativo",
      rotulo: "Ativo",
      alinhar: "direita",
      valorOrdenacao: (l) => l.minutosAtivos,
      render: (l) => (
        <span className="tabular-nums text-slate-200">{formatarHorasCurto(l.minutosAtivos)}</span>
      ),
    },
    {
      chave: "ocioso",
      rotulo: "Ocioso",
      alinhar: "direita",
      ocultarCelular: true,
      valorOrdenacao: (l) => l.minutosOciosos,
      render: (l) => (
        <span className="tabular-nums text-slate-400">{formatarHorasCurto(l.minutosOciosos)}</span>
      ),
    },
    {
      chave: "indice",
      rotulo: "Índice",
      alinhar: "direita",
      valorOrdenacao: (l) => l.indice ?? -1,
      render: (l) => (
        <span className={cn("font-medium tabular-nums", faixaIndice(l.indice).classe)}>
          {formatarPorcentagem(l.indice, 1)}
        </span>
      ),
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      linhas={linhas}
      chave={(l) => l.dia}
      ordenacaoInicial={{ coluna: "dia", direcao: "desc" }}
      vazio="Sem registros nesse período."
    />
  );
}

/* ------------------------------------------------------------------ registros */

const ESTADOS = [
  { valor: "todos", rotulo: "Todos os estados" },
  { valor: "ATIVO", rotulo: "Ativo" },
  { valor: "OCIOSO", rotulo: "Ocioso" },
  { valor: "BLOQUEADO", rotulo: "Bloqueado" },
];

/**
 * Atividade minuto a minuto. É o detalhe por trás dos gráficos: quando um
 * número do consolidado parece estranho, é aqui que se descobre por quê.
 */
export function TabelaRegistros({ total }: { total: number }) {
  const { layout } = useFocus();
  const [estado, setEstado] = useState("todos");
  const [busca, setBusca] = useState("");
  const [texto, setTexto] = useState("");

  const linhas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return REGISTROS.filter((linha) => {
      if (estado !== "todos" && linha.estado !== estado) return false;
      if (!termo) return true;
      return [linha.colaborador, linha.processo, linha.dominio, linha.titulo, linha.maquina]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(termo));
    });
  }, [estado, busca]);

  const filtrado = estado !== "todos" || busca.trim() !== "";
  const totalExibido = filtrado ? linhas.length : total;

  return (
    <Cartao className="overflow-hidden">
      <div
        className={cn(
          "flex gap-3 border-b border-foco-borda p-4",
          layout === "celular" ? "flex-col" : "items-center",
        )}
      >
        <Seletor
          aria-label="Estado"
          className={layout === "celular" ? "" : "w-52"}
          valor={estado}
          aoMudar={setEstado}
          opcoes={ESTADOS}
        />

        <form
          className="relative flex-1"
          onSubmit={(evento) => {
            evento.preventDefault();
            setBusca(texto);
          }}
        >
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          />
          <Entrada
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            placeholder="Filtrar por aplicativo, site ou título da janela…"
            aria-label="Buscar nos registros"
            className="pl-9"
          />
        </form>

        <p className="shrink-0 text-xs text-slate-500">
          {linhas.length === 0
            ? "nenhum registro"
            : `1–${formatarNumero(linhas.length)} de ${formatarNumero(totalExibido)}`}
        </p>
      </div>

      {linhas.length === 0 ? (
        <p className="p-10 text-center text-sm text-slate-500">
          Nenhum registro no período com esses filtros. A atividade minuto a minuto existe só
          dentro da janela de retenção da empresa — fora dela sobra o consolidado.
        </p>
      ) : layout === "celular" ? (
        <ul className="divide-y divide-slate-800/70">
          {linhas.slice(0, 40).map((linha) => (
            <li key={linha.chave} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{linha.colaborador}</p>
                  <p className="truncate text-xs text-slate-500">
                    {linha.equipe} · {linha.maquina}
                  </p>
                </div>
                <span className="shrink-0 tabular-nums text-xs text-slate-400">
                  {linha.data} {linha.hora}
                </span>
              </div>
              <p className="mt-2 truncate text-sm text-slate-300">
                {linha.dominio ?? linha.processo}
              </p>
              <p className="truncate text-xs text-slate-600">{linha.titulo}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Selo
                  variante={
                    linha.estado === "ATIVO" ? "ativo" : linha.estado === "OCIOSO" ? "ocioso" : "offline"
                  }
                >
                  {linha.estado.toLowerCase()}
                </Selo>
                <span>{linha.teclas} teclas</span>
                <span>{linha.cliques} cliques</span>
                <span>{linha.segundosAtivos}s ativo</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <table className="w-full text-sm">
          <thead className="border-b border-foco-borda">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Momento</th>
              <th className="px-4 py-3 font-medium">Colaborador</th>
              <th className="px-4 py-3 font-medium">Estação</th>
              <th className="px-4 py-3 font-medium">Aplicativo / site</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium">Teclas</th>
              <th className="px-4 py-3 text-right font-medium">Cliques</th>
              <th className="px-4 py-3 text-right font-medium">Ativo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {linhas.map((linha) => (
              <tr key={linha.chave} className="hover:bg-slate-800/30">
                <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-slate-300">
                  <span className="text-slate-500">{linha.data}</span> {linha.hora}
                </td>
                <td className="px-4 py-2.5">
                  <span className="block truncate text-slate-200">{linha.colaborador}</span>
                  <span className="block truncate text-xs text-slate-600">{linha.equipe}</span>
                </td>
                <td className="px-4 py-2.5 text-slate-400">{linha.maquina}</td>
                <td className="max-w-[22rem] px-4 py-2.5">
                  <span className="block truncate text-slate-300">
                    {linha.dominio ?? linha.processo}
                  </span>
                  <span className="block truncate text-xs text-slate-600" title={linha.titulo}>
                    {linha.titulo}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <IndicadorLed
                      estado={
                        linha.estado === "ATIVO"
                          ? "ativo"
                          : linha.estado === "OCIOSO"
                            ? "ocioso"
                            : "offline"
                      }
                    />
                    {linha.estado.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-400">{linha.teclas}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-400">
                  {linha.cliques}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-400">
                  {linha.segundosAtivos}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {linhas.length > 0 ? (
        <div className="flex items-center justify-between gap-3 border-t border-foco-borda p-4">
          <Botao variante="contorno" tamanho="sm" disabled>
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Anterior
          </Botao>
          <span className="text-xs text-slate-500">
            página 1 de {formatarNumero(Math.max(1, Math.ceil(totalExibido / 100)))} · retenção de{" "}
            {EMPRESA.retencaoDias} dias
          </span>
          <Botao variante="contorno" tamanho="sm" disabled={filtrado}>
            Próxima
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Botao>
        </div>
      ) : null}
    </Cartao>
  );
}
