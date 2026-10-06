import {
  Calculator,
  Check,
  CircleDollarSign,
  Coins,
  FileText,
  Hourglass,
  Image as ImageIcon,
  MessagesSquare,
  Minus,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shuffle,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Screen } from "./chrome";
import { Abas, Avatar, Bar, Button, Panel, Pill, Stat, iniciais, tabela } from "./kit";
import {
  clientRecord,
  commercialPanel,
  leadDistribution,
  pipeline,
  simulation,
} from "./data";

const iconesPainel = [Target, TrendingUp, Hourglass, Coins];
const acentosPainel = ["primary", "success", "warning", "primary"] as const;

export function PainelComercial() {
  return (
    <Screen
      workspace="Comercial"
      active="Painel comercial"
      title="Painel comercial"
      subtitle={`Meta, vendas e comissão da equipe · ${commercialPanel.period}`}
    >
      <div className="grid grid-cols-4 gap-3" data-tour="painel-stats">
        {commercialPanel.stats.map((stat, indice) => (
          <Stat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            accent={acentosPainel[indice]}
            icon={iconesPainel[indice]}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {commercialPanel.secondary.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-ns-border bg-ns-surface px-3.5 py-2.5">
            <p className="text-[10px] font-medium uppercase text-ns-muted">{stat.label}</p>
            <p className="mt-0.5 text-[16px] font-semibold text-ns-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Panel title="Ranking de consultores" hint="Por valor vendido" className="col-span-2">
          <div className="space-y-3">
            {commercialPanel.ranking.map((row) => (
              <div key={row.name} className="flex items-center gap-3">
                <Avatar initials={iniciais(row.name)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-[13px] font-medium text-ns-text">{row.name}</p>
                    <p className="shrink-0 text-[13px] font-semibold text-ns-text">{row.sales}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <Bar value={row.share} />
                    <span className="shrink-0 text-[11px] text-ns-muted">{row.deals} vendas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Origem do lead">
            <div className="space-y-2.5">
              {commercialPanel.origins.map((origin) => (
                <div key={origin.label}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12px] text-ns-muted">{origin.label}</span>
                    <span className="text-[12px] font-semibold text-ns-text">{origin.share}%</span>
                  </div>
                  <div className="mt-1">
                    <Bar value={origin.share} tone="muted" />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Produto vendido">
            <div className="space-y-2">
              {commercialPanel.products.map((product) => (
                <div key={product.label} className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] text-ns-muted">{product.label}</span>
                  <span className="text-[12px] font-semibold text-ns-text">{product.value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Screen>
  );
}

/** Caixa de seleção das tabelas: marcada, vazia ou parcial (o "Todos" do cabeçalho). */
function Caixa({ estado }: { estado: "marcada" | "vazia" | "parcial" }) {
  return (
    <span
      className={`flex h-4 w-4 items-center justify-center rounded border ${
        estado === "vazia" ? "border-ns-border bg-ns-surface" : "border-ns-primary bg-ns-primary"
      }`}
    >
      {estado === "marcada" ? (
        <Check aria-hidden="true" className="h-3 w-3 text-white" strokeWidth={3} />
      ) : estado === "parcial" ? (
        <Minus aria-hidden="true" className="h-3 w-3 text-white" strokeWidth={3} />
      ) : null}
    </span>
  );
}

export function DistribuicaoLeads() {
  const selecionados = leadDistribution.leads.filter((lead) => lead.selected).length;

  return (
    <Screen
      workspace="Comercial"
      active="Distribuição de leads"
      title="Distribuição de leads"
      subtitle={`${leadDistribution.source} · última importação ${leadDistribution.lastImport}`}
      actions={
        <Button>
          <Shuffle aria-hidden="true" className="h-3.5 w-3.5" />
          Distribuir igualmente
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        <Stat
          label="Linhas novas importadas"
          value={String(leadDistribution.imported)}
          accent="success"
          icon={Plus}
        />
        <div data-tour="importacao-incremental">
          <Stat
            label="Já existentes, ignoradas"
            value={String(leadDistribution.ignored)}
            hint="Importação incremental não duplica"
            accent="primary"
            icon={RefreshCw}
          />
        </div>
        <Stat
          label="Aguardando distribuição"
          value={String(leadDistribution.pending)}
          accent="warning"
          icon={Hourglass}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <section className="col-span-2 overflow-hidden rounded-lg border border-ns-border bg-ns-surface">
          <div className="flex items-baseline justify-between gap-3 px-4 py-3.5">
            <h4 className="text-[13px] font-semibold text-ns-text">Leads aguardando</h4>
            <span className="text-[11px] text-ns-muted">{selecionados} selecionados</span>
          </div>
          <table className={tabela.base}>
            <thead className={tabela.cabeca}>
              <tr>
                <th className={`${tabela.th} w-8`}>
                  {/* Marcar só alguns deixa o "Todos" em estado parcial. */}
                  <Caixa estado="parcial" />
                </th>
                <th className={tabela.th}>Nome</th>
                <th className={tabela.th}>Telefone</th>
                <th className={tabela.th}>Origem</th>
                <th className={tabela.th}>Entrada</th>
              </tr>
            </thead>
            <tbody>
              {leadDistribution.leads.map((lead) => (
                <tr key={lead.name} className={lead.selected ? tabela.selecionada : tabela.linha}>
                  <td className={tabela.td}>
                    <Caixa estado={lead.selected ? "marcada" : "vazia"} />
                  </td>
                  <td className={`${tabela.td} font-medium`}>{lead.name}</td>
                  <td className={tabela.fraco}>{lead.phone}</td>
                  <td className={tabela.td}>
                    <Pill>{lead.origin}</Pill>
                  </td>
                  <td className={tabela.fraco}>{lead.entry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Panel title="Carga por consultor" hint="Após distribuir" data-tour="carga-consultor" className="self-start">
          <div className="space-y-3">
            {leadDistribution.workload.map((person) => (
              <div key={person.name} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar initials={iniciais(person.name)} />
                  <span className="truncate text-[13px] text-ns-text">{person.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-ns-text">{person.current}</span>
                  {person.incoming > 0 ? <Pill tone="primary">+{person.incoming}</Pill> : null}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Screen>
  );
}

export function Pipeline() {
  return (
    <Screen
      workspace="Comercial"
      active="Pré-vendas"
      title="Pré-vendas"
      subtitle="Pipeline comercial · todos os consultores"
      actions={
        <Button>
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Nova pré-venda
        </Button>
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-ns-border bg-ns-surface px-2.5 py-2">
          <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ns-muted" />
          <span className="truncate text-[12px] text-ns-muted">
            Nome ou CPF, do cliente ou do financiado
          </span>
        </div>
        <span className="rounded-md border border-ns-primary/40 bg-ns-primary/10 px-2.5 py-2 text-[12px] font-medium text-ns-primary">
          Quadro
        </span>
        <span className="rounded-md border border-ns-border bg-ns-surface px-2.5 py-2 text-[12px] font-medium text-ns-muted">
          Lista
        </span>
      </div>

      <div className="flex gap-2.5">
        {pipeline.columns.map((column, indice) => (
          <div
            key={column.title}
            // O realce do tour pega uma coluna, não o quadro inteiro: é mais
            // preciso e deixa área escura para a legenda.
            data-tour={indice === 1 ? "kanban" : undefined}
            className="flex min-w-0 flex-1 flex-col rounded-lg border border-ns-border bg-ns-alt/60"
          >
            <div className="flex items-center justify-between gap-2 px-3 py-2.5">
              <h4 className="truncate text-[12px] font-semibold text-ns-text">{column.title}</h4>
              <span className="shrink-0 rounded-full bg-ns-surface px-1.5 text-[10px] font-semibold text-ns-muted">
                {column.cards.length}
              </span>
            </div>
            <div className="flex-1 space-y-2 px-2 pb-2">
              {column.cards.map((card) => (
                <article key={card.client} className="rounded-lg border border-ns-border bg-ns-surface p-2.5">
                  <p className="truncate text-[12px] font-semibold text-ns-text">{card.client}</p>
                  <p className="mt-1 text-[13px] font-semibold text-ns-text">{card.value}</p>
                  <div className="mt-2 flex items-center justify-between gap-1.5">
                    <Pill>{card.product}</Pill>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-ns-muted">{card.age}</span>
                      <Avatar initials={card.owner} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

export function TelaCliente() {
  return (
    <Screen
      workspace="Comercial"
      active="Clientes"
      title="Cliente 360"
      subtitle="Cadastro, documentos, simulações e histórico no mesmo lugar."
    >
      <section className="flex items-center gap-3 rounded-lg border border-ns-border bg-ns-surface px-4 py-3.5">
        <Avatar initials={iniciais(clientRecord.name)} grande />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-[15px] font-semibold text-ns-text">{clientRecord.name}</h4>
            <Pill tone="amber">{clientRecord.status}</Pill>
          </div>
          <p className="mt-0.5 truncate text-[12px] text-ns-muted">
            CPF {clientRecord.document} · protocolo {clientRecord.protocol} · {clientRecord.owner}
          </p>
        </div>
        {/* O telefone do cliente abre a conversa dele no Atendimento, sem sair do CRM. */}
        <Button variant="ghost">
          <MessagesSquare aria-hidden="true" className="h-3.5 w-3.5 text-ns-success" />
          {clientRecord.phone}
        </Button>
        <Button>
          <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
          Editar
        </Button>
      </section>

      <div className="mt-3">
        <Abas itens={clientRecord.tabs} ativa={clientRecord.activeTab} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Panel title="Linha do tempo" className="col-span-2" data-tour="linha-do-tempo">
          <ol className="relative space-y-4 border-l border-ns-border pl-5">
            {clientRecord.timeline.map((event) => (
              <li key={event.when} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full border-2 border-ns-surface bg-ns-primary"
                />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13px] font-semibold text-ns-text">{event.title}</p>
                  <span className="shrink-0 text-[11px] text-ns-muted">{event.when}</span>
                </div>
                <p className="mt-0.5 text-[12px] text-ns-muted">{event.detail}</p>
                <p className="mt-0.5 text-[11px] text-ns-muted/80">{event.who}</p>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="space-y-3">
          <Panel title="Resumo">
            <div className="grid grid-cols-3 gap-2">
              {[
                [clientRecord.preSales, "Pré-vendas"],
                [clientRecord.documents, "Documentos"],
                [clientRecord.simulations, "Simulações"],
              ].map(([valor, rotulo]) => (
                <div key={rotulo} className="rounded-lg bg-ns-alt px-2 py-2 text-center">
                  <p className="text-base font-semibold text-ns-text">{valor}</p>
                  <p className="text-[10px] text-ns-muted">{rotulo}</p>
                </div>
              ))}
            </div>
            <dl className="mt-3">
              {[
                ["Telefone", clientRecord.phone],
                ["Cidade", clientRecord.city],
                ["Responsável", clientRecord.owner],
              ].map(([rotulo, valor]) => (
                <div
                  key={rotulo}
                  className="flex items-baseline justify-between gap-3 border-b border-ns-border py-2 last:border-0"
                >
                  <dt className="text-[11px] text-ns-muted">{rotulo}</dt>
                  <dd className="text-[12px] text-ns-text">{valor}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </Screen>
  );
}

const iconesSimulacao = [CircleDollarSign, Calculator, TrendingDown];

export function Simulacao() {
  const { current, corrected } = simulation.installments;

  return (
    <Screen
      workspace="Comercial"
      active="Simulações"
      title="Detalhe da simulação"
      subtitle="Resultados, parâmetros e documentos da análise."
    >
      <section className="flex items-center justify-between gap-4 rounded-lg border border-ns-border bg-ns-surface px-4 py-3.5">
        <div className="min-w-0">
          <h4 className="text-[15px] font-semibold text-ns-text">Simulação</h4>
          <p className="mt-0.5 truncate text-[12px] text-ns-muted">
            {simulation.client} · {simulation.type} · {simulation.protocol}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="inline-flex rounded-full border border-ns-primary/50 px-2.5 py-0.5 text-[11px] font-semibold text-ns-primary">
            PDF gerado
          </span>
          <p className="mt-1 text-[11px] text-ns-muted">{simulation.savedAt}</p>
        </div>
      </section>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_210px] gap-4">
        <div className="min-w-0">
          <Abas itens={["Resumo", "Parâmetros", "Comparativo", "PDF"]} ativa="Resumo" />

          <div className="mt-3 grid grid-cols-3 gap-3">
            {simulation.results.map((result, indice) => (
              <div key={result.label} data-tour={indice === 2 ? "reducao" : undefined}>
                <Stat {...result} icon={iconesSimulacao[indice]} />
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Panel title="Comparativo de parcelas">
              <div className="flex h-[188px] items-end justify-around border-b border-ns-border px-4">
                {[
                  { rotulo: "Parcela atual", valor: current, cor: "bg-ns-muted/50", texto: "text-ns-muted" },
                  { rotulo: "Nova parcela", valor: corrected, cor: "bg-ns-primary", texto: "text-ns-primary" },
                ].map((barra) => (
                  <div key={barra.rotulo} className="flex w-16 flex-col items-center">
                    <span className={`text-[11px] font-semibold ${barra.texto}`}>
                      {barra.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                    <span
                      className={`mt-1 w-full rounded-t ${barra.cor}`}
                      // A altura é a proporção real entre as duas parcelas.
                      style={{ height: `${Math.round((barra.valor / current) * 150)}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex justify-around px-4 text-[11px] text-ns-muted">
                <span>Parcela atual</span>
                <span>Nova parcela</span>
              </div>
            </Panel>

            <Panel title="Resumo da análise">
              <dl>
                {simulation.summary.map(([rotulo, valor]) => (
                  <div
                    key={rotulo}
                    className="flex items-baseline justify-between gap-3 border-b border-ns-border py-1.5 last:border-0"
                  >
                    <dt className="text-[11px] text-ns-muted">{rotulo}</dt>
                    <dd className="text-[12px] text-ns-text">{valor}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>
        </div>

        <aside className="self-start rounded-lg border border-ns-border bg-ns-surface p-4">
          <h4 className="text-[13px] font-semibold text-ns-text">Ações</h4>
          <div className="mt-3 flex flex-col items-start gap-2">
            <Button>
              <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
              Editar
            </Button>
            <Button variant="ghost">Voltar para simulações</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-ns-border pt-3">
            <Button variant="ghost">
              <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
              Gerar arquivos
            </Button>
            <Button variant="ghost">
              <FileText aria-hidden="true" className="h-3.5 w-3.5" />
              PDF
            </Button>
            <Button variant="ghost">
              <ImageIcon aria-hidden="true" className="h-3.5 w-3.5" />
              Imagem
            </Button>
            <Button variant="ghost">
              <Send aria-hidden="true" className="h-3.5 w-3.5 text-ns-primary" />
              Enviar
            </Button>
          </div>
          <p className="mt-3 border-t border-ns-border pt-3 text-[11px] leading-relaxed text-ns-muted">
            O relatório em PDF e a imagem-resumo são gerados ao salvar, com o protocolo{" "}
            {simulation.protocol}.
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ns-muted">
            <Users aria-hidden="true" className="h-3 w-3" />
            Vinculada ao cadastro do cliente
          </p>
        </aside>
      </div>
    </Screen>
  );
}
