import { Download, Filter, Plus, RotateCcw, Search, ShieldCheck } from "lucide-react";
import { Bar, Button, Panel, Pill, Screen, Stat } from "./chrome";
import { backups, consultas, documentos, logs, usuarios } from "./data";

/**
 * Telas de apoio, reproduzidas com as mesmas colunas que existem no sistema
 * (documentos, usuários, backups e logs). Só o conteúdo é fictício.
 */

function Th({ children, right = false }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`pb-2 font-medium ${right ? "text-right" : ""}`}>{children}</th>
  );
}

export function Documentos() {
  return (
    <Screen
      workspace="Comercial"
      active="Documentos"
      title="Documentos"
      subtitle="Gerados por template ou enviados pelo cliente"
      actions={
        <Button>
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Gerar documento
        </Button>
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Search aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[12px] text-slate-400">Buscar por título ou cliente</span>
        </div>
        {documentos.filters.slice(0, 3).map((filtro, index) => (
          <span
            key={filtro}
            className={`rounded-lg border px-2.5 py-2 text-[12px] font-medium ${
              index === 0
                ? "border-teal-200 bg-teal-50 text-teal-800"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {filtro}
          </span>
        ))}
      </div>

      <Panel title="Documentos do período" hint="5 de 148" data-tour="tabela-documentos">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
              <Th>Título</Th>
              <Th>Tipo</Th>
              <Th>Cliente</Th>
              <Th>Template</Th>
              <Th>Fonte</Th>
              <Th>Status</Th>
              <Th>Data</Th>
              <Th>Criado por</Th>
            </tr>
          </thead>
          <tbody>
            {documentos.rows.map((row) => (
              <tr key={row.title} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 text-[13px] font-medium text-slate-800">{row.title}</td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.type}</td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.client}</td>
                <td className="py-2.5 text-[12px] text-slate-500">{row.template}</td>
                <td className="py-2.5">
                  <Pill tone={row.source === "Template" ? "teal" : "slate"}>{row.source}</Pill>
                </td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.status}</td>
                <td className="py-2.5 text-[12px] text-slate-500">{row.date}</td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Screen>
  );
}

export function Usuarios() {
  return (
    <Screen
      workspace="Gestão"
      active="Usuários"
      title="Usuários"
      subtitle="Criados e mantidos pelo supervisor da sua equipe"
      actions={
        <Button>
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Novo usuário
        </Button>
      }
    >
      <Panel title="Equipe" hint="6 de 18 usuários">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
              <Th>Nome</Th>
              <Th>Apelido</Th>
              <Th>Login</Th>
              <Th>Telefone</Th>
              <Th>Área</Th>
              <Th>Meta do mês</Th>
              <Th>Cargo</Th>
              <Th>Ativo</Th>
            </tr>
          </thead>
          <tbody>
            {usuarios.rows.map((row) => (
              <tr key={row.login} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 text-[13px] font-medium text-slate-800">{row.name}</td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.nick}</td>
                <td className="py-2.5 text-[12px] text-slate-500">{row.login}</td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.phone}</td>
                <td className="py-2.5">
                  <Pill tone="slate">{row.area}</Pill>
                </td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.goal}</td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.role}</td>
                <td className="py-2.5">
                  <Pill tone={row.active ? "teal" : "slate"}>{row.active ? "Ativo" : "Inativo"}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Screen>
  );
}

export function Backups() {
  return (
    <Screen
      workspace="Gestão"
      active="Backups"
      title="Backups"
      subtitle={backups.note}
      actions={
        <Button variant="ghost">
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          Gerar agora
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Último backup" value="Hoje · 00:10" tone="positive" />
        <Stat label="Janela de restauração" value="7 dias" hint="Neste ambiente demonstrativo" />
        <Stat label="Guardado em" value="Fora do banco" hint="Repositório privado separado" />
      </div>

      <Panel title="Cópias disponíveis" className="mt-4">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
              <Th>Backup</Th>
              <Th>Origem</Th>
              <Th>Status</Th>
              <Th>Tamanho</Th>
              <Th>Gerado em</Th>
              <Th>Expira em</Th>
              <Th right>Ação</Th>
            </tr>
          </thead>
          <tbody>
            {backups.rows.map((row) => (
              <tr key={row.name} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 text-[13px] font-medium text-slate-800">{row.name}</td>
                <td className="py-2.5">
                  <Pill tone={row.origin === "Manual" ? "slate" : "teal"}>{row.origin}</Pill>
                </td>
                <td className="py-2.5 text-[12px] text-teal-700">{row.status}</td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.size}</td>
                <td className="py-2.5 text-[12px] text-slate-500">{row.created}</td>
                <td className="py-2.5 text-[12px] text-slate-500">{row.expires}</td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-teal-700">
                    <Download aria-hidden="true" className="h-3.5 w-3.5" />
                    Restaurar
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

export function Logs() {
  return (
    <Screen
      workspace="Gestão"
      active="Logs"
      title="Logs de auditoria"
      subtitle="Quem fez o quê, quando — mantido sem expiração automática"
      actions={
        <Button variant="ghost">
          <Filter aria-hidden="true" className="h-3.5 w-3.5" />
          Filtrar
        </Button>
      }
    >
      <Panel title="Registro de ações" hint="6 de 34.812">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
              <Th>Data</Th>
              <Th>Usuário</Th>
              <Th>Ação</Th>
              <Th>Entidade</Th>
              <Th>Registro</Th>
              <Th>Detalhes</Th>
            </tr>
          </thead>
          <tbody>
            {logs.rows.map((row) => (
              <tr key={row.date + row.action} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 text-[12px] text-slate-500">{row.date}</td>
                <td className="py-2.5 text-[13px] font-medium text-slate-800">{row.user}</td>
                <td className="py-2.5">
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700">
                    {row.action}
                  </code>
                </td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.entity}</td>
                <td className="py-2.5 text-[12px] text-slate-600">{row.record}</td>
                <td className="py-2.5 text-[12px] text-slate-500">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <p className="mt-3 flex items-center gap-2 text-[12px] text-slate-500">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />
        O registro guarda autor e data de cada ação relevante e não expira sozinho.
      </p>
    </Screen>
  );
}

export function Consultas() {
  return (
    <Screen
      workspace="Financeiro"
      active="Consultas"
      title="Consultas"
      subtitle={`Período de ${consultas.period}`}
      actions={
        <Button variant="ghost">
          <Filter aria-hidden="true" className="h-3.5 w-3.5" />
          Trocar período
        </Button>
      }
    >
      <div className="grid grid-cols-4 gap-3">
        {consultas.totals.map((total) => (
          <Stat key={total.label} {...total} />
        ))}
      </div>

      <Panel title="Por categoria" hint="No período consultado" className="mt-4">
        <div className="space-y-3">
          {consultas.byCategory.map((row) => (
            <div key={row.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] text-slate-700">{row.label}</span>
                <span className="text-[13px] font-semibold text-slate-950">{row.value}</span>
              </div>
              <div className="mt-1.5">
                <Bar value={row.share} tone={row.label === "Venda" ? "teal" : "slate"} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
