/**
 * Formatação da réplica do NewSec Focus — sempre em pt-BR.
 *
 * Copiada de `newsecfocus/dashboard/lib/formato.ts`, com uma diferença
 * deliberada: os números agrupados e compactos ("12,4 mil") são montados à
 * mão em vez de pelo Intl.NumberFormat. O HTML desta página sai do build, e o
 * ICU do Node pode escrever o separador de um jeito diferente do navegador do
 * visitante. Texto diferente entre servidor e cliente é hidratação quebrada
 * (erro #418 do React), então aqui nada depende da versão do ICU.
 */

export type TipoCategoria = "PRODUCTIVE" | "NEUTRAL" | "UNPRODUCTIVE";

export type BucketSerie = "hour" | "day" | "week" | "month";

/**
 * Converte um total de minutos em "Xh YYmin". Sem separador de milhar nas
 * horas ("2570h"), exatamente como o painel escreve.
 */
export function formatarHoras(minutos: number): string {
  const total = Math.max(0, Math.round(minutos));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}min`;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

/** Versão compacta para células de tabela: "7h32". */
export function formatarHorasCurto(minutos: number): string {
  const total = Math.max(0, Math.round(minutos));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}min`;
  return `${h}h${m.toString().padStart(2, "0")}`;
}

function agrupar(inteiro: number): string {
  return String(Math.abs(inteiro)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatarNumero(valor: number): string {
  const inteiro = Math.round(valor);
  return `${inteiro < 0 ? "-" : ""}${agrupar(inteiro)}`;
}

/** Abrevia números grandes: 12.400 → "12,4 mil". */
export function formatarNumeroCompacto(valor: number): string {
  const absoluto = Math.abs(valor);
  if (absoluto < 1000) return formatarNumero(valor);

  const [divisor, sufixo] = absoluto >= 1_000_000 ? [1_000_000, "mi"] : [1000, "mil"];
  const texto = (valor / divisor).toFixed(1).replace(".", ",").replace(/,0$/, "");
  return `${texto} ${sufixo}`;
}

export function formatarPorcentagem(valor: number | null, casas = 0): string {
  if (valor === null || Number.isNaN(valor)) return "—";
  return `${valor.toFixed(casas).replace(".", ",")}%`;
}

/** Variação com sinal explícito: "+12,4%" / "−3,1%". */
export function formatarVariacao(valor: number | null): string {
  if (valor === null || Number.isNaN(valor)) return "—";
  const sinal = valor > 0 ? "+" : valor < 0 ? "−" : "";
  return `${sinal}${Math.abs(valor).toFixed(1).replace(".", ",")}%`;
}

/** Como se chama a granularidade do gráfico, em português claro. */
export const ROTULO_BUCKET: Record<BucketSerie, string> = {
  hour: "hora a hora",
  day: "dia a dia",
  week: "semana a semana",
  month: "mês a mês",
};

// ----------------------------------------------------------------------------
//  Cores e rótulos das categorias de produtividade
// ----------------------------------------------------------------------------

export const CORES_TIPO: Record<string, string> = {
  PRODUCTIVE: "#22d3ee",
  NEUTRAL: "#a78bfa",
  UNPRODUCTIVE: "#fb7185",
  SEM: "#475569",
};

export const ROTULOS_TIPO: Record<string, string> = {
  PRODUCTIVE: "Produtivo",
  NEUTRAL: "Neutro",
  UNPRODUCTIVE: "Improdutivo",
  SEM: "Sem classificação",
};

export const PALETA_SERIES = [
  "#22d3ee", "#a78bfa", "#34d399", "#fbbf24",
  "#fb7185", "#38bdf8", "#f472b6", "#818cf8",
  "#2dd4bf", "#facc15",
];

/**
 * Faixa qualitativa do índice de produtividade. O rótulo acompanha a cor, o
 * que mantém a leitura acessível para quem não distingue as cores.
 */
export function faixaIndice(indice: number | null): {
  rotulo: string;
  cor: string;
  classe: string;
} {
  if (indice === null) {
    return { rotulo: "sem classificação", cor: "#475569", classe: "text-slate-500" };
  }
  if (indice >= 70) return { rotulo: "alto", cor: "#34d399", classe: "text-emerald-400" };
  if (indice >= 45) return { rotulo: "médio", cor: "#fbbf24", classe: "text-amber-400" };
  return { rotulo: "baixo", cor: "#fb7185", classe: "text-rose-400" };
}

/**
 * Faixa de risco por percentual fora da janela — o inverso do índice: aqui,
 * quanto maior, pior (mais sinal de sobrecarga).
 */
export function faixaRisco(percentual: number | null): { rotulo: string; classe: string } {
  if (percentual === null) return { rotulo: "sem janela definida", classe: "text-slate-500" };
  if (percentual >= 25) return { rotulo: "alto", classe: "text-rose-400" };
  if (percentual >= 10) return { rotulo: "médio", classe: "text-amber-400" };
  return { rotulo: "baixo", classe: "text-emerald-400" };
}

/** Junta classes condicionais. A réplica não precisa de tailwind-merge. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
