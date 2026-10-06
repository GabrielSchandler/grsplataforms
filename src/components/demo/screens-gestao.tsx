import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CircleCheck,
  Clock3,
  Copy,
  Database,
  FileText,
  Filter,
  HardDrive,
  ListChecks,
  MoreHorizontal,
  Plus,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { Screen } from "./chrome";
import { Abas, Avatar, Bar, Button, Detalhe, Filtros, Panel, Pill, Stat, iniciais, tabela } from "./kit";
import { backups, consultas, documentos, gestao, logs, usuarios } from "./data";

/**
 * Telas de apoio, reproduzidas com as mesmas colunas que existem no sistema
 * (documentos, usuários, backups e logs). Só o conteúdo é fictício.
 *
 * Todas seguem o desenho novo das listas: indicadores no topo, tabela à
 * esquerda e o registro consultado aberto num painel à direita.
 */

/** Moldura das listas: título com a contagem, filtros e a tabela. */
function Lista({
  titulo,
  total,
  busca,
  selects,
  children,
  ...rest
}: {
  titulo: string;
  total: string;
  busca: string;
  selects?: readonly string[];
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section {...rest} className="min-w-0 overflow-hidden rounded-lg border border-ns-border bg-ns-surface">
      <div className="px-4 pb-3 pt-3.5">
        <h4 className="text-[13px] font-semibold text-ns-text">
          {titulo} <span className="font-normal text-ns-muted">({total})</span>
        </h4>
        <div className="mt-3">
          <Filtros busca={busca} selects={selects} />
        </div>
      </div>
      {children}
    </section>
  );
}

const iconesDocumentos = [FileText, Copy, AlertTriangle, Users];

