import type { ReactNode } from "react";

type Tone = "dark" | "panel" | "light" | "bone";

const toneClass: Record<Tone, string> = {
  dark: "bg-ink-950 text-white",
  panel: "border-y border-ink-800 bg-ink-900 text-white",
  light: "bg-white text-ink-950",
  bone: "bg-bone text-ink-950",
};

/** Fundos escuros compartilham a mesma escala de texto secundário. */
function isDark(tone: Tone) {
  return tone === "dark" || tone === "panel";
}

export function Section({
  id,
  tone = "dark",
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${toneClass[tone]} scroll-mt-20 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: Tone }) {
  return (
    <p
      className={`flex items-start gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] ${
        isDark(tone) ? "text-fog-400" : "text-fog-600"
      }`}
    >
      {/* O traço acompanha a primeira linha, e não o centro do bloco. */}
      <span aria-hidden="true" className="mt-[0.62em] h-px w-6 shrink-0 bg-brand-500" />
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display mt-5 text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-[2.75rem] ${className}`}
    >
      {children}
    </h2>
  );
}

export function Lead({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={`measure mt-5 text-base leading-relaxed sm:text-lg ${
        isDark(tone) ? "text-fog-300" : "text-fog-600"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/** Lista de itens com marcador vermelho — usada nas seções de recurso. */
export function CheckList({
  items,
  tone = "dark",
  columns = 1,
}: {
  items: readonly string[];
  tone?: Tone;
  columns?: 1 | 2;
}) {
  return (
    <ul className={`mt-8 grid gap-x-8 gap-y-3.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
          />
          <span
            className={`text-[15px] leading-relaxed ${
              isDark(tone) ? "text-fog-300" : "text-ink-800"
            }`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
