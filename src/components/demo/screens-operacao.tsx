import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpenCheck,
  Building2,
  CircleCheck,
  Clock3,
  Coins,
  GraduationCap,
  GripVertical,
  Lock,
  Plus,
  Settings2,
  Wallet,
} from "lucide-react";
import { Screen } from "./chrome";
import { Abas, Bar, Button, DemoBadge, Detalhe, Filtros, Panel, Pill, Stat, tabela } from "./kit";
import { academy, clientPortal, companySettings, finance, legalPipeline } from "./data";

export function EsteiraJuridica() {
  return (
    <Screen
      workspace="Jurídico"
      active="Esteira"
      title="Esteira jurídica"
      subtitle="Etapas configuradas pela própria empresa."
      actions={
        <Button variant="ghost">
          <Settings2 aria-hidden="true" className="h-3.5 w-3.5" />
          Configurar etapas
        </Button>
      }
    >
      <div className="flex gap-2.5">
        {legalPipeline.columns.map((column, indice) => (
          <div
            key={column.title}
            data-tour={indice === 1 ? "esteira-colunas" : undefined}
            className="flex min-w-0 flex-1 flex-col rounded-lg border border-ns-border bg-ns-alt/60"
          >
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <h4 className="min-w-0 flex-1 truncate text-[12px] font-semibold text-ns-text">
                {column.title}
              </h4>
              <span className="shrink-0 rounded-full bg-ns-surface px-1.5 text-[10px] font-semibold text-ns-muted">
                {column.cards.length}
              </span>
            </div>
            <div className="flex-1 space-y-2 px-2 pb-2">
              {column.cards.map((card) => (
                <article key={card.protocol} className="rounded-lg border border-ns-border bg-ns-surface p-2.5">
                  <div className="flex items-start gap-1.5">
                    <GripVertical aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ns-muted/60" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-ns-text">{card.client}</p>
                      <p className="mt-0.5 truncate text-[11px] text-ns-muted">{card.owner}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 pl-5">
                    <Pill>{card.type}</Pill>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-ns-muted">
                      <Clock3 aria-hidden="true" className="h-3 w-3" />
                      {card.days} {card.days === 1 ? "dia" : "dias"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px] text-ns-muted">
        As colunas acima são um exemplo. Cada empresa cria as próprias etapas, define cor,
        descrição e documentos esperados, e reordena quando o processo mudar.
      </p>
    </Screen>
  );
}

/**
 * Portal do cliente: é a página pública de acompanhamento, fora do sistema —
 * por isso não usa a casca nem o tema do CRM.
 */
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
            <span className="inline-flex items-center rounded border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[11px] font-medium text-teal-800">
              {clientPortal.status}
            </span>
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

const iconesFinanceiro = [Wallet, ArrowUpRight, ArrowDownRight, Coins];

/** Fluxo de caixa em barras, entradas e saídas pagas por mês. SVG à mão. */
function FluxoDeCaixa() {
  const teto = Math.max(...finance.cashFlow.map((mes) => mes.in));
  const altura = 108;
  const passo = 100 / finance.cashFlow.length;

  return (
    <div>
      <svg viewBox={`0 0 100 ${altura + 2}`} preserveAspectRatio="none" className="h-[132px] w-full" role="img" aria-label="Fluxo de caixa: entradas e saídas pagas nos últimos 6 meses">
        {finance.cashFlow.map((mes, indice) => {
          const base = indice * passo + passo / 2;
          const entrada = (mes.in / teto) * altura;
          const saida = (mes.out / teto) * altura;

          return (
            <g key={mes.month}>
              <rect x={base - 5.4} y={altura - entrada} width="5" height={entrada} rx="0.6" style={{ fill: "var(--ns-success)" }} />
              <rect x={base + 0.4} y={altura - saida} width="5" height={saida} rx="0.6" style={{ fill: "var(--ns-danger)" }} />
            </g>
          );
        })}
        <line x1="0" x2="100" y1={altura + 1} y2={altura + 1} strokeWidth="0.6" style={{ stroke: "var(--ns-border)" }} />
      </svg>
      <div className="mt-1 flex">
        {finance.cashFlow.map((mes) => (
          <span key={mes.month} className="flex-1 text-center text-[10px] text-ns-muted">
            {mes.month}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Financeiro() {
  const [aberto] = finance.entries;

  return (
    <Screen
      workspace="Financeiro"
      active="Financeiro"
      title="Financeiro"
      subtitle={`Caixa, contas a receber e a pagar · ${finance.period}`}
      actions={
        <Button>
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Novo lançamento
        </Button>
      }
    >
      <Abas itens={["Visão geral", "Lançamentos", "Consultas", "Comissões"]} ativa="Visão geral" />

      <div className="mt-3 grid grid-cols-4 gap-3" data-tour="financeiro-stats">
        {finance.stats.map((stat, indice) => (
          <Stat key={stat.label} {...stat} icon={iconesFinanceiro[indice]} />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_220px] gap-3">
        <div className="min-w-0 space-y-3">
          <Panel title="Fluxo de caixa" hint="Últimos 6 meses">
            <div className="mb-2 flex gap-4 text-[11px] text-ns-muted">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-ns-success" />
                Entradas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-ns-danger" />
                Saídas
              </span>
            </div>
            <FluxoDeCaixa />
          </Panel>

          <section className="overflow-hidden rounded-lg border border-ns-border bg-ns-surface">
            <div className="px-4 pb-3 pt-3.5">
              <h4 className="text-[13px] font-semibold text-ns-text">
                Lançamentos <span className="font-normal text-ns-muted">(84)</span>
              </h4>
              <div className="mt-3">
                <Filtros
                  busca="Buscar lançamentos"
                  selects={["Todos os tipos", "Todas as categorias", "Todos os status"]}
                />
              </div>
            </div>
            <table className={tabela.base}>
              <thead className={tabela.cabeca}>
                <tr>
                  <th className={tabela.th}>Vencimento</th>
                  <th className={tabela.th}>Descrição</th>
                  <th className={tabela.th}>Categoria</th>
                  <th className={tabela.th}>Status</th>
                  <th className={`${tabela.th} text-right`}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {finance.entries.map((entry, indice) => (
                  <tr key={entry.description} className={indice === 0 ? tabela.selecionada : tabela.linha}>
                    <td className={tabela.fraco}>{entry.date}</td>
                    <td className={`${tabela.td} font-medium`}>{entry.description}</td>
                    <td className={tabela.td}>
                      <Pill tone={entry.category === "Chargeback" ? "amber" : "slate"}>
                        {entry.category}
                      </Pill>
                    </td>
                    <td className={tabela.td}>
                      <Pill tone={entry.status === "Pendente" ? "amber" : "success"}>{entry.status}</Pill>
                    </td>
                    <td className={`${tabela.td} text-right`}>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          entry.kind === "in" ? "text-ns-success" : "text-ns-danger"
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
          </section>
        </div>

        <Detalhe
          titulo={aberto.description}
          selo={<Pill tone="success">{aberto.status}</Pill>}
          fatos={finance.selected}
        >
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="ghost">Editar lançamento</Button>
            <Button variant="danger">Excluir</Button>
          </div>
        </Detalhe>
      </div>
    </Screen>
  );
}

export function AcademyScreen() {
  const [aberto] = academy.tracks;

  return (
    <Screen
      workspace="Academy"
      active="Academy"
      title="Academy"
      subtitle="Treinamentos, cursos e aprendizado interno."
    >
      <Abas itens={["Catálogo", "Administração"]} ativa="Catálogo" />

      <div className="mt-3 grid grid-cols-4 gap-3">
        <Stat label="Cursos disponíveis" value={String(academy.tracks.length)} accent="primary" icon={GraduationCap} />
        <Stat label="Capítulos disponíveis" value={String(academy.totals.chapters)} accent="primary" icon={BookOpenCheck} />
        <Stat
          label="Seus capítulos concluídos"
          value={String(academy.tracks.reduce((soma, curso) => soma + curso.done, 0))}
          accent="success"
          icon={CircleCheck}
        />
        <Stat label="Duração do catálogo" value={`${academy.totals.minutes} min`} accent="warning" icon={Clock3} />
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_230px] gap-3">
        <div className="min-w-0 space-y-3">
          <section className="overflow-hidden rounded-lg border border-ns-border bg-ns-surface">
            <div className="px-4 pb-3 pt-3.5">
              <h4 className="text-[13px] font-semibold text-ns-text">
                Cursos <span className="font-normal text-ns-muted">({academy.tracks.length})</span>
              </h4>
              <div className="mt-3">
                <Filtros busca="Buscar por nome ou conteúdo..." selects={["Todos os tipos", "Todos os status"]} />
              </div>
            </div>
            <table className={tabela.base}>
              <thead className={tabela.cabeca}>
                <tr>
                  <th className={tabela.th}>Curso</th>
                  <th className={tabela.th}>Público</th>
                  <th className={tabela.th}>Capítulos</th>
                  <th className={tabela.th}>Seu progresso</th>
                </tr>
              </thead>
              <tbody>
                {academy.tracks.map((curso, indice) => (
                  <tr key={curso.name} className={indice === 0 ? tabela.selecionada : tabela.linha}>
                    <td className={tabela.td}>
                      <p className="font-semibold">{curso.name}</p>
                      <p className="mt-0.5 text-[11px] text-ns-muted">{curso.category}</p>
                    </td>
                    <td className={`${tabela.fraco} leading-snug`}>{curso.audience}</td>
                    <td className={tabela.td}>{curso.chapters}</td>
                    <td className={tabela.td}>
                      <div className="flex w-28 items-center gap-2">
                        <Bar value={curso.progress} />
                        <span className="shrink-0 text-[11px] font-medium">
                          {curso.done}/{curso.chapters}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <p className="text-[11px] text-ns-muted">
            Cada curso termina em prova, com nota mínima de {academy.passingScore} para aprovação. A
            gestão acompanha o progresso de cada pessoa na aba Administração.
          </p>
        </div>

        <Detalhe
          titulo={aberto.name}
          selo={<Pill tone="primary">{aberto.category}</Pill>}
          fatos={[
            ["Duração", `${aberto.minutes} min`],
            ["Capítulos", String(aberto.chapters)],
            ["Concluídos", String(aberto.done)],
            ["Nota mínima", String(academy.passingScore)],
          ]}
        >
          <p className="mt-3 text-[11px] font-semibold text-ns-text">Capítulos</p>
          <ul className="mt-1">
            {academy.chapterList.map((capitulo) => (
              <li
                key={capitulo.title}
                className="flex items-baseline justify-between gap-3 border-b border-ns-border py-1.5 last:border-0"
              >
                <span className="min-w-0 text-[11px] leading-snug text-ns-primary">{capitulo.title}</span>
                <span className="shrink-0 text-[10px] text-ns-muted">{capitulo.minutes} min</span>
              </li>
            ))}
          </ul>
        </Detalhe>
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
      title="Gestão"
      subtitle="Configuração da empresa · módulos conforme o pacote contratado."
      actions={<Pill tone="success">Ambiente ativo</Pill>}
    >
      <div className="grid grid-cols-3 gap-3">
        <Panel title="Identidade" className="col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-ns-alt text-sm font-bold uppercase tracking-wide text-ns-text">
              SE
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ns-text">{companySettings.name}</p>
              <p className="mt-0.5 text-[11px] text-ns-muted">Logo exibida no sistema</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 border-t border-ns-border pt-3">
            <div>
              <p className="text-[10px] uppercase text-ns-muted">Razão social</p>
              <p className="text-[12px] text-ns-text">{companySettings.legalName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-ns-muted">CNPJ</p>
              <p className="text-[12px] text-ns-text">{companySettings.taxId}</p>
            </div>
            <p className="text-[11px] text-ns-muted">{companySettings.since}</p>
          </div>
        </Panel>

        <Panel title="Usuários" hint="Criados pelo supervisor">
          <p className="text-2xl font-semibold text-ns-text">
            {companySettings.users.used}
            <span className="text-[13px] font-normal text-ns-muted">
              {" "}
              de {companySettings.users.contracted} contratados
            </span>
          </p>
          <div className="mt-3">
            <Bar value={(companySettings.users.used / companySettings.users.contracted) * 100} />
          </div>
          <div className="mt-4 space-y-2 border-t border-ns-border pt-3">
            {companySettings.teams.map((team) => (
              <div key={team.name} className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] text-ns-muted">{team.name}</span>
                <span className="text-[12px] font-semibold text-ns-text">{team.people}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Armazenamento">
          <p className="text-2xl font-semibold text-ns-text">{companySettings.storage.label}</p>
          <div className="mt-3">
            <Bar value={companySettings.storage.pct} tone="muted" />
          </div>
          <p className="mt-4 border-t border-ns-border pt-3 text-[12px] leading-relaxed text-ns-muted">
            Documentos, contratos e anexos dos seus clientes, em armazenamento privado com acesso
            por link temporário.
          </p>
        </Panel>
      </div>

      <Panel title="Módulos do seu ambiente" hint="10 de 11 ativos" className="mt-3">
        <div className="space-y-3">
          {grupos.map((grupo) => (
            <div key={grupo}>
              <p className="text-[10px] font-semibold uppercase text-ns-muted">{grupo}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {companySettings.modules
                  .filter((module) => module.group === grupo)
                  .map((module) => (
                    <span
                      key={module.name}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
                        module.enabled ? "bg-ns-primary/12 text-ns-primary" : "bg-ns-alt text-ns-muted"
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
        <p className="mt-4 border-t border-ns-border pt-3 text-[12px] text-ns-muted">
          Módulo fora do pacote não aparece na barra lateral da equipe.
        </p>
      </Panel>
    </Screen>
  );
}
