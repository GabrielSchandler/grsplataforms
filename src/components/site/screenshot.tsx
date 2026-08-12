import Image from "next/image";
import sizes from "@/content/screenshot-sizes.json";

/**
 * As dimensões vêm do manifesto escrito por scripts/capture-screens.mjs, e
 * não de números copiados à mão — assim a reserva de espaço nunca fica
 * defasada quando as telas são geradas de novo. Sem isso a página salta
 * enquanto as imagens carregam.
 */
const dimensions: Record<string, { width: number; height: number }> = sizes;

export function Screenshot({
  id,
  alt,
  caption,
  tone = "dark",
}: {
  id: string;
  alt: string;
  caption: string;
  tone?: "dark" | "light";
}) {
  const dimension = dimensions[id] ?? { width: 2048, height: 995 };

  return (
    <figure className="mt-10">
      <div
        className={`overflow-hidden rounded-lg border ${
          tone === "dark" ? "border-ink-700 bg-ink-900" : "border-fog-200 bg-white"
        } p-1.5`}
      >
        <Image
          src={`/img/telas/${id}.webp`}
          alt={alt}
          width={dimension.width}
          height={dimension.height}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="w-full rounded border border-fog-200"
        />
      </div>
      <figcaption
        className={`mt-3 flex gap-2.5 border-l-2 border-brand-500 pl-3 text-[13px] leading-relaxed ${
          tone === "dark" ? "text-fog-500" : "text-fog-600"
        }`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
