import { demoCompany, simulationDocument as doc } from "./data";

/**
 * Os dois arquivos que a simulação gera automaticamente ao ser salva.
 *
 * Repare que os dois saem com a marca da empresa que usa o sistema, e não
 * com a de quem o desenvolveu — é o material que o cliente final recebe.
 *
 * `data-demo` marca a réplica: são documentos com estilo próprio, então a
 * auditoria de contraste do site não se aplica aqui.
 */

function Linha({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const cor =
    tone === "positive" ? "text-emerald-700" : tone === "negative" ? "text-red-700" : "text-slate-900";

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-[13px] text-slate-600">{label}</span>
      <span className={`text-[13px] font-semibold ${cor}`}>{value}</span>
    </div>
  );
}

/** Imagem-resumo: a peça que o consultor envia pelo WhatsApp. */
export function ImagemResumo() {
  return (
    <div data-demo="true" className="w-full bg-slate-100">
      <div aria-hidden="true" className="h-1.5 w-full bg-red-700" />

      <header className="flex items-start justify-between gap-6 bg-slate-900 px-8 py-7">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-white text-lg font-bold tracking-wide text-slate-800">
            {demoCompany.initials}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400">
              Análise de correção de juros
            </p>
            <h3 className="mt-1.5 text-2xl font-semibold tracking-wide text-white">
              Simulação resumida
            </h3>
            <p className="mt-1.5 text-[13px] text-slate-300">
              {doc.client} · sem parcelas em atraso
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right text-[12px] text-slate-300">
          <p>{doc.issuedAt}</p>
          <p className="mt-1">Protocolo {doc.protocol}</p>
        </div>
      </header>

      <div className="space-y-4 px-8 py-7">
        <section className="flex items-start justify-between gap-6 rounded border-l-4 border-emerald-600 bg-emerald-50 px-5 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
              Economia total estimada
            </p>
            <p className="mt-1 text-4xl font-semibold text-emerald-700">
              {doc.headline.totalSaving}
            </p>
            <p className="mt-1.5 text-[13px] text-slate-600">
              Potencial identificado a partir dos dados informados.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
            Análise aprovada
          </span>
        </section>

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Parcela atual",
              value: doc.headline.currentInstallment,
              border: "border-red-600",
              bg: "bg-red-50",
              text: "text-red-700",
            },
            {
              label: "Parcela corrigida",
              value: doc.headline.correctedInstallment,
              border: "border-emerald-600",
              bg: "bg-emerald-50",
              text: "text-emerald-700",
            },
            {
              label: "Economia mensal",
              value: doc.headline.monthlySaving,
              border: "border-blue-600",
              bg: "bg-blue-50",
              text: "text-blue-700",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded border-l-4 ${card.border} ${card.bg} px-4 py-4`}
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-600">
                {card.label}
              </p>
              <p className={`mt-1 text-2xl font-semibold ${card.text}`}>{card.value}</p>
              <p className="mt-1 text-[11px] text-slate-500">Valor mensal estimado</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <section className="overflow-hidden rounded bg-white">
            <div aria-hidden="true" className="h-1 w-full bg-red-700" />
            <div className="px-5 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                Cenário informado
              </p>
              <h4 className="mt-1 text-[15px] font-semibold text-slate-900">Contrato atual</h4>
              <div className="mt-3">
                <Linha label="Instituição financeira" value={doc.lender} />
                <Linha label="Produto analisado" value="Financiamento de veículo" />
                <Linha label="Modelo e ano" value={`${doc.model} · ${doc.year}`} />
                <Linha label="Valor financiado" value="R$ 22.500,00" />
                <Linha label="Total de parcelas" value="48" />
                <Linha label="Saldo devedor sem correção" value="R$ 53.760,00" tone="negative" />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded bg-white">
            <div aria-hidden="true" className="h-1 w-full bg-emerald-600" />
            <div className="px-5 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                Cenário projetado
              </p>
              <h4 className="mt-1 text-[15px] font-semibold text-slate-900">
                Após análise revisional
              </h4>
              <div className="mt-3">
                <Linha label="Total da dívida após revisão" value="R$ 38.707,20" tone="positive" />
                <Linha label="Economia total" value="R$ 15.052,80" tone="positive" />
                <Linha label="Parcela após abatimentos" value="R$ 806,40" tone="positive" />
                <Linha label="Saldo devedor pós-correção" value="R$ 38.707,20" tone="positive" />
                <Linha label="Valor estimado para quitação" value="R$ 27.095,04" tone="positive" />
              </div>
            </div>
          </section>
        </div>

        <section className="rounded border-l-4 border-red-700 bg-white px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
            Próximo passo
          </p>
          <p className="mt-1.5 text-[15px] text-slate-800">
            Valide os documentos e as condições com seu especialista.
          </p>
        </section>

        <footer className="flex items-start justify-between gap-6 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">{demoCompany.tradeName}</p>
            <p className="mt-1">Av. Demonstrativa, 100 — Centro, São Paulo/SP</p>
          </div>
          <div className="text-right">
            <p>(11) 90000-0000 · ativaassessoria.exemplo</p>
            <p className="mt-1">Valores estimativos sujeitos à validação documental.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

/** Relatório em PDF: a primeira das três páginas geradas. */
export function RelatorioPdf() {
  return (
    <div data-demo="true" className="w-full bg-slate-200 px-10 py-8">
      <article className="mx-auto max-w-[760px] bg-white px-12 py-10 shadow-[0_2px_16px_rgba(15,23,42,0.12)]">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded bg-slate-100 text-xl font-bold tracking-wide text-slate-700">
            {demoCompany.initials}
          </div>
        </div>

        <div className="mt-7 flex items-start justify-between gap-6">
          <div>
            <p className="text-xl font-bold text-slate-900">{demoCompany.tradeName}</p>
            <p className="mt-1.5 text-[11px] text-slate-500">CNPJ: 00.000.000/0001-00</p>
            <p className="text-[11px] text-slate-500">Data de emissão: {doc.issuedAt}</p>
            <p className="text-[11px] text-slate-500">Protocolo: {doc.protocol}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="rounded-full border border-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">
              Simulação gratuita
            </span>
            <span className="rounded-full border border-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-800">
              Análise inicial
            </span>
            <span className="rounded-full border border-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-800">
              Estimativa
            </span>
          </div>
        </div>

        <h3 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">
          Análise sintetizada
        </h3>
        <p className="mt-2 text-[13px] text-slate-500">
          Simulação inicial de potencial revisional.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
          Esta análise apresenta uma visão inicial do potencial de redução identificado a partir
          dos dados informados. O objetivo é demonstrar, de forma clara e objetiva, onde pode
          existir oportunidade de revisão e negociação do contrato.
        </p>

        <div className="mt-7 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800">
            Economia total
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{doc.headline.totalSaving}</p>
          <p className="mt-2 text-[13px] text-slate-600">
            Com base nos dados informados, identificamos um potencial relevante de redução no
            custo total do contrato.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            {
              label: "Parcela atual",
              value: doc.headline.currentInstallment,
              bg: "bg-red-50",
              border: "border-red-100",
              text: "text-red-700",
            },
            {
              label: "Parcela corrigida",
              value: doc.headline.correctedInstallment,
              bg: "bg-emerald-50",
              border: "border-emerald-100",
              text: "text-emerald-700",
            },
            {
              label: "Economia mensal",
              value: doc.headline.monthlySaving,
              bg: "bg-emerald-50",
              border: "border-emerald-100",
              text: "text-emerald-700",
            },
          ].map((card) => (
            <div key={card.label} className={`rounded-lg border ${card.border} ${card.bg} px-4 py-4`}>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <p className={`mt-1 text-xl font-bold ${card.text}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <h4 className="mt-8 text-[13px] font-bold uppercase tracking-wide text-slate-900">
          Dados do atendimento
        </h4>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-4 rounded-lg border border-slate-200 px-6 py-5">
          {[
            ["Cliente", `${doc.client} · sem parcelas em atraso`],
            ["Telefone", doc.phone],
            ["Financeira", doc.lender],
            ["Tipo da simulação", doc.type],
            ["Especialista responsável", doc.specialist],
            ["Data do atendimento", doc.issuedAt],
            ["Situação", doc.status],
            ["Modelo e ano", `${doc.model} · ${doc.year}`],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-0.5 text-[13px] font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 border-t border-slate-200 pt-4 text-center text-[11px] text-slate-400">
          Página 1 de 3 · as páginas seguintes trazem o resumo da operação, o panorama da
          oportunidade e as condições contratuais.
        </p>
      </article>
    </div>
  );
}