export function Documentos() {
  const [aberto] = documentos.rows;

  return (
    <Screen
      workspace="Comercial"
      active="Documentos"
      title="Documentos"
      subtitle="Documentos gerados, templates e arquivos operacionais da empresa."
      actions={
        <Button>
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Gerar documento
        </Button>
      }
    >
      <Abas itens={["Gerados", "Templates"]} ativa="Gerados" />

      <div className="mt-3 grid grid-cols-4 gap-3">
        {documentos.stats.map((stat, indice) => (
          <Stat key={stat.label} {...stat} icon={iconesDocumentos[indice]} />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_220px] gap-3">
        <Lista
          titulo="Documentos gerados"
          total="148"
          busca="Buscar por nome ou conteúdo..."
          selects={["Todos os tipos", "Todos os status"]}
          data-tour="tabela-documentos"
        >
          <table className={tabela.base}>
            <thead className={tabela.cabeca}>
              <tr>
                <th className={tabela.th}>Nome</th>
                <th className={tabela.th}>Cliente</th>
                <th className={tabela.th}>Tipo</th>
                <th className={tabela.th}>Criado por</th>
                <th className={tabela.th}>Status</th>
                <th className={tabela.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {documentos.rows.map((row, indice) => (
                <tr key={row.title} className={indice === 0 ? tabela.selecionada : tabela.linha}>
                  <td className={`${tabela.td} font-semibold`}>{row.title}</td>
                  <td className={tabela.td}>{row.client}</td>
                  <td className={tabela.fraco}>{row.type}</td>
                  <td className={tabela.fraco}>{row.author}</td>
                  <td className={tabela.td}>
                    <Pill tone={row.source === "Template" ? "success" : "slate"}>{row.status}</Pill>
                  </td>
                  <td className={tabela.td}>
                    <MoreHorizontal aria-hidden="true" className="h-4 w-4 text-ns-primary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Lista>

        <Detalhe
          titulo={`${aberto.title} — ${aberto.client}`}
          selo={<Pill tone="success">{aberto.status}</Pill>}
          fatos={[
            ["Cliente", aberto.client],
            ["Tipo", aberto.type],
            ["Template", aberto.template],
            ["Criado por", aberto.author],
            ["Data de criação", aberto.date],
            ["Formato", "DOCX e PDF"],
          ]}
        >
          <p className="mt-3 text-[13px] font-semibold text-ns-primary">Visualizar</p>
        </Detalhe>
      </div>
    </Screen>
  );
}

const iconesGestao = [Clock3, Users, Calculator, FileText];
const iconesAtencao = [Clock3, FileText, Users];

/** Selo "Ver detalhes" que fecha o título dos painéis da visão geral. */
function PainelGestao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-lg border border-ns-border bg-ns-surface p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-[13px] font-semibold text-ns-text">{titulo}</h4>
        <span className="rounded border border-ns-border px-2 py-1 text-[10px] font-semibold text-ns-primary">
          Ver detalhes
        </span>
      </div>
      {children}
    </section>
  );
}

export function GestaoVisaoGeral() {
  return (
    <Screen
      workspace="Gestão"
      active="Gestão"
      title="Gestão"
      subtitle="Central de comando da empresa e das áreas administrativas."
    >
      <div className="grid grid-cols-4 gap-3">
        {gestao.stats.map((stat, indice) => (
          <Stat key={stat.label} {...stat} icon={iconesGestao[indice]} />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[1.2fr_1fr_1fr] gap-3">
        <PainelGestao titulo="Requer sua atenção">
          {gestao.attention.map((item, indice) => {
            const Icone = iconesAtencao[indice];

            return (
              <div
                key={item.label}
                className="flex items-center gap-2.5 border-b border-ns-border py-3 last:border-0"
              >
                <Icone aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-primary" />
                <span className="flex-1 text-[12px] text-ns-text">{item.label}</span>
                <strong className="text-[13px] text-ns-text">{item.value}</strong>
              </div>
            );
          })}
        </PainelGestao>

        <PainelGestao titulo="Equipe por área">
          {gestao.areas.map((area) => (
            <div key={area.label} className="border-b border-ns-border py-2.5 last:border-0">
              <div className="flex justify-between gap-2 text-[12px] text-ns-text">
                <span>{area.label}</span>
                <strong>{area.people}</strong>
                <span className="text-ns-muted">{area.active}% ativos</span>
              </div>
              <div className="mt-2">
                <Bar value={area.active} />
              </div>
            </div>
          ))}
        </PainelGestao>

        <PainelGestao titulo="Operação">
          {gestao.operation.map((item) => (
            <div
              key={item.label}
              className="flex justify-between gap-3 border-b border-ns-border py-3.5 text-[12px] text-ns-text last:border-0"
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </PainelGestao>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <PainelGestao titulo="Controle da empresa">
          <div className="flex items-center gap-2.5 border-b border-ns-border py-3">
            <Database aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-primary" />
            <span className="min-w-0">
              <strong className="block text-[12px] text-ns-text">Último backup</strong>
              <span className="text-[11px] text-ns-muted">{gestao.lastBackup}</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 border-b border-ns-border py-3 text-[12px] text-ns-text">
            <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-primary" />
            Central de aprovações
          </div>
          <div className="flex items-center gap-2.5 py-3 text-[12px] text-ns-text">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-success" />
            Auditoria da empresa
          </div>
        </PainelGestao>

        <PainelGestao titulo="Atividade recente">
          {gestao.activity.map((evento) => (
            <div
              key={evento.when}
              className="flex items-start gap-2.5 border-b border-ns-border py-2 last:border-0"
            >
              <Activity aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ns-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-ns-text">{evento.action}</p>
                <p className="truncate text-[11px] text-ns-muted">
                  {evento.who} · {evento.when}
                </p>
              </div>
            </div>
          ))}
        </PainelGestao>
      </div>
    </Screen>
  );
}

export function Usuarios() {
  const [aberto] = usuarios.rows;

  return (
    <Screen
      workspace="Gestão"
      active="Usuários"
      title="Gestão"
      subtitle="Usuários, áreas, metas e treinamento da equipe."
      actions={
        <Button>
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Novo usuário
        </Button>
      }
    >
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Usuários ativos" value="17" hint="de 20 contratados" accent="success" icon={UserCheck} />
        <Stat label="Comercial" value="12" accent="primary" icon={Users} />
        <Stat label="Jurídico" value="4" accent="primary" icon={Users} />
        <Stat label="Gestão" value="2" accent="warning" icon={Users} />
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_220px] gap-3">
        <Lista
          titulo="Equipe"
          total="18"
          busca="Buscar por nome, e-mail ou login"
          selects={["Todas as áreas"]}
        >
          <table className={tabela.base}>
            <thead className={tabela.cabeca}>
              <tr>
                <th className={tabela.th}>Nome</th>
                <th className={tabela.th}>Login</th>
                <th className={tabela.th}>Área</th>
                <th className={tabela.th}>Cargo</th>
                <th className={tabela.th}>Meta do mês</th>
                <th className={tabela.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.rows.map((row, indice) => (
                <tr key={row.login} className={indice === 0 ? tabela.selecionada : tabela.linha}>
                  <td className={tabela.td}>
                    <div className="flex items-center gap-2">
                      <Avatar initials={iniciais(row.name)} />
                      <span className="font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td className={tabela.fraco}>{row.login}</td>
                  <td className={tabela.td}>{row.area}</td>
                  <td className={tabela.fraco}>{row.role}</td>
                  <td className={tabela.td}>{row.goal}</td>
                  <td className={tabela.td}>
                    <Pill tone={row.active ? "success" : "slate"}>{row.active ? "Ativo" : "Inativo"}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Lista>

        <Detalhe
          titulo={aberto.name}
          selo={<Pill tone="success">Ativo</Pill>}
          fatos={[
            ["Apelido", aberto.nick],
            ["Login", aberto.login],
            ["Telefone", aberto.phone],
            ["Área", aberto.area],
            ["Cargo", aberto.role],
            ["Meta do mês", aberto.goal],
          ]}
        >
          <div className="mt-3">
            <Button variant="ghost">Editar usuário</Button>
          </div>
        </Detalhe>
      </div>
    </Screen>
  );
}

export function Backups() {
  const [aberto] = backups.rows;

  return (
    <Screen
      workspace="Gestão"
      active="Backups"
      title="Gestão"
      subtitle="Segurança, cópias de dados e recuperação do sistema."
      actions={
        <Button variant="ghost">
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          Gerar agora
        </Button>
      }
    >
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Último backup concluído" value="Hoje · 00:10" accent="primary" icon={Database} />
        <Stat
          label="Execuções concluídas"
          value="5 de 5"
          hint="Últimas execuções carregadas"
          accent="success"
          icon={CircleCheck}
        />
        <Stat label="Volume dos arquivos listados" value="2,0 GB" accent="primary" icon={HardDrive} />
        <Stat
          label="Janela de restauração"
          value="7 dias"
          hint="Neste ambiente demonstrativo"
          accent="warning"
          icon={Clock3}
        />
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_220px] gap-3">
        <Lista
          titulo="Histórico de backups"
          total="5"
          busca="Buscar por nome ou conteúdo..."
          selects={["Todos os tipos", "Todos os status"]}
        >
          <table className={tabela.base}>
            <thead className={tabela.cabeca}>
              <tr>
                <th className={tabela.th}>Gerado em</th>
                <th className={tabela.th}>Tipo</th>
                <th className={tabela.th}>Backup</th>
                <th className={tabela.th}>Tamanho</th>
                <th className={tabela.th}>Status</th>
                <th className={tabela.th}>Expira em</th>
              </tr>
            </thead>
            <tbody>
              {backups.rows.map((row, indice) => (
                <tr key={row.name} className={indice === 0 ? tabela.selecionada : tabela.linha}>
                  <td className={tabela.td}>{row.created}</td>
                  <td className={tabela.fraco}>{row.origin}</td>
                  <td className={`${tabela.td} font-medium`}>{row.name}</td>
                  <td className={tabela.fraco}>{row.size}</td>
                  <td className={tabela.td}>
                    <Pill tone="success">{row.status}</Pill>
                  </td>
                  <td className={tabela.fraco}>{row.expires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Lista>

        <Detalhe
          titulo={aberto.name}
          selo={<Pill tone="success">{aberto.status}</Pill>}
          fatos={[
            ["Tipo", aberto.origin],
            ["Tamanho", aberto.size],
            ["Gerado em", aberto.created],
            ["Expira em", aberto.expires],
          ]}
        >
          <div className="mt-3">
            <Button>Baixar backup</Button>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-ns-primary">Ferramentas de recuperação</p>
        </Detalhe>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ns-muted">{backups.note}</p>
    </Screen>
  );
}

export function Logs() {
  return (
    <Screen
      workspace="Gestão"
      active="Logs"
      title="Gestão"
      subtitle="Quem fez o quê, quando — mantido sem expiração automática."
      actions={
        <Button variant="ghost">
          <Filter aria-hidden="true" className="h-3.5 w-3.5" />
          Filtrar
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Eventos carregados" value="300" hint="de 34.812 registrados" accent="primary" icon={ListChecks} />
        <Stat label="Usuários com atividade" value="14" accent="success" icon={Users} />
        <Stat label="Ações do sistema" value="38" hint="Importações e backups" accent="warning" icon={Activity} />
      </div>

      <section className="mt-3 overflow-hidden rounded-lg border border-ns-border bg-ns-surface">
        <h4 className="px-4 py-3.5 text-[13px] font-semibold text-ns-text">Registro de ações</h4>
        <table className={tabela.base}>
          <thead className={tabela.cabeca}>
            <tr>
              <th className={tabela.th}>Data</th>
              <th className={tabela.th}>Usuário</th>
              <th className={tabela.th}>Ação</th>
              <th className={tabela.th}>Entidade</th>
              <th className={tabela.th}>Registro</th>
              <th className={tabela.th}>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {logs.rows.map((row) => (
              <tr key={row.date + row.action} className={tabela.linha}>
                <td className={tabela.fraco}>{row.date}</td>
                <td className={`${tabela.td} font-medium`}>{row.user}</td>
                <td className={tabela.td}>
                  <code className="rounded bg-ns-alt px-1.5 py-0.5 text-[11px] text-ns-text">
                    {row.action}
                  </code>
                </td>
                <td className={tabela.fraco}>{row.entity}</td>
                <td className={tabela.fraco}>{row.record}</td>
                <td className={tabela.fraco}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="mt-3 flex items-center gap-2 text-[12px] text-ns-muted">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-ns-success" />
        O registro guarda autor e data de cada ação relevante e não expira sozinho.
      </p>
    </Screen>
  );
}

const iconesConsultas = [ArrowUpRight, ArrowDownRight, Calculator, ListChecks];
const acentosConsultas = ["success", "danger", "primary", "warning"] as const;

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
        {consultas.totals.map((total, indice) => (
          <Stat
            key={total.label}
            label={total.label}
            value={total.value}
            accent={acentosConsultas[indice]}
            icon={iconesConsultas[indice]}
          />
        ))}
      </div>

      <Panel title="Por categoria" hint="No período consultado" className="mt-3">
        <div className="space-y-3">
          {consultas.byCategory.map((row) => (
            <div key={row.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] text-ns-muted">{row.label}</span>
                <span className="text-[13px] font-semibold text-ns-text">{row.value}</span>
              </div>
              <div className="mt-1.5">
                <Bar value={row.share} tone={row.label === "Venda" ? "primary" : "muted"} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
