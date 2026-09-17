import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CircleCheck,
  GripVertical,
  Lock,
  PlayCircle,
  Settings2,
  Upload,
} from "lucide-react";
import { Avatar, Bar, Button, DemoBadge, Panel, Pill, Screen, Stat } from "./chrome";
import { academy, clientPortal, companySettings, finance, legalPipeline } from "./data";

export function EsteiraJuridica() {
  return (
    <Screen
      workspace="Jurídico"
      active="Esteira"
      title="Esteira jurídica"
      subtitle="Etapas configuradas pela própria empresa"
      actions={
        <Button variant="ghost">
          <Settings2 aria-hidden="true" className="h-3.5 w-3.5" />
          Configurar etapas
        </Button>
      }
    >
      <div className="flex gap-3">
        {legalPipeline.columns.map((column, indice) => (
          <div
            key={column.title}
            data-tour={indice === 1 ? "esteira-colunas" : undefined}
            className="flex w-56 shrink-0 flex-col"
          >
            <div className="rounded-t-lg border border-b-0 border-slate-200 bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h4 className="min-w-0 flex-1 truncate text-[12px] font-semibold text-slate-950">
                  {column.title}
                </h4>
                <span className="shrink-0 text-[11px] text-slate-500">{column.cards.length}</span>
              </div>
              <p className="mt-1 truncate text-[10px] text-slate-500">Espera: {column.expected}</p>
            </div>
            <div className="flex-1 space-y-2 rounded-b-lg border border-t-0 border-slate-200 bg-slate-50/60 p-2">
              {column.cards.map((card) => (
                <article
                  key={card.protocol}
                  className="rounded border border-slate-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-start gap-1.5">
                    <GripVertical
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-slate-900">{card.client}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{card.protocol}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 pl-5">
                    <span className="truncate text-[11px] text-slate-600">{card.owner}</span>
                    <span className="shrink-0 text-[10px] text-slate-400">{card.days}d</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px] text-slate-500">
        As colunas acima são um exemplo. Cada empresa cria as próprias etapas, define cor,
        descrição e documentos esperados, e reordena quando o processo mudar.
      </p>
    </Screen>
  );
}

export function PortalCliente() {
  return (
    <div data-demo="true" className="min-h-[620px] w-full bg-[#f7f8fa] px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">
              SE
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">SuaEmpresa</p>
              <p className="text-[11px] text-slate-500">Acompanhamento do atendimento</p>
            </div>
          </div>
          <DemoBadge />
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <Lock aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />
            Acesso liberado com CPF e protocolo
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-y border-slate-100 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Cliente</p>
              <p className="mt-1 text-[13px] font-medium text-slate-900">{clientPortal.client}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">CPF</p>
              <p className="mt-1 text-[13px] font-medium text-slate-900">{clientPortal.document}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Protocolo</p>
              <p className="mt-1 text-[13px] font-medium text-slate-900">{clientPortal.protocol}</p>
            </div>
          </div>

          <div className="mt-4">
            <Pill tone="teal">{clientPortal.status}</Pill>
          </div>

          <ol className="mt-5 space-y-4 border-l border-slate-200 pl-5" data-tour="portal-atualizacoes">
            {clientPortal.updates.map((update) => (
              <li key={update.when} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-teal-700"
                />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13px] font-semibold text-slate-900">{update.title}</p>
                  <span className="shrink-0 text-[11px] text-slate-400">{update.when}</span>
                </div>
                <p className="mt-0.5 text-[12px] text-slate-600">{update.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Somente as atualizações liberadas pela equipe aparecem nesta página.
        </p>
      </div>
    </div>
  );
}

export function Financeiro() {
  return (
    <Screen
      workspace="Financeiro"
      active="Lançamentos"
      title="Lançamentos"
      subtitle={finance.period}
      actions={
        <Button variant="ghost">
          <Upload aria-hidden="true" className="h-3.5 w-3.5" />
          Importar planilha
        </Button>
      }
    >
      <div className="grid grid-cols-4 gap-3" data-tour="financeiro-stats">
        {finance.stats.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>

      <Panel title="Movimentação do período" hint="6 de 84 lançamentos" className="mt-4">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="pb-2 font-medium">Data</th>
              <th className="pb-2 font-medium">Descrição</th>
              <th className="pb-2 font-medium">Categoria</th>
              <th className="pb-2 font-medium">Forma</th>
              <th className="pb-2 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {finance.entries.map((entry) => (
              <tr key={entry.description} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 text-[12px] text-slate-500">{entry.date}</td>
                <td className="py-2.5 text-[13px] font-medium text-slate-800">{entry.description}</td>
                <td className="py-2.5">
                  <Pill tone={entry.category === "Chargeback" ? "amber" : "slate"}>
                    {entry.category}
                  </Pill>
                </td>
                <td className="py-2.5 text-[12px] text-slate-600">{entry.method}</td>
                <td className="py-2.5 text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-[13px] font-semibold ${
                      entry.kind === "in" ? "text-teal-700" : "text-brand-500"
                    }`}
                  >
                    {entry.kind === "in" ? (
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {entry.value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Screen>
  );
}

export function AcademyScreen() {
  return (
    <Screen
      workspace="Academy"
      active="Academy"
      title="Academy"
      subtitle="Trilhas de treinamento da equipe"
    >
      <div className="grid grid-cols-2 gap-4">
        <Panel title="Trilhas publicadas">
          <div className="space-y-3">
            {academy.tracks.map((track) => (
              <div key={track.name} className="rounded-lg border border-slate-200 px-3 py-2.5">
                <div className="flex items-start gap-2.5">
                  <PlayCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold text-slate-900">{track.name}</p>
                      <span className="shrink-0 text-[11px] text-slate-500">
                        nota mínima {academy.passingScore}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] leading-snug text-slate-600">
                      {track.description}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">{track.audience}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Bar value={track.progress} />
                      <span className="shrink-0 text-[11px] font-medium text-slate-700">
                        {track.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Acompanhamento da gestão" hint="Progresso por usuário">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="pb-2 font-medium">Usuário</th>
                <th className="pb-2 font-medium">Trilha</th>
                <th className="pb-2 font-medium">Progresso</th>
              </tr>
            </thead>
            <tbody>
              {academy.team.map((person) => (
                <tr key={person.name} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar initials={person.name.split(" ").map((p) => p[0]).join("").slice(0, 2)} />
                      <span className="text-[13px] font-medium text-slate-800">{person.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-[12px] text-slate-600">{person.track}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Bar value={person.progress} />
                      <span className="w-8 shrink-0 text-right text-[11px] font-medium text-slate-700">
                        {person.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </Screen>
  );
}

export function ConfiguracaoEmpresa() {
  const grupos = ["Operação", "Crescimento", "Gestão"];

  return (
    <Screen
      workspace="Gestão"
      active="Empresa"
      title={companySettings.name}
      subtitle="Configuração da empresa · módulos conforme o pacote contratado"
      actions={<Pill tone="teal">Ambiente ativo</Pill>}
    >
      <div className="grid grid-cols-3 gap-4">
        <Panel title="Identidade" className="col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-bold uppercase tracking-wide text-slate-700">
              AA
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-slate-950">
                {companySettings.name}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">Logo exibida no sistema</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Razão social</p>
              <p className="text-[12px] text-slate-800">{companySettings.legalName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">CNPJ</p>
              <p className="text-[12px] text-slate-800">{companySettings.taxId}</p>
            </div>
            <p className="text-[11px] text-slate-400">{companySettings.since}</p>
          </div>
        </Panel>

        <Panel title="Usuários" hint="Criados pelo supervisor">
          <p className="text-2xl font-semibold text-slate-950">
            {companySettings.users.used}
            <span className="text-[13px] font-normal text-slate-500">
              {" "}
              de {companySettings.users.contracted} contratados
            </span>
          </p>
          <div className="mt-3">
            <Bar value={(companySettings.users.used / companySettings.users.contracted) * 100} />
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            {companySettings.teams.map((team) => (
              <div key={team.name} className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] text-slate-700">{team.name}</span>
                <span className="text-[12px] font-semibold text-slate-950">{team.people}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Armazenamento">
          <p className="text-2xl font-semibold text-slate-950">{companySettings.storage.label}</p>
          <div className="mt-3">
            <Bar value={companySettings.storage.pct} tone="slate" />
          </div>
          <p className="mt-4 border-t border-slate-100 pt-3 text-[12px] leading-relaxed text-slate-600">
            Documentos, contratos e anexos dos seus clientes, em armazenamento privado com acesso
            por link temporário.
          </p>
        </Panel>
      </div>

      <Panel title="Módulos do seu ambiente" hint="10 de 11 ativos" className="mt-4">
        <div className="space-y-3">
          {grupos.map((grupo) => (
            <div key={grupo}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {grupo}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {companySettings.modules
                  .filter((module) => module.group === grupo)
                  .map((module) => (
                    <span
                      key={module.name}
                      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] ${
                        module.enabled
                          ? "border-teal-200 bg-teal-50 text-teal-800"
                          : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {module.enabled ? (
                        <CircleCheck aria-hidden="true" className="h-3 w-3" />
                      ) : (
                        <Building2 aria-hidden="true" className="h-3 w-3 opacity-40" />
                      )}
                      {module.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-slate-100 pt-3 text-[12px] text-slate-600">
          Módulo fora do pacote não aparece na barra lateral da equipe.
        </p>
      </Panel>
    </Screen>
  );
}
