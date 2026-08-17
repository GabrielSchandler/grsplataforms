import { Check, Download, FileText, Image as ImageIcon, Plus, Search, Shuffle } from "lucide-react";
import { Avatar, Bar, Button, Panel, Pill, Screen, Stat } from "./chrome";
import {
  clientRecord,
  commercialPanel,
  leadDistribution,
  pipeline,
  simulation,
} from "./data";

export function PainelComercial() {
  return (
    <Screen
      workspace="Comercial"
      active="Painel comercial"
      title="Painel comercial"
      subtitle={commercialPanel.period}
    >
      <div className="grid grid-cols-4 gap-3" data-tour="painel-stats">
        {commercialPanel.stats.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {commercialPanel.secondary.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Panel title="Ranking de consultores" hint="Por valor vendido" className="col-span-2">
          <div className="space-y-3">
            {commercialPanel.ranking.map((row) => (
              <div key={row.name} className="flex items-center gap-3">
                <Avatar initials={row.name.split(" ").map((p) => p[0]).join("").slice(0, 2)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-[13px] font-medium text-slate-800">{row.name}</p>
                    <p className="shrink-0 text-[13px] font-semibold text-slate-950">{row.sales}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <Bar value={row.share} />
                    <span className="shrink-0 text-[11px] text-slate-500">{row.deals} vendas</span>
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
                    <span className="truncate text-[12px] text-slate-700">{origin.label}</span>
                    <span className="text-[12px] font-semibold text-slate-950">{origin.share}%</span>
                  </div>
                  <div className="mt-1">
                    <Bar value={origin.share} tone="slate" />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Produto vendido">
            <div className="space-y-2">
              {commercialPanel.products.map((product) => (
                <div key={product.label} className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] text-slate-700">{product.label}</span>
                  <span className="text-[12px] font-semibold text-slate-950">{product.value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Screen>
  );
}

export function DistribuicaoLeads() {
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
        <Stat label="Linhas novas importadas" value={String(leadDistribution.imported)} tone="positive" />
        <div data-tour="importacao-incremental">
          <Stat
            label="Já existentes, ignoradas"
            value={String(leadDistribution.ignored)}
            hint="Importação incremental não duplica"
          />
        </div>
        <Stat label="Aguardando distribuição" value={String(leadDistribution.pending)} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Panel title="Leads aguardando" hint="3 selecionados" className="col-span-2">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="w-8 pb-2 font-medium" />
                <th className="pb-2 font-medium">Nome</th>
                <th className="pb-2 font-medium">Telefone</th>
                <th className="pb-2 font-medium">Origem</th>
                <th className="pb-2 font-medium">Entrada</th>
              </tr>
            </thead>
            <tbody>
              {leadDistribution.leads.map((lead) => (
                <tr key={lead.name} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        lead.selected ? "border-teal-700 bg-teal-700" : "border-slate-300 bg-white"
                      }`}
                    >
                      {lead.selected ? (
                        <Check aria-hidden="true" className="h-3 w-3 text-white" strokeWidth={3} />
                      ) : null}
                    </span>
                  </td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-800">{lead.name}</td>
                  <td className="py-2.5 text-[13px] text-slate-600">{lead.phone}</td>
                  <td className="py-2.5">
                    <Pill>{lead.origin}</Pill>
                  </td>
                  <td className="py-2.5 text-[12px] text-slate-500">{lead.entry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Carga por consultor" hint="Após distribuir" data-tour="carga-consultor">
          <div className="space-y-3">
            {leadDistribution.workload.map((person) => (
              <div key={person.name} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar initials={person.name.split(" ").map((p) => p[0]).join("").slice(0, 2)} />
                  <span className="truncate text-[13px] text-slate-700">{person.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-slate-950">{person.current}</span>
                  {person.incoming > 0 ? (
                    <Pill tone="teal">+{person.incoming}</Pill>
                  ) : null}
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
        <Button variant="ghost">
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Nova pré-venda
        </Button>
      }
    >
      <div className="flex gap-3">
        {pipeline.columns.map((column, indice) => (
          <div
            key={column.title}
            // O realce do tour pega uma coluna, não o quadro inteiro: é mais
            // preciso e deixa área escura para a legenda.
            data-tour={indice === 1 ? "kanban" : undefined}
            className="flex w-56 shrink-0 flex-col"
          >
            <div className="flex items-baseline justify-between gap-2 rounded-t-lg border border-b-0 border-slate-200 bg-white px-3 py-3">
              <h4 className="truncate text-[12px] font-semibold text-slate-950">{column.title}</h4>
              <span className="shrink-0 text-[11px] text-slate-500">{column.cards.length}</span>
            </div>
            <div className="flex-1 space-y-2 rounded-b-lg border-x border-b border-slate-200 bg-slate-50/60 p-2">
              {column.cards.map((card) => (
                <article
                  key={card.client}
                  className="rounded border border-slate-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <p className="truncate text-[13px] font-medium text-slate-900">{card.client}</p>
                  <p className="mt-1 text-[13px] font-semibold text-slate-950">{card.value}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Pill>{card.product}</Pill>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">{card.age}</span>
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
      title={clientRecord.name}
      subtitle={`CPF ${clientRecord.document} · protocolo ${clientRecord.protocol} · ${clientRecord.owner}`}
      actions={<Pill tone="amber">{clientRecord.status}</Pill>}
    >
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap gap-1 border-b border-slate-100 px-3 pt-3">
          {clientRecord.tabs.map((tab) => (
            <span
              key={tab}
              className={`rounded-t px-3 py-2 text-[12px] font-medium ${
                tab === clientRecord.activeTab
                  ? "border-b-2 border-teal-700 text-teal-900"
                  : "text-slate-500"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="col-span-2" data-tour="linha-do-tempo">
            <ol className="relative space-y-4 border-l border-slate-200 pl-5">
              {clientRecord.timeline.map((event) => (
                <li key={event.when} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-teal-700"
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-semibold text-slate-900">{event.title}</p>
                    <span className="shrink-0 text-[11px] text-slate-400">{event.when}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-slate-600">{event.detail}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{event.who}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Contato</p>
              <p className="mt-1 text-[13px] text-slate-800">{clientRecord.phone}</p>
              <p className="text-[12px] text-slate-500">{clientRecord.city}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-slate-200 px-2 py-2 text-center">
                <p className="text-base font-semibold text-slate-950">{clientRecord.preSales}</p>
                <p className="text-[10px] text-slate-500">Pré-vendas</p>
              </div>
              <div className="rounded-lg border border-slate-200 px-2 py-2 text-center">
                <p className="text-base font-semibold text-slate-950">{clientRecord.documents}</p>
                <p className="text-[10px] text-slate-500">Documentos</p>
              </div>
              <div className="rounded-lg border border-slate-200 px-2 py-2 text-center">
                <p className="text-base font-semibold text-slate-950">{clientRecord.simulations}</p>
                <p className="text-[10px] text-slate-500">Simulações</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Busca do cadastro</p>
              <div className="mt-1.5 flex items-center gap-2 rounded border border-slate-200 px-2 py-1.5">
                <Search aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[12px] text-slate-400">Nome ou CPF, do cliente ou do financiado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

export function Simulacao() {
  return (
    <Screen
      workspace="Comercial"
      active="Simulações"
      title="Simulação revisional"
      subtitle={`${simulation.type} · ${simulation.client} · ${simulation.protocol}`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <FileText aria-hidden="true" className="h-3.5 w-3.5" />
            PDF
          </Button>
          <Button variant="ghost">
            <ImageIcon aria-hidden="true" className="h-3.5 w-3.5" />
            Imagem
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Panel title="Dados do contrato">
          <div className="space-y-2.5">
            {simulation.fields.map((field) => (
              <div key={field.label} className="flex items-center justify-between gap-3">
                <span className="text-[12px] text-slate-600">{field.label}</span>
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[12px] font-medium text-slate-900">
                  {field.value}
                </span>
              </div>
            ))}

            <div className="border-t border-slate-100 pt-3" data-tour="reducao">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-medium text-slate-700">Redução aplicada</span>
                <span className="text-[13px] font-semibold text-teal-700">{simulation.reduction}%</span>
              </div>
              <div className="mt-2">
                <Bar value={simulation.reduction * 2.5} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded border border-teal-700 bg-teal-700">
                  <Check aria-hidden="true" className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-[12px] text-slate-700">Considerar quitação antecipada</span>
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {simulation.results.map((result) => (
              <Stat key={result.label} {...result} />
            ))}
          </div>

          <Panel title="Gerado automaticamente ao salvar">
            <div className="space-y-2">
              {simulation.outputs.map((output) => (
                <div
                  key={output}
                  className="flex items-center justify-between gap-3 rounded border border-slate-200 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText aria-hidden="true" className="h-4 w-4 text-teal-700" />
                    <span className="text-[13px] text-slate-800">{output}</span>
                  </div>
                  <Download aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
                </div>
              ))}
              <p className="pt-1 text-[11px] text-slate-500">
                Protocolo {simulation.protocol} aplicado aos dois arquivos.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </Screen>
  );
}
