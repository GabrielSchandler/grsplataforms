"use client";

/**
 * Dispositivos e coleta — `app/painel/dispositivos/page.tsx`. Fora do menu,
 * como no painel: chega-se aqui pelo aviso de estação sem enviar. Junto, o
 * diário de bordo das estações (ligou, bloqueou, hibernou, desligou).
 */

import { CheckCircle2, Layers, Monitor, MonitorOff, ScrollText } from "lucide-react";
import { EMPRESA, type TipoEventoEstacao } from "./dados";
import { useFocus } from "./estado";
import { cn, formatarDuracao } from "./formato";
import { Aviso, CabecalhoPagina, GradeIndicadores, Indicador, Secao, Selo, TabelaSimples } from "./kit";
import { ATRASADAS, ESTACOES, GRUPOS_EVENTOS } from "./vivo";

const EVENTO: Record<TipoEventoEstacao, { rotulo: string; cor: string }> = {
  AGENTE_INICIADO: { rotulo: "Ligou / agente iniciado", cor: "bg-emerald-500" },
  AGENTE_PARADO: { rotulo: "Agente parado", cor: "bg-rose-500" },
  SUSPENSA: { rotulo: "Hibernou", cor: "bg-slate-400" },
  RETOMADA: { rotulo: "Voltou da hibernação", cor: "bg-emerald-500" },
  DESLIGANDO: { rotulo: "Desligou", cor: "bg-slate-500" },
  BLOQUEADA: { rotulo: "Tela bloqueada", cor: "bg-amber-500" },
  DESBLOQUEADA: { rotulo: "Tela desbloqueada", cor: "bg-sky-500" },
};

export function TelaDispositivos() {
  const { abrirTela, layout } = useFocus();
  const celular = layout === "celular";
  const versoes = new Map<string, number>();
  for (const e of ESTACOES) versoes.set(e.versao, (versoes.get(e.versao) ?? 0) + 1);
  const maisComum = [...versoes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const semEnvio = ESTACOES.filter((e) => e.situacao !== "RECENTE");

  return (
    <div className="space-y-4">
      <CabecalhoPagina
        trilha={[{ rotulo: "Visão geral", aoClicar: () => abrirTela("visao") }, { rotulo: "Dispositivos e coleta" }]}
        titulo="Dispositivos e coleta"
        descricao="Estações com o agente, último envio de cada uma e a versão em uso."
      />

      <GradeIndicadores>
        <Indicador compacto icone={<Monitor />} rotulo="Estações registradas" valor={ESTACOES.length} rodape={`limite do plano: ${EMPRESA.maxDispositivos}`} />
        <Indicador
          compacto
          icone={<CheckCircle2 />}
          rotulo="Com envio recente"
          valor={ESTACOES.length - semEnvio.length}
          rodape={`enviaram nos últimos ${EMPRESA.limiarAtrasoMinutos} min`}
        />
        <Indicador compacto tom={semEnvio.length > 0 ? "alerta" : "normal"} icone={<MonitorOff />} rotulo="Sem envio recente" valor={semEnvio.length} rodape={`${ATRASADAS.length} durante o expediente`} />
        <Indicador compacto icone={<Layers />} rotulo="Versões do agente em uso" valor={versoes.size} rodape={maisComum ? `mais comum: ${maisComum}` : undefined} />
      </GradeIndicadores>

      <div className={cn("grid gap-4", celular ? "grid-cols-1" : "grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]")}>
        <Secao data-tour="estacoes" icone={<Monitor />} titulo={`Estações (${ESTACOES.length})`} subtitulo="As sem envio recente aparecem primeiro">
          <TabelaSimples minimo="min-w-[580px]" className="max-h-[420px] overflow-y-auto">
            <thead className="sticky top-0">
              <tr>
                <th>Estação</th>
                <th>Usuário Windows</th>
                <th>Pessoa</th>
                <th className="!text-right">Último envio</th>
                <th>Versão</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {ESTACOES.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="foco-mono text-[12.5px] font-medium text-slate-900">{e.maquina}</td>
                  <td className="foco-mono text-[12px] text-slate-600">{e.usuarioWindows}</td>
                  <td>
                    <button type="button" onClick={() => abrirTela("pessoa", { pessoaId: e.colaboradorId })} className="hover:text-foco-acao hover:underline">
                      {e.colaborador}
                    </button>
                  </td>
                  <td className="foco-num whitespace-nowrap text-right">{e.ultimoEnvio}</td>
                  <td className="foco-mono text-[12px]">{e.versao}</td>
                  <td>
                    {e.situacao === "RECENTE" ? (
                      <Selo tom="sucesso">Envio recente</Selo>
                    ) : (
                      <Selo tom="atencao">Sem envio há {formatarDuracao(e.minutosSemEnvio)}</Selo>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </TabelaSimples>
        </Secao>

        <Secao data-tour="diario" icone={<ScrollText />} titulo="Linha do tempo das estações" subtitulo="Ligou, bloqueou, hibernou, desligou">
          <div className="foco-rolagem max-h-[420px] space-y-4 overflow-y-auto pr-1">
            {GRUPOS_EVENTOS.map((g) => (
              <div key={g.titulo}>
                <p className="mb-2 text-[11.5px] font-medium uppercase tracking-wide text-slate-500">{g.titulo}</p>
                <ul className="space-y-2">
                  {g.eventos.map((ev) => (
                    <li key={ev.id} className="flex items-center gap-3 text-[13px]">
                      <span className="foco-num w-11 shrink-0 text-slate-500">{ev.hora}</span>
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", EVENTO[ev.tipo].cor)} />
                      <span className="foco-mono w-16 shrink-0 text-[12px] text-slate-700">{ev.maquina}</span>
                      <span className="text-slate-700">{EVENTO[ev.tipo].rotulo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Secao>
      </div>

      <Aviso titulo="Atraso de envio não confirma computador desligado">
        A estação pode estar sem rede, com o agente parado ou desligada — o painel não distingue os três. O que não foi enviado fica guardado na
        estação e chega quando a conexão volta.
      </Aviso>
    </div>
  );
}
